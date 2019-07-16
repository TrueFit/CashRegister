using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using CashRegister.Interfaces.Denominations;
using CashRegister.Interfaces.Tills;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;

namespace CashRegister.Core.Tills
{
    /// <summary>
    /// Container class for Extension methods
    /// </summary>
    public static class Extensions
    {
        /// <summary>
        /// Extension method for shuffling a list based on Fisher-Yates shuffle
        /// </summary>
        /// <typeparam name="T">List type</typeparam>
        /// <param name="list">List to shuffle</param>
        public static void Shuffle<T>(this IList<T> list)
        {
            RNGCryptoServiceProvider provider = new RNGCryptoServiceProvider();
            int n = list.Count;
            while (n > 1)
            {
                byte[] box = new byte[1];
                do provider.GetBytes(box);
                while (!(box[0] < n * (Byte.MaxValue / n)));
                int k = (box[0] % n);
                n--;
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }
        }
    }

    /// <summary>
    /// A Till containing US denominations and counts for each
    /// </summary>
    public class USTill : ITill
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="bank">Bank to get denominations from</param>
        /// <param name="randomize">Optional argument indicating if the denomination order should be randomized</param>
        public USTill(USBank bank, bool randomize = false)
        {
            Amounts = new Dictionary<IDenomination, int>();

            var values = new List<USValues>();
            values.AddRange((USValues[])Enum.GetValues(typeof(USValues)));

            // Shuffle the order of the denominations
            if (randomize)
            {
                values.Shuffle();
            }

            // Initialize value
            foreach (USValues val in values)
            {
                Amounts[bank.Retrieve(val)] = 0;
            }
        }

        public Dictionary<IDenomination, int> Amounts { get; }

        /// <summary>
        /// Set the amount of the given denomination
        /// </summary>
        /// <param name="denom"></param>
        /// <param name="count"></param>
        public void SetAmount(IDenomination denom, int count)
        {
            // Don't set if count is negative
            if (count > 0)
            {
                Amounts[denom] = count;
            }
        }

        /// <summary>
        /// Determine if the till is empty / uninitialized
        /// </summary>
        /// <returns></returns>
        public bool IsEmpty()
        {
            foreach(KeyValuePair<IDenomination, int> keyValuePair in Amounts)
            {
                if (keyValuePair.Value.CompareTo(0) > 0) return false;
            }
            return true;
        }
    }
}
