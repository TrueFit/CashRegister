import Currency from "./Currency.js";
import { dollar } from "../../../config/denomitions.js";

export default class DollarCurrency extends Currency {
    getDenominations = () => {
        return dollar;
    }
}