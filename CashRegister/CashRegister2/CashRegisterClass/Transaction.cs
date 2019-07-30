using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CashRegister.CashRegisterClass
{
    class Transaction
    {
        public decimal owedAmount { get; set; }
        public decimal paidAmount { get; set; }
        public Transaction()
        {

        }

        public Transaction(string owed, string paid)
        {
            owed = owed.Trim();
            decimal castOwed = Convert.ToDecimal(owed);

            paid = paid.Trim();
            decimal castPaid = Convert.ToDecimal(paid);

            owedAmount = castOwed;
            paidAmount = castPaid;
        }
    }
}
