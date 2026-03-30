-- ─────────────────────────────────────────────────
-- Expense Calendar – Supabase Setup
-- Run this in the Supabase SQL Editor
-- ─────────────────────────────────────────────────

-- Income sources (weekly paycheck, monthly salary, etc.)
CREATE TABLE IF NOT EXISTS income (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  frequency   TEXT NOT NULL DEFAULT 'monthly',
  day_of_week   INTEGER,
  day_of_month  INTEGER,
  month_of_year INTEGER,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Recurring expenses (rent, subscriptions, etc.)
CREATE TABLE IF NOT EXISTS recurring (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  frequency   TEXT NOT NULL DEFAULT 'monthly',
  day_of_week   INTEGER,
  day_of_month  INTEGER,
  month_of_year INTEGER,
  category    TEXT DEFAULT 'Other',
  date        DATE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- One-time transactions (manual entries + bank statement imports)
CREATE TABLE IF NOT EXISTS transactions (
  id          SERIAL PRIMARY KEY,
  date        DATE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  type        TEXT NOT NULL DEFAULT 'expense'
              CHECK (type IN ('income', 'expense')),
  category    TEXT DEFAULT 'Other',
  source      TEXT DEFAULT 'manual',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS: allow all operations
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all income" ON income
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all recurring" ON recurring
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all transactions" ON transactions
  FOR ALL USING (true) WITH CHECK (true);
