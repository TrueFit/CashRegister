using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;

namespace CashRegisterApp.Model
{
    /// <summary> Model. Performs main calculation logic. </summary>
    public class CashRegisterModel : ICashRegister, INotifyPropertyChanged
    {
        #region Private Fields

        private static readonly object _singletonLock = new object();
        private static CashRegisterModel _instance;
        private string _inputFile;
        private string _locale;
        private Random _r = new Random();

        #endregion Private Fields

        #region Public Constructors

        /// <summary> Sets the Divisor or any other properties custom to this Model. </summary>
        public CashRegisterModel()
        {
            Divisor = 3;
        }

        #endregion Public Constructors

        #region Public Properties

        /// <summary> Gets a singleton instance of the class. </summary>
        public static CashRegisterModel Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_singletonLock)
                    {
                        if (_instance == null)
                        {
                            _instance = new CashRegisterModel();
                        }
                    }
                }

                return _instance;
            }
        }

        /// <summary> Custom divisor used to determine if a random calculation is to be performed. </summary>
        public int Divisor { get; set; }

        /// <summary> List of <see cref="Transaction" /> s to process. </summary>
        public List<Transaction> Input { get; set; } = new List<Transaction>();

        /// <summary> Directory of the input file. </summary>
        public string InputFile
        {
            get => _inputFile;
            set
            {
                if (!string.IsNullOrEmpty(value))
                {
                    _inputFile = value;
                    OnPropertyChanged(nameof(InputFile));
                }
            }
        }

        /// <summary> Determines the user's region to use the proper currency for calculation. </summary>
        public string Locale
        {
            get => _locale;
            set
            {
                _locale = value;
                OnPropertyChanged(nameof(Locale));
            }
        }

        /// <summary>
        /// ObservableCollection containing all of the output strings. Used to update the UI with results.
        /// </summary>
        public ObservableCollection<string> Output { get; set; } = new ObservableCollection<string>();

        #endregion Public Properties

        #region Protected Methods

        /// <summary> Raises the PropertyChanged Event to update the UI for a given property. </summary>
        /// <param name="propName"> Name of the invoking property. </param>
        protected virtual void OnPropertyChanged(string name) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));

        #endregion Protected Methods

        #region Public Methods

        /// <summary> Start change calculation. </summary>
        public ObservableCollection<string> Calculate()
        {
            foreach (Transaction t in Input)
            {
                string curTransaction = string.Empty;

                if (t.Change == 0)
                {
                    curTransaction = "No Change.";
                    continue;
                }
                else if (t.Paid % Divisor == 0)
                {
                    // Send a scrambled list of denominations to calculate
                    curTransaction = SpecialCalculate(t);
                }
                else
                {
                    // Send an ordered list of denominations to calculate
                    curTransaction = CountChange(t, t.Currency.DenominationValues);
                }

                // format and publish
                curTransaction = curTransaction.Substring(0, curTransaction.Length - 2) + '.';
                Output.Add(curTransaction);
            }

            return Output;
        }

        /// <summary> Do a generic calculation on the transaction using a list of denominations. </summary>
        /// <param name="t"> <see cref="Transaction" /> to process </param>
        /// <param name="denominations"> Collection of value/names for the Locale's denomination </param>
        /// <returns> </returns>
        public string CountChange(Transaction t, Dictionary<int, string> denominations)
        {
            string curTransaction = string.Empty;

            foreach (KeyValuePair<int, string> denomVal in denominations)
            {
                // get the total change for the current denomination via integer division.
                int denomChange = t.Change / denomVal.Key;

                if (denomChange == 0)
                {
                    // current denomination is greater than the change due
                    continue;
                }
                else if (denomChange > 1)
                {
                    // multiple of this denomination is needed.
                    curTransaction += ($"{denomChange} {denomVal.Value}s, ");
                }
                else
                {
                    // single of this denomination is needed
                    curTransaction += ($"{denomChange} {denomVal.Value}, ");
                }

                // remove this amount of change from the total remaining. The next pass of the loop
                // will process this remainder for other denominations.
                t.Change -= denomChange * denomVal.Key;
            }

            return curTransaction;
        }

        /// <summary>
        /// Get all values from the input file and add them to the <see cref="Input" /> list of <see
        /// cref="Transaction" /> s.
        /// </summary>
        public void ParseInput()
        {
            try
            {
                Input = new List<Transaction>();

                StreamReader reader = File.OpenText(InputFile);

                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    string[] s = line.Split(',');
                    decimal paid = decimal.Parse(s[0]);
                    decimal cost = decimal.Parse(s[1]);
                    int p = Convert.ToInt32(paid * 100);
                    int c = Convert.ToInt32(cost * 100);

                    Input.Add(new Transaction(p, c, Locale));
                }

                reader.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception in ParseInput: {ex.Message}");
            }
        }

        /// <summary> Calculate change based on the custom divisor. </summary>
        public string SpecialCalculate(Transaction t)
        {
            //Shuffle the order of values in the denomination list. This will pass arbitrarily ordered increments at CountChange which will give random change values.
            Dictionary<int, string> randomDenominations = t.Currency.DenominationValues.OrderBy(x => _r.Next()).ToDictionary(y => y.Key, y => y.Value);

            return CountChange(t, randomDenominations);
        }

        #endregion Public Methods

        #region Public Events

        /// <summary> Event handler for Property Changed. </summary>
        public event PropertyChangedEventHandler PropertyChanged;

        #endregion Public Events
    }
}