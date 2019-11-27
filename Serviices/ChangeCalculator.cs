using System;
using System.Collections.Generic;
using System.Linq;
using DomainModels;
using Interfaces;

namespace Services
{
    public class ChangeCalculator: ICalculator
    {
        ICurrency CurrentCurrency;
        public ChangeCalculator(ICurrency currency)
        {
            CurrentCurrency = currency;
        }

        public List<IChange> Calculate(decimal amountDue, decimal amountPaid )
        {
           var totalchange = Convert.ToInt32((amountPaid - amountDue) * CurrentCurrency.Multiplier);

            var list = CurrentCurrency.Denominations.Where(c => c.Value < totalchange).OrderByDescending(x => x.Value).ToList();

            var result = GetChange(list, totalchange);
                                 
            return result;
        }


        public List<IChange> GetChange(List<IDenomination> list, int change)
        {
            var l = new List<IChange>();
           
            foreach (var denom in list)
            {   
                var subl = list.Where(subd => subd != denom && subd.Value < denom.Value).ToList();
                if (!subl.Any())//no more sub denoms, return the total
                {
                    var t = GetDivisorandRemainder(change, denom.Value);
                    var c = new Change();
                    c.ChangeList.Add((t.num, denom));
                    l.Add(c);
                    continue;
                }

                //get all change variations from 0 to that max value
                for (int i = 0; (i * denom.Value) <= change; i++)
                {
                    var v = (i * denom.Value);
                    var subchange = change - v;
                    var res = (i, denom);
                                      
                    var innerRes = GetChange(subl, subchange);

                    foreach (var inner in innerRes)
                    {
                        inner.ChangeList.Add((res.i, res.denom));

                    }
                    l.AddRange(innerRes);

                }
            }
            return l;
        }

        public (int num, int rem) GetDivisorandRemainder(int change, int currencyValue)
        {
            var x = Math.DivRem(change, currencyValue, out var rem);

            return (x, rem);
        }

    }
}
