"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleMapper = void 0;
class PeopleMapper {
    static toEntity(row) {
        return {
            id: row.id,
            companyId: row.company_id,
            personType: row.person_type,
            name: row.name,
            details: row.details,
            email: row.email,
            phone: row.phone,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
    static toInsertRow(input) {
        return {
            company_id: input.companyId,
            person_type: input.personType,
            name: input.name,
            details: input.details,
            email: input.email,
            phone: input.phone,
        };
    }
    static toUpdateRow(input) {
        const row = {};
        if (input.personType !== undefined)
            row.person_type = input.personType;
        if (input.name !== undefined)
            row.name = input.name;
        if (input.details !== undefined)
            row.details = input.details;
        if (input.email !== undefined)
            row.email = input.email;
        if (input.phone !== undefined)
            row.phone = input.phone;
        return row;
    }
}
exports.PeopleMapper = PeopleMapper;
//# sourceMappingURL=people.mapper.js.map