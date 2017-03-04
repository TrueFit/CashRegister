namespace TruefitCashRegister
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.OpenFileButton = new System.Windows.Forms.Button();
            this.openPriceFile = new System.Windows.Forms.OpenFileDialog();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.pricePreview = new System.Windows.Forms.Label();
            this.receivedPreview = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.nextPreviewButton = new System.Windows.Forms.Button();
            this.resultReview = new System.Windows.Forms.GroupBox();
            this.changeViewer = new System.Windows.Forms.RichTextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.resultPriceDisplay = new System.Windows.Forms.Label();
            this.resultReceivedDisplay = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.nextChangeButton = new System.Windows.Forms.Button();
            this.CalculateChangeButton = new System.Windows.Forms.Button();
            this.saveFileDialog1 = new System.Windows.Forms.SaveFileDialog();
            this.groupBox1.SuspendLayout();
            this.resultReview.SuspendLayout();
            this.SuspendLayout();
            // 
            // OpenFileButton
            // 
            this.OpenFileButton.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.OpenFileButton.Location = new System.Drawing.Point(12, 12);
            this.OpenFileButton.Name = "OpenFileButton";
            this.OpenFileButton.Size = new System.Drawing.Size(275, 37);
            this.OpenFileButton.TabIndex = 0;
            this.OpenFileButton.Text = "Open Price and Payment File";
            this.OpenFileButton.UseVisualStyleBackColor = true;
            this.OpenFileButton.Click += new System.EventHandler(this.OpenFileButton_Click);
            // 
            // openPriceFile
            // 
            this.openPriceFile.FileName = "openFileDialog1";
            this.openPriceFile.Title = "Price and Payment Flat File";
            // 
            // groupBox1
            // 
            this.groupBox1.BackColor = System.Drawing.Color.Azure;
            this.groupBox1.Controls.Add(this.pricePreview);
            this.groupBox1.Controls.Add(this.receivedPreview);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Controls.Add(this.nextPreviewButton);
            this.groupBox1.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox1.Location = new System.Drawing.Point(12, 55);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(275, 204);
            this.groupBox1.TabIndex = 1;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Preview Price and Payments";
            // 
            // pricePreview
            // 
            this.pricePreview.AutoSize = true;
            this.pricePreview.Location = new System.Drawing.Point(157, 94);
            this.pricePreview.Name = "pricePreview";
            this.pricePreview.Size = new System.Drawing.Size(49, 17);
            this.pricePreview.TabIndex = 4;
            this.pricePreview.Text = "$0.00";
            // 
            // receivedPreview
            // 
            this.receivedPreview.AutoSize = true;
            this.receivedPreview.Location = new System.Drawing.Point(154, 42);
            this.receivedPreview.Name = "receivedPreview";
            this.receivedPreview.Size = new System.Drawing.Size(49, 17);
            this.receivedPreview.TabIndex = 3;
            this.receivedPreview.Text = "$0.00";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(16, 94);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(45, 17);
            this.label2.TabIndex = 2;
            this.label2.Text = "Price";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(16, 42);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(75, 17);
            this.label1.TabIndex = 1;
            this.label1.Text = "Received";
            // 
            // nextPreviewButton
            // 
            this.nextPreviewButton.Location = new System.Drawing.Point(72, 175);
            this.nextPreviewButton.Name = "nextPreviewButton";
            this.nextPreviewButton.Size = new System.Drawing.Size(131, 23);
            this.nextPreviewButton.TabIndex = 0;
            this.nextPreviewButton.Text = "Next";
            this.nextPreviewButton.UseVisualStyleBackColor = true;
            this.nextPreviewButton.Click += new System.EventHandler(this.nextPreviewButton_Click);
            // 
            // resultReview
            // 
            this.resultReview.BackColor = System.Drawing.Color.Azure;
            this.resultReview.Controls.Add(this.changeViewer);
            this.resultReview.Controls.Add(this.label7);
            this.resultReview.Controls.Add(this.resultPriceDisplay);
            this.resultReview.Controls.Add(this.resultReceivedDisplay);
            this.resultReview.Controls.Add(this.label5);
            this.resultReview.Controls.Add(this.label6);
            this.resultReview.Controls.Add(this.nextChangeButton);
            this.resultReview.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.resultReview.Location = new System.Drawing.Point(12, 324);
            this.resultReview.Name = "resultReview";
            this.resultReview.Size = new System.Drawing.Size(275, 329);
            this.resultReview.TabIndex = 2;
            this.resultReview.TabStop = false;
            this.resultReview.Text = "Review Results";
            // 
            // changeViewer
            // 
            this.changeViewer.Location = new System.Drawing.Point(19, 103);
            this.changeViewer.Name = "changeViewer";
            this.changeViewer.Size = new System.Drawing.Size(236, 191);
            this.changeViewer.TabIndex = 7;
            this.changeViewer.Text = "";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(16, 82);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(97, 17);
            this.label7.TabIndex = 6;
            this.label7.Text = "Change Due";
            // 
            // resultPriceDisplay
            // 
            this.resultPriceDisplay.AutoSize = true;
            this.resultPriceDisplay.Location = new System.Drawing.Point(157, 54);
            this.resultPriceDisplay.Name = "resultPriceDisplay";
            this.resultPriceDisplay.Size = new System.Drawing.Size(49, 17);
            this.resultPriceDisplay.TabIndex = 4;
            this.resultPriceDisplay.Text = "$0.00";
            // 
            // resultReceivedDisplay
            // 
            this.resultReceivedDisplay.AutoSize = true;
            this.resultReceivedDisplay.Location = new System.Drawing.Point(157, 28);
            this.resultReceivedDisplay.Name = "resultReceivedDisplay";
            this.resultReceivedDisplay.Size = new System.Drawing.Size(49, 17);
            this.resultReceivedDisplay.TabIndex = 3;
            this.resultReceivedDisplay.Text = "$0.00";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(16, 54);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(45, 17);
            this.label5.TabIndex = 2;
            this.label5.Text = "Price";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(16, 28);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(75, 17);
            this.label6.TabIndex = 1;
            this.label6.Text = "Received";
            // 
            // nextChangeButton
            // 
            this.nextChangeButton.Location = new System.Drawing.Point(72, 300);
            this.nextChangeButton.Name = "nextChangeButton";
            this.nextChangeButton.Size = new System.Drawing.Size(131, 23);
            this.nextChangeButton.TabIndex = 0;
            this.nextChangeButton.Text = "Next";
            this.nextChangeButton.UseVisualStyleBackColor = true;
            this.nextChangeButton.Click += new System.EventHandler(this.nextChangeButton_Click);
            // 
            // CalculateChangeButton
            // 
            this.CalculateChangeButton.Font = new System.Drawing.Font("Microsoft Sans Serif", 15F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.CalculateChangeButton.Location = new System.Drawing.Point(13, 265);
            this.CalculateChangeButton.Name = "CalculateChangeButton";
            this.CalculateChangeButton.Size = new System.Drawing.Size(274, 53);
            this.CalculateChangeButton.TabIndex = 3;
            this.CalculateChangeButton.Text = "Calculate Change";
            this.CalculateChangeButton.UseVisualStyleBackColor = true;
            this.CalculateChangeButton.Click += new System.EventHandler(this.CalculateChangeButton_Click);
            // 
            // saveFileDialog1
            // 
            this.saveFileDialog1.Title = "Save Change Output Here";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.LemonChiffon;
            this.ClientSize = new System.Drawing.Size(303, 665);
            this.Controls.Add(this.CalculateChangeButton);
            this.Controls.Add(this.resultReview);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.OpenFileButton);
            this.Name = "Form1";
            this.Text = "Form1";
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.resultReview.ResumeLayout(false);
            this.resultReview.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button OpenFileButton;
        private System.Windows.Forms.OpenFileDialog openPriceFile;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Label pricePreview;
        private System.Windows.Forms.Label receivedPreview;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button nextPreviewButton;
        private System.Windows.Forms.GroupBox resultReview;
        private System.Windows.Forms.Label resultPriceDisplay;
        private System.Windows.Forms.Label resultReceivedDisplay;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Button nextChangeButton;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Button CalculateChangeButton;
        private System.Windows.Forms.RichTextBox changeViewer;
        private System.Windows.Forms.SaveFileDialog saveFileDialog1;
    }
}

