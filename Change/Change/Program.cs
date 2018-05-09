using System;
using System.IO;

namespace ChangeRegister
{
    class Program
    {
        public static void ChangeDue(int saleValue, int cashGiven)
        {
            // condition for sale wheather it is divided by 3 or not
            int changeDue = (cashGiven - saleValue);
            if (saleValue % 3 == 0)
                ChangeDivisableBy3(changeDue);
            else
                ChangeNonDivisableBy3(changeDue);
        }
        // Method for sale which is not divisable by 3
        public static void ChangeNonDivisableBy3(int changeDue)
        {
            int dollars = changeDue / 100;
            int quarters = (changeDue % 100) / 25;
            int dimes = (changeDue % 25) / 10;
            int nickles = (changeDue % 25 % 10) / 5;
            int pennies = (changeDue % 25 % 10 % 5);
            Display(dollars, quarters, dimes, nickles, pennies);
        }
        // Method for sale divided by 3
        public static void ChangeDivisableBy3(int changeDue)
        {
            int dollarCount = 0, quartersCount = 0, dimesCount = 0, cnickles = 0, penniesCount = 0;
            int Min = 1, Max = 6, x = 0;
            // Generating a Random value in between 1 to 5 to pass to switch case
            Random randNum = new Random();
            while (changeDue > 0)
            {
                int temp = changeDue;
                switch (x = randNum.Next(Min, Max))
                {
                    case 1:
                        changeDue = changeDue - 100;
                        // checking change due is non negative 
                        if (changeDue < 0)
                            changeDue = temp;
                        else
                            dollarCount++;
                        break;
                    case 2:
                        changeDue = changeDue - 25;
                        if (changeDue < 0)
                            changeDue = temp;
                        else
                            quartersCount++;
                        break;
                    case 3:
                        changeDue = changeDue - 10;
                        if (changeDue < 0)
                            changeDue = temp;
                        else
                            dimesCount++;
                        break;
                    case 4:
                        changeDue = changeDue - 5;
                        if (changeDue < 0)
                            changeDue = temp;
                        else
                            cnickles++;
                        break;
                    case 5:
                        changeDue = changeDue - 1;
                        if (changeDue < 0)
                            changeDue = temp;
                        else
                            penniesCount++;
                        break;
                }
            }
            Display(dollarCount, quartersCount, dimesCount, cnickles, penniesCount);
        }
        // Display function for change count
        public static void Display(int dollars, int quarters, int dimes, int nickles, int pennies)
        {
            if (dollars != 0)
            {
                Console.Write(dollars +"dollars \t");
            }
            if (quarters != 0)
            {
                Console.Write(quarters +"quarters \t");
            }
            if (dimes != 0)
            {
                Console.Write(dimes +"dimes \t");
            }
            if (nickles != 0)
            {
                Console.Write(nickles + "nickles \t");
            }
            if (pennies != 0)
            {
                Console.Write(pennies +"Pennies \t");
            }
        }
        static void Main(string[] args)
        {
            int saleValue;
            int cashGiven;
            string fileName = @"C:\Users\Naren\source\repos\Change\Change\Input.txt";
            // Read a text file using StreamReader
            using (System.IO.StreamReader sr = new System.IO.StreamReader(fileName))
            {
                String line;
                while ((line = sr.ReadLine()) != null)
                {
                    char[] splitchar = { ',' };
                    string[] strArr = line.Split(splitchar);
                    decimal d = Convert.ToDecimal(strArr[0]) * 100;
                    saleValue = (int)d;
                    decimal d1 = Convert.ToDecimal(strArr[1]) * 100;
                    cashGiven = (int)d1;
                    // Checking for valid sale and cash given and calling change function
                    if (saleValue > cashGiven)
                        Console.WriteLine("Balance due=" + (saleValue - cashGiven));
                    else if (saleValue == cashGiven)
                        Console.WriteLine("ChangeDue=0");
                    else
                        ChangeDue(saleValue, cashGiven);
                    Console.WriteLine();
                }
            }
            Console.ReadLine();
        }
    }
}