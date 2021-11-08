// TrueFit_CashRegister.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include "CashRegister.h"
#include <iostream>


void RunProgram();

int main()
{
    RunProgram();

    return 0;
    
}

void RunProgram(){

    CashRegister test = CashRegister();
    std::string file;
    std::string response = "yes";

    while (response == "yes") {
        std::cout << "Please enter sales file to process" << std::endl;
        std::cin >> file;
        test.ProcessSales(file);
        std::cout << "Processing complete. Would you like to process another file? Enter yes or no \n";
        std::cin >> response;
    }

    std::cout << "Thank you for using the cash register.\n";

}

