using CashRegister.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister
{
    public class Register
    {
        /// <summary>
        /// Singleton pattern
        /// </summary>
        private static Register _instance;
        public static Register Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new Register();
                }
                return _instance;
            }
        }

        /// <summary>
        /// Returns the change in string format that should be given to a customer based on the amount paid in the paidList parameter
        /// </summary>
        /// <param name="transaction"> The amount of money that is owed as item1, with item2 being the amount paid by the customer. </param>
        /// <param name="changeList"> The list of available change, for example US Currency. </param>
        /// <returns> A pretty printed string displaying what change is to be given for the transaction input. </returns>
        public string MakeChange(Tuple<decimal, decimal> transaction, Dictionary<decimal, Tuple<string, string>> changeList)
        {
            List<string> returnChange = new List<string>();

            var itemCost = transaction.Item1;
            var amountPaid = transaction.Item2;
            var changeDue = amountPaid - itemCost;

            var coins = changeList.Select(x => x.Key).ToArray();

            //Reverse compare used to make Sorted Dictionary, so coins will appear in descending order (in case of random coins)
            var rawCoins = new SortedDictionary<decimal, int>(Comparer<decimal>.Create((x, y) => y.CompareTo(x)));

            //If the cost of the item is divisible by 3, calculate random coins!
            if (itemCost % .03m == 0)
            {
                FindCoins(changeDue, coins, ref rawCoins, true);
            }
            else
            {
                FindCoins(changeDue, coins, ref rawCoins);
            }

            //Form the pretty print return of change due
            foreach(var record in rawCoins)
            {
                string prettyChange = "";
                prettyChange += record.Value;

                //Use singular or plural versions of the change name
                if(record.Value == 1)
                {
                    prettyChange += " " + changeList[record.Key].Item1;
                }
                else
                {
                    prettyChange += " " + changeList[record.Key].Item2;
                }

                returnChange.Add(prettyChange);
            }

            return String.Join(", ", returnChange);
        }

        /// <summary>
        /// Find the largest coin that can go into the amount of change due, record it, subtract that value from the change due and keep going.
        /// Once change due is reduced to 0, return the recorded change used to get there.
        /// </summary>
        /// <param name="changeDue"> The amount of change to come up with.  This value decreases as the recursion continues. </param>
        /// <param name="coins"> The list of available coins that can be used to determine change. </param>
        /// <param name="foundCoins"> The list of recorded coins used so far to reduce the change due. </param>
        /// <param name="random"> This flag is set to true if calculating random coin denominations used. </param>
        /// <returns> A sorted dictionary of coin types and the amounts used to calculate change. </returns>
        private SortedDictionary<decimal, int> FindCoins(decimal changeDue, decimal[] coins, ref SortedDictionary<decimal, int> foundCoins, bool random = false)
        {
            var availableCoins = coins.Where(x => x <= changeDue);

            decimal chosenCoin = availableCoins.Max();
            if (random)
            {
                var rand = RandomHelper.GetRandomInt(availableCoins.Count());
                chosenCoin = availableCoins.ElementAt(rand);
            }

            if (foundCoins.ContainsKey(chosenCoin))
            {
                foundCoins[chosenCoin]++;
            }
            else
            {
                foundCoins.Add(chosenCoin, 1);
            }
            changeDue -= chosenCoin;

            //Match found, or no possible coin denominations can be used
            if(changeDue == 0 || availableCoins.Count() == 0)
            {
                return foundCoins;
            }
            else
            {
                return FindCoins(changeDue, coins, ref foundCoins, random);
            }
        }
    }
}
