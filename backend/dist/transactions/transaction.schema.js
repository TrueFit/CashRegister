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
exports.TransactionSchema = exports.Transaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Transaction = class Transaction {
};
exports.Transaction = Transaction;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "amountOwed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "amountPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "change", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Transaction.prototype, "denominations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['greedy', 'random'] }),
    __metadata("design:type", String)
], Transaction.prototype, "strategy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: () => new Date() }),
    __metadata("design:type", Date)
], Transaction.prototype, "timestamp", void 0);
exports.Transaction = Transaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: false })
], Transaction);
exports.TransactionSchema = mongoose_1.SchemaFactory.createForClass(Transaction);
//# sourceMappingURL=transaction.schema.js.map