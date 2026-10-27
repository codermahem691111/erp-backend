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
exports.CreateProductDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const normalize_decorators_1 = require("../../common/decorators/normalize.decorators");
class CreateProductDto {
    name;
    details = '';
    sellingPrice;
    buyingPrice;
    imageUrl;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Product name is required.' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Product name must be at most 150 characters.' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(4000, { message: 'Details must be at most 4000 characters.' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "details", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'Selling price must be a number.' }),
    (0, class_validator_1.Min)(0, { message: 'Selling price cannot be negative.' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "sellingPrice", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'Buying price must be a number.' }),
    (0, class_validator_1.Min)(0, { message: 'Buying price cannot be negative.' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "buyingPrice", void 0);
__decorate([
    (0, normalize_decorators_1.Trim)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Image must be a valid URL.' }),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateProductDto.prototype, "imageUrl", void 0);
//# sourceMappingURL=create-product.dto.js.map