"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const products_repository_1 = require("../products/products.repository");
const finance_repository_1 = require("./finance.repository");
let FinanceService = class FinanceService {
    finance;
    products;
    constructor(finance, products) {
        this.finance = finance;
        this.products = products;
    }
    list(companyId) {
        return this.finance.list(companyId);
    }
    async addExpense(companyId, dto) {
        if (dto.category === 'product_buying' && dto.productId) {
            await this.assertOwnProduct(companyId, dto.productId);
        }
        else if (dto.productId && dto.category !== 'product_buying') {
            throw new common_1.BadRequestException('A product can only be linked to product buying expenses.');
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
    async addIncome(companyId, dto) {
        if (dto.productId)
            await this.assertOwnProduct(companyId, dto.productId);
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
    async remove(companyId, id) {
        const deleted = await this.finance.delete(companyId, id);
        if (!deleted)
            throw new common_1.NotFoundException('Finance entry not found.');
    }
    async summary(companyId) {
        const entries = await this.finance.list(companyId);
        const totals = {
            income: 0,
            expenses: 0,
            net: 0,
            staffSalary: 0,
            productBuying: 0,
            storeMaintenance: 0,
        };
        const months = new Map();
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
            }
            else {
                totals.expenses += entry.amount;
                point.expenses += entry.amount;
                if (entry.expenseCategory === 'staff_salary') {
                    totals.staffSalary += entry.amount;
                    point.staffSalary += entry.amount;
                }
                else if (entry.expenseCategory === 'product_buying') {
                    totals.productBuying += entry.amount;
                    point.buying += entry.amount;
                }
                else if (entry.expenseCategory === 'store_maintenance') {
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
    async assertOwnProduct(companyId, productId) {
        const product = await this.products.findById(companyId, productId);
        if (!product)
            throw new common_1.BadRequestException('That product does not belong to your company.');
    }
    monthKey(date) {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }
    fillRecentMonths(existing, count) {
        const now = new Date();
        const points = [];
        for (let i = count - 1; i >= 0; i -= 1) {
            const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
            const key = this.monthKey(date);
            points.push(existing.get(key) ?? {
                month: key,
                selling: 0,
                buying: 0,
                staffSalary: 0,
                storeMaintenance: 0,
                expenses: 0,
                net: 0,
            });
        }
        return points;
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [finance_repository_1.FinanceRepository,
        products_repository_1.ProductsRepository])
], FinanceService);
//# sourceMappingURL=finance.service.js.map