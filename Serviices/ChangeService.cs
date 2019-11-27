using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using CsvHelper;
using Interfaces;
using DomainModels;
using Services.Rules;

namespace Services
{
    public class ChangeService:IChangeService
    {
        public string Delimiter { get; set; }
        public string CurrencyCode { get; set; }
        public ICurrency CurrentCurrency { get; set; }
        public int Divisor { get; set; }
        private IRuleProcessor ChangeRuleProcessor;

        private ICalculator Calc;
        private string NewLine = Environment.NewLine;
        public ChangeService(string delimiter, string currency, int divisor)
        {
            Delimiter = delimiter;
            CurrencyCode = currency;
            Divisor = divisor;
            CurrentCurrency = GetCurrency(currency);
                    
            Calc = new ChangeCalculator(CurrentCurrency);
            ChangeRuleProcessor = new RuleProcessor();
           
        }

        public List<string> Process(Stream fileStream)
        {
           var exportValues = new List<string>();
            using (var sReader = new StreamReader(fileStream))
            {
                using (IReader csvReader = new CsvReader(sReader, new CsvHelper.Configuration.Configuration { Delimiter = Delimiter, IgnoreBlankLines=false }))
                {
                    while (csvReader.Read())
                    { 
                        var val = ReadDecimalValuesFromRow(csvReader);
                        if (val.success)
                        {
                            exportValues.Add(GetChange(val.amtDue, val.amtPaid));
                        }
                        else
                            exportValues.Add(NewLine);
                    }
                }
            }
            return exportValues;
        }

        public (bool success,decimal amtDue, decimal amtPaid) ReadDecimalValuesFromRow(IReader csvReader )
        {
            if (csvReader.TryGetField(0, out decimal amtdue) && csvReader.TryGetField(1, out decimal amtPaid))
            {
                return (true,amtdue, amtPaid);
            }
            return (false,0,0);
        }

        public string GetChange(decimal amtDue, decimal amtPaid)
        {             
            var amtdueint = Convert.ToInt32(amtDue * CurrentCurrency.Multiplier);

            var changeRules = new List<IRule> { new RandomChangeRule(Divisor, Calc, amtdueint), new MinChangeRule(Calc) };
            var changeCalc = ChangeRuleProcessor.ProcessRules(changeRules);
                    
            var  result = changeCalc.Calculate(amtDue, amtPaid);

            var output = string.Empty;

            if (result == null) return output;
            var list = result.ChangeList.Where(r => r.Number > 0).OrderByDescending(r => r.Money.Value).ToList();
            var index = 1;

            foreach( var chValue in list)
            {
                output += $"{chValue.Number} {(chValue.Number>1? chValue.Money.NamePlural.ToLower():chValue.Money.Name.ToLower())}";
                if (index < list.Count)
                    output += ", ";
                index++;
            }

            return output;
        }

        public ICurrency GetCurrency(string currencyCode)
        {
            var dollartype = typeof(USDollar);
            var assembly = System.Reflection.Assembly.GetAssembly(dollartype);
                                                
                foreach (System.Reflection.TypeInfo ti in assembly.DefinedTypes)
                {
                    if (ti.ImplementedInterfaces.Contains(typeof(ICurrency)))
                    {
                        var currency = (ICurrency)Activator.CreateInstance(ti);
                        if (currency != null && currency.Code.Equals(currencyCode))
                        return currency;
                     
                    }
                }
      
           return new USDollar();
        }
    }
}
