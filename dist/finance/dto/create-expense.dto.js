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
exports.CreateExpenseDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const normalize_decorators_1 = require("../../common/decorators/normalize.decorators");
const finance_types_1 = require("../finance.types");
class CreateExpenseDto {
    category;
    amount;
    note;
    productId;
    occurredAt;
}
exports.CreateExpenseDto = CreateExpenseDto;
__decorate([
    (0, class_validator_1.IsIn)(finance_types_1.EXPENSE_CATEGORIES, {
        message: 'Expense must be staff salary, product buying, or store maintenance.',
    }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "category", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'Amount must be a number.' }),
    (0, class_validator_1.Min)(0.01, { message: 'Amount must be greater than 0.' }),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Product is invalid.' }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Date must be a valid date.' }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "occurredAt", void 0);
//# sourceMappingURL=create-expense.dto.js.map