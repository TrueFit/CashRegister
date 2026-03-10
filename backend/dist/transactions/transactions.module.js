"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const transaction_schema_1 = require("./transaction.schema");
const transactions_controller_1 = require("./transactions.controller");
const transactions_service_1 = require("./transactions.service");
const change_calculator_service_1 = require("./change-calculator.service");
const greedy_change_strategy_1 = require("./strategies/greedy-change.strategy");
const random_change_strategy_1 = require("./strategies/random-change.strategy");
const currency_config_1 = require("../config/currency.config");
const change_calculator_config_1 = require("../config/change-calculator.config");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
            ]),
        ],
        controllers: [transactions_controller_1.TransactionsController],
        providers: [
            transactions_service_1.TransactionsService,
            change_calculator_service_1.ChangeCalculatorService,
            greedy_change_strategy_1.GreedyChangeStrategy,
            random_change_strategy_1.RandomChangeStrategy,
            {
                provide: currency_config_1.DENOMINATIONS_TOKEN,
                useFactory: (configService) => {
                    const currency = configService.get('CURRENCY', 'USD');
                    return currency_config_1.CURRENCY_DENOMINATIONS[currency] ?? currency_config_1.USD_DENOMINATIONS;
                },
                inject: [config_1.ConfigService],
            },
            {
                provide: change_calculator_config_1.CHANGE_CALCULATOR_CONFIG,
                useFactory: (configService) => {
                    const divisor = parseInt(configService.get('CHANGE_DIVISOR', '3'), 10);
                    return { divisor: isNaN(divisor) ? 3 : divisor };
                },
                inject: [config_1.ConfigService],
            },
        ],
    })
], TransactionsModule);
//# sourceMappingURL=transactions.module.js.map