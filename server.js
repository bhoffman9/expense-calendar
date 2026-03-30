const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'budget.json');
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// --- Data helpers ---
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaults = {
      income: [
        { id: 1, name: "J&A Management Group", amount: 1115, frequency: "weekly", dayOfWeek: 5 },
        { id: 2, name: "Advanced Medical Hair Institute", amount: 300, frequency: "monthly", dayOfMonth: 1 }
      ],
      recurring: [],
      transactions: [],
      nextId: 3
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- API Routes ---

// Get all data
app.get('/api/data', (req, res) => {
  res.json(loadData());
});

// Add/update income source
app.post('/api/income', (req, res) => {
  const data = loadData();
  const item = req.body;
  if (item.id) {
    const idx = data.income.findIndex(i => i.id === item.id);
    if (idx >= 0) data.income[idx] = item;
  } else {
    item.id = data.nextId++;
    data.income.push(item);
  }
  saveData(data);
  res.json(data);
});

// Delete income source
app.delete('/api/income/:id', (req, res) => {
  const data = loadData();
  data.income = data.income.filter(i => i.id !== parseInt(req.params.id));
  saveData(data);
  res.json(data);
});

// Add/update recurring charge
app.post('/api/recurring', (req, res) => {
  const data = loadData();
  const item = req.body;
  if (item.id) {
    const idx = data.recurring.findIndex(i => i.id === item.id);
    if (idx >= 0) data.recurring[idx] = item;
  } else {
    item.id = data.nextId++;
    data.recurring.push(item);
  }
  saveData(data);
  res.json(data);
});

// Delete recurring charge
app.delete('/api/recurring/:id', (req, res) => {
  const data = loadData();
  data.recurring = data.recurring.filter(i => i.id !== parseInt(req.params.id));
  saveData(data);
  res.json(data);
});

// Add one-time transaction
app.post('/api/transaction', (req, res) => {
  const data = loadData();
  const item = req.body;
  if (item.id) {
    const idx = data.transactions.findIndex(i => i.id === item.id);
    if (idx >= 0) data.transactions[idx] = item;
  } else {
    item.id = data.nextId++;
    data.transactions.push(item);
  }
  saveData(data);
  res.json(data);
});

// Delete transaction
app.delete('/api/transaction/:id', (req, res) => {
  const data = loadData();
  data.transactions = data.transactions.filter(i => i.id !== parseInt(req.params.id));
  saveData(data);
  res.json(data);
});

// Upload bank statement PDF
app.post('/api/upload-statement', upload.single('statement'), async (req, res) => {
  try {
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;
    const transactions = parseBankStatement(text);

    const data = loadData();
    for (const t of transactions) {
      t.id = data.nextId++;
      t.source = 'bank-statement';
      data.transactions.push(t);
    }
    saveData(data);

    res.json({ parsed: transactions.length, transactions, allData: data });
  } catch (err) {
    console.error('PDF parse error:', err);
    res.status(400).json({ error: 'Could not parse PDF. ' + err.message });
  }
});

// Parse bank statement text - handles common formats
function parseBankStatement(text) {
  const transactions = [];
  const lines = text.split('\n');

  // Common date patterns: MM/DD/YYYY, MM/DD/YY, MM-DD-YYYY
  const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
  // Money pattern: captures negative or positive amounts
  const moneyPattern = /[-]?\$?([\d,]+\.\d{2})/g;

  for (const line of lines) {
    const dateMatch = line.match(datePattern);
    if (!dateMatch) continue;

    const amounts = [];
    let m;
    const moneyRegex = /[-]?\$?([\d,]+\.\d{2})/g;
    while ((m = moneyRegex.exec(line)) !== null) {
      amounts.push(parseFloat(m[1].replace(/,/g, '')));
    }

    if (amounts.length === 0) continue;

    // Get description: text between date and first amount
    const dateEnd = dateMatch.index + dateMatch[0].length;
    const firstAmountMatch = line.match(/[-]?\$?[\d,]+\.\d{2}/);
    const amountStart = firstAmountMatch ? line.indexOf(firstAmountMatch[0], dateEnd) : line.length;
    let description = line.substring(dateEnd, amountStart).trim();

    // Clean up description
    description = description.replace(/^\s*[-–]\s*/, '').trim();
    if (!description) description = 'Unknown';

    // Use the last amount (often the running balance is last, transaction amount is first or second)
    const amount = amounts.length === 1 ? amounts[0] : amounts[0];

    // Determine if debit or credit based on context
    const isDebit = line.toLowerCase().includes('debit') ||
                    line.includes('-$') ||
                    line.match(/-\s*\$/) ||
                    (amounts.length > 1 && amounts[0] > 0 && line.toLowerCase().includes('withdrawal'));

    transactions.push({
      date: normalizeDate(dateMatch[1]),
      description,
      amount: amount,
      type: isDebit ? 'expense' : 'income',
      category: categorizeTransaction(description)
    });
  }

  return transactions;
}

function normalizeDate(dateStr) {
  const parts = dateStr.split(/[\/\-]/);
  let month = parts[0].padStart(2, '0');
  let day = parts[1].padStart(2, '0');
  let year = parts[2];
  if (year.length === 2) year = '20' + year;
  return `${year}-${month}-${day}`;
}

function categorizeTransaction(desc) {
  const d = desc.toLowerCase();
  if (d.includes('rent') || d.includes('mortgage')) return 'Housing';
  if (d.includes('electric') || d.includes('gas') || d.includes('water') || d.includes('utility')) return 'Utilities';
  if (d.includes('insurance')) return 'Insurance';
  if (d.includes('grocery') || d.includes('walmart') || d.includes('kroger') || d.includes('publix') || d.includes('aldi')) return 'Groceries';
  if (d.includes('restaurant') || d.includes('mcdonald') || d.includes('starbucks') || d.includes('doordash') || d.includes('uber eat') || d.includes('grubhub')) return 'Dining';
  if (d.includes('netflix') || d.includes('spotify') || d.includes('hulu') || d.includes('disney') || d.includes('youtube') || d.includes('apple') || d.includes('amazon prime')) return 'Subscriptions';
  if (d.includes('gas') || d.includes('shell') || d.includes('chevron') || d.includes('bp') || d.includes('fuel')) return 'Gas';
  if (d.includes('car') || d.includes('auto') || d.includes('vehicle')) return 'Auto';
  if (d.includes('phone') || d.includes('t-mobile') || d.includes('verizon') || d.includes('at&t')) return 'Phone';
  if (d.includes('internet') || d.includes('comcast') || d.includes('spectrum')) return 'Internet';
  if (d.includes('transfer') || d.includes('zelle') || d.includes('venmo') || d.includes('cashapp')) return 'Transfer';
  if (d.includes('payroll') || d.includes('direct dep') || d.includes('salary')) return 'Income';
  return 'Other';
}

// Get local network IPs for multi-device access
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

app.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIPs();
  console.log(`\n  Budget Calendar running at:`);
  console.log(`    Local:   http://localhost:${PORT}`);
  ips.forEach(ip => console.log(`    Network: http://${ip}:${PORT}`));
  console.log(`\n  Access from any device on your network!\n`);
});
