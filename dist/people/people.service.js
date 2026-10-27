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
exports.PeopleService = void 0;
const common_1 = require("@nestjs/common");
const people_repository_1 = require("./people.repository");
let PeopleService = class PeopleService {
    people;
    constructor(people) {
        this.people = people;
    }
    list(companyId, personType) {
        return this.people.list(companyId, personType);
    }
    async get(companyId, id) {
        const person = await this.people.findById(companyId, id);
        if (!person)
            throw new common_1.NotFoundException('Person not found.');
        return person;
    }
    create(companyId, dto) {
        return this.people.create({
            companyId,
            personType: dto.personType,
            name: dto.name,
            details: dto.details ?? '',
            email: dto.email ?? null,
            phone: dto.phone ?? null,
        });
    }
    async update(companyId, id, dto) {
        const updated = await this.people.update(companyId, id, {
            personType: dto.personType,
            name: dto.name,
            details: dto.details,
            email: dto.email,
            phone: dto.phone,
        });
        if (!updated)
            throw new common_1.NotFoundException('Person not found.');
        return updated;
    }
    async remove(companyId, id) {
        const deleted = await this.people.delete(companyId, id);
        if (!deleted)
            throw new common_1.NotFoundException('Person not found.');
    }
};
exports.PeopleService = PeopleService;
exports.PeopleService = PeopleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [people_repository_1.PeopleRepository])
], PeopleService);
//# sourceMappingURL=people.service.js.map