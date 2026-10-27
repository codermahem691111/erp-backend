export const EXPENSE_CATEGORIES = ['staff_salary', 'product_buying', 'store_maintenance'] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type FinanceEntryType = 'income' | 'expense';

export interface FinanceEntryRow {
  id: string;
  company_id: string;
  entry_type: FinanceEntryType;
  expense_category: ExpenseCategory | null;
  amount: number | string;
  note: string;
  product_id: string | null;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceEntry {
  id: string;
  companyId: string;
  entryType: FinanceEntryType;
  expenseCategory: ExpenseCategory | null;
  amount: number;
  note: string;
  productId: string | null;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFinanceEntryInput {
  companyId: string;
  entryType: FinanceEntryType;
  expenseCategory: ExpenseCategory | null;
  amount: number;
  note: string;
  productId: string | null;
  occurredAt: Date;
}

export interface MonthlyFinancePoint {
  month: string;
  selling: number;
  buying: number;
  staffSalary: number;
  storeMaintenance: number;
  expenses: number;
  net: number;
}

export interface FinanceSummary {
  totals: {
    income: number;
    expenses: number;
    net: number;
    staffSalary: number;
    productBuying: number;
    storeMaintenance: number;
  };
  monthly: MonthlyFinancePoint[];
}
