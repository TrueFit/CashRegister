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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const transactions_service_1 = require("./transactions.service");
const transaction_row_dto_1 = require("./dto/transaction-row.dto");
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const content = file.buffer.toString('utf-8');
        const lines = content
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        if (lines.length === 0) {
            throw new common_1.BadRequestException('CSV file is empty');
        }
        const firstLine = lines[0].toLowerCase();
        const dataLines = firstLine.includes('amount_owed') || firstLine.includes('amountowed')
            ? lines.slice(1)
            : lines;
        if (dataLines.length === 0) {
            throw new common_1.BadRequestException('CSV file has no data rows');
        }
        const rows = [];
        for (let i = 0; i < dataLines.length; i++) {
            const parts = dataLines[i].split(',');
            if (parts.length < 2) {
                throw new common_1.BadRequestException(`Invalid CSV row at line ${i + 1}: "${dataLines[i]}"`);
            }
            const [rawOwed, rawPaid] = parts;
            const dto = (0, class_transformer_1.plainToInstance)(transaction_row_dto_1.TransactionRowDto, {
                amountOwed: rawOwed.trim(),
                amountPaid: rawPaid.trim(),
            });
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                const messages = errors
                    .map((e) => Object.values(e.constraints || {}).join(', '))
                    .join('; ');
                throw new common_1.BadRequestException(`Validation error at row ${i + 1}: ${messages}`);
            }
            rows.push(dto);
        }
        return this.transactionsService.processTransactions(rows);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "uploadFile", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map