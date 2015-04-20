using CashRegister.WebApi.Models;
using System.Collections.Generic;
using System.Text;
namespace CashRegister.WebApi.Helpers
{
    public static class DollarsToChangeConverter
    {
        public static string Convert(double amountOwed, double amountPaid)
        {
            var difference = GetDifference(amountOwed, amountPaid);
            var currencyList = GetCurrencyFromDifference(difference);

            return GetStringFromCurrency(currencyList);
        }

        #region -- Helpers --

        private static double GetDifference(double amountOwed, double amountPaid)
        {
            return amountPaid - amountOwed;
        }
        private static Dictionary<eCurrencyDenominations, int> GetCurrencyFromDifference(double difference)
        {
            var currencyList = new Dictionary<eCurrencyDenominations, int>();

            // Bills
            if(difference > 5000)
            {
                var amount = (int)(difference / 5000);
                difference -= amount * 5000;

                currencyList.Add(eCurrencyDenominations.FiveThousandDollarBill, 
                    amount);
            }
            if (difference > 1000)
            {
                var amount = (int)(difference / 1000);
                difference -= amount * 1000;

                currencyList.Add(eCurrencyDenominations.ThousandDollarBill, 
                    amount);
            }
            if (difference > 500)
            {
                var amount = (int)(difference / 500);
                difference -= amount * 500;

                currencyList.Add(eCurrencyDenominations.FiveDollarBill, amount);
            }
            if (difference > 100)
            {
                var amount = (int)(difference / 100);
                difference -= amount * 100;

                currencyList.Add(eCurrencyDenominations.HundredDollarBill, amount);
            }
            if (difference > 50)
            {
                var amount = (int)(difference / 50);
                difference -= amount * 50;

                currencyList.Add(eCurrencyDenominations.FiftyDollarBill, amount);
            }
            if (difference > 20)
            {
                var amount = (int)(difference / 20);
                difference -= amount * 20;

                currencyList.Add(eCurrencyDenominations.TwentyDollarBill, amount);
            }
            if (difference > 10)
            {
                var amount = (int)(difference / 10);
                difference -= amount * 10;

                currencyList.Add(eCurrencyDenominations.TenDollarBill, amount);
            }
            if (difference > 5)
            {
                var amount = (int)(difference / 5);
                difference -= amount * 5;

                currencyList.Add(eCurrencyDenominations.FiftyDollarBill, amount);
            }
            if (difference > 1)
            {
                var amount = (int)(difference / 1);
                difference -= amount * 1;

                currencyList.Add(eCurrencyDenominations.OneDollarBill, amount);
            }

            //Change
            if (difference > .25)
            {
                var amount = (int)(difference / .25);
                difference -= amount * .25;

                currencyList.Add(eCurrencyDenominations.Quarter, amount);
            }
            if (difference > .1)
            {
                var amount = (int)(difference / .1);
                difference -= amount * .1;

                currencyList.Add(eCurrencyDenominations.Dime, amount);
            }
            if (difference > .05)
            {
                var amount = (int)(difference / .05);
                difference -= amount * .05;

                currencyList.Add(eCurrencyDenominations.Nickle, amount);
            }
            if (difference > .01)
            {
                var amount = (int)(difference / .01);
                difference -= amount * .01;

                currencyList.Add(eCurrencyDenominations.Penny, amount);
            }

            return currencyList;
        }
        private static string GetStringFromCurrency(Dictionary<eCurrencyDenominations, int> currency)
        {
            var sb = new StringBuilder();
            
            if(currency.ContainsKey(eCurrencyDenominations.FiveThousandDollarBill))
            {
                sb.Append(currency[eCurrencyDenominations.FiveThousandDollarBill] + 
                    ((currency[eCurrencyDenominations.FiveThousandDollarBill] > 1) ?
                    " Five Thousand Dollar Bills," : " Five Thousand Dollar Bill"));
            }
            if(currency.ContainsKey(eCurrencyDenominations.ThousandDollarBill))
            {
                sb.Append(currency[eCurrencyDenominations.ThousandDollarBill] +
                    ((currency[eCurrencyDenominations.ThousandDollarBill] > 1) ?
                    " Thousand Dollar Bills," : " Thousand Dollar Bill,"));
            }
            if(currency.ContainsKey(eCurrencyDenominations.FiveHundredDollarBill))
            {
                sb.Append(currency[eCurrencyDenominations.FiveHundredDollarBill] +
                    ((currency[eCurrencyDenominations.FiveHundredDollarBill] > 1) ?
                    " Five Hundred Dollar Bills," : " Five Hundred Dollar Bill,"));
            }
            if(currency.ContainsKey(eCurrencyDenominations.HundredDollarBill))
            {
                sb.Append(currency[eCurrencyDenominations.HundredDollarBill] +
                    ((currency[eCurrencyDenominations.HundredDollarBill] > 1) ?
                    " Hundred Dollar Bills," : " Hundred Dollar Bill,"));
            }
            if(currency.ContainsKey(eCurrencyDenominations.FiftyDollarBill))
            {
                sb.Append(currency[eCurrencyDenominations.FiftyDollarBill] +
                    ((currency[eCurrencyDenominations.FiftyDollarBill] > 1) ?
                    " Fifty Dollar Bills," : " Fifty Dollar Bill,"));
            }
            if(currency.ContainsKey(eCurrencyDenominations.TwentyDollarBill))
            {
                sb.Append(currency[eCurrencyDenominations.TwentyDollarBill] +
                    ((currency[eCurrencyDenominations.TwentyDollarBill] > 1) ?
                    " Twenty Dollar Bills," : " Twenty Dollar Bill,"));
            }
            if(currency.ContainsKey(eCurrencyDenominations.TenDollarBill))
            {
                sb.Append(currency[eCurrencyDenominations.TenDollarBill] +
                    ((currency[eCurrencyDenominations.TenDollarBill] > 1) ?
                    " Ten Dollar Bills," : " Ten Dollar Bill,"));
            }
            if(currency.ContainsKey(eCurrencyDenominations.FiveDollarBill))
            {
                sb.Append(currency[eCurrencyDenominations.FiveDollarBill] +
                    ((currency[eCurrencyDenominations.FiveDollarBill] > 1) ?
                    " Five Dollar Bills," : " Five Dollar Bill,"));
            }
            if(currency.ContainsKey(eCurrencyDenominations.OneDollarBill))
            {
                sb.Append(currency[eCurrencyDenominations.OneDollarBill] +
                    ((currency[eCurrencyDenominations.OneDollarBill] > 1) ?
                    " One Dollar Bills," : " One Dollar Bill,"));
            }

            // Change
            if (currency.ContainsKey(eCurrencyDenominations.Quarter))
            {
                sb.Append(currency[eCurrencyDenominations.Quarter] +
                    ((currency[eCurrencyDenominations.Quarter] > 1) ?
                    " Quarters," : " Quarter,"));
            }
            if (currency.ContainsKey(eCurrencyDenominations.Dime))
            {
                sb.Append(currency[eCurrencyDenominations.Dime] +
                    ((currency[eCurrencyDenominations.Dime] > 1) ?
                    " Dimes," : " Dime,"));
            }
            if (currency.ContainsKey(eCurrencyDenominations.Nickle))
            {
                sb.Append(currency[eCurrencyDenominations.Nickle] +
                    ((currency[eCurrencyDenominations.Nickle] > 1) ?
                    " Nickles," : " Nickle,"));
            }
            if (currency.ContainsKey(eCurrencyDenominations.Penny))
            {
                sb.Append(currency[eCurrencyDenominations.Penny] +
                    ((currency[eCurrencyDenominations.Penny] > 1) ?
                   " Pennies," : " Penny,"));
            }

            return sb.Remove(sb.Length - 1, 1).ToString();
        }

        #endregion
    }
}