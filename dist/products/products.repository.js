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
var ProductsRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRepository = void 0;
const common_1 = require("@nestjs/common");
const supabase_error_1 = require("../common/supabase-error");
const supabase_service_1 = require("../supabase/supabase.service");
const products_mapper_1 = require("./products.mapper");
const TABLE = 'products';
let ProductsRepository = ProductsRepository_1 = class ProductsRepository {
    supabase;
    logger = new common_1.Logger(ProductsRepository_1.name);
    constructor(supabase) {
        this.supabase = supabase;
    }
    async list(companyId) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'list products', error);
        return (data ?? []).map((row) => products_mapper_1.ProductsMapper.toEntity(row));
    }
    async findById(companyId, id) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .select('*')
            .eq('company_id', companyId)
            .eq('id', id)
            .maybeSingle();
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'find product', error);
        return data ? products_mapper_1.ProductsMapper.toEntity(data) : null;
    }
    async create(input) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .insert(products_mapper_1.ProductsMapper.toInsertRow(input))
            .select()
            .single();
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'create product', error);
        return products_mapper_1.ProductsMapper.toEntity(data);
    }
    async update(companyId, id, input) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .update(products_mapper_1.ProductsMapper.toUpdateRow(input))
            .eq('company_id', companyId)
            .eq('id', id)
            .select()
            .maybeSingle();
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'update product', error);
        return data ? products_mapper_1.ProductsMapper.toEntity(data) : null;
    }
    async delete(companyId, id) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .delete()
            .eq('company_id', companyId)
            .eq('id', id)
            .select('id')
            .maybeSingle();
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'delete product', error);
        return Boolean(data);
    }
};
exports.ProductsRepository = ProductsRepository;
exports.ProductsRepository = ProductsRepository = ProductsRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ProductsRepository);
//# sourceMappingURL=products.repository.js.map