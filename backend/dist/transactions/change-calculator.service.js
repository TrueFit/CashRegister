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
exports.ChangeCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const change_calculator_config_1 = require("../config/change-calculator.config");
const currency_config_1 = require("../config/currency.config");
const greedy_change_strategy_1 = require("./strategies/greedy-change.strategy");
const random_change_strategy_1 = require("./strategies/random-change.strategy");
let ChangeCalculatorService = class ChangeCalculatorService {
    constructor(denominations, config) {
        this.denominations = denominations;
        this.config = config;
        this.greedy = new greedy_change_strategy_1.GreedyChangeStrategy();
        this.random = new random_change_strategy_1.RandomChangeStrategy();
    }
    calculate(amountOwed, amountPaid) {
        const changeInDollars = Math.round((amountPaid - amountOwed) * 100) / 100;
        const changeInCents = Math.round(changeInDollars * 100);
        const useRandom = changeInCents % this.config.divisor === 0;
        const strategyName = useRandom ? 'random' : 'greedy';
        const results = useRandom
            ? this.random.calculate(changeInCents, this.denominations)
            : this.greedy.calculate(changeInCents, this.denominations);
        const denominationsString = this.formatDenominations(results);
        return {
            change: changeInDollars,
            denominations: denominationsString,
            strategy: strategyName,
        };
    }
    formatDenominations(results) {
        if (results.length === 0) {
            return 'no change';
        }
        return results
            .map(({ denomination, count }) => {
            const label = count === 1 ? denomination.singular : denomination.plural;
            return `${count} ${label}`;
        })
            .join(', ');
    }
};
exports.ChangeCalculatorService = ChangeCalculatorService;
exports.ChangeCalculatorService = ChangeCalculatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(currency_config_1.DENOMINATIONS_TOKEN)),
    __param(1, (0, common_1.Inject)(change_calculator_config_1.CHANGE_CALCULATOR_CONFIG)),
    __metadata("design:paramtypes", [Array, Object])
], ChangeCalculatorService);
//# sourceMappingURL=change-calculator.service.js.map