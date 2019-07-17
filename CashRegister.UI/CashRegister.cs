using CashRegister.Core;
using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace CashRegister.UI
{
    public partial class CashRegister : Form
    {
        private Register register;
        private List<string> imageNames;

        public CashRegister()
        {
            register = new Register();
            imageNames = new List<string>() { "dollar", "quarter", "dime", "nickel", "penny" };

            InitializeComponent();

            // Fill layout dropdown
            int count = 0;
            var layoutList = new List<LayoutId>();
            foreach (var layout in Enum.GetValues(typeof(Layouts)))
            {
                layoutList.Add(new LayoutId(count, layout.ToString()));
                count++;
            }

            layoutDropdown.DataSource = layoutList;
            layoutDropdown.DisplayMember = "Name";
            layoutDropdown.ValueMember = "Id";
        }

        private void LoadButton_Click(object sender, EventArgs e)
        {
            openFileDialog.ShowDialog();
        }

        private void SaveButton_Click(object sender, EventArgs e)
        {
            saveFileDialog.ShowDialog();
        }

        private void ClearButton_Click(object sender, EventArgs e)
        {
            // Clear previous data
            register.Clear();

            // Update the table
            UpdateTableData((Layouts)Enum.GetValues(typeof(Layouts)).GetValue(layoutDropdown.SelectedIndex));
        }

        private void LayoutDropdown_SelectedIndexChanged(object sender, EventArgs e)
        {
            // Set desired layout
            register.Layout = (Layouts)Enum.GetValues(typeof(Layouts)).GetValue(layoutDropdown.SelectedIndex);

            // Update the table
            UpdateTableData((Layouts)Enum.GetValues(typeof(Layouts)).GetValue(layoutDropdown.SelectedIndex));
        }

        private void OpenFileDialog_FileOk(object sender, CancelEventArgs e)
        {
            // Load data
            register.LoadFromFile(openFileDialog.FileName);
            openFileDialog.FileName = "";
            register.Calculate();

            // Fill tables
            UpdateTableData((Layouts)Enum.GetValues(typeof(Layouts)).GetValue(layoutDropdown.SelectedIndex));
        }

        private void SaveFileDialog_FileOk(object sender, CancelEventArgs e)
        {
            // Save data
            register.WriteToFile(saveFileDialog.FileName);
            saveFileDialog.FileName = "";
        }

        private void UpdateTableData(Layouts layout)
        {
            // Remove all added labels
            for(int row = 0; row < tablePanel.RowCount; row++)
            {
                for(int col = 0; col < tablePanel.ColumnCount; col++)
                {
                    // Don't remove the first two columns of the first row
                    if(row == 0 && (col == 0 || col == 1))
                    {
                        continue;
                    }

                    tablePanel.Controls.Remove(tablePanel.GetControlFromPosition(col, row));
                }
            }

            // Update counts
            tablePanel.RowCount = 1;
            tablePanel.ColumnCount = 2;

            // Add denomination labels
            var bank = Bank.InitializeFactories().ExecuteCreation(layout);
            tablePanel.ColumnCount += bank.Denominations.Count;

            for(int i = 0; i < bank.Denominations.Count; i++)
            {
                tablePanel.ColumnStyles.Add(new ColumnStyle());

                // Create a label for this denomination
                var label = new Label();
                label.AutoSize = true;
                label.Font = new System.Drawing.Font("Microsoft Sans Serif", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
                label.Name = bank.Denominations[i].Name + "Label";

                // Display the denomination image if it's available
                if(imageNames.Contains(bank.Denominations[i].Name))
                {
                    // Build path to desired image
                    string imagePath = Directory.GetParent(Environment.CurrentDirectory).Parent.FullName + Path.DirectorySeparatorChar.ToString() + "Images" + Path.DirectorySeparatorChar.ToString() + bank.Denominations[i].Name + ".png";
                    label.Image = System.Drawing.Image.FromFile(imagePath);
                }
                label.Text = bank.Denominations[i].Name.First().ToString().ToUpper() + bank.Denominations[i].Name.Substring(1);

                tablePanel.Controls.Add(label, i + 2, 0);
            }

            tablePanel.RowCount += register.NumberOfTransactions();

            // For each transaction
            for (int i = 0; i < register.NumberOfTransactions(); i++)
            {
                tablePanel.RowStyles.Add(new RowStyle());

                // Add amount owed
                var currOwedLabel = new Label();
                currOwedLabel.AutoSize = true;
                currOwedLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
                currOwedLabel.Name = "owedLabel" + i.ToString();
                currOwedLabel.Text = register.GetTransaction(i).Owed.ToString();
                tablePanel.Controls.Add(currOwedLabel, 0, i + 1);

                // Add amount recieved
                var currRecievedLabel = new Label();
                currRecievedLabel.AutoSize = true;
                currRecievedLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
                currRecievedLabel.Name = "owedLabel" + i.ToString();
                currRecievedLabel.Text = register.GetTransaction(i).Received.ToString();
                tablePanel.Controls.Add(currRecievedLabel, 1, i + 1);

                // For each denomination, add count
                var change = register.GetTransaction(i).Change.Amounts;
                for (int j = 0; j < change.Count; j++)
                {
                    var currDenomLabel = new Label();
                    currDenomLabel.AutoSize = true;
                    currDenomLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
                    currDenomLabel.Name = change.Keys.ElementAt(j).Name + "Label" + i.ToString();
                    currDenomLabel.Text = change.Values.ElementAt(j).ToString();
                    tablePanel.Controls.Add(currDenomLabel, j + 2, i + 1);
                }
            }
        }
    }
}
