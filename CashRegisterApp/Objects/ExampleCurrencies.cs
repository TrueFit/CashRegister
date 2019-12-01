using System.Collections.Generic;

namespace CashRegisterApp
{
    /// <summary> Names of supplied Locales. </summary>
    public enum Locales
    {
        USD,
        EURO
    };

    /// <summary>
    /// Sample data for this application. A real-world application would have this file replaced by
    /// either configuration file or database data.
    /// </summary>
    public class ExampleCurrencies
    {
        #region Public Properties

        /// <summary> Names and Integer values for Euro currency. </summary>
        public static Denomination EURO
        {
            get => new Denomination()
            {
                Locale = nameof(Locales.EURO),
                DenominationValues = new Dictionary<int, string>()
                {
                    { 20000, "Twenty Thousand Euro Note"},
                    { 10000, "Ten Thousand Euro Note"},
                    { 5000, " Five Thousand Euro Note"},
                    { 2000, "Two Thousand Euro Note"},
                    { 1000, "Thousand Euro Note"},
                    { 500, "Five Hundred Euro Note"},
                    { 200, "Two Hundred Euro Coin"},
                    { 100, "Hundred Euro Coin"},
                    { 50, "Fifty Euro Cent"},
                    { 20, "Twenty Euro Cent"},
                    { 10, "Ten Euro Cent"},
                    { 5, "Five Euro Cent"},
                    { 2, "Two Euro Cent"},
                    { 1, "Euro Cent"}
                }
            };
        }

        /// <summary> Names and Integer values for USD currency. </summary>
        public static Denomination USD
        {
            get => new Denomination()
            {
                Locale = nameof(Locales.USD),
                DenominationValues = new Dictionary<int, string>()
                {
                    { 10000, "hundred" },
                    { 2000, "twenty"},
                    { 1000, "ten" },
                    { 500, "five" },
                    { 100, "dollar" },
                    { 25, "quarter" },
                    { 10, "dime" },
                    { 5, "nickel" },
                    { 1, "penny" }
                }
            };
        }

        #endregion Public Properties
    }
}