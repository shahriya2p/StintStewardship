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
exports.CreateStudentInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let CreateStudentInput = class CreateStudentInput {
};
__decorate([
    (0, graphql_1.Field)({ nullable: false }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudentInput.prototype, "stud_name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: false }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateStudentInput.prototype, "stud_roll", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: false }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateStudentInput.prototype, "semester", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: false }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudentInput.prototype, "username", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: false }),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStudentInput.prototype, "password", void 0);
CreateStudentInput = __decorate([
    (0, graphql_1.InputType)()
], CreateStudentInput);
exports.CreateStudentInput = CreateStudentInput;
//# sourceMappingURL=create-student.input.type.js.map