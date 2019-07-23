using System.Collections.Generic;
using System.Linq;
using System.Text;
using CashRegister.Model.Interfaces;

namespace CashRegister.Model.Implementation
{
    public abstract class ChangeGenerator : IChangeGenerator
    {
        #region Fields

        private const char SEPARATOR_CHARACTER = ',';
        private readonly IDictionary<double, string> _currencyValueNameMapping;
        private readonly IDictionary<double, int> _amountOfEachUnitOfCurrency;

        #endregion

        #region Constructor

        protected ChangeGenerator(IDictionary<double, int> amountOfEachUnitOfCurrency,
            IDictionary<double, string> currencyValueNameMapping)
        {
            _amountOfEachUnitOfCurrency
                = new Dictionary<double, int>(amountOfEachUnitOfCurrency);

            _currencyValueNameMapping
                = new Dictionary<double, string>(currencyValueNameMapping);

            GreatestToLeastUnitValues = _amountOfEachUnitOfCurrency.Keys.OrderByDescending(d => d);
        }

        #endregion

        #region Protected Properties

        protected IEnumerable<double> GreatestToLeastUnitValues { get; }

        #endregion

        #region IChangeGenerator Implementation

        public abstract string Generate(double amountOwed, double amountPaid);

        #endregion

        #region Protected Methods

        protected void ResetState()
        {
            var keys = new List<double>(_amountOfEachUnitOfCurrency.Keys);
            foreach (double key in keys)
            {
                _amountOfEachUnitOfCurrency[key] = 0;
            }
        }

        protected void IncrementUnitUsed(double key, int value)
        {
            _amountOfEachUnitOfCurrency[key] += value;
        }

        protected string CreateOutPutString()
        {
            var builder = new StringBuilder();

            foreach (double unit in GreatestToLeastUnitValues)
            {
                int numberOfUnit = _amountOfEachUnitOfCurrency[unit];

                if (numberOfUnit <= 0) continue;

                bool isPlural = numberOfUnit > 1;
                string unitName = _currencyValueNameMapping[unit];

                builder.Append($"{numberOfUnit} {(isPlural ? Pluralize(unitName) : unitName)}{SEPARATOR_CHARACTER}");
            }

            return CleanTrailingSeparatorCharacter(builder.ToString());
        }

        protected virtual string Pluralize(string unitName)
        {
            // TODO: move the string literals to a shared location
            // default case is for english
            return unitName.ToUpper().Equals("PENNY") ? "pennies" : $"{unitName}s";
        }

        protected virtual string CleanTrailingSeparatorCharacter(string outputString)
        {
            bool doesOutPutHaveTrailingSeparator = outputString.EndsWith(SEPARATOR_CHARACTER.ToString());

            return doesOutPutHaveTrailingSeparator ? outputString.TrimEnd(SEPARATOR_CHARACTER) : outputString;
        }

        #endregion
    }
}