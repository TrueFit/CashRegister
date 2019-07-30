using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace CashRegister
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public string display;
        public MainWindow()
        {
            InitializeComponent();
            //shRunFlatFile();

            var cash = new CashRegisterClass.CashRegisterClass();
            var l = new System.Windows.Controls.Label();

            List<string> returnVal = cash.RunFlatFile();

            foreach (var line in returnVal)
            {
                display = display + line + "\r\n";
            }

        }

        private void Label_Loaded(object sender, RoutedEventArgs e)
        {
            // ... Get label.
            var label = sender as Label;
            // ... Set date in content.
            label.Content = display;
        }

    }
}
