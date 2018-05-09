const utils = require('./Utils.js');


//@RETURNS 'string' - containing the well formatted change object or error output where applicable 
//@PARAMS - price - The value of the first parameter of the csv
//@PARAMS - paid - The value of the second parameter of the csv
//@PARAMS - 'locale' - Locale to make for easy currency additions
module.exports = {
	getChange : function getChange(price, paid, locale, callback){
			paid = utils.convertToSmallest(paid, locale);
			price = utils.convertToSmallest(price, locale);
			var owed = paid - price;

			if(owed > 0){
				if(utils.checkModulus(price)){
					//is divisible by 3 return random string
					utils.calcChange.random(owed, locale, function(data){
						callback( utils.formatString(data) );	
					});
				}else{
					//calculate 
					utils.calcChange.standard(owed, locale, function(data){
						callback( utils.formatString(data) );	
					});
				}
			}else{
				if(owed < 0){
					//Full Change is due
					callback('Invalid Transaction - Someone Robbed the Register\n');
				}else{
					callback('Exact Payment - Nothing is Owed\n');	
				}
			}
	}
};

