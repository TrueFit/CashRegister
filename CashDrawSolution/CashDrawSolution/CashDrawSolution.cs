using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
namespace CashDrawSolution
{
    public partial class CashDrawSolution : Form
    {
        public CashDrawSolution()
        {
            InitializeComponent();
        }

        private const decimal _dollar = 1;
        private const decimal _quater = 0.25m;
        private const decimal _dime = 0.10m;
        private const decimal _nickel = 0.05m;
        private const decimal _penny = 0.01m;

        private void btn_UploadFile_Click(object sender, EventArgs e)
        {
            DialogResult uploadInputFile = uploadInputFileDialog.ShowDialog();

            if (uploadInputFile == DialogResult.OK && uploadInputFileDialog.FileName.Contains("txt"))
            {
                string fileName = uploadInputFileDialog.FileName;

                StringBuilder outPutfileData = new StringBuilder();
                string[] fileLines = File.ReadAllLines(fileName);
                string currentLine = string.Empty;
                decimal owedAmountInDecimal;
                decimal paidAmountInDecimal;
                string owedAmount;
                string paidAmount;
                for (int i = 0; i < fileLines.Length; i++)
                {
                    owedAmount = string.Empty;
                    paidAmount = string.Empty;
                    currentLine = fileLines[i];
                    var commaSeparatedValues = currentLine.Split(',');

                    if (i != 0)
                        outPutfileData.AppendLine();

                    if (commaSeparatedValues.Length != 2)
                    {
                        outPutfileData.Append("Invalid line, does not contain paid amount or owned amount");
                        continue;
                    }

                    owedAmount = commaSeparatedValues[0];
                    paidAmount = commaSeparatedValues[1];

                    //Verify OwedValue is valid 
                    if (!Decimal.TryParse(owedAmount, out owedAmountInDecimal))
                    {
                        outPutfileData.Append("Invalid Owed Amount");
                        continue;
                    }
                    //Verify PaidValue is valid
                    if (!Decimal.TryParse(paidAmount, out paidAmountInDecimal))
                    {
                        outPutfileData.Append("Invalid Paid Amount");
                        continue;
                    }

                    //Verify difference between Paid Amound and Owed Amound is valid
                    if (paidAmountInDecimal - owedAmountInDecimal < 0)
                    {
                        outPutfileData.Append("Paid Amount is less then owed Amount");
                        continue;
                    }

                    //Get change
                    outPutfileData.Append(getChange(paidAmountInDecimal - owedAmountInDecimal, (owedAmountInDecimal * 100) % 3 == 0));
                }
                MessageBox.Show(createOutputFile(outPutfileData));
            }
            else if (!uploadInputFileDialog.FileName.Contains("txt"))
                MessageBox.Show("Invalid File. Please select text file");

        }
        /// <summary>
        /// Create Output file having file name OutputFile_[DateTimeStamp]
        /// </summary>
        /// <param name="outPutFileText"></param>
        /// <returns></returns>
        private string createOutputFile(StringBuilder outPutFileText)
        {
            string fileName = "OutputFile_" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".txt";
            string path = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments) + "/" + fileName;
            string status;
            try
            {
                System.IO.StreamWriter file = new System.IO.StreamWriter(path, false);
                file.Write(outPutFileText.ToString());
                file.Close();
                status = string.Concat("Output file has been created at", path);
            }
            catch (Exception ex)
            {
                status = string.Format("An error occured: Exception: {0}", ex.Message);
            }
            return status;
        }

        /// <summary>
        /// Get change based on difference between paid amount and owed amount
        /// </summary>
        /// <param name="difference"></param>
        /// <param name="NeedRandomBehaviour"> If paid number is divisible by 3, this flag will be true </param>
        /// <returns></returns>
        private string getChange(decimal difference, bool NeedRandomBehaviour)
        {
            string change = string.Empty;
            int numberOfDollars;
            int numberOfQuaters;
            int numberOfNickels;
            int numberOfDimes;

            RandomNumber randomNumber = new RandomNumber();

            numberOfDollars = (int)(difference / _dollar);
            if (NeedRandomBehaviour)
                numberOfDollars = numberOfDollars == 1 ? randomNumber.Next(2) : randomNumber.Next(numberOfDollars);
            if (numberOfDollars > 0)
            {
                change = numberOfDollars + (numberOfDollars == 1 ? " Dollar" : " Dollars");
                difference = difference - (numberOfDollars);
            }

            numberOfQuaters = (int)(difference / _quater);
            if (NeedRandomBehaviour)
                numberOfQuaters = numberOfQuaters == 1 ? randomNumber.Next(2) : randomNumber.Next(numberOfQuaters);
            if (numberOfQuaters > 0)
            {
                change += addComma(change) + numberOfQuaters + (numberOfQuaters == 1 ? " Quater" : " Quaters");
                difference = difference - (_quater * numberOfQuaters);
            }

            numberOfDimes = (int)(difference / _dime);
            if (NeedRandomBehaviour)
                numberOfDimes = numberOfDimes == 1 ? randomNumber.Next(2) : randomNumber.Next(numberOfDimes);
            if (numberOfDimes > 0)
            {
                change += addComma(change) + numberOfDimes + (numberOfDimes == 1 ? " Dime" : " Dimes");
                difference = difference - (_dime * numberOfDimes);
            }

            numberOfNickels = (int)(difference / _nickel);
            if (NeedRandomBehaviour)
                numberOfNickels = numberOfNickels == 1 ? randomNumber.Next(2) : randomNumber.Next(numberOfNickels);

            if (numberOfNickels > 0)
            {
                change += addComma(change) + numberOfNickels + (numberOfNickels == 1 ? " Nickel" : " Nickels");
                difference = difference - (_nickel * numberOfNickels);
            }

            if (difference > 0)
                change += addComma(change) + (int)(difference / _penny) + (difference == 1 ? " Penny" : " Pennies");

            return change;
        }

        /// <summary>
        /// if comma is added, it will be added.
        /// </summary>
        /// <param name="change"></param>
        /// <returns></returns>
        private string addComma(string change)
        {
            return (!string.IsNullOrEmpty(change) ? ", " : "");
        }

    }
}
