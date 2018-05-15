using System;

namespace CashRegisterLib
{
    public sealed class CashDenomination : IComparable<CashDenomination>
    {
        public readonly string SingularName;
        public readonly string PluralName;
        public readonly decimal MonetaryValue;

        public CashDenomination(string singularName, string pluralName, decimal monetaryValue)
        {
            if (String.IsNullOrWhiteSpace(singularName)){
                throw new ArgumentException("singularName must have a value.");
            }

            if (String.IsNullOrWhiteSpace(pluralName))
            {
                throw new ArgumentException("pluralName must have a value.");
            }

            if (monetaryValue <= 0)
            {
                throw new ArgumentException("monetaryValue must be a value greater than 0.");
            }

            SingularName = singularName;
            PluralName = pluralName;
            MonetaryValue = monetaryValue;
        }

        int IComparable<CashDenomination>.CompareTo(CashDenomination other)
        {
            return MonetaryValue.CompareTo(other.MonetaryValue) * -1;
        }
    }
}
