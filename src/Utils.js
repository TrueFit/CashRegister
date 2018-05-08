const Locales = require('./Locales.js');

module.exports = {
   //@PARAMS owedMaximized (int) - The Amount owed converted to the smallest denomination
	checkModulus : function(owedMaximized){
		return (owedMaximized % 3 === 0);
   },
	calcChange : function(){
	
		return{
			standard: function(){
			
			},
			random : function(){
			
			}	
		}	
	},

   //@Params owed (float)(required) - The amount owed in the original float format
   //@Params 'locale' (required) - The desired locale to use
	convertToSmallest : function(owed, locale){
	   return Locales[locale].base * owed;
	}


};
