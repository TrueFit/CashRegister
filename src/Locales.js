//Locale denominations should be structured as largest denomination to smallest formated with values in the smallest denomination
module.exports = {
	USD : { 
		base: 100, 
		denominations: {
			hundreds : {value : 10000 },
			fifties : {value : 5000 },
			twenties : {value : 2000 },
			tens : { value : 1000 },
			fives : { value : 500 },
			ones : {value : 100},
			quarters : { value : 25 },
			dimes : { value : 10},
			nickels : {value : 5 },
			pennies : {value : 1 },
		}
	},
//For Example
//		BTC : {
//			base: 100000000, //1 BTC = 100,000,000 satoshi
//			denominations: {
//				0 : { name : 'satoshi', value: 1},
//				1 : { name : 'bit', value: 100 },	
//				2 : { name : 'mbit', value: 100000 },
//				3 : { name : 'cbit', value: 1000000 },	
//				4 : { name : 'coin', value: 100000000 },
//			}
//		}
};
