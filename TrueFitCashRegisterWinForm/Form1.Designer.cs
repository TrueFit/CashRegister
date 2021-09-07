namespace TrueFitCashRegisterWinForm
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
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
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.Options = new System.Windows.Forms.GroupBox();
            this.fileNameLbl = new System.Windows.Forms.Label();
            this.randomTxt = new System.Windows.Forms.TextBox();
            this.charityChk = new System.Windows.Forms.CheckBox();
            this.label6 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.euroRdo = new System.Windows.Forms.RadioButton();
            this.usdRdo = new System.Windows.Forms.RadioButton();
            this.label3 = new System.Windows.Forms.Label();
            this.sourcebtn = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.outputLocationTxt = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.computeAlllbtn = new System.Windows.Forms.Button();
            this.folderBrowserDialog1 = new System.Windows.Forms.FolderBrowserDialog();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.outputTxt = new System.Windows.Forms.TextBox();
            this.contextMenuStrip1 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.inputTxt = new System.Windows.Forms.TextBox();
            this.Options.SuspendLayout();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.groupBox3.SuspendLayout();
            this.SuspendLayout();
            // 
            // Options
            // 
            this.Options.Controls.Add(this.fileNameLbl);
            this.Options.Controls.Add(this.randomTxt);
            this.Options.Controls.Add(this.charityChk);
            this.Options.Controls.Add(this.label6);
            this.Options.Controls.Add(this.label5);
            this.Options.Controls.Add(this.label4);
            this.Options.Controls.Add(this.euroRdo);
            this.Options.Controls.Add(this.usdRdo);
            this.Options.Controls.Add(this.label3);
            this.Options.Controls.Add(this.sourcebtn);
            this.Options.Location = new System.Drawing.Point(56, 32);
            this.Options.Name = "Options";
            this.Options.Size = new System.Drawing.Size(434, 239);
            this.Options.TabIndex = 0;
            this.Options.TabStop = false;
            this.Options.Text = "Options";
            // 
            // fileNameLbl
            // 
            this.fileNameLbl.AutoSize = true;
            this.fileNameLbl.Location = new System.Drawing.Point(305, 53);
            this.fileNameLbl.Name = "fileNameLbl";
            this.fileNameLbl.Size = new System.Drawing.Size(0, 20);
            this.fileNameLbl.TabIndex = 11;
            // 
            // randomTxt
            // 
            this.randomTxt.Location = new System.Drawing.Point(205, 127);
            this.randomTxt.Name = "randomTxt";
            this.randomTxt.Size = new System.Drawing.Size(125, 27);
            this.randomTxt.TabIndex = 10;
            this.randomTxt.Text = "3";
            this.randomTxt.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.randomTxt_KeyPress);
            // 
            // charityChk
            // 
            this.charityChk.AutoSize = true;
            this.charityChk.Location = new System.Drawing.Point(206, 173);
            this.charityChk.Name = "charityChk";
            this.charityChk.Size = new System.Drawing.Size(18, 17);
            this.charityChk.TabIndex = 9;
            this.charityChk.UseVisualStyleBackColor = true;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(30, 171);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(148, 20);
            this.label6.TabIndex = 8;
            this.label6.Text = "Round Up for Charity";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(30, 130);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(89, 20);
            this.label5.TabIndex = 7;
            this.label5.Text = "Randomizer";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(30, 92);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(66, 20);
            this.label4.TabIndex = 6;
            this.label4.Text = "Currency";
            // 
            // euroRdo
            // 
            this.euroRdo.AutoSize = true;
            this.euroRdo.Location = new System.Drawing.Point(270, 92);
            this.euroRdo.Name = "euroRdo";
            this.euroRdo.Size = new System.Drawing.Size(57, 24);
            this.euroRdo.TabIndex = 5;
            this.euroRdo.TabStop = true;
            this.euroRdo.Text = "EUR";
            this.euroRdo.UseVisualStyleBackColor = true;
            this.euroRdo.CheckedChanged += new System.EventHandler(this.rdo_CheckedChanged);
            // 
            // usdRdo
            // 
            this.usdRdo.AutoSize = true;
            this.usdRdo.Location = new System.Drawing.Point(205, 94);
            this.usdRdo.Name = "usdRdo";
            this.usdRdo.Size = new System.Drawing.Size(59, 24);
            this.usdRdo.TabIndex = 4;
            this.usdRdo.TabStop = true;
            this.usdRdo.Text = "USD";
            this.usdRdo.UseVisualStyleBackColor = true;
            this.usdRdo.CheckedChanged += new System.EventHandler(this.rdo_CheckedChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(30, 52);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(96, 20);
            this.label3.TabIndex = 3;
            this.label3.Text = "Select source";
            // 
            // sourcebtn
            // 
            this.sourcebtn.Location = new System.Drawing.Point(205, 49);
            this.sourcebtn.Name = "sourcebtn";
            this.sourcebtn.Size = new System.Drawing.Size(94, 29);
            this.sourcebtn.TabIndex = 2;
            this.sourcebtn.Text = "open";
            this.sourcebtn.UseVisualStyleBackColor = true;
            this.sourcebtn.Click += new System.EventHandler(this.sourcebtn_Click);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.outputLocationTxt);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.computeAlllbtn);
            this.groupBox1.Location = new System.Drawing.Point(526, 32);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(283, 239);
            this.groupBox1.TabIndex = 1;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Controls";
            // 
            // outputLocationTxt
            // 
            this.outputLocationTxt.Location = new System.Drawing.Point(24, 158);
            this.outputLocationTxt.Multiline = true;
            this.outputLocationTxt.Name = "outputLocationTxt";
            this.outputLocationTxt.ReadOnly = true;
            this.outputLocationTxt.Size = new System.Drawing.Size(231, 60);
            this.outputLocationTxt.TabIndex = 4;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(24, 134);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(85, 20);
            this.label2.TabIndex = 3;
            this.label2.Text = "Output File:\r\n";
            // 
            // computeAlllbtn
            // 
            this.computeAlllbtn.Enabled = false;
            this.computeAlllbtn.Location = new System.Drawing.Point(47, 51);
            this.computeAlllbtn.Name = "computeAlllbtn";
            this.computeAlllbtn.Size = new System.Drawing.Size(182, 55);
            this.computeAlllbtn.TabIndex = 0;
            this.computeAlllbtn.Text = "Compute All";
            this.computeAlllbtn.UseVisualStyleBackColor = true;
            this.computeAlllbtn.Click += new System.EventHandler(this.computeAlllbtn_Click);
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.outputTxt);
            this.groupBox2.Location = new System.Drawing.Point(56, 295);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(753, 297);
            this.groupBox2.TabIndex = 2;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Output";
            // 
            // outputTxt
            // 
            this.outputTxt.Location = new System.Drawing.Point(30, 45);
            this.outputTxt.Multiline = true;
            this.outputTxt.Name = "outputTxt";
            this.outputTxt.ReadOnly = true;
            this.outputTxt.Size = new System.Drawing.Size(685, 230);
            this.outputTxt.TabIndex = 0;
            // 
            // contextMenuStrip1
            // 
            this.contextMenuStrip1.ImageScalingSize = new System.Drawing.Size(20, 20);
            this.contextMenuStrip1.Name = "contextMenuStrip1";
            this.contextMenuStrip1.Size = new System.Drawing.Size(61, 4);
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.inputTxt);
            this.groupBox3.Location = new System.Drawing.Point(56, 600);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(753, 297);
            this.groupBox3.TabIndex = 3;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Input";
            // 
            // inputTxt
            // 
            this.inputTxt.Location = new System.Drawing.Point(30, 45);
            this.inputTxt.Multiline = true;
            this.inputTxt.Name = "inputTxt";
            this.inputTxt.ReadOnly = true;
            this.inputTxt.Size = new System.Drawing.Size(685, 230);
            this.inputTxt.TabIndex = 0;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 20F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(874, 909);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.Options);
            this.Name = "Form1";
            this.Text = "Cash Register";
            this.Options.ResumeLayout(false);
            this.Options.PerformLayout();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.GroupBox Options;
        private System.Windows.Forms.TextBox randomTxt;
        private System.Windows.Forms.CheckBox charityChk;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.RadioButton euroRdo;
        private System.Windows.Forms.RadioButton usdRdo;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button sourcebtn;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button computeAlllbtn;
        private System.Windows.Forms.FolderBrowserDialog folderBrowserDialog1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.TextBox outputTxt;
        private System.Windows.Forms.ContextMenuStrip contextMenuStrip1;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.TextBox inputTxt;
        private System.Windows.Forms.Label fileNameLbl;
        private System.Windows.Forms.TextBox outputLocationTxt;
    }
}

