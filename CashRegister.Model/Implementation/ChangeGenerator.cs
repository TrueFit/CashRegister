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
        private readonly IDictionary<string, string> _pluralCurrencyUnitNames;

        #endregion

        #region Constructor

        protected ChangeGenerator(IDictionary<double, int> amountOfEachUnitOfCurrency,
            IDictionary<double, string> currencyValueNameMapping,
            IDictionary<string, string> pluralCurrencyUnitNames)
        {
            // create a new dictionary here to ensure we aren't updating the source
            _amountOfEachUnitOfCurrency
                = new Dictionary<double, int>(amountOfEachUnitOfCurrency);

            _currencyValueNameMapping = currencyValueNameMapping;
            _pluralCurrencyUnitNames = pluralCurrencyUnitNames;

            GreatestToLeastUnitValues = _amountOfEachUnitOfCurrency.Keys.OrderByDescending(d => d)
                                                                        .ToList();
        }

        #endregion

        #region Protected Properties

        protected IList<double> GreatestToLeastUnitValues { get; }

        #endregion

        #region IChangeGenerator Implementation

        public abstract string Generate(double amountOwed, double amountPaid);

        #endregion

        #region Protected Methods

        protected void ResetCountOfUnitsUsed()
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

        protected string CreateOutputString()
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
            return _pluralCurrencyUnitNames[unitName];
        }

        protected virtual string CleanTrailingSeparatorCharacter(string outputString)
        {
            bool doesOutPutHaveTrailingSeparator = outputString.EndsWith(SEPARATOR_CHARACTER.ToString());

            return doesOutPutHaveTrailingSeparator ? outputString.TrimEnd(SEPARATOR_CHARACTER) : outputString;
        }

        #endregion
    }
}