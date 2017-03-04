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
using ModelObjects;
using ChangeCalculator;

namespace TruefitCashRegister
{
    public partial class Form1 : Form
    {
        private Queue<Tuple<decimal, decimal>> costThenReceived;
        private Queue<ChangeSummary> currentChangeDue;
        private ICalculator changeCalculator;

        public Form1()
        {
            InitializeComponent();
            costThenReceived = new Queue<Tuple<decimal, decimal>>();
            changeCalculator = new USDollarChangeCalculator();
        }

        private void OpenFileButton_Click(object sender, EventArgs e)
        {
            var result = openPriceFile.ShowDialog();

            if (result == DialogResult.OK)
            {
                foreach(var p in File.ReadAllLines(openPriceFile.FileName))
                {
                    try
                    {
                        var temp = p.Split(',');
                        costThenReceived.Enqueue(new Tuple<decimal, decimal>(decimal.Parse(temp[0]), decimal.Parse(temp[1])));
                        DisplayNextPreview();
                    }
                    catch
                    {
                        changeViewer.Clear();
                        changeViewer.Text = "File format is incorrect.\nEx. 2.14,3.00";
                    }
                }
            }
        }

        private void DisplayNextPreview()
        {
            if(costThenReceived.Count > 0)
            {
                var temp = costThenReceived.Dequeue();
                pricePreview.Text = temp.Item1.ToString("C");
                receivedPreview.Text = temp.Item2.ToString("C");
                costThenReceived.Enqueue(temp);
            }
        }

        private void DisplayNextChangeSummary()
        {
            if(currentChangeDue.Count > 0)
            {
                var temp = currentChangeDue.Dequeue();
                resultReceivedDisplay.Text = temp.ReceivedMoney.ToString("C");
                resultPriceDisplay.Text = temp.Price.ToString("C");

                changeViewer.Clear();
                foreach(var change in temp.ChangeItems)
                {
                    changeViewer.AppendText($"{change.Count} {change.Currency.Name}\n");
                }

                currentChangeDue.Enqueue(temp);
            }
        }

        private void nextPreviewButton_Click(object sender, EventArgs e)
        {
            DisplayNextPreview();
        }

        private void CalculateChangeButton_Click(object sender, EventArgs e)
        {
            currentChangeDue = new Queue<ChangeSummary>();

            foreach (var transaction in costThenReceived)
                currentChangeDue.Enqueue(changeCalculator.GetChange(transaction.Item1, transaction.Item2));

            SaveChangeToFile();
        }

        private void SaveChangeToFile()
        {
            changeViewer.Clear();
            try
            {
                saveFileDialog1.Filter = "Text file (*.txt)|*.txt";
                if (saveFileDialog1.ShowDialog() == DialogResult.OK)
                {
                    using (StreamWriter writer = new StreamWriter(saveFileDialog1.FileName))
                    {
                        foreach(var result in currentChangeDue)
                        {
                            StringBuilder saveLine = new StringBuilder();
                            foreach (var change in result.ChangeItems)
                                saveLine.Append($"{change.Count} {change.Currency.Name},");

                            if (saveLine.Length > 0)
                            {
                                saveLine.Remove(saveLine.Length - 1, 1);
                                writer.WriteLine(saveLine.ToString());
                            }
                        }

                        changeViewer.Text = $"Results saved to {saveFileDialog1.FileName}. Press next to preview results";
                    }
                }
                else
                    throw new Exception();
            }
            catch
            {
                changeViewer.Text = "Results could not be saved.  Press next to see unsaved results";
            }
        }

        private void nextChangeButton_Click(object sender, EventArgs e)
        {
            DisplayNextChangeSummary();
        }
    }
}
