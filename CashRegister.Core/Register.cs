using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using CashRegister.Core.Transactions;
using CashRegister.Interfaces.Transactions;
using System.IO;

namespace CashRegister.Core
{
    /// <summary>
    /// A Register that maintains a ledger for a given denomination layout
    /// </summary>
    public class Register
    {
        private Layouts layout;
        private TransactionLedger ledgerFactory;
        private ITransactionLedger ledger;

        /// <summary>
        /// Constructor
        /// </summary>
        public Register()
        {
            ledgerFactory = TransactionLedger.InitializeFactories(Transaction.InitializeFactories(Till.InitializeFactories(Bank.InitializeFactories())));
            Layout = Layouts.US;
        }

        public Layouts Layout
        {
            get
            {
                return layout;
            }

            set
            {
                layout = value;
                ledger = ledgerFactory.ExecuteCreation(layout);
            }
        }

        /// <summary>
        /// Loads ledger data from file into the transaction ledger
        /// </summary>
        /// <param name="filePath">Path to the input file</param>
        public void LoadFromFile(string filePath)
        {
            var ledgerString = File.ReadAllText(filePath);

            if (ledger == null)
            {
                ledger = ledgerFactory.ExecuteCreation(Layout);
            }

            ledger.Load(ledgerString);
        }

        /// <summary>
        /// Loads ledger data from string into the transaction ledger
        /// </summary>
        /// <param name="ledgerString"></param>
        public void LoadFromString(string ledgerString)
        {
            if (ledger == null)
            {
                ledger = ledgerFactory.ExecuteCreation(Layout);
            }

            ledger.Load(ledgerString);
        }

        /// <summary>
        /// Calcluates the change for all transaction in the ledger
        /// </summary>
        public void Calculate()
        {
            if(ledger != null)
            {
                ledger.Calculate();
            }
        }

        /// <summary>
        /// Retrieve the number of loaded transactions
        /// </summary>
        /// <returns></returns>
        public int NumberOfTransactions()
        {
            if(ledger != null)
            {
                return ledger.Transactions.Count;
            }

            return 0;
        }

        /// <summary>
        /// Retrieves a Transaction at the given index
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public ITransaction GetTransaction(int index)
        {
            if(ledger != null)
            {
                return ledger.Transactions[index];
            }

            return null;
        }

        /// <summary>
        /// Clears the transaction ledger
        /// </summary>
        public void Clear()
        {
            if (ledger != null)
            {
                ledger.Clear();
            }
        }

        /// <summary>
        /// Generate a string of all the transaction calculations
        /// </summary>
        /// <returns>String of transaction results</returns>
        public override string ToString()
        {
            if(ledger != null)
            {
                return ledger.ToString();
            }
            else
            {
                return "";
            }
        }

        /// <summary>
        /// Writes the generated result string to file
        /// </summary>
        /// <param name="filePath">Path of output file</param>
        public void WriteToFile(string filePath)
        {
            var changeString = ToString();
            File.WriteAllLines(filePath, changeString.Split('\n'));
        }
    }
}
