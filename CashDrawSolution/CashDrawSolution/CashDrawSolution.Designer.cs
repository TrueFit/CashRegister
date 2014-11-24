namespace CashDrawSolution
{
    partial class CashDrawSolution
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
            this.lbl_InputFile = new System.Windows.Forms.Label();
            this.btn_UploadFile = new System.Windows.Forms.Button();
            this.uploadInputFileDialog = new System.Windows.Forms.OpenFileDialog();
            this.label1 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // lbl_InputFile
            // 
            this.lbl_InputFile.Location = new System.Drawing.Point(0, 0);
            this.lbl_InputFile.Name = "lbl_InputFile";
            this.lbl_InputFile.Size = new System.Drawing.Size(100, 23);
            this.lbl_InputFile.TabIndex = 2;
            // 
            // btn_UploadFile
            // 
            this.btn_UploadFile.Location = new System.Drawing.Point(67, 68);
            this.btn_UploadFile.Name = "btn_UploadFile";
            this.btn_UploadFile.Size = new System.Drawing.Size(118, 23);
            this.btn_UploadFile.TabIndex = 1;
            this.btn_UploadFile.Text = "Upload Input File";
            this.btn_UploadFile.UseVisualStyleBackColor = true;
            this.btn_UploadFile.Click += new System.EventHandler(this.btn_UploadFile_Click);
            // 
            // uploadInputFileDialog
            // 
            this.uploadInputFileDialog.FileName = "uploadInputFileDialog";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(64, 27);
            this.label1.MaximumSize = new System.Drawing.Size(20, 20);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(0, 13);
            this.label1.TabIndex = 3;
            // 
            // CashDrawSolution
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(284, 262);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.btn_UploadFile);
            this.Controls.Add(this.lbl_InputFile);
            this.Name = "CashDrawSolution";
            this.Text = "CashDraw Solution";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lbl_InputFile;
        private System.Windows.Forms.Button btn_UploadFile;
        private System.Windows.Forms.OpenFileDialog uploadInputFileDialog;
        private System.Windows.Forms.Label label1;
        
    }
}

