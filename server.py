#!/usr/bin/env python3
"""Budget Calendar Server - Python/Flask-free version using built-in http.server"""

import http.server
import json
import os
import socket
import urllib.parse
import io
import re
from datetime import datetime
from pathlib import Path

PORT = 3000
DATA_FILE = Path(__file__).parent / 'data' / 'budget.json'
PUBLIC_DIR = Path(__file__).parent / 'public'

# --- Data ---
def load_data():
    if not DATA_FILE.exists():
        defaults = {
            "income": [
                {"id": 1, "name": "J&A Management Group", "amount": 1115, "frequency": "weekly", "dayOfWeek": 5},
                {"id": 2, "name": "Advanced Medical Hair Institute", "amount": 300, "frequency": "monthly", "dayOfMonth": 1}
            ],
            "recurring": [],
            "transactions": [],
            "nextId": 3
        }
        DATA_FILE.parent.mkdir(exist_ok=True)
        DATA_FILE.write_text(json.dumps(defaults, indent=2))
        return defaults
    return json.loads(DATA_FILE.read_text())

def save_data(data):
    DATA_FILE.write_text(json.dumps(data, indent=2))

# --- PDF Parsing ---
def parse_pdf_text(text):
    """Parse bank statement text for transactions"""
    transactions = []
    lines = text.split('\n')
    date_pattern = re.compile(r'(\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4})')

    for line in lines:
        date_match = date_pattern.search(line)
        if not date_match:
            continue

        amounts = re.findall(r'[-]?\$?([\d,]+\.\d{2})', line)
        if not amounts:
            continue

        # Get description between date and first amount
        date_end = date_match.end()
        first_amt_match = re.search(r'[-]?\$?[\d,]+\.\d{2}', line[date_end:])
        if first_amt_match:
            description = line[date_end:date_end + first_amt_match.start()].strip()
        else:
            description = line[date_end:].strip()

        description = re.sub(r'^[\s\-–]+', '', description).strip()
        if not description:
            description = 'Unknown'

        amount = float(amounts[0].replace(',', ''))

        is_debit = ('debit' in line.lower() or '-$' in line or
                     bool(re.search(r'-\s*\$', line)))

        date_str = normalize_date(date_match.group(1))

        transactions.append({
            "date": date_str,
            "description": description,
            "amount": amount,
            "type": "expense" if is_debit else "income",
            "category": categorize(description)
        })

    return transactions

def normalize_date(date_str):
    parts = re.split(r'[/\-]', date_str)
    month = parts[0].zfill(2)
    day = parts[1].zfill(2)
    year = parts[2]
    if len(year) == 2:
        year = '20' + year
    return f"{year}-{month}-{day}"

def categorize(desc):
    d = desc.lower()
    categories = [
        (['rent', 'mortgage'], 'Housing'),
        (['electric', 'water', 'utility', 'sewer'], 'Utilities'),
        (['insurance'], 'Insurance'),
        (['grocery', 'walmart', 'kroger', 'publix', 'aldi'], 'Groceries'),
        (['restaurant', 'mcdonald', 'starbucks', 'doordash', 'uber eat', 'grubhub'], 'Dining'),
        (['netflix', 'spotify', 'hulu', 'disney', 'youtube', 'apple', 'amazon prime'], 'Subscriptions'),
        (['shell', 'chevron', 'bp', 'fuel', 'gas station'], 'Gas'),
        (['car', 'auto', 'vehicle'], 'Auto'),
        (['phone', 't-mobile', 'verizon', 'at&t'], 'Phone'),
        (['internet', 'comcast', 'spectrum'], 'Internet'),
        (['transfer', 'zelle', 'venmo', 'cashapp'], 'Transfer'),
        (['payroll', 'direct dep', 'salary'], 'Income'),
    ]
    for keywords, category in categories:
        if any(k in d for k in keywords):
            return category
    return 'Other'

# --- HTTP Handler ---
class BudgetHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def do_GET(self):
        if self.path == '/api/data':
            self.send_json(load_data())
        else:
            super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))

        if self.path == '/api/income':
            body = json.loads(self.rfile.read(content_length))
            data = load_data()
            if body.get('id'):
                idx = next((i for i, x in enumerate(data['income']) if x['id'] == body['id']), -1)
                if idx >= 0:
                    data['income'][idx] = body
            else:
                body['id'] = data['nextId']
                data['nextId'] += 1
                data['income'].append(body)
            save_data(data)
            self.send_json(data)

        elif self.path == '/api/recurring':
            body = json.loads(self.rfile.read(content_length))
            data = load_data()
            if body.get('id'):
                idx = next((i for i, x in enumerate(data['recurring']) if x['id'] == body['id']), -1)
                if idx >= 0:
                    data['recurring'][idx] = body
            else:
                body['id'] = data['nextId']
                data['nextId'] += 1
                data['recurring'].append(body)
            save_data(data)
            self.send_json(data)

        elif self.path == '/api/transaction':
            body = json.loads(self.rfile.read(content_length))
            data = load_data()
            if body.get('id'):
                idx = next((i for i, x in enumerate(data['transactions']) if x['id'] == body['id']), -1)
                if idx >= 0:
                    data['transactions'][idx] = body
            else:
                body['id'] = data['nextId']
                data['nextId'] += 1
                data['transactions'].append(body)
            save_data(data)
            self.send_json(data)

        elif self.path == '/api/upload-statement':
            self.handle_upload()

        else:
            self.send_error(404)

    def do_DELETE(self):
        parts = self.path.split('/')
        if len(parts) == 4 and parts[1] == 'api':
            collection = parts[2]  # income, recurring, or transaction
            item_id = int(parts[3])
            data = load_data()

            if collection == 'income':
                data['income'] = [i for i in data['income'] if i['id'] != item_id]
            elif collection == 'recurring':
                data['recurring'] = [i for i in data['recurring'] if i['id'] != item_id]
            elif collection == 'transaction':
                data['transactions'] = [i for i in data['transactions'] if i['id'] != item_id]

            save_data(data)
            self.send_json(data)
        else:
            self.send_error(404)

    def handle_upload(self):
        content_type = self.headers.get('Content-Type', '')

        if 'multipart/form-data' not in content_type:
            self.send_json({"error": "Expected multipart form data"}, 400)
            return

        # Parse multipart form data
        boundary = content_type.split('boundary=')[1].encode()
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        # Extract PDF data from multipart
        pdf_data = extract_file_from_multipart(body, boundary)

        if not pdf_data:
            self.send_json({"error": "No file found in upload"}, 400)
            return

        try:
            # Try to use PyPDF2 or pdfplumber if available, otherwise basic extraction
            text = extract_text_from_pdf(pdf_data)
            transactions = parse_pdf_text(text)

            data = load_data()
            for t in transactions:
                t['id'] = data['nextId']
                t['source'] = 'bank-statement'
                data['nextId'] += 1
                data['transactions'].append(t)
            save_data(data)

            self.send_json({
                "parsed": len(transactions),
                "transactions": transactions,
                "allData": data
            })
        except Exception as e:
            self.send_json({"error": f"Could not parse PDF: {str(e)}"}, 400)

    def send_json(self, obj, code=200):
        data = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(data))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, format, *args):
        # Quiet logging - only show errors
        if args and '404' in str(args[0]):
            super().log_message(format, *args)

def extract_file_from_multipart(body, boundary):
    """Extract file bytes from multipart form data"""
    parts = body.split(b'--' + boundary)
    for part in parts:
        if b'filename=' in part:
            # Find the blank line separating headers from content
            header_end = part.find(b'\r\n\r\n')
            if header_end >= 0:
                file_data = part[header_end + 4:]
                # Remove trailing boundary markers
                if file_data.endswith(b'\r\n'):
                    file_data = file_data[:-2]
                if file_data.endswith(b'--'):
                    file_data = file_data[:-2]
                if file_data.endswith(b'\r\n'):
                    file_data = file_data[:-2]
                return file_data
    return None

def extract_text_from_pdf(pdf_bytes):
    """Extract text from PDF using available libraries"""
    # Try PyPDF2
    try:
        from PyPDF2 import PdfReader
        reader = PdfReader(io.BytesIO(pdf_bytes))
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        return text
    except ImportError:
        pass

    # Try pdfplumber
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            text = ''
            for page in pdf.pages:
                text += page.extract_text() + '\n'
            return text
    except ImportError:
        pass

    # Try pdfminer
    try:
        from pdfminer.high_level import extract_text as pdfminer_extract
        return pdfminer_extract(io.BytesIO(pdf_bytes))
    except ImportError:
        pass

    raise ImportError(
        "No PDF library found. Install one with:\n"
        "  pip install PyPDF2\n"
        "  pip install pdfplumber\n"
        "  pip install pdfminer.six"
    )

def get_local_ips():
    ips = []
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ip = info[4][0]
            if not ip.startswith('127.'):
                ips.append(ip)
    except Exception:
        pass
    return list(set(ips))

if __name__ == '__main__':
    # Ensure data directory exists
    DATA_FILE.parent.mkdir(exist_ok=True)

    server = http.server.HTTPServer(('0.0.0.0', PORT), BudgetHandler)

    ips = get_local_ips()
    print(f"\n  Budget Calendar running at:")
    print(f"    Local:   http://localhost:{PORT}")
    for ip in ips:
        print(f"    Network: http://{ip}:{PORT}")
    print(f"\n  Access from any device on your network!\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
        server.server_close()
