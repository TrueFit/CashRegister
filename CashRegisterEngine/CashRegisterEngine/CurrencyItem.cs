using System;
using System.Collections.Generic;
using System.Text;

namespace CashRegisterEngine
{
    public class CurrencyItem
    {
        public int currencyCount { get; set; }

        public int currencyValue { get; set; }

        public CurrencyType currencyType { get; set; }

        public override string ToString()
        {
            StringBuilder sbDenomination = new StringBuilder();
            switch (currencyType)
            {
                case CurrencyType.coin:
                    switch (currencyValue)
                    {
                        case 25:
                            sbDenomination.Append("Quarters");
                            break;
                        case 10:
                            sbDenomination.Append("Dimes");
                            break;
                        case 5:
                            sbDenomination.Append("Nickles");
                            break;
                        case 1:
                            sbDenomination.Append("Pennies");
                            break;
                    }
                    break;
                case CurrencyType.paper:
                    switch(currencyValue)
                    {
                        case 100:
                            sbDenomination.Append("Hundred Dollars");
                            break;
                        case 50:
                            sbDenomination.Append("Fifty Dollars");
                            break;
                        case 20:
                            sbDenomination.Append("Twenty Dollars");
                            break;
                        case 10:
                            sbDenomination.Append("Ten Dollars");
                            break;
                        case 5:
                            sbDenomination.Append("Five Dollars");
                            break;
                        case 1:
                            sbDenomination.Append("One Dollar");
                            break;
                    }
                    break;
            }

            return this.currencyCount.ToString() + " " + sbDenomination.ToString();
        }

    }

    public class CurrencyItemTypeComparer : IEqualityComparer<CurrencyItem>
    {
        public bool Equals(CurrencyItem x, CurrencyItem y)
        {
            return (x.currencyType == y.currencyType) && (x.currencyValue == y.currencyValue);
        }

        public int GetHashCode(CurrencyItem obj)
        {
            return obj.currencyType.GetHashCode() + obj.currencyValue.GetHashCode();
        }
    }

    public enum CurrencyType
    {
        coin,
        paper
    }

}
