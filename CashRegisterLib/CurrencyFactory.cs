using CashRegisterLib.Enum;

namespace CashRegisterLib
{
    public static class CurrencyFactory
    {
        public static CurrencySet CreateCurrencySet(CurrencyType currencyType)
        {
            CurrencySet currency = null;

            switch (currencyType)
            {
                case CurrencyType.Usd:
                    currency = new USDDenominations();
                    break;
                case CurrencyType.Cad:
                    currency = new CADDenominations();
                    break;
            }

            return currency;
        }
    }
}
