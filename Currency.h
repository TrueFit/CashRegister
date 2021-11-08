
#ifndef CURRENCY
#define CURRENCY

#include<string>
#include<map>

class Currency{
	
	public: 

		//Get amount back with the most of the highest valued bill/coin, then most of the next highest value
		//  and so on until amount is given back in full in the form of a string
		std::string GetAmountDescending(int amount) const;

		//Get amount back with random assignments to bills/coins
		std::string GetAmountAtRandom(int amount) const;;

		//Return the type of currency being used in the form of a string
		virtual std::string GetCurrencyType() const = 0;

	protected:

		//Default constructor - not used
		Currency();

		//Map providing the associated value x100 (ex: .25 --> 25) as the key 
		//	and the string name of bill/coin in singular as stored value
		std::map<int, std::string> singularAmounts;

		//Map providing the associated value x100 (ex: .25 --> 25) as the key 
		//	and the string name of bill/coin in plural as stored value
		std::map<int, std::string> pluralAmounts;


	private:

		//Helper method
		int GetRandomQuantity(const int amount, const int denomination) const;

};


#endif