const Locales = require('./Locales.js');
const _ = require('underscore');

//@PARAMS {data} - The calculated change object { ones: 1, quarters: 2, dimes: 3, ...}
module.exports.formatString = function(data){
	var out = [], order = [];

	//format to text
	for(var obj in data){
		out.push(`${data[obj]} ${obj}`);
	}
	//TODO add custom new line character option
	return out.join(',').toString() + '\n';
};


//@PARAMS owedMaximized (int) - The Amount owed converted to the smallest denomination unit
module.exports.checkModulus = function(owedMaximized){
	return (owedMaximized % 3 === 0);
};

module.exports.calcChange = function(){

	//@PARAMS owedMax(int) - the maximized amount to be converted to change 
	//@PARAMS 'locale' - the desired currency 
	//@PARAMS {result} - initial empty object for the recursion to build upon
	//@PARAMS {callback}
	const _recursiveSearch = function(owedMax, locale, result, callback){
		for(var key in Locales[locale].denominations){
			var obj = Locales[locale].denominations[key]; 
			if(owedMax >= obj.value){
				if(result[key] === undefined){
					result[key] = 1;
				}else{
					result[key]++;
				}
				var remainder = owedMax - obj.value;
				if(remainder > 0){
					_recursiveSearch(remainder, locale, result, callback);	
					break;
				}else{
					callback(result);
					break;
				}
			}else{ 
				continue;	
			}
		}
	};

	const _getRandom = function(low, high){
		return Math.floor(Math.random() * (high - low + 1)) + low; 	
	};


	return{
		//@PARAMS owedMax(int) - the maximized amount to be converted to change 
		//@PARAMs 'locale' - the desired locale
		//@PARAMS {callback}
		standard: function(owedMax, locale, callback){
			_recursiveSearch(owedMax, locale, {}, function(result){
				callback(result);	
			});
		},
			random : function(owedMax, locale, callback){
				//pick a random number of percents 
				var xPercent = 100, distro = [], converted = [], totalConverted = 0;
				//pick a random distribution
				for(var i=0; i <= _getRandom(1, 5); i++){
					if(distro.length - 1 >= 0){
						xPercent = xPercent - distro[distro.length -1];
						distro.push(_getRandom(1, xPercent));			
					}else if(xPercent !== 0){
						distro.push(_getRandom(1, xPercent));
					}
				}
				//add any percentage of 100 that is remaining
				if(xPercent > 0){
					distro.push(xPercent - distro[distro.length - 1] );	
				}
				//convert it to actual amount owed
				for(var i=0; i < distro.length; i++){
					converted.push(Math.floor((distro[i] * 0.01 ) * owedMax));	
					totalConverted = totalConverted + converted[i];
				}
				//substract whatever amount has been rounded out from the largest percent
				if(totalConverted > owedMax){
					//TODO seems like a waste to import all of underscore for this
					var largest = _.max(converted);
					converted[converted.indexOf(largest)] = largest - (totalConverted - owedMax);		
					//add whatever amount has been rounded out to the smallest percent
				}else if(totalConverted < owedMax){
					//TODO seems like a waste to import all of underscore for this
					var smallest = _.min(converted);
					converted[converted.indexOf(smallest)] = smallest + (owedMax - totalConverted);		
				}

				//start the recursion
				var working = [];
				for(var i=0; i<converted.length; i++){
					_recursiveSearch(converted[i], locale, {}, function(result){
						working.push(result);	
					});
				}

				//merge and order the results
				var final = {hundreds: 0, fifties: 0, twenties: 0, tens: 0, fives: 0, ones: 0, quarters: 0, dimes: 0, nickels: 0, pennies: 0 };
				for(var i=0; i<working.length; i++){
					for(var key in working[i]){
							final[key] += working[i][key];	
					}
				}

				//remove unused keys
				for(var key in final){
					if(final[key] === 0) delete final[key];	
				}

				//send it
				callback(final);
			}	
	}	
}();

//@PARAMS owed (float)(required) - The amount owed in the original float format
//@PARAMS 'locale' (required) - The desired locale to use
module.exports.convertToSmallest = function(owed, locale){
	return parseInt(Locales[locale].base * owed);
}


