
#ifndef REGISTER
#define REGISTER
#include "USDClass.h"


class CashRegister {

	public:

		//Types of currency the Cash Register can accept (errors when using 'USD' so using 'US' for 'US Dollar')
		enum class CurrencyT {US};

		//Default Constructor - initiates random divisor to 3 and operating currency to US
		CashRegister();

		//Initiates random divisor to 3 and operating currency to valid CurrencyT provided
		//	If no valid CurrencyT then defaults to USD
		CashRegister(CurrencyT newCurrency);

		//Initiates random divisor to newDivisor and operating currency to valid CurrencyT provided
		//	If no valid CurrencyT then defaults to USD
		CashRegister(CurrencyT newCurrency, int newDivisor);

		//Destructor
		~CashRegister();

		//Change the cash register's current divisor
		void ChangeRandomDivisor(int newDivisor);

		//Return the value of the current random divisor
		int GetCurrentRandomDivisor() const;

		//Change the value of the cash register's operating currency
		//	Must be a valid CurrencyT value
		void ChangeOperatingCurrency(CurrencyT newCurrency);

		//Return cash register's current operating currency
		std::string GetOperatingCurrency() const;

		//Process a file of Sales in operating Currency
		void ProcessSales(std::string file) const;

	private:

		//Default random divisor is 3
		const int DEFAULT_RANDOM_DIVISOR = 3;

		//Default currency is US
		 const CurrencyT DEFAULT_CURRENCY = CurrencyT::US;

		 //Location of the output file
		const std::string OUTPUT_FILE = "C:\\TrueFit\\output.txt";

		//Cash register's current random divisor
		int randomDivisor;

		//Cash Register's current operating currency
		Currency* operatingCurrency;

		//Used to compare when trying to change currency types
		CurrencyT currencyType;

		//Helper methods
		std::string CalculateSale(Currency* currency, int sale, int paid) const;
		void NewCurrency(CurrencyT newCurrency);
		bool ValidateInput(std::string line, int& sale, int& paid, std::string& errorStr) const;
		bool LineToInts(std::string line, int& sale, int& paid, std::string& errorStr) const;
		bool IsNumber(std::string value) const;
		void FormatString(std::string& value) const;


};

#endif