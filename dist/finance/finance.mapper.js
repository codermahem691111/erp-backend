"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceMapper = void 0;
class FinanceMapper {
    static toEntity(row) {
        return {
            id: row.id,
            companyId: row.company_id,
            entryType: row.entry_type,
            expenseCategory: row.expense_category,
            amount: Number(row.amount),
            note: row.note,
            productId: row.product_id,
            occurredAt: new Date(row.occurred_at),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
    static toInsertRow(input) {
        return {
            company_id: input.companyId,
            entry_type: input.entryType,
            expense_category: input.expenseCategory,
            amount: input.amount,
            note: input.note,
            product_id: input.productId,
            occurred_at: input.occurredAt.toISOString(),
        };
    }
}
exports.FinanceMapper = FinanceMapper;
//# sourceMappingURL=finance.mapper.js.map