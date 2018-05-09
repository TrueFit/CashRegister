const assert = require('assert');
const utils = require('../src/Utils.js');
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


describe('Util', function(){
	describe('#checkModulus', function(){
		it('should return true when divisible by 3', function(){
			assert.equal(utils.checkModulus(333), true);
		});
		it('should return false when not divisible by 3', function(){
			assert.equal(utils.checkModulus(332), false);
		});

	});

	describe('#covertToSmallest', function(){
		it('should return an integer from a float', function(){
			expect(utils.convertToSmallest(2.22, 'USD')).to.be.a('number');	
		})
		it('should return an integer from a string', function(){
			expect(utils.convertToSmallest('2.22', 'USD')).to.be.a('number');	
		})
		it('should return 333 from 3.33 with locale set to USD', function(){
			assert.equal(utils.convertToSmallest(3.33, 'USD'), 333);
		})
	});

	describe('#calcChange.standard', function(){
		it('$30 should return 1 twenty and 1 ten', function(){
			utils.calcChange.standard(3000, 'USD', function(r){
				assert.equal(r.pennies, undefined);
				assert.equal(r.nickels, undefined);
				assert.equal(r.dimes, undefined);
				assert.equal(r.quarters, undefined);
				assert.equal(r.ones, undefined);
				assert.equal(r.fives, undefined);
				assert.equal(r.tens, 1);
				assert.equal(r.twenties, 1);
				assert.equal(r.fifties, undefined);
				assert.equal(r.hundreds, undefined);

			});
		});
		it('$332.33 should return 3 hundreds, 1 twenty, 1 ten,  2 dollars, 1 quarter, 1 nickel, and 3 pennies', function(){
			utils.calcChange.standard(33233, 'USD', function(r){
				assert.equal(r.pennies, 3);
				assert.equal(r.nickels, 1);
				assert.equal(r.dimes, undefined);
				assert.equal(r.quarters, 1);
				assert.equal(r.ones, 2);
				assert.equal(r.fives, undefined);
				assert.equal(r.tens, 1);
				assert.equal(r.twenties, 1);
				assert.equal(r.fifties, undefined);
				assert.equal(r.hundreds, 3);
			});
		});
		it('$0.10 should return 1 dime', function(){
			utils.calcChange.standard(10, 'USD', function(r){
				assert.equal(r.pennies, undefined);
				assert.equal(r.nickels, undefined);
				assert.equal(r.dimes, 1);
				assert.equal(r.quarters, undefined);
				assert.equal(r.ones, undefined);
				assert.equal(r.fives, undefined);
				assert.equal(r.tens, undefined);
				assert.equal(r.twenties, undefined);
				assert.equal(r.fifties, undefined);
				assert.equal(r.hundreds, undefined);
			});
		});
		it('$23.05 should return 1 twenty, 3 ones, 1 nickel', function(){
			utils.calcChange.standard(2305, 'USD', function(r){
				assert.equal(r.pennies, undefined);
				assert.equal(r.nickels, 1);
				assert.equal(r.dimes, undefined);
				assert.equal(r.quarters, undefined);
				assert.equal(r.ones, 3);
				assert.equal(r.fives, undefined);
				assert.equal(r.tens, undefined);
				assert.equal(r.twenties, 1);
				assert.equal(r.fifties, undefined);
				assert.equal(r.hundreds, undefined);
			});
		});

		describe('#calcChange.random', function(){

			it('should not return the same values', function(){
				var return1, return2;
				utils.calcChange.random(168, 'USD', function(d){
					return1 = d;
					utils.calcChange.random(168,'USD', function(d){
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

			it('should not be more or less than $3.33', function(){
				utils.calcChange.random(168, 'USD', function(d){
					var total = 0;
					for(var obj in d){
						total += (d[obj] * values[obj]); 
					}
					assert.equal(total.toPrecision(3), 1.68);
				});
			});



			//TODO make these tests actual assertions
			it('should work', function(){
				utils.calcChange.random(333, 'USD', function(r){
					console.log(r);	
				});	
			});	
			it('should work', function(){
				utils.calcChange.random(3, 'USD', function(r){
					console.log(r);	
				});	
			});	
			it('should work', function(){
				utils.calcChange.random(6, 'USD', function(r){
					console.log(r);	
				});	
			});	
			it('should work', function(){
				utils.calcChange.random(9, 'USD', function(r){
					console.log(r);	
				});	
			});	
			it('should work', function(){
				utils.calcChange.random(12, 'USD', function(r){
					console.log(r);	
				});	
			});	
			it('should work', function(){
				utils.calcChange.random(3, 'USD', function(r){
					console.log(r);	
				});	
			});	


		});

	});

});
