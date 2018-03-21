using System;
using System.Collections.Generic;
using System.Linq;

namespace CashRegister {
    class Change {
        private static List<CoinType> availableCoins = new List<CoinType>(){
    new CoinType() { Value = 0.25m, Name = "quarter", PluralName = "quarters" },
    new CoinType() { Value = 0.10m, Name = "dime", PluralName = "dimes" },
    new CoinType() { Value = 0.05m, Name = "nickel", PluralName = "nickels" },
    new CoinType() { Value = 0.01m, Name = "penny", PluralName = "pennies" }
    /* to add as needed or for different currency
    new CoinType() { Value = 1, Name = "€1" },
    new CoinType() { Value = 0.5m, Name = "50 cent" },
    */
};
        public static string GetListOfChange(decimal ttl, decimal skipvalue) {
        //if out of type of coin, can't give it out
            foreach (var a in availableCoins.Where(w=>w.Skipped)){
                //reset any still true back to false
                a.Skipped = false;
            }
            var ac = availableCoins.FirstOrDefault(f => f.Value == skipvalue);
            if (ac != null)
                ac.Skipped = true;
            //create local version of change
            decimal rmnChange = ttl;
            //store results into dictonary
            Dictionary<CoinType, int> expectedChange = new Dictionary<CoinType, int>();
            
            //Order coins by value
            var coinTypes = availableCoins
                            .OrderByDescending(x => x.Value)
                            .ToList();

            foreach (var coinType in coinTypes.Where(w => !w.Skipped)) {
                int numCoins = CalculateMaxCoins(coinType, ref rmnChange);
                if (numCoins > 0) {
                    //Add the results
                    expectedChange.Add(coinType, numCoins);
                    //  Stop processing if there is no money left to calculate.
                    if (rmnChange == 0) break;
                }
            }
            //store ouput results.
            string summary = String.Join(", ",
                               expectedChange.Select(x => x.Value + " " + (x.Value > 1 ? x.Key.PluralName : x.Key.Name)));
            return summary;
        }
        private static int CalculateMaxCoins(CoinType coinType, ref decimal change) {
            int amt = 0;
            while (change >= coinType.Value && (change - coinType.Value >= 0) && amt < 1000000) {//while loop cathcer jic
                amt++;
                change = change - coinType.Value;
            }
            return amt;
        }        
    }
    public class CoinType {
        public decimal Value { get; set; }
        public string Name { get; set; }  
        public string PluralName { get; set; }
        public bool Skipped { get; set; }
    }
}
