"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomChangeStrategy = void 0;
const common_1 = require("@nestjs/common");
const greedy_change_strategy_1 = require("./greedy-change.strategy");
const MAX_ATTEMPTS = 1000;
let RandomChangeStrategy = class RandomChangeStrategy {
    constructor() {
        this.greedy = new greedy_change_strategy_1.GreedyChangeStrategy();
    }
    calculate(changeInCents, denominations) {
        const sorted = [...denominations].sort((a, b) => b.valueInCents - a.valueInCents);
        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            const result = this.tryRandomDistribution(changeInCents, sorted);
            if (result !== null) {
                return result;
            }
        }
        return this.greedy.calculate(changeInCents, denominations);
    }
    tryRandomDistribution(changeInCents, sortedDenominations) {
        const counts = new Map();
        let remaining = changeInCents;
        while (remaining > 0) {
            const usable = sortedDenominations.filter((d) => d.valueInCents <= remaining);
            if (usable.length === 0) {
                return null;
            }
            const denom = usable[Math.floor(Math.random() * usable.length)];
            const maxCount = Math.floor(remaining / denom.valueInCents);
            const count = Math.floor(Math.random() * maxCount) + 1;
            counts.set(denom.valueInCents, (counts.get(denom.valueInCents) ?? 0) + count);
            remaining -= count * denom.valueInCents;
        }
        const results = [];
        for (const [valueInCents, count] of counts.entries()) {
            const denom = sortedDenominations.find((d) => d.valueInCents === valueInCents);
            if (denom) {
                results.push({ denomination: denom, count });
            }
        }
        results.sort((a, b) => b.denomination.valueInCents - a.denomination.valueInCents);
        return results;
    }
};
exports.RandomChangeStrategy = RandomChangeStrategy;
exports.RandomChangeStrategy = RandomChangeStrategy = __decorate([
    (0, common_1.Injectable)()
], RandomChangeStrategy);
//# sourceMappingURL=random-change.strategy.js.map