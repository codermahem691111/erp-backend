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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const supabase_auth_guard_1 = require("../auth/guards/supabase-auth.guard");
const create_person_dto_1 = require("./dto/create-person.dto");
const update_person_dto_1 = require("./dto/update-person.dto");
const people_service_1 = require("./people.service");
const people_types_1 = require("./people.types");
let PeopleController = class PeopleController {
    peopleService;
    constructor(peopleService) {
        this.peopleService = peopleService;
    }
    list(user, personType) {
        const filter = people_types_1.PERSON_TYPES.includes(personType)
            ? personType
            : undefined;
        return this.peopleService.list(user.id, filter);
    }
    get(user, id) {
        return this.peopleService.get(user.id, id);
    }
    create(user, dto) {
        return this.peopleService.create(user.id, dto);
    }
    update(user, id, dto) {
        return this.peopleService.update(user.id, id, dto);
    }
    remove(user, id) {
        return this.peopleService.remove(user.id, id);
    }
};
exports.PeopleController = PeopleController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('personType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_person_dto_1.CreatePersonDto]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_person_dto_1.UpdatePersonDto]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "remove", null);
exports.PeopleController = PeopleController = __decorate([
    (0, common_1.Controller)('people'),
    (0, common_1.UseGuards)(supabase_auth_guard_1.SupabaseAuthGuard),
    __metadata("design:paramtypes", [people_service_1.PeopleService])
], PeopleController);
//# sourceMappingURL=people.controller.js.map