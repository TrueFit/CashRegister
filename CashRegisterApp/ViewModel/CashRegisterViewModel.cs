using CashRegisterApp.Model;
using System.Collections.ObjectModel;
using System.ComponentModel;

namespace CashRegisterApp
{
    /// <summary> View Model </summary>
    public class CashRegisterViewModel : INotifyPropertyChanged
    {
        #region Public Constructors

        /// <summary>
        /// Constructor for the VM that gets an instance of the Model <see cref="CashRegisterModel" />.
        /// </summary>
        public CashRegisterViewModel()
        {
            CashRegister = CashRegisterModel.Instance;
            NotifyPropertyChanged(nameof(Locale));
        }

        #endregion Public Constructors

        #region Public Properties

        /// <summary> Local property for the <see cref="CashRegisterModel" />. </summary>
        public CashRegisterModel CashRegister { get; }

        /// <summary> <see cref="CashRegisterModel.InputFile" /> </summary>
        public string InputFile
        {
            get => CashRegister.InputFile;
            set
            {
                CashRegister.InputFile = value;
                NotifyPropertyChanged(nameof(InputFile));
            }
        }

        /// <summary> <see cref="CashRegisterModel.Locale" /> </summary>
        public string Locale
        {
            get => CashRegister.Locale;
            set
            {
                CashRegister.Locale = value;
                NotifyPropertyChanged(nameof(Locale));
            }
        }

        /// <summary> <see cref="CashRegisterModel.Output" /> </summary>
        public ObservableCollection<string> Output
        {
            get => CashRegister.Output;
            set
            {
                CashRegister.Output = value;
                NotifyPropertyChanged(nameof(Output));
            }
        }

        #endregion Public Properties

        #region Public Methods

        /// <summary>
        /// Passes calculation of change to the Model. Sets the VM's Output to trigger the
        /// PropertyChanged event and update the UI.
        /// </summary>
        public void CalculateChange() => Output = CashRegister.Calculate();

        /// <summary> Raises the PropertyChanged Event to update the UI for a given property. </summary>
        /// <param name="propName"> Name of the invoking property. </param>
        public void NotifyPropertyChanged(string propName) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propName));

        #endregion Public Methods

        #region Public Events

        /// <summary> Event handler for Property Changed. </summary>
        public event PropertyChangedEventHandler PropertyChanged;

        #endregion Public Events
    }
}