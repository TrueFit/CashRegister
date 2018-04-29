using System;
using System.Collections.Generic;
using System.Text;

namespace CashRegisterEngine
{
    public class GetChangeResponse
    {
        public decimal amtOwed { get; set; } 

        public decimal amtPaid { get; set; }

        public decimal amtChange { get; set; }

        public ICollection<ChangeResponseItem> items { get; set; }

        public GetChangeResponse()
        {
            this.items = new List<ChangeResponseItem>();
        }

    }
}
