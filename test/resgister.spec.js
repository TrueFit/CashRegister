const assert = require('assert');
const cash = require('../src/CashRegister.js');
const chai = require('chai');
const expect = chai.expect

const values = {
	pennies: 0.01,	
	nickels: 0.05,	
	dimes: 0.1,	
	quarters: 0.25,	
	ones: 1,	
	fives: 5,	
	tens: 10,	
	twenties: 20,	
	fifties: 50,	
	hundreds: 100,	
}; 

describe('CashRegister', function(){
	describe('#getChange', function(){
		it('should work', function(){
			cash.getChange(2.12, 'USD', function(d){
				console.log(d);	
			});
		});	
		it('should work', function(){
			cash.getChange(1.97, 'USD', function(d){
				console.log(d);	
			});
		});	
		it('should not return the same values', function(){
			var return1, return2;
			cash.getChange(3.33, 'USD', function(d){
				return1 = d;
				cash.getChange(3.33, 'USD', function(d){
					return2 = d;
					var hash1 = [] , hash2 = [];
					for(var obj in return1){
						hash1.push(return1[obj]);	
					}
					for(var obj in return2){
						hash2.push(return2[obj]); 	
					}
					hash1.sort();
					hash2.sort();
					assert.notEqual(JSON.stringify(hash1), JSON.stringify(hash2));
				});

			});
		});	

		it('should not be more than $3.33', function(){
			cash.getChange(3.33, 'USD', function(d){
				var total = 0;
				for(var obj in d){
					total += (d[obj] * values[obj]); 
				}
				assert.equal(total.toPrecision(3), 3.33);
			});
		});
	});

});
