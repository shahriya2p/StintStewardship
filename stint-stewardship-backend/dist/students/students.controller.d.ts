/// <reference types="multer" />
import { FileUploadDto } from './file.upload.dto';
import { StudentsService } from './students.service';
export declare class StudentsController {
    private studentService;
    constructor(studentService: StudentsService);
    uploadFile(file: Express.Multer.File, fileUploadDto: FileUploadDto): Promise<import("./file.entity").File>;
}
