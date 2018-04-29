using System;
using System.Collections.Generic;
using System.Text;

namespace CashRegisterEngine
{
    public class ChangeResponseItem
    {
        public int unitCount { get; set; }

        public int denominationValue { get; set; }

        public ChangeType denominationType { get; set; }
    }

    public enum ChangeType
    {
        coin,
        paper
    }

}
