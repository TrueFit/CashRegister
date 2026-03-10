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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("./transaction.schema");
const change_calculator_service_1 = require("./change-calculator.service");
let TransactionsService = class TransactionsService {
    constructor(transactionModel, changeCalculatorService) {
        this.transactionModel = transactionModel;
        this.changeCalculatorService = changeCalculatorService;
    }
    async processTransactions(rows) {
        const results = [];
        for (const row of rows) {
            if (row.amountPaid < row.amountOwed) {
                throw new common_1.BadRequestException(`amountPaid (${row.amountPaid}) must be >= amountOwed (${row.amountOwed})`);
            }
            const { change, denominations, strategy } = this.changeCalculatorService.calculate(row.amountOwed, row.amountPaid);
            const transaction = new this.transactionModel({
                amountOwed: row.amountOwed,
                amountPaid: row.amountPaid,
                change,
                denominations,
                strategy,
                timestamp: new Date(),
            });
            await transaction.save();
            results.push({
                amountOwed: row.amountOwed,
                amountPaid: row.amountPaid,
                change,
                denominations,
                strategy,
            });
        }
        return results;
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        change_calculator_service_1.ChangeCalculatorService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map