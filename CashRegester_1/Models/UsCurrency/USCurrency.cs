using Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.UsCurrency
{
    public class Dollar : ICurrency
    {
       string ICurrency.Singular => "dollar";

        string ICurrency.Plural => "dollars";
    }

    public class Quarter : ICurrency
    {
        string ICurrency.Singular => "quarter";

        string ICurrency.Plural => "quarters";
    }

    public class Dime : ICurrency
    {
        string ICurrency.Singular => "dime";

        string ICurrency.Plural => "dimes";
    }

    public class Nickle : ICurrency
    {
        string ICurrency.Singular => "nickle";

        string ICurrency.Plural => "nickles";
    }

    public class Penny : ICurrency
    {
        string ICurrency.Singular => "penny";

        string ICurrency.Plural => "pennies";
    }
}
