using System.Collections.ObjectModel;

namespace CashRegisterApp
{
    /// <summary> Interface for a base Cash Register </summary>
    public interface ICashRegister
    {
        #region Public Properties

        /// <summary> Divisor that determines if there is random calculation. </summary>
        int Divisor { get; }

        #endregion Public Properties

        #region Public Methods

        /// <summary> Performs required calculation logic for the CashRegisterModel. </summary>
        /// <returns> </returns>
        ObservableCollection<string> Calculate();

        /// <summary> Performs required special calculation logic for the CashRegisterModel. </summary>
        /// <param name="transaction"> </param>
        /// <returns> </returns>
        string SpecialCalculate(Transaction transaction);

        #endregion Public Methods
    }
}