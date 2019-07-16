using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Core.Tills;
using CashRegister.Interfaces.Denominations;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;

namespace CashRegister.UnitTests.Tills
{
    public class USTillTest
    {
        private USBank usBank;
        private USTill usTill;
        private USTill usTillRandom1;
        private USTill usTillRandom2;

        [SetUp]
        public void Setup()
        {
            usBank = (USBank)USBank.Initialize();
            usTill = new USTill(usBank);
            usTillRandom1 = new USTill(usBank, true);
            usTillRandom2 = new USTill(usBank, true);
        }

        [Test]
        public void Ordered()
        {
            var tillList = usTill.Amounts.Select(kvp => kvp.Key).ToList();
            var denomList = new List<IDenomination>() { usBank.Retrieve(USValues.Dollar),
                                                        usBank.Retrieve(USValues.Quarter),
                                                        usBank.Retrieve(USValues.Dime),
                                                        usBank.Retrieve(USValues.Nickel),
                                                        usBank.Retrieve(USValues.Penny) };

            Assert.IsTrue(tillList.SequenceEqual(denomList));
        }

        [Test]
        public void Randomized()
        {
            var tillList = usTill.Amounts.Select(kvp => kvp.Key).ToList();
            var randomTillList1 = usTillRandom1.Amounts.Select(kvp => kvp.Key).ToList();
            var randomTillList2 = usTillRandom2.Amounts.Select(kvp => kvp.Key).ToList();

            Assert.IsTrue(!tillList.SequenceEqual(randomTillList1) || !tillList.SequenceEqual(randomTillList2));
        }

        [Test]
        public void SetAmount_Positive()
        {
            var keyList = usTill.Amounts.Keys.ToList();
            foreach (var key in keyList)
            {
                usTill.SetAmount(key, 2);
                Assert.AreEqual(2, usTill.Amounts[key]);
            }

            keyList = usTillRandom1.Amounts.Keys.ToList();
            foreach (var key in keyList)
            {
                usTill.SetAmount(key, 2);
                Assert.AreEqual(2, usTill.Amounts[key]);
            }

            keyList = usTillRandom2.Amounts.Keys.ToList();
            foreach (var key in keyList)
            {
                usTill.SetAmount(key, 2);
                Assert.AreEqual(2, usTill.Amounts[key]);
            }
        }

        [Test]
        public void SetAmount_Negative()
        {
            foreach (var keyValuePair in usTill.Amounts)
            {
                usTill.SetAmount(keyValuePair.Key, -1);
                Assert.AreEqual(0, usTill.Amounts[keyValuePair.Key]);
            }

            foreach (var keyValuePair in usTillRandom1.Amounts)
            {
                usTillRandom1.SetAmount(keyValuePair.Key, -1);
                Assert.AreEqual(0, usTillRandom1.Amounts[keyValuePair.Key]);
            }

            foreach (var keyValuePair in usTillRandom2.Amounts)
            {
                usTillRandom2.SetAmount(keyValuePair.Key, -1);
                Assert.AreEqual(0, usTillRandom2.Amounts[keyValuePair.Key]);
            }
        }

        [Test]
        public void IsEmpty_True()
        {
            Assert.IsTrue(usTill.IsEmpty());
            Assert.IsTrue(usTillRandom1.IsEmpty());
            Assert.IsTrue(usTillRandom2.IsEmpty());
        }

        [Test]
        public void IsEmpty_False()
        {
            usTill.SetAmount(usTill.Amounts.Keys.First(), 2);
            usTillRandom1.SetAmount(usTillRandom1.Amounts.Keys.First(), 2);
            usTillRandom2.SetAmount(usTillRandom2.Amounts.Keys.First(), 2);

            Assert.IsFalse(usTill.IsEmpty());
            Assert.IsFalse(usTillRandom1.IsEmpty());
            Assert.IsFalse(usTillRandom2.IsEmpty());
        }
    }
}
