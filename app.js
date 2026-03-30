// State
let data = { income: [], recurring: [], transactions: [], nextId: 1 };
let currentYear, currentMonth;

// Init
const now = new Date();
currentYear = now.getFullYear();
currentMonth = now.getMonth();

loadAllData();

// --- API ---
async function loadAllData() {
  const res = await fetch('/api/data');
  data = await res.json();
  render();
}

async function apiPost(endpoint, body) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  data = await res.json();
  render();
}

async function apiDelete(endpoint, id) {
  const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
  data = await res.json();
  render();
}

// --- Calendar Logic ---
function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  render();
}

function goToday() {
  currentYear = now.getFullYear();
  currentMonth = now.getMonth();
  render();
}

// --- Get entries for a specific date ---
function getEntriesForDate(year, month, day) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const date = new Date(year, month, day);
  const dow = date.getDay();
  const entries = [];

  // Income sources
  for (const inc of data.income) {
    if (inc.frequency === 'weekly' && inc.dayOfWeek === dow) {
      entries.push({ ...inc, type: 'income', isRecurring: true });
    } else if (inc.frequency === 'biweekly' && inc.dayOfWeek === dow) {
      // Show biweekly on every other occurrence
      const refDate = new Date(2026, 0, 1); // reference start
      const diffWeeks = Math.floor((date - refDate) / (7 * 24 * 60 * 60 * 1000));
      if (diffWeeks % 2 === 0) {
        entries.push({ ...inc, type: 'income', isRecurring: true });
      }
    } else if (inc.frequency === 'monthly') {
      const dom = inc.dayOfMonth || 1;
      const maxDay = getMonthDays(year, month);
      const effectiveDay = Math.min(dom, maxDay);
      if (day === effectiveDay) {
        entries.push({ ...inc, type: 'income', isRecurring: true });
      }
    } else if (inc.frequency === 'yearly') {
      const yMonth = inc.monthOfYear || 0;
      const yDay = inc.dayOfMonth || 1;
      if (month === yMonth && day === yDay) {
        entries.push({ ...inc, type: 'income', isRecurring: true });
      }
    }
  }

  // Recurring charges
  for (const rec of data.recurring) {
    if (rec.frequency === 'weekly' && rec.dayOfWeek === dow) {
      entries.push({ ...rec, type: 'expense', isRecurring: true });
    } else if (rec.frequency === 'biweekly' && rec.dayOfWeek === dow) {
      const refDate = new Date(2026, 0, 1);
      const diffWeeks = Math.floor((date - refDate) / (7 * 24 * 60 * 60 * 1000));
      if (diffWeeks % 2 === 0) {
        entries.push({ ...rec, type: 'expense', isRecurring: true });
      }
    } else if (rec.frequency === 'monthly') {
      const dom = rec.dayOfMonth || 1;
      const maxDay = getMonthDays(year, month);
      const effectiveDay = Math.min(dom, maxDay);
      if (day === effectiveDay) {
        entries.push({ ...rec, type: 'expense', isRecurring: true });
      }
    } else if (rec.frequency === 'yearly') {
      const yMonth = rec.monthOfYear || 0;
      const yDay = rec.dayOfMonth || 1;
      if (month === yMonth && day === yDay) {
        entries.push({ ...rec, type: 'expense', isRecurring: true });
      }
    }
  }

  // One-time transactions
  for (const t of data.transactions) {
    if (t.date === dateStr) {
      entries.push({ ...t, isRecurring: false });
    }
  }

  return entries;
}

// --- Calculate monthly totals ---
function getMonthTotals(year, month) {
  const days = getMonthDays(year, month);
  let totalIncome = 0;
  let totalExpenses = 0;

  for (let d = 1; d <= days; d++) {
    const entries = getEntriesForDate(year, month, d);
    for (const e of entries) {
      if (e.type === 'income') totalIncome += e.amount;
      else totalExpenses += e.amount;
    }
  }

  return { totalIncome, totalExpenses, net: totalIncome - totalExpenses };
}

// --- Calculate take-home ---
function calcTakeHome() {
  let weeklyIncome = 0;
  let monthlyIncome = 0;
  let weeklyExpenses = 0;
  let monthlyExpenses = 0;

  for (const inc of data.income) {
    if (inc.frequency === 'weekly') {
      weeklyIncome += inc.amount;
      monthlyIncome += inc.amount * 52 / 12;
    } else if (inc.frequency === 'biweekly') {
      weeklyIncome += inc.amount / 2;
      monthlyIncome += inc.amount * 26 / 12;
    } else if (inc.frequency === 'monthly') {
      monthlyIncome += inc.amount;
      weeklyIncome += inc.amount * 12 / 52;
    } else if (inc.frequency === 'yearly') {
      monthlyIncome += inc.amount / 12;
      weeklyIncome += inc.amount / 52;
    }
  }

  for (const rec of data.recurring) {
    if (rec.frequency === 'weekly') {
      weeklyExpenses += rec.amount;
      monthlyExpenses += rec.amount * 52 / 12;
    } else if (rec.frequency === 'biweekly') {
      weeklyExpenses += rec.amount / 2;
      monthlyExpenses += rec.amount * 26 / 12;
    } else if (rec.frequency === 'monthly') {
      monthlyExpenses += rec.amount;
      weeklyExpenses += rec.amount * 12 / 52;
    } else if (rec.frequency === 'yearly') {
      monthlyExpenses += rec.amount / 12;
      weeklyExpenses += rec.amount / 52;
    }
  }

  const weeklyNet = weeklyIncome - weeklyExpenses;
  const monthlyNet = monthlyIncome - monthlyExpenses;
  const yearlyNet = monthlyNet * 12;

  return { weeklyIncome, monthlyIncome, weeklyExpenses, monthlyExpenses, weeklyNet, monthlyNet, yearlyNet };
}

// --- Render ---
function render() {
  renderCalendar();
  renderSidebar();
}

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const title = document.getElementById('monthTitle');
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  title.textContent = `${months[currentMonth]} ${currentYear}`;

  const days = getMonthDays(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

  let html = '';
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (const d of dayNames) {
    html += `<div class="cal-header">${d}</div>`;
  }

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="cal-day empty"></div>';
  }

  // Day cells
  for (let d = 1; d <= days; d++) {
    const isToday = isCurrentMonth && today.getDate() === d;
    const entries = getEntriesForDate(currentYear, currentMonth, d);

    let dayIncome = 0, dayExpense = 0;
    for (const e of entries) {
      if (e.type === 'income') dayIncome += e.amount;
      else dayExpense += e.amount;
    }

    const dayNet = dayIncome - dayExpense;
    const hasEntries = entries.length > 0;

    html += `<div class="cal-day${isToday ? ' today' : ''}" onclick="showDayDetail(event, ${currentYear}, ${currentMonth}, ${d})">`;
    html += `<div class="day-number">${d}</div>`;
    html += '<div class="day-entries">';

    // Show up to 3 entries
    const showEntries = entries.slice(0, 3);
    for (const e of showEntries) {
      const cls = e.type === 'income' ? 'income' : 'expense';
      const recurCls = e.isRecurring ? ' recurring' : '';
      html += `<div class="day-entry ${cls}${recurCls}">${truncate(e.name || e.description, 16)} ${formatMoney(e.amount)}</div>`;
    }
    if (entries.length > 3) {
      html += `<div class="day-entry" style="color:var(--text-dim)">+${entries.length - 3} more</div>`;
    }

    html += '</div>';

    if (hasEntries) {
      const totalCls = dayNet >= 0 ? 'positive' : 'negative';
      html += `<div class="day-total ${totalCls}">${dayNet >= 0 ? '+' : ''}${formatMoney(dayNet)}</div>`;
    }

    html += '</div>';
  }

  // Fill remaining cells
  const totalCells = firstDay + days;
  const remainder = totalCells % 7;
  if (remainder > 0) {
    for (let i = 0; i < 7 - remainder; i++) {
      html += '<div class="cal-day empty"></div>';
    }
  }

  grid.innerHTML = html;
}

function renderSidebar() {
  const th = calcTakeHome();

  document.getElementById('weeklyIncome').textContent = formatMoney(th.weeklyNet);
  document.getElementById('weeklyIncome').className = `amount ${th.weeklyNet >= 0 ? 'positive' : 'negative'}`;

  document.getElementById('monthlyIncome').textContent = formatMoney(th.monthlyNet);
  document.getElementById('monthlyIncome').className = `amount ${th.monthlyNet >= 0 ? 'positive' : 'negative'}`;

  document.getElementById('monthlyBreakdown').innerHTML =
    `<div class="summary-row"><span>Income</span><span style="color:var(--green)">${formatMoney(th.monthlyIncome)}</span></div>` +
    `<div class="summary-row"><span>Expenses</span><span style="color:var(--red)">-${formatMoney(th.monthlyExpenses)}</span></div>`;

  document.getElementById('yearlyIncome').textContent = formatMoney(th.yearlyNet);
  document.getElementById('yearlyIncome').className = `amount ${th.yearlyNet >= 0 ? 'positive' : 'negative'}`;

  // This month totals
  const mt = getMonthTotals(currentYear, currentMonth);
  document.getElementById('monthIncome').textContent = formatMoney(mt.totalIncome);
  document.getElementById('monthExpenses').textContent = `-${formatMoney(mt.totalExpenses)}`;
  document.getElementById('monthNet').textContent = `${mt.net >= 0 ? '' : '-'}${formatMoney(Math.abs(mt.net))}`;
  document.getElementById('monthNet').className = `amount ${mt.net >= 0 ? 'positive' : 'negative'}`;

  // Income list
  const incomeList = document.getElementById('incomeList');
  incomeList.innerHTML = data.income.map(i => `
    <div class="item-row">
      <span class="item-name">${i.name}</span>
      <span class="item-amount income">+${formatMoney(i.amount)}</span>
      <span class="item-freq">${i.frequency}</span>
      <div class="item-actions">
        <button class="icon-btn" onclick="editItem('income', ${i.id})" title="Edit">&#9998;</button>
        <button class="icon-btn delete" onclick="deleteItem('income', ${i.id})" title="Delete">&#10005;</button>
      </div>
    </div>
  `).join('');

  // Recurring list
  const recurringList = document.getElementById('recurringList');
  recurringList.innerHTML = data.recurring.map(r => `
    <div class="item-row">
      <span class="item-name">${r.name}</span>
      <span class="item-amount expense">-${formatMoney(r.amount)}</span>
      <span class="item-freq">${r.frequency}</span>
      <div class="item-actions">
        <button class="icon-btn" onclick="editItem('recurring', ${r.id})" title="Edit">&#9998;</button>
        <button class="icon-btn delete" onclick="deleteItem('recurring', ${r.id})" title="Delete">&#10005;</button>
      </div>
    </div>
  `).join('');
}

// --- Day Detail ---
function showDayDetail(event, year, month, day) {
  const entries = getEntriesForDate(year, month, day);
  if (entries.length === 0) return;

  const detail = document.getElementById('dayDetail');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(year, month, day);

  document.getElementById('dayDetailTitle').textContent =
    `${dayNames[date.getDay()]}, ${months[month]} ${day}`;

  let itemsHtml = '';
  let total = 0;

  for (const e of entries) {
    const sign = e.type === 'income' ? '+' : '-';
    const color = e.type === 'income' ? 'var(--green)' : 'var(--red)';
    const amt = e.type === 'income' ? e.amount : -e.amount;
    total += amt;

    const label = e.name || e.description;
    const tag = e.isRecurring ? ' <span style="font-size:9px;color:var(--yellow)">[recurring]</span>' : '';
    itemsHtml += `<div class="day-detail-item">
      <span>${label}${tag}</span>
      <span style="color:${color};font-weight:600">${sign}${formatMoney(e.amount)}</span>
    </div>`;
  }

  document.getElementById('dayDetailItems').innerHTML = itemsHtml;
  document.getElementById('dayDetailTotal').innerHTML = `
    <span>Net</span>
    <span style="color:${total >= 0 ? 'var(--green)' : 'var(--red)'}">${total >= 0 ? '+' : '-'}${formatMoney(Math.abs(total))}</span>
  `;

  // Position
  const rect = event.currentTarget.getBoundingClientRect();
  detail.classList.add('active');
  let left = rect.right + 8;
  let top = rect.top;
  if (left + 300 > window.innerWidth) left = rect.left - 308;
  if (top + detail.offsetHeight > window.innerHeight) top = window.innerHeight - detail.offsetHeight - 10;
  detail.style.left = left + 'px';
  detail.style.top = top + 'px';

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', closeDayDetail);
  }, 10);
}

function closeDayDetail(e) {
  const detail = document.getElementById('dayDetail');
  if (!detail.contains(e.target)) {
    detail.classList.remove('active');
    document.removeEventListener('click', closeDayDetail);
  }
}

// --- Modal ---
function openModal(type, editData) {
  document.getElementById('modalOverlay').classList.add('active');
  document.getElementById('itemType').value = type;
  document.getElementById('modalTitle').textContent =
    editData ? `Edit ${type === 'income' ? 'Income' : 'Expense'}` : `Add ${type === 'income' ? 'Income Source' : 'Recurring Expense'}`;

  // Reset
  document.getElementById('itemId').value = editData ? editData.id : '';
  document.getElementById('itemName').value = editData ? editData.name : '';
  document.getElementById('itemAmount').value = editData ? editData.amount : '';
  document.getElementById('itemFrequency').value = editData ? editData.frequency : 'monthly';
  document.getElementById('itemDayOfMonth').value = editData ? (editData.dayOfMonth || '') : '';
  document.getElementById('itemDayOfWeek').value = editData ? (editData.dayOfWeek || 0) : 0;
  document.getElementById('itemDate').value = editData ? (editData.date || '') : '';
  document.getElementById('itemCategory').value = editData ? (editData.category || 'Other') : 'Other';

  updateFrequencyFields();
}

function closeModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('modalOverlay').classList.remove('active');
}

function updateFrequencyFields() {
  const freq = document.getElementById('itemFrequency').value;
  document.getElementById('dayOfMonthGroup').style.display = (freq === 'monthly' || freq === 'yearly') ? '' : 'none';
  document.getElementById('dayOfWeekGroup').style.display = (freq === 'weekly' || freq === 'biweekly') ? '' : 'none';
  document.getElementById('dateGroup').style.display = freq === 'one-time' ? '' : 'none';
}

document.getElementById('itemFrequency').addEventListener('change', updateFrequencyFields);

async function saveItem(e) {
  e.preventDefault();
  const type = document.getElementById('itemType').value;
  const freq = document.getElementById('itemFrequency').value;

  const item = {
    name: document.getElementById('itemName').value,
    amount: parseFloat(document.getElementById('itemAmount').value),
    frequency: freq,
    category: document.getElementById('itemCategory').value
  };

  const idVal = document.getElementById('itemId').value;
  if (idVal) item.id = parseInt(idVal);

  if (freq === 'monthly' || freq === 'yearly') {
    item.dayOfMonth = parseInt(document.getElementById('itemDayOfMonth').value) || 1;
  }
  if (freq === 'weekly' || freq === 'biweekly') {
    item.dayOfWeek = parseInt(document.getElementById('itemDayOfWeek').value);
  }
  if (freq === 'one-time') {
    item.date = document.getElementById('itemDate').value;
  }

  const endpoint = type === 'income' ? '/api/income' : '/api/recurring';
  await apiPost(endpoint, item);
  closeModal();
  toast(`${item.name} saved`);
}

function editItem(type, id) {
  const list = type === 'income' ? data.income : data.recurring;
  const item = list.find(i => i.id === id);
  if (item) openModal(type, item);
}

async function deleteItem(type, id) {
  if (!confirm('Delete this item?')) return;
  const endpoint = type === 'income' ? '/api/income' : '/api/recurring';
  await apiDelete(endpoint, id);
  toast('Item deleted');
}

// --- Upload ---
function openUploadModal() {
  document.getElementById('uploadOverlay').classList.add('active');
  document.getElementById('uploadStatus').textContent = '';
  document.getElementById('parsedResults').innerHTML = '';
}

function closeUploadModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('uploadOverlay').classList.remove('active');
}

async function uploadFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  document.getElementById('uploadStatus').textContent = 'Parsing statement...';

  const formData = new FormData();
  formData.append('statement', file);

  try {
    const res = await fetch('/api/upload-statement', { method: 'POST', body: formData });
    const result = await res.json();

    if (result.error) {
      document.getElementById('uploadStatus').textContent = result.error;
      return;
    }

    document.getElementById('uploadStatus').textContent =
      `Found ${result.parsed} transactions`;

    let html = '';
    for (const t of result.transactions) {
      const color = t.type === 'income' ? 'var(--green)' : 'var(--red)';
      html += `<div class="parsed-item">
        <span>${t.date}</span>
        <span style="flex:1;margin:0 8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.description}</span>
        <span class="parsed-cat">${t.category}</span>
        <span style="color:${color};font-weight:600;margin-left:8px">${formatMoney(t.amount)}</span>
      </div>`;
    }
    document.getElementById('parsedResults').innerHTML = html;

    data = result.allData;
    render();
    toast(`${result.parsed} transactions imported`);
  } catch (err) {
    document.getElementById('uploadStatus').textContent = 'Upload failed: ' + err.message;
  }

  e.target.value = '';
}

// --- Helpers ---
function formatMoney(amount) {
  return '$' + Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.substring(0, len - 1) + '...' : str;
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

// Keyboard nav
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') changeMonth(-1);
  if (e.key === 'ArrowRight') changeMonth(1);
  if (e.key === 'Escape') {
    closeModal();
    closeUploadModal();
    document.getElementById('dayDetail').classList.remove('active');
  }
});
