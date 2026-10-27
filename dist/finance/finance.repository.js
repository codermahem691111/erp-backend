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
var FinanceRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceRepository = void 0;
const common_1 = require("@nestjs/common");
const supabase_error_1 = require("../common/supabase-error");
const supabase_service_1 = require("../supabase/supabase.service");
const finance_mapper_1 = require("./finance.mapper");
const TABLE = 'finance_entries';
let FinanceRepository = FinanceRepository_1 = class FinanceRepository {
    supabase;
    logger = new common_1.Logger(FinanceRepository_1.name);
    constructor(supabase) {
        this.supabase = supabase;
    }
    async list(companyId) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .select('*')
            .eq('company_id', companyId)
            .order('occurred_at', { ascending: false });
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'list finance entries', error);
        return (data ?? []).map((row) => finance_mapper_1.FinanceMapper.toEntity(row));
    }
    async create(input) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .insert(finance_mapper_1.FinanceMapper.toInsertRow(input))
            .select()
            .single();
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'create finance entry', error);
        return finance_mapper_1.FinanceMapper.toEntity(data);
    }
    async delete(companyId, id) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .delete()
            .eq('company_id', companyId)
            .eq('id', id)
            .select('id')
            .maybeSingle();
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'delete finance entry', error);
        return Boolean(data);
    }
};
exports.FinanceRepository = FinanceRepository;
exports.FinanceRepository = FinanceRepository = FinanceRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], FinanceRepository);
//# sourceMappingURL=finance.repository.js.map