import Reader from '../../infraestructure/file/Reader.js';
import Writer from '../../infraestructure/file/Writer.js';
import ChangeCase from '../../application/ChangeCase.js';
import MinimumAmount from '../../domain/change/MinimunAmount.js';
import RandomizeByDebt from '../../domain/change/RandomByDebt.js';
import DollarCurrency from '../../domain/currencies/DollarCurrency.js';
import { divisorNumber } from '../../../config/const.js';

export default class ChangeController {

    constructor() { }

    static processFile = async (inputPath, outputPath) => {
        try {
            const rows = Reader.readFile(inputPath);
            const output = rows.map(row => {
                const [owed, paid] = row.split(',').map(Number);
                const randomization = new RandomizeByDebt(divisorNumber);
                const minimumAmount = new MinimumAmount();
                const dollarCurrency = new DollarCurrency();
                let changeCase;
                if (randomization.isApplicable(owed)) {
                    changeCase = new ChangeCase(dollarCurrency, randomization);
                } else {
                    changeCase = new ChangeCase(dollarCurrency, minimumAmount);
                }
                return changeCase.calculateChange(owed, paid);
            }).join('\n');

            Writer.writeFile(outputPath, output);
        } catch (error) {
            console.error('Error: ', error);
        }
    }
}
