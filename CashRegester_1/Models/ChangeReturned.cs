using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    public class ChangeReturned
    {
        public ChangeReturned(string change)
        {
            Change = change;
        }
        public string Change { get; set; }
    }
}
