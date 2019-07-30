using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister.CashRegisterClass
{
    class CashRegisterClass : ICashRegisterClass
    {
        private readonly ICashRegisterClass register;
        public const int dividor = 3;

        public CashRegisterClass(ICashRegisterClass reg)
        {
            this.register = reg;
        }

        public CashRegisterClass()
        {

        }

        public List<String> RunFlatFile()
        {
            List<Transaction> transactions = new List<Transaction>();
            string returnString = "";
            List<string> stringList = new List<string>();

            //get file
            try
            {
                var file = ReadFile();
                foreach (var line in file)
                {
                    var data = line.Split(',');
                    //var newTransaction = new Transaction()
                    transactions.Add(new Transaction(data[0], data[1]));
                }

                //calculate dividor
                foreach (var trans in transactions)
                {

                    Currency cur = new Currency();
                    if (IsOwedDivded(trans))
                    {
                        //random
                        var tempStr = RandomOwed(trans, cur);
                        stringList.Add(tempStr);
                        returnString = returnString + tempStr;
                    }
                    else
                    {
                        var temp = DetermineOwed(trans, cur);
                        stringList.Add(temp);
                        returnString = returnString + temp;
                    }
                }

            }
            catch (Exception e)
            {

            }
            return stringList;
        }

        private List<string> ReadFile()
        {
            using (var reader = new StreamReader("C:\\Users\\jeffw\\Documents\\FlatFile.txt"))
            {
                List<string> flatFile = new List<string>();
                while (!reader.EndOfStream)
                {
                    var row = reader.ReadLine();
                    flatFile.Add(row);
                }
                return flatFile;
            }

        }

        private bool IsOwedDivded(Transaction transaction)
        {
            int amt = Convert.ToInt32(transaction.owedAmount * 100);

            return ((amt % dividor) == 0);
        }

        private string DetermineOwed(Transaction trans, Currency curr)
        {
            var returnAmt = trans.paidAmount - trans.owedAmount;

            if (Convert.ToDouble(returnAmt) <= 0.00)
            {
                return "Invalid trnasaction.";
            }

            curr.currency.OrderBy(t => t.currencyValue);

            string retString = "";

            foreach (var currency in curr.currency)
            {
                if (returnAmt < currency.currencyValue)
                {
                    continue;
                }

                while (returnAmt >= currency.currencyValue)
                {
                    currency.count++;
                    returnAmt = returnAmt - currency.currencyValue;
                }

                if (currency.count != 0)
                {
                    retString = retString + currency.count + " " + currency.currencyType.ToLower() + ",";
                }

            }
            return retString;
        }


        private string RandomOwed(Transaction trans, Currency curr)
        {
            var returnAmt = trans.paidAmount - trans.owedAmount;

            if (Convert.ToDouble(returnAmt) <= 0.00)
            {
                return "Invalid trnasaction.";
            }

            var currList = curr.currency;

            string retString = "";


            while (Convert.ToDouble(returnAmt) > 0.00)
            {
                foreach (var currency in curr.currency)
                {
                    if (currency.currencyValue >= returnAmt)
                    {
                        continue;
                    }
                    Random random = new Random();

                    var availChange = returnAmt / currency.currencyValue;
                    int newRandom = random.Next(0, Convert.ToInt32(availChange));

                    if (Convert.ToDouble(returnAmt) < 0.05)
                    {
                        currency.count = currency.count + Convert.ToInt32(returnAmt * 100);

                        returnAmt = Convert.ToDecimal(0.00);
                        continue;
                    }
                    currency.count = currency.count + newRandom;

                    if (newRandom != 0)
                    {
                        returnAmt = returnAmt - (Convert.ToDecimal(newRandom) * currency.currencyValue);
                    }



                }
            }

            foreach (var currency in curr.currency)
            {
                if (currency.count != 0)
                {
                    retString = retString + currency.count + " " + currency.currencyType.ToLower() + ",";
                }

            }

            return retString;
        }
    }
}
