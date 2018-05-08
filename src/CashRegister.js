const utils = require('./Utils.js');


//@RETURNS {object} containing the amount owed, and any applicable warnings, and the formatted output 
//@PARAMS - price (float) - The value of the first parameter of the csv
//@PARAMS - paid (float) - The value of the second parameter of the csv
//@PARAMS - 'locale' - An optional locale to make for easy currency additions
module.exports = {
	getChange : function getChange(price, paid, locale='USD'){
			var owed = price - paid;
			if( owed > 0){
				owed = utils.convertToSmallest(owed, locale);
				if(utils.checkModulus(owed)){
					//is divisible by 3 return random string
					return utils.calcChange.random(xOwed, locale);
				}else{
					//calculate 
					return utils.calcChange.standard(xOwed, locale);
				}
				//convert to float
				//convert total amount to pennies

			}else{
				if(owed < 0){
					//TODO add test case for this
					//Full Change is due
					return 'Invalid Transaction';
				}else{
					if(parseInt(price) === 0 && parseInt(paid) === 0){
						//TODO add test case for this
						return 'Invalid Transaction - Someone robbed the register';
					}else{
						//TODO add test case for this
						return 'Exact Change - Nothing is Owed';	
					}
				}
			}
	}
};

