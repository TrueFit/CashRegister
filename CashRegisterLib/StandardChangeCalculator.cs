namespace CashRegisterLib
{
    public class StandardChangeCalculator:IChangeCalculator
    {
        public ChangeCounter GetChangeOutput(decimal changeDue)
        {
            ChangeCounter counter = new ChangeCounter();
            USDDenominations denominations = new USDDenominations();

            foreach (var d in denominations)
            {
                while (d.MonetaryValue <= changeDue)
                {
                    changeDue -= d.MonetaryValue;
                    counter.AddChange(d);
                }
            }

            return counter;
        }
    }
}
