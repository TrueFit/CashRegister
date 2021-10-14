using Models.Interfaces;
using Models.UsCurrency;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Calculator
{
    public class Calculator : ICalculator
    {
        private Dictionary<decimal, ICurrency> currencyValues = new Dictionary<decimal, ICurrency>() { { 1, new Dollar() }, { .25m, new Quarter() }, { .10m, new Dime() }, { .05m, new Nickle() }, { .01m, new Penny() } };        

        public string Calculate(decimal owed, decimal paid, int? randomDivisor)
        {
            string retVal = String.Empty;
            decimal change = Math.Abs(owed - paid);

            if (owed > paid)
            {
                retVal = "You still owe " + change;
            }
            else if (randomDivisor != null && change % randomDivisor == 0)
            {
                retVal = GetRandomChange(change);
            }
            else
            {
                retVal = GetChange(change);
            }
            
            return retVal;

        }

        private string GetChange(decimal change)
        {
                int dollars = (int)(change / 1);
                change %= 1;
                int quarters = (int)(change / .25m);
                change %= .25m;
                int dimes = (int)(change / .10m);
                change %= .10m;
                int nickles = (int)(change / .05m);
                change %= .05m;
                int pennies = (int)(change / .01m);

                StringBuilder sb = new StringBuilder();

                if (dollars > 0)
                {
                    sb.Append(dollars > 1 ? dollars.ToString() + " dollars" : dollars.ToString() + " dollar");
                }
                if (quarters > 0)
                {
                    sb.Append(", ");
                    sb.Append(quarters > 1 ? quarters.ToString() + " quarters" : quarters.ToString() + " quarter");
                }
                if (dimes > 0)
                {
                    sb.Append(", ");
                    sb.Append(dimes > 1 ? dimes.ToString() + " dimes" : dimes.ToString() + " dime");
                }
                if (nickles > 0)
                {
                    sb.Append(", ");
                    sb.Append(nickles > 1 ? nickles.ToString() + " nickles" : nickles.ToString() + " nickle");
                }
                if (pennies > 0)
                {
                    sb.Append(", ");
                    sb.Append(pennies > 1 ? pennies.ToString() + " pennies" : pennies.ToString() + " penny");
                }
                return sb.ToString();
            }
        

        private string GetRandomChange(decimal change)
        {
            string rdmChange = String.Empty;

            Dictionary<decimal, ICurrency> values = GetDictionary();
            Dictionary<string,int> changeDic = new Dictionary<string, int>();

            StringBuilder sb = new StringBuilder();
            while (change > 0)
            {
                Random random = new Random();
                Random selectRandom = new Random();
                var item = values.ElementAt(random.Next(0, values.Count));
                int value = 0;
                if (values.Count > 1)
                {
                    value = selectRandom.Next(0, (int)(change / item.Key));
                }
                else
                {
                    value = (int)(change / item.Key);
                }
                if (value > 0)
                {
                    if(changeDic.ContainsKey(item.Value.Singular))
                    {
                        changeDic.Add(item.Value.Plural, changeDic[item.Value.Singular] + value);
                        changeDic.Remove(item.Value.Singular);
                    }                        
                    else if (changeDic.ContainsKey(item.Value.Plural))
                    {
                        changeDic[item.Value.Plural] += value;
                    }
                    else
                    {
                        changeDic.Add( value > 1 ? item.Value.Plural : item.Value.Singular, value);
                    }                    
                    change -= (value * item.Key);
                }
                values.Remove(item.Key);
                if (values.Count == 0)
                {
                    values = GetDictionary();
                }
            }

            foreach (var item in changeDic)
            {
                if (sb.Length > 0)
                {
                    sb.Append(", ");
                }
                sb.Append(item.Value.ToString() + " " + item.Key);
            }

            rdmChange = sb.ToString();
            return rdmChange;
        }

        private Dictionary<decimal, ICurrency> GetDictionary()
        {
            Dictionary<decimal, ICurrency> tmpDic = new Dictionary<decimal, ICurrency>();
            foreach (var item in currencyValues)
            {
                tmpDic.Add(item.Key,item.Value);
            }
            return tmpDic;
        }

    }
}
