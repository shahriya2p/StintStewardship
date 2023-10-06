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
exports.SubjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const subject_entity_1 = require("./subject.entity");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
let SubjectService = class SubjectService {
    constructor(subjectRepository) {
        this.subjectRepository = subjectRepository;
    }
    async createSubject(createSubjectInput) {
        const { sub_code, sub_name, sub_of_sem } = createSubjectInput;
        const subject = this.subjectRepository.create({
            subject_id: (0, uuid_1.v4)(),
            sub_code,
            sub_name,
            sub_of_sem,
        });
        return await this.subjectRepository.save(subject);
    }
    async getSubjects() {
        return await this.subjectRepository.find();
    }
    async getSubjectById(subject_code) {
        return await this.subjectRepository.findOneBy({ sub_code: subject_code });
    }
    async getSubjectByName(sub_name) {
        return await this.subjectRepository.findOneBy({ sub_name: sub_name });
    }
    async deleteSubject(id) {
        const subject_to_delete = await this.subjectRepository.findOne({
            where: { subject_id: id },
        });
        if (subject_to_delete) {
            const result = await this.subjectRepository.delete(subject_to_delete._id);
            return result.affected > 0;
        }
        else {
            return false;
        }
    }
};
SubjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubjectService);
exports.SubjectService = SubjectService;
//# sourceMappingURL=subject.service.js.map