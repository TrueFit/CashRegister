namespace CashRegisterApp
{
    /// <summary> Contains price and payment information for a given transaction. </summary>
    public class Transaction
    {
        #region Public Constructors

        /// <summary> Creates a new transaction. Calculates the change based on the given data. </summary>
        /// <param name="paid"> Amount paid. </param>
        /// <param name="price"> Price of the item. </param>
        /// <param name="locale"> Denomination to use for this transaction. </param>
        public Transaction(int paid, int price, string locale)
        {
            Paid = paid;
            Price = price;
            Change = price - paid;

            switch (locale)
            {
                case nameof(Locales.USD):
                    Currency = ExampleCurrencies.USD;
                    return;
                case nameof(Locales.EURO):
                    Currency = ExampleCurrencies.EURO;
                    return;
            }
        }

        #endregion Public Constructors

        #region Public Properties

        /// <summary> Money to be given back. </summary>
        public int Change { get; set; }

        /// <summary> List of denominations and names for the given Locale. </summary>
        public Denomination Currency { get; }

        /// <summary> Amount paid. </summary>
        public int Paid { get; }

        /// <summary> Cost of item. </summary>
        public int Price { get; }

        #endregion Public Properties
    }
}