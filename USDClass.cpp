#include "USDClass.h"


USDClass::USDClass():Currency(){ 


	//Assigning appropriate values x100 (ex: .25 = 25) to singular form of coin/bill
	singularAmounts[1] = "penny";
	singularAmounts[5] = "nickel";
	singularAmounts[10] = "dime";
	singularAmounts[25] = "quarter";
	singularAmounts[100] = "dollar";


	//Plural forms with corresponding values
	pluralAmounts[1] = "pennies";
	pluralAmounts[5] = "nickels";
	pluralAmounts[10] = "dimes";
	pluralAmounts[25] = "quarters";
	pluralAmounts[100] = "dollars";

}


std::string USDClass::GetCurrencyType() const { return CURRENCY_STR; }