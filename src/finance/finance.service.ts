import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateIncomeDto } from './dto/create-income.dto';
import { FinanceRepository } from './finance.repository';
import {
  FinanceEntry,
  FinanceSummary,
  MonthlyFinancePoint,
} from './finance.types';

@Injectable()
export class FinanceService {
  constructor(
    private readonly finance: FinanceRepository,
    private readonly products: ProductsRepository,
  ) {}

  list(companyId: string): Promise<FinanceEntry[]> {
    return this.finance.list(companyId);
  }

  async addExpense(companyId: string, dto: CreateExpenseDto): Promise<FinanceEntry> {
    if (dto.category === 'product_buying' && dto.productId) {
      await this.assertOwnProduct(companyId, dto.productId);
    } else if (dto.productId && dto.category !== 'product_buying') {
      throw new BadRequestException('A product can only be linked to product buying expenses.');
    }

    return this.finance.create({
      companyId,
      entryType: 'expense',
      expenseCategory: dto.category,
      amount: dto.amount,
      note: dto.note ?? '',
      productId: dto.productId ?? null,
      occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(),
    });
  }

  async addIncome(companyId: string, dto: CreateIncomeDto): Promise<FinanceEntry> {
    if (dto.productId) await this.assertOwnProduct(companyId, dto.productId);

    return this.finance.create({
      companyId,
      entryType: 'income',
      expenseCategory: null,
      amount: dto.amount,
      note: dto.note ?? '',
      productId: dto.productId ?? null,
      occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(),
    });
  }

  async remove(companyId: string, id: string): Promise<void> {
    const deleted = await this.finance.delete(companyId, id);
    if (!deleted) throw new NotFoundException('Finance entry not found.');
  }

  async summary(companyId: string): Promise<FinanceSummary> {
    const entries = await this.finance.list(companyId);
    const totals = {
      income: 0,
      expenses: 0,
      net: 0,
      staffSalary: 0,
      productBuying: 0,
      storeMaintenance: 0,
    };

    const months = new Map<string, MonthlyFinancePoint>();

    for (const entry of entries) {
      const monthKey = this.monthKey(entry.occurredAt);
      const point = months.get(monthKey) ?? {
        month: monthKey,
        selling: 0,
        buying: 0,
        staffSalary: 0,
        storeMaintenance: 0,
        expenses: 0,
        net: 0,
      };

      if (entry.entryType === 'income') {
        totals.income += entry.amount;
        point.selling += entry.amount;
      } else {
        totals.expenses += entry.amount;
        point.expenses += entry.amount;
        if (entry.expenseCategory === 'staff_salary') {
          totals.staffSalary += entry.amount;
          point.staffSalary += entry.amount;
        } else if (entry.expenseCategory === 'product_buying') {
          totals.productBuying += entry.amount;
          point.buying += entry.amount;
        } else if (entry.expenseCategory === 'store_maintenance') {
          totals.storeMaintenance += entry.amount;
          point.storeMaintenance += entry.amount;
        }
      }

      point.net = point.selling - point.expenses;
      months.set(monthKey, point);
    }

    totals.net = totals.income - totals.expenses;

    const monthly = this.fillRecentMonths(months, 12);
    return { totals, monthly };
  }

  private async assertOwnProduct(companyId: string, productId: string): Promise<void> {
    const product = await this.products.findById(companyId, productId);
    if (!product) throw new BadRequestException('That product does not belong to your company.');
  }

  private monthKey(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private fillRecentMonths(
    existing: Map<string, MonthlyFinancePoint>,
    count: number,
  ): MonthlyFinancePoint[] {
    const now = new Date();
    const points: MonthlyFinancePoint[] = [];

    for (let i = count - 1; i >= 0; i -= 1) {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      const key = this.monthKey(date);
      points.push(
        existing.get(key) ?? {
          month: key,
          selling: 0,
          buying: 0,
          staffSalary: 0,
          storeMaintenance: 0,
          expenses: 0,
          net: 0,
        },
      );
    }

    return points;
  }
}
