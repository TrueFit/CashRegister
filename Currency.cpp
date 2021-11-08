#include "Currency.h"

#include<random>
#include<chrono>


Currency::Currency() { }

std::string Currency::GetAmountDescending(int amount) const {

	std::string returnStr = "";
	int quantity = 0;

	auto it = singularAmounts.crbegin();

	//Iterate through map values from largest (end of map) to smallest until full amount is given back
	//	using appropriate singular or plural verbiage
	while (amount != 0 and it != singularAmounts.crend()) {

		quantity = amount / (*it).first;

		if (quantity != 0) {
			if (quantity == 1) {
				returnStr += std::to_string(quantity) + ' ' + (*it).second + ",";
				amount = amount - (*it).first;
			}
			else {
				returnStr += std::to_string(quantity) + ' ' + pluralAmounts.at((*it).first) + ",";
				amount = amount - (quantity * (*it).first);
			}
		}
		it++;
	}

	return returnStr.substr(0, returnStr.length() - 1);

}

std::string Currency::GetAmountAtRandom(int amount) const {

	std::string returnStr = "";
	int quantity;
	auto it = singularAmounts.crbegin();


	while (amount != 0 and it != singularAmounts.crend()) {

		quantity = GetRandomQuantity(amount, (*it).first);

		if (quantity != 0) {

			//If the amount isn't 0 but we are at last denomination - fill the rest of amount with last denomination
			if (amount - (quantity * (*it).first) != 0 and next(it, 1) == singularAmounts.crend()) {
				quantity = amount;
				returnStr += std::to_string(quantity) + ' ' + (*it).second + ",";
				amount = amount - quantity;
			}else{

				//If quantity used is one - use singular spelling
				if (quantity == 1) {
					returnStr += std::to_string(quantity) + ' ' + (*it).second + ",";
					amount = amount - (*it).first;
				
				//Otherwise use plural spelling
				}else {
					returnStr += std::to_string(quantity) + ' ' + pluralAmounts.at((*it).first) + ",";
					amount = amount - (quantity * (*it).first);
				}
			}
		}
		it++;
	}

	return returnStr.substr(0, returnStr.length() - 1);

};

int Currency::GetRandomQuantity(const int amount, const int denomination) const {

	std::uniform_int_distribution<int> distribution(0, 100);
	unsigned seed1 = std::chrono::system_clock::now().time_since_epoch().count();
	std::default_random_engine generator(seed1);

	if (amount / denomination != 0) {
		//Generate random number no larger than the total amount of times the denomination can divide into amount
		return distribution(generator) % (amount / denomination);
	}

	return 0;
}
