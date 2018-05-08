//Locale denominations should be structured as smallest denomination to largest formated with values in the smallest denomination
module.exports = {
	USD : { 
		base: 100, 
		count : 10, //optimization ? maybe just make denominations an Array?
		denominations: {
			0 : {name : 'penny', value : 1, base: 0.01 },
			1 : {name : 'nickel', value : 5, base: 0.05 },
			2 : {name : 'dime', value : 10, base: 0.1 },
			3 : {name : 'quarter', value : 25, base: 0.25 },
			4 : {name : 'one dollars', value : 100, base: 1 },
			5 : {name : 'five dollars', value : 500, base: 5 },
			6 : {name : 'ten dollars', value : 1000, base: 10 },
			7 : {name : 'twenty dollars', value : 2000, base: 20 },
			8 : {name : 'fifty dollars', value : 5000, base: 50 },
			9 : {name : 'one hundred dollars', value : 10000, base : 100 },
		}
	},
		//For Example
		BTC : {
			base: 100000000, //1 BTC = 100,000,000 satoshi
			denominations: {
				0 : { name : 'satoshi', value: 1},
				1 : { name : 'bit', value: 100 },	
				2 : { name : 'mbit', value: 100000 },
				3 : { name : 'cbit', value: 1000000 },	
				4 : { name : 'coin', value: 100000000 },
			}
		}
};
