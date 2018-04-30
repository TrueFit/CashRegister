using System;
using System.Collections.Generic;
using System.Text;

namespace CashRegisterEngine
{
    public class GetChangeRequest
    {
        public decimal amtOwed { get; set; }

        public decimal amtPaid { get; set; }
    }
}
