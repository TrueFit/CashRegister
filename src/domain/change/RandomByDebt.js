import ChangeMethod from "./ChangeMethod.js";

export default class RandomizeByDebt extends ChangeMethod {
    constructor(divisor = 3) {
        super();
        this.divisor = divisor;
    }

    isApplicable = (owed) => {
        return (owed * 100) % this.divisor === 0;
    }

    calculateChange = (owed, paid, denominations) => {
        let remainingAmount = (paid - owed).toFixed(2);
        const denomCounts = {};
        const result = [];

        const randomDenominations = Object.entries(denominations).sort(() => Math.random() - 0.5);

        for (const [denom, value] of randomDenominations) {
            const count = Math.floor(remainingAmount / value);
            if (count > 0) {
                denomCounts[denom] = count;
                remainingAmount -= count * value;
                remainingAmount = Number(remainingAmount).toFixed(2);
            }
        }

        Object.keys(denominations).forEach(denom => {
            if (denomCounts[denom]) {
                const count = denomCounts[denom];
                result.push(`${count} ${denom}${count > 1 ? 's' : ''}`);
            }
        });

        return result.join(', ');
    }
}

// let final = false;
// while (!final) {
//     for (const [denom, value] of randomDenominations) {
//         const count = Math.floor(remainingAmount / value);
//         if (count > 0) {
//             if (denomCounts[denom]) {
//                 denomCounts[denom] += 1;
//                 // denomCounts[denom] += count;
//             } else {
//                 denomCounts[denom] = 1;
//                 // denomCounts[denom] = count;
//             }

//             remainingAmount -= value;
//             // remainingAmount -= count * value;
//             remainingAmount = Number(remainingAmount).toFixed(2);
//         }
//         if (remainingAmount == 0) {
//             final = true;
//         }
//     }
// }
