#include "CashRegister.h"
#include <fstream>


CashRegister::CashRegister() : randomDivisor(DEFAULT_RANDOM_DIVISOR){

	operatingCurrency = new USDClass();
	currencyType = CurrencyT::US;
}

CashRegister::CashRegister(CurrencyT newCurrency): randomDivisor(DEFAULT_RANDOM_DIVISOR){

	NewCurrency(newCurrency);

}

CashRegister::CashRegister(CurrencyT newCurrency, int newDivisor): randomDivisor(newDivisor){

	NewCurrency(newCurrency);

}

void CashRegister::NewCurrency(CurrencyT newCurrency) {

	switch (newCurrency) {
		case CurrencyT::US: {
			operatingCurrency = new USDClass();
			currencyType = CurrencyT::US;
			break;
		}
		default: {
			operatingCurrency = new USDClass();
			currencyType = CurrencyT::US;
		}
	};

}

CashRegister::~CashRegister() {

	delete operatingCurrency;
	operatingCurrency = nullptr;
}

void CashRegister::ChangeOperatingCurrency(CurrencyT newCurrency) {

	if (newCurrency != currencyType) {
		delete operatingCurrency;
		operatingCurrency = nullptr;
		NewCurrency(newCurrency);
	}

}

std::string CashRegister::GetOperatingCurrency() const { return operatingCurrency->GetCurrencyType(); }

int CashRegister::GetCurrentRandomDivisor() const { return randomDivisor; }

void CashRegister::ChangeRandomDivisor(int newDivisor) { randomDivisor = newDivisor; }

bool CashRegister::LineToInts(std::string line, int& sale, int& paid, std::string& errorStr) const {


	std::string saleStr = line.substr(0, line.find_first_of(','));
	std::string paidStr = line.substr(line.find_first_of(',') + 1, std::string::npos);

	//Validate that each value contains decimal point
	if (saleStr.find(".") == std::string::npos or paidStr.find(".") == std::string::npos) {
		errorStr = "Please make sure values are in the form of X.XX\n";
		return false;
	}else {
		FormatString(paidStr);
		FormatString(saleStr);

		//Validate that each value contains only numerica characters
		if (IsNumber(saleStr) and IsNumber(paidStr)) {
			sale = stoi(saleStr, nullptr, 10);
			paid = stoi(paidStr, nullptr, 10);
		}else {
			errorStr = "Please make sure values conatain only numerical characters \n";
			return false;
		}
	}

	return true;
};

void CashRegister::FormatString(std::string& value) const {

	int decimalPos = value.find('.');
	int strLength = value.length();
	int difference = strLength - decimalPos;

	if (difference == 1) {
		value += "00";
	}else if (difference == 2) {
		value += "0";
	}else if (difference > 3) {
		value = value.erase(value.find('.') + 3);
	}

	value = value.erase(value.find_first_of('.'), 1);
}

bool CashRegister::IsNumber(std::string value) const {

	bool allDigits = true;

	for (int i = 0; i < value.length(); i++) {
		if (!isdigit(value[i])) {
			allDigits = false;
			i = value.length();
		}
	}

	return allDigits;

}

std::string CashRegister::CalculateSale(Currency* currency, int sale, int paid) const {

	int changeDue = paid - sale;
	std::string changeStr = "";


	if (changeDue == 0) {
		changeStr = "There is no change due.";
	}else if (changeDue < 0) {
		changeStr = "Amount paid does not cover amount due.";
	}else {
		if (sale % randomDivisor == 0) {
			changeStr = currency->GetAmountAtRandom(changeDue);
		}else {
			changeStr = currency->GetAmountDescending(changeDue);
		}
	}

	return changeStr + "\n";
	
};

void CashRegister::ProcessSales(std::string file) const {

	std::ifstream sales;
	std::ofstream output;
	std::string line;
	int saleAmount = 0;
	int paidAmount = 0;
	std::string changeDue = "";
	std::string errorStr = "";
	bool validInput = true;

	sales.open(file, std::fstream::in);
	output.open(OUTPUT_FILE);

	if (sales) {
		getline(sales, line);
		while (sales) {
			validInput = ValidateInput(line, saleAmount, paidAmount, errorStr);
			if (validInput) {
				changeDue = CalculateSale(operatingCurrency, saleAmount, paidAmount);
				output << changeDue;
			}else {
				output << errorStr;
			}
		
			getline(sales, line);
		}
	}else{
		output << file + " is not a valid file.\n";
	}

	sales.close();
	output.close();

};

bool CashRegister::ValidateInput(std::string line, int& sale, int& paid, std::string& errorStr) const {


	//If the first and last occurrance of a comma are not the same or the value is not npos
	if (line.find_first_of(',') != line.find_last_of(',') or line.find(',') == std::string::npos) {
		errorStr = "Please provide two comma separated values in the form of X.XX,Y.YY\n";
		return false;
	}

	if (!LineToInts(line, sale, paid, errorStr)) {
		return false;
	}
	
	return true;
}

