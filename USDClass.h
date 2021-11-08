#ifndef USD
#define USD


#include "Currency.h"

class USDClass : public Currency {

	public:

		//Default Constructor
		USDClass();

		//Returns type of currency in form of string
		std::string GetCurrencyType() const;

	private:

		//String representation of type of currency
		const std::string CURRENCY_STR = "USD";
};

#endif
