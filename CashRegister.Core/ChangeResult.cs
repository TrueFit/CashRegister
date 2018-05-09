namespace CashRegister.Core
{
    /// <summary>
    /// Responsible for handling amounts of each denomination to be returned to the customer 
    /// and building the string representation of itself.
    /// </summary>
    internal class ChangeResult
    {
        public int Hundreds { get; set; }
        public int Fifties { get; set; }
        public int Twenties { get; set; }
        public int Tens { get; set; }
        public int Fives { get; set; }
        public int Dollars { get; set; }
        public int Quarters { get; set; }
        public int Dimes { get; set; }
        public int Nickles { get; set; }
        public int Pennies { get; set; }

        /// <summary>
        /// Matches by the decimal representation of the denomination. Sets the corresponding property to the supplied value.
        /// </summary>
        /// <param name="denomination">Decimal representation of the denomination. E.g. 0.01m</param>
        /// <param name="amount">Physical amount of the denomination to be returned to the customer.</param>
        internal void AddDenomination(decimal denomination, int amount)
        {
            switch (denomination)
            {
                case 100.00m:
                    Hundreds = amount;
                    break;
                case 50.00m:
                    Fifties = amount;
                    break;
                case 20.00m:
                    Twenties = amount;
                    break;
                case 10.00m:
                    Tens = amount;
                    break;
                case 5.00m:
                    Fives = amount;
                    break;
                case 1.00m:
                    Dollars = amount;
                    break;
                case 0.25m:
                    Quarters = amount;
                    break;
                case 0.10m:
                    Dimes = amount;
                    break;
                case 0.05m:
                    Nickles = amount;
                    break;
                case 0.01m:
                    Pennies = amount;
                    break;
            }
        }

        /// <summary>
        /// Builds the string representation of the ChangeResult object.
        /// </summary>
        /// <returns>The string representation of the ChangeResult object</returns>
        public override string ToString()
        {
            var result = string.Empty;

            if (Hundreds > 0)
            {
                result += $"{Hundreds} hundred{(Hundreds > 1 ? "s" : string.Empty)},";
            }

            if (Fifties > 0)
            {
                result += $"{Fifties} fift{(Fifties > 1 ? "ies" : "y")},";
            }

            if (Twenties > 0)
            {
                result += $"{Twenties} twent{(Twenties > 1 ? "ies" : "y")},";
            }

            if (Tens > 0)
            {
                result += $"{Tens} ten{(Tens > 1 ? "s" : string.Empty)},";
            }

            if (Fives > 0)
            {
                result += $"{Fives} five{(Fives > 1 ? "s" : string.Empty)},";
            }

            if (Dollars > 0)
            {
                result += $"{Dollars} dollar{(Dollars > 1 ? "s" : string.Empty)},";
            }

            if (Quarters > 0)
            {
                result += $"{Quarters} quarter{(Quarters > 1 ? "s" : string.Empty)},";
            }

            if (Dimes > 0)
            {
                result += $"{Dimes} dime{(Dimes > 1 ? "s" : string.Empty)},";
            }

            if (Nickles > 0)
            {
                result += $"{Nickles} nickle{(Nickles > 1 ? "s" : string.Empty)},";
            }

            if (Pennies > 0)
            {
                result += $"{Pennies} penn{(Pennies > 1 ? "ies" : "y")},";
            }

            return result.TrimEnd(',');
        }
    }
}
