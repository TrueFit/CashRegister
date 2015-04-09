using System;
using System.Linq;
using System.Text;
using Dollar.Web.Calculators;

namespace Dollar.Web.Common
{
    public class MonetaryInputParser
    {
        public MonetaryInputParser()
        {
            Output = new StringBuilder();
        }

        private StringBuilder Output { get; set; }

        public MonetaryInputParser ProcessFileContent(string fileContent)
        {
            var lines = fileContent.Split(new[] {Environment.NewLine}, StringSplitOptions.None);

            foreach (var line in lines
                .Where(x => !string.IsNullOrWhiteSpace(x)))
            {
                Output.AppendLine(ProcessLine(line));
            }

            return this;
        }

        private static string ProcessLine(string line)
        {
            const string failMessage = "Invalid input data";

            if (!line.Contains(","))
            {
                return failMessage;
            }

            decimal amountOwed, amountPaid;

            try
            {
                amountOwed = Convert.ToDecimal(line.Split(',').First().Trim());

                amountPaid = Convert.ToDecimal(line.Split(',').Last().Trim());
            }
            catch (Exception)
            {
                return failMessage;
            }

            if (amountOwed > amountPaid)
            {
                return failMessage;
            }

            if (amountOwed == amountPaid)
            {
                return "No change due";
            }

            var amountOwedCharacters = amountOwed.ToString().Replace(".", "").ToCharArray();

            var amountOwedSum = amountOwedCharacters
                .Aggregate(0, (current, character) => current + Convert.ToInt16(character.ToString()));

            var isDivisibleByThree = amountOwedSum%3 == 0;

            var amountDue = isDivisibleByThree
                ? new DivisibleByThreeChangeCalculator().Calculate(amountOwed, amountPaid)
                : new ChangeCalculator().Calculate(amountOwed, amountPaid);

            return amountDue;
        }

        public override string ToString()
        {
            return Output != null ? Output.ToString() : string.Empty;
        }
    }
}