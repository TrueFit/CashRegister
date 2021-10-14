using Models;
using Models.Interfaces;
using System.Collections.Generic;

namespace Services
{
    public class CalculatorService
    {
        private ICalculator _calculator { get; set; }
        public CalculatorService(ICalculator calc)
        {
            _calculator = calc;
        }
        private int _randomDivisor = 3;
        public List<ChangeReturned> Calculate(List<CashRegisterTape> crtList)
        {
            List<ChangeReturned> list = new List<ChangeReturned>();
            foreach (CashRegisterTape crt in crtList)
            {
                list.Add(new ChangeReturned(_calculator.Calculate(crt.Owed, crt.Paid,_randomDivisor)));
                
            }

                   

            return list;
        }

    }
}
