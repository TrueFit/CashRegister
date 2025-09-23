import ChangeMethod from "./ChangeMethod.js";

export default class MinimumAmount extends ChangeMethod {
    isApplicable = (owed) => {
        return true;
    }

    calculateChange = (owed, paid, denominations) => {
        let remainingAmount = (paid - owed).toFixed(2);
        const result = [];

        for (const [denom, value] of Object.entries(denominations)) {
            const count = Math.floor(remainingAmount / value);

            if (count > 0) {
                result.push(`${count} ${denom}${count > 1 ? 's' : ''}`);
                remainingAmount -= count * value;
                remainingAmount = Number(remainingAmount).toFixed(2);
            }
        }

        return result.join(', ');
    }
}