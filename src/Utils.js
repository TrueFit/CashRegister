const Locales = require('./Locales.js');

//@PARAMS owedMaximized (int) - The Amount owed converted to the smallest denomination
module.exports.checkModulus = function(owedMaximized){
	return (owedMaximized % 3 === 0);
};

module.exports.calcChange = function(){
	var _working = {};
	const _recursiveSearch = function(owedMax, locale, callback){
		for(var key in Locales[locale].denominations){
			var obj = Locales[locale].denominations[key]; 
			if(owedMax >= obj.value){
				if(_working[key] === undefined){
					_working[key] = 1;
				}else{
					_working[key]++;
				}
				var remainder = owedMax - obj.value;
				if(remainder > 0){
					_recursiveSearch(remainder, locale, callback);	
					break;
				}else{
					callback(_working);
					break;
				}
			}else{ 
				continue;	
			}
		}
	};

	return{
		//@PARAMS owedMax(int) - the maximized owed 
		//@PARAMs 'locale' - the desired locale
		//@PARAMS callback
		standard: function(owedMax, locale, callback){
			_working = {};
			_recursiveSearch(owedMax, locale, function(result){
				callback(result);	
			});
		},
			random : function(owedMax, locale, callback){
				//calculate random percentages of owedMax 
				//pick a random

			}	
	}	
}();

//@PARAMS owed (float)(required) - The amount owed in the original float format
//@PARAMS 'locale' (required) - The desired locale to use
module.exports.convertToSmallest = function(owed, locale){
	return parseInt(Locales[locale].base * owed);
}


