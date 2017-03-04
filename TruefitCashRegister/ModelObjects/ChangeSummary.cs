using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModelObjects
{
    public class ChangeSummary
    {
        public decimal ReceivedMoney { get; set; }
        public decimal Price { get; set; }
        public List<ChangeItem> ChangeItems { get; set; }
    }
}
