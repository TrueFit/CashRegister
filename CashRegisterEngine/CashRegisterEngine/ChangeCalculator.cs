using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CashRegisterEngine
{
    public sealed class ChangeCalculator : IChangeCalculator
    {
        private static ChangeCalculator instance = null;
        private static readonly object padlock = new object();

        int[] allDenominations = { 10000, 5000, 2000, 1000, 500, 100, 25, 10, 5, 1 };

        Random rng;
        
        public static ChangeCalculator Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new ChangeCalculator();
                    }
                    return instance;
                }
            }
        }

        ChangeCalculator()
        {
            rng = new Random(DateTime.Now.DayOfYear);
        }
        
        public string ProcessAndGetOutputFilePath(string inputFilePath)
        {
            string outputFilePath = inputFilePath + ".output";
            if (File.Exists(inputFilePath))
            {
                using (var sr = new StreamReader(inputFilePath))
                {
                    using (var sw = new StreamWriter(outputFilePath))
                    {
                        int counterIn = 0;
                        int counterOut = 0;
                        string line;
                        while ((line = sr.ReadLine()) != null)
                        {
                            counterIn++;
                            var _output = GetChangeOutputLine(line);
                            sw.WriteLine(_output);
                            counterOut++;
                        }
                    }   
                }
            }
            else
            {
                throw new FileNotFoundException("File at provided path not found.");
            }

            return outputFilePath;
        }

        public string GetChangeOutputLine(string inputLine)
        {
            if (string.IsNullOrEmpty(inputLine) || inputLine.IndexOf(',') == -1)
            {
                throw new Exception("Invalid input detected.");
            }

            string[] _inputVals = inputLine.IndexOf(',') > 0 ? inputLine.Split(',') : null;
            string _output = null;

            if (_inputVals != null && _inputVals.Length == 2)
            {
                var _inp0 = _inputVals[0];
                var _inp1 = _inputVals[1];
                decimal _decInpOwed = 0.00M;
                decimal _decInpPaid = 0.00M;
                if (decimal.TryParse(_inp0, out _decInpOwed) && decimal.TryParse(_inp1, out _decInpPaid))
                {
                    GetChangeRequest request = new GetChangeRequest();
                    request.amtOwed = _decInpOwed;
                    request.amtPaid = _decInpPaid;
                    _output = GetChangeResponse(request)?.ToString();
                }
                else
                {
                    throw new InvalidOperationException("Invalid input detected.");
                }
            }
            else
            {
                throw new InvalidOperationException("Invalid input detected.");
            }

            return _output;
        }

        public GetChangeResponse GetChangeResponse(GetChangeRequest request)
        {
            if (request.amtPaid < request.amtOwed)
            {
                throw new InvalidOperationException("Insufficient amount paid to cover amount owed.");
            }

            GetChangeResponse response = new GetChangeResponse();
            response.amtOwed = request.amtOwed;
            response.amtPaid = request.amtPaid;
            response.amtChange = response.amtPaid - response.amtOwed;
            var mod = response.amtOwed % 3;
            response.currencyItems = (int)mod == 0 ? 
                calculateRandomCurrencyItems(response.amtChange) :
                calculateCurrencyItems(response.amtChange);

            return response;
        }
       
        ICollection<CurrencyItem> calculateCurrencyItems(decimal amtChange)
        {
            decimal _runningBalance = amtChange;
            List<CurrencyItem> _items = new List<CurrencyItem>();
            CurrencyItem _itm = new CurrencyItem();

            var maxUnitValue = (int)Math.Floor(amtChange);
            if (maxUnitValue >= 100)
            {
                _itm.currencyType = CurrencyType.paper;
                _itm.currencyValue = 100;
            }
            else if (maxUnitValue >= 50)
            {
                _itm.currencyType = CurrencyType.paper;
                _itm.currencyValue = 50;
            }
            else if (maxUnitValue >= 20)
            {
                _itm.currencyType = CurrencyType.paper;
                _itm.currencyValue = 20;
            }
            else if (maxUnitValue >= 10)
            {
                _itm.currencyType = CurrencyType.paper;
                _itm.currencyValue = 10;
            }
            else if (maxUnitValue >= 5)
            {
                _itm.currencyType = CurrencyType.paper;
                _itm.currencyValue = 5;
            }
            else if (maxUnitValue >= 1)
            {
                _itm.currencyType = CurrencyType.paper;
                _itm.currencyValue = 1;
            }
            else if (maxUnitValue == 0)
            {
                maxUnitValue = (int)Math.Floor(amtChange * 100);
                if (maxUnitValue >= 25)
                {
                    _itm.currencyType = CurrencyType.coin;
                    _itm.currencyValue = 25;
                }
                else if (maxUnitValue >= 10)
                {
                    _itm.currencyType = CurrencyType.coin;
                    _itm.currencyValue = 10;
                }
                else if (maxUnitValue >= 5)
                {
                    _itm.currencyType = CurrencyType.coin;
                    _itm.currencyValue = 5;
                }
                else
                {
                    _itm.currencyType = CurrencyType.coin;
                    _itm.currencyValue = 1;
                }
            }

            var _ct = maxUnitValue / _itm.currencyValue;
            _itm.currencyCount = _ct;
            _runningBalance -= _itm.currencyType == CurrencyType.paper ?
                (decimal)(_itm.currencyCount * _itm.currencyValue) :
                (decimal)(_itm.currencyCount * _itm.currencyValue)/100.0M;

            _items.Add(_itm);

            if (_runningBalance > 0.0M)
            {
                _items.AddRange(calculateCurrencyItems(_runningBalance));
            }
            
            return _items;
        }

        List<CurrencyItem> _rndItems = new List<CurrencyItem>();
        ICollection<CurrencyItem> calculateRandomCurrencyItems(decimal amtChange)
        { 
            decimal _runningBalance = amtChange;
            List<CurrencyItem> _items = new List<CurrencyItem>();
            
            
            var _decAmtRemaining = amtChange;

            while (_decAmtRemaining > 0.00M)
            {
                var maxUnitValue = (int)Math.Floor(_decAmtRemaining * 100);
                var _itm = getRandomCurrencyItem(maxUnitValue);
                int _unitCount = _itm.currencyType == CurrencyType.paper ?  
                                 (int)Math.Floor(_decAmtRemaining / _itm.currencyValue) : 
                                 (int)Math.Floor(_decAmtRemaining / (_itm.currencyValue / 100.0M));
                _itm.currencyCount = _unitCount;
                _rndItems.Add(_itm);
                _decAmtRemaining -= _itm.currencyType == CurrencyType.paper ?
                                    (decimal)(_itm.currencyCount * _itm.currencyValue) :
                                    (decimal)(_itm.currencyCount * _itm.currencyValue) / 100.0M;
                
            }
            _items.AddRange(_rndItems);
            
            return _items;
        }

        int _maxRetryCount = 100;
        int _currentRetryCount = 0;
        CurrencyItem getRandomCurrencyItem(int maxUnitValue)
        {
            CurrencyItem _item = new CurrencyItem();
            int _rndIdx = getRandomIndex();
            int _rndVal = allDenominations[_rndIdx];

            if (_rndVal >= 100)
            {
                _item.currencyType = CurrencyType.paper;
                _item.currencyValue = _rndVal / 100;
            }
            else
            {
                _item.currencyType = CurrencyType.coin;
                _item.currencyValue = _rndVal;
            }

            if (_rndVal > maxUnitValue || _rndItems.Contains(_item, new CurrencyItemTypeComparer()))
            {
                if (_currentRetryCount < _maxRetryCount)
                {
                    _currentRetryCount++;
                    _item = getRandomCurrencyItem(maxUnitValue);
                }
                else
                {
                    throw new Exception("Maximum retry count reached for randome currency item.");
                }
            }

            return _item;
        }

        int getRandomIndex()
        {
            int _min = 0;
            int _max = 9;
            return rng.Next(_min, _max);
        }
        
    }
}
