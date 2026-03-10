"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreedyChangeStrategy = void 0;
const common_1 = require("@nestjs/common");
let GreedyChangeStrategy = class GreedyChangeStrategy {
    calculate(changeInCents, denominations) {
        const results = [];
        let remaining = changeInCents;
        const sorted = [...denominations].sort((a, b) => b.valueInCents - a.valueInCents);
        for (const denom of sorted) {
            if (remaining <= 0)
                break;
            const count = Math.floor(remaining / denom.valueInCents);
            if (count > 0) {
                results.push({ denomination: denom, count });
                remaining -= count * denom.valueInCents;
            }
        }
        return results;
    }
};
exports.GreedyChangeStrategy = GreedyChangeStrategy;
exports.GreedyChangeStrategy = GreedyChangeStrategy = __decorate([
    (0, common_1.Injectable)()
], GreedyChangeStrategy);
//# sourceMappingURL=greedy-change.strategy.js.map