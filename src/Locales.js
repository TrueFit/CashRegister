//Locale denominations should be structured as largest denomination to smallest formated with values in the smallest denomination
module.exports = {
	USD : { 
		base: 100, 
		denominations: {
			10000 : {name : 'one hundred dollars', value : 10000, base : 100 },
			5000 : {name : 'fifty dollars', value : 5000, base: 50 },
			2000 : {name : 'twenty dollars', value : 2000, base: 20 },
			1000 : {name : 'ten dollars', value : 1000, base: 10 },
			500 : {name : 'five dollars', value : 500, base: 5 },
			100 : {name : 'one dollars', value : 100, base: 1 },
			25 : {name : 'quarter', value : 25, base: 0.25 },
			10 : {name : 'dime', value : 10, base: 0.1 },
			5 : {name : 'nickel', value : 5, base: 0.05 },
			1 : {name : 'penny', value : 1, base: 0.01 },
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
