using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace TrueFitCashRegisterWinForm
{
    public partial class Form1 : Form
    {
        private string filePath = "";

        // US Currency
        Dictionary<string, double> USDs = new Dictionary<string, double>() { { "penny/pennies", .01 }, { "nickle/nickles", .05 }, { "dime/dimes", .10 }, { "quarter/quarters", .25 }, { "half dollar/half dollars", .50 }, { "dollar/dollars", 1 }, { "five dollar/fives", 5 }, { "ten dollar/tens", 10 }, { "twenty/twenties", 20 }, { "fifty/fifties", 50 }, { "hundred/hundreds", 100 } };

        // EUR Currency 
        Dictionary<string, double> EURs = new Dictionary<string, double>() { { "one cent/one cent euros", .01 }, { "two cent/two cent euros", .02 }, { "ten cent/ten cent euros", .1 }, { "twenty cent/twenty cent euros", .2 }, { "fifty cent/fifty cent euros", .5 }, { "euro/euros", 1 }, { "two euro/two euros", 2 }, { "five/fives", 5 }, { "ten/tens", 10 }, { "twenty/twenties", 20 }, { "fifty/fifties", 50 }, { "hundred/hundreds", 100 }, { "two-hundred/two-hundreds", 200 }, { "five-hundred/five-hundreds", 500 } };

        public Form1()
        {
            InitializeComponent();
        }

        private void sourcebtn_Click(object sender, EventArgs e)
        {
            try
            {

                using (OpenFileDialog openFileDialog = new OpenFileDialog())
                {
                    openFileDialog.InitialDirectory = "c:\\";
                    openFileDialog.Filter = "flat files (*.txt, *.csv)|*.txt;*.csv|All files (*.*)|*.*";
                    openFileDialog.FilterIndex = 2;
                    openFileDialog.RestoreDirectory = true;

                    if (openFileDialog.ShowDialog() == DialogResult.OK)
                    {
                        //Get the path of specified file
                        fileNameLbl.Text = Path.GetFileName(openFileDialog.FileName);
                        filePath = openFileDialog.FileName;

                        //Read the contents of the file into a stream
                        var fileStream = openFileDialog.OpenFile();

                        using (StreamReader reader = new StreamReader(fileStream))
                        {
                            inputTxt.Text = reader.ReadToEnd();
                        }

                        if (usdRdo.Checked || euroRdo.Checked)
                            computeAlllbtn.Enabled = true;
                    }
                }
            }
            catch (Exception error)
            {
                inputTxt.Text = "Error while getting source file: " + error;
            }
        }

        private void computeAlllbtn_Click(object sender, EventArgs e)
        {
            try
            {
                outputTxt.Text = "";
                if (!usdRdo.Checked && !euroRdo.Checked)
                    outputTxt.Text = "No Currency Selected";

                using (StreamReader reader = new StreamReader(filePath))
                {
                    while (!reader.EndOfStream)
                    {
                        string tranactionLine = reader.ReadLine();
                        string[] splitString = tranactionLine.Split(',');
                        decimal cost = decimal.Parse(splitString[0]);
                        decimal payment = decimal.Parse(splitString[1]);

                        decimal change = calculateChange(cost, payment);

                        // No Change
                        if (change == 0)
                        {
                            //outputTxt.Text += $"Cost: {cost} Payment: {payment} - Change: No Change" + System.Environment.NewLine;
                            outputTxt.Text += $"No Change" + System.Environment.NewLine;
                            continue;
                        }
                        // Not enough payment
                        else if (change < 0)
                        {
                            // Open dialog with message and request more money
                            Form2 moMoneyDialog = new Form2();
                            moMoneyDialog.Size = new Size(700, 450);

                            // Show moMoneyDialog as a modal dialog and determine if DialogResult = OK.
                            if (moMoneyDialog.ShowDialog(this) == DialogResult.OK)
                            {
                                // Read the contents of moMoneyDialog's TextBox.
                                // Add additional money to payment
                                payment = payment + decimal.Parse(moMoneyDialog.amountTxt.Text);
                                // Recalculate Change
                                change = calculateChange(cost, payment);
                            }

                            moMoneyDialog.Dispose();
                        }

                        // Get the proper currency
                        Dictionary<string, double> currentCurrency = new Dictionary<string, double>();
                        if (usdRdo.Checked)
                            currentCurrency = new Dictionary<string, double>(USDs);
                        else if (euroRdo.Checked)
                            currentCurrency = new Dictionary<string, double>(EURs);

                        string changeBreakdownStr = "";
                        // Check against Randomizer
                        if (!string.IsNullOrEmpty(randomTxt.Text) && (cost * 100) % (Int32.Parse(randomTxt.Text)) == 0)
                            // Calculate randomw results
                            changeBreakdownStr = randomBreakdown(change, currentCurrency);
                        else
                            // Calculate from largest to smallest
                            changeBreakdownStr = calculateBreakdown(change, currentCurrency);

                        //outputTxt.Text += $"Cost: {cost} Payment: {payment} - Change: {change} = {changeBreakdownStr}" + System.Environment.NewLine;
                        outputTxt.Text += $"{changeBreakdownStr}" + System.Environment.NewLine;
                    }
                }

                saveOutputFile();
            }
            catch (Exception error)
            {
                outputTxt.Text = $"Error while computing: {error}";
            }
        }

        private void saveOutputFile()
        {
            string outputPath = outputLocationTxt.Text = filePath.Substring(0, filePath.LastIndexOf("\\")) + "\\output.txt";
            // Create the file, or overwrite if the file exists.
            using (FileStream fs = File.Create(outputPath))
            {
                byte[] info = new UTF8Encoding(true).GetBytes(outputTxt.Text);
                // Add some information to the file.
                fs.Write(info);
            }
        }

        private decimal calculateChange(decimal cost, decimal payment)
        {
            // Calulcate Change
            // If Donating to Charity: Round change to next bill
            return !charityChk.Checked ? payment - cost : payment - Math.Ceiling(cost);
        }

        private string calculateBreakdown(decimal change, Dictionary<string, double> denominations)
        {
            string changeStr = "";

            // Calucate Bills
            // Iterate through all Note Denomination in decending order, that are <= to current whole amount
            foreach (var note in denominations.Where(n => (decimal)n.Value <= change).OrderByDescending(n => n.Value))
            {
                if ((change / (decimal)note.Value) >= 1)
                {
                    // Calculate number of notes for x value
                    int numNotes = (int)Math.Floor((decimal)(change / (decimal)note.Value));
                    change -= (numNotes * (decimal)note.Value);

                    // Get proper label from Dict Key
                    string label = numNotes > 1 ? note.Key.Substring(note.Key.IndexOf("/") + 1) : note.Key.Substring(0, note.Key.IndexOf("/"));
                    changeStr += $"{numNotes} {label}, ";
                }
            }

            return Regex.Replace(changeStr, ", $", "");
        }

        private string randomBreakdown(decimal change, Dictionary<string, double> denominations)
        {
            string changeStr = "";

            // Calucate Bills
            // Iterate through all Note Denomination in RANDOM order, that are <= to current whole amount
            Random r = new Random();
            foreach (var note in denominations.Where(n => (decimal)n.Value <= change).OrderByDescending(n => n.Value)) //(n => r.Next()).ToDictionary(i => i.Key, i => i.Value))
            {
                // if change can be divided by at least once
                if ((change / (decimal)note.Value) >= 1)
                {
                    int numNotes = 0;
                    if (note.Value != .01)
                    {
                        // Calculate number of max possible notes for x value
                        int numPossibleNotes = (int)Math.Floor((decimal)(change / (decimal)note.Value));

                        numNotes = r.Next(0, numPossibleNotes); // Random number of Notes/Coins between 0 and max possible amount
                        change -= (numNotes * (decimal)note.Value);

                    }
                    // Remaining amount is cleared wit .01 denomination
                    else
                    {
                        // Calculate number of notes for x value
                        numNotes = (int)Math.Floor((decimal)(change / (decimal)note.Value));
                        change -= (numNotes * (decimal)note.Value);

                    }

                    // if Random amount is greated than 0
                    if (numNotes != 0)
                    {
                        // Get proper label from Dict Key
                        string label = numNotes > 1 ? note.Key.Substring(note.Key.IndexOf("/") + 1) : note.Key.Substring(0, note.Key.IndexOf("/"));
                        changeStr += $"{numNotes} {label}, ";
                    }
                }
            }

            return Regex.Replace(changeStr, ", $", "");
        }

        private void randomTxt_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (!char.IsControl(e.KeyChar) && !char.IsDigit(e.KeyChar) && (e.KeyChar != '.'))
            {
                e.Handled = true;
            }
        }

        private void rdo_CheckedChanged(object sender, EventArgs e)
        {
            if (!String.IsNullOrEmpty(filePath))
                computeAlllbtn.Enabled = true;
        }
    }
}
