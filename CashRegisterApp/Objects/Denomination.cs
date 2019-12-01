using System.Collections.Generic;

namespace CashRegisterApp
{
    /// <summary> Information for the selected locale's denominations. </summary>
    public class Denomination : IDenomination
    {
        #region Public Properties

        /// <summary> <see cref="IDenomination.DenominationValues" /> </summary>
        public Dictionary<int, string> DenominationValues { get; set; } = new Dictionary<int, string>();

        /// <summary> <see cref="IDenomination.Locale" />. </summary>
        public string Locale { get; set; }

        #endregion Public Properties
    }
}