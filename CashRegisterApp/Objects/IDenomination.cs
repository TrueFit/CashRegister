using System.Collections.Generic;

namespace CashRegisterApp
{
    /// <summary> Base data for Denominatins. </summary>
    internal interface IDenomination
    {
        #region Public Properties

        /// <summary> List of all denominations and their names. </summary>
        Dictionary<int, string> DenominationValues { get; set; }

        /// <summary> Region for the given denomination. </summary>
        string Locale { get; }

        #endregion Public Properties
    }
}