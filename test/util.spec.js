const assert = require('assert');
const utils = require('../src/Utils.js');
const chai = require('chai');
const expect = chai.expect


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
	
	});
});
