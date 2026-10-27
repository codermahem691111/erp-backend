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
var PeopleRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleRepository = void 0;
const common_1 = require("@nestjs/common");
const supabase_error_1 = require("../common/supabase-error");
const supabase_service_1 = require("../supabase/supabase.service");
const people_mapper_1 = require("./people.mapper");
const TABLE = 'people';
let PeopleRepository = PeopleRepository_1 = class PeopleRepository {
    supabase;
    logger = new common_1.Logger(PeopleRepository_1.name);
    constructor(supabase) {
        this.supabase = supabase;
    }
    async list(companyId, personType) {
        let query = this.supabase.admin
            .from(TABLE)
            .select('*')
            .eq('company_id', companyId)
            .order('created_at', { ascending: false });
        if (personType)
            query = query.eq('person_type', personType);
        const { data, error } = await query;
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'list people', error);
        return (data ?? []).map((row) => people_mapper_1.PeopleMapper.toEntity(row));
    }
    async findById(companyId, id) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .select('*')
            .eq('company_id', companyId)
            .eq('id', id)
            .maybeSingle();
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'find person', error);
        return data ? people_mapper_1.PeopleMapper.toEntity(data) : null;
    }
    async create(input) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .insert(people_mapper_1.PeopleMapper.toInsertRow(input))
            .select()
            .single();
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'create person', error);
        return people_mapper_1.PeopleMapper.toEntity(data);
    }
    async update(companyId, id, input) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .update(people_mapper_1.PeopleMapper.toUpdateRow(input))
            .eq('company_id', companyId)
            .eq('id', id)
            .select()
            .maybeSingle();
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'update person', error);
        return data ? people_mapper_1.PeopleMapper.toEntity(data) : null;
    }
    async delete(companyId, id) {
        const { data, error } = await this.supabase.admin
            .from(TABLE)
            .delete()
            .eq('company_id', companyId)
            .eq('id', id)
            .select('id')
            .maybeSingle();
        (0, supabase_error_1.throwOnSupabaseError)(this.logger, 'delete person', error);
        return Boolean(data);
    }
};
exports.PeopleRepository = PeopleRepository;
exports.PeopleRepository = PeopleRepository = PeopleRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], PeopleRepository);
//# sourceMappingURL=people.repository.js.map