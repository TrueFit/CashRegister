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
		it('should work 3000', function(){
			utils.calcChange.standard(3000, 'USD', function(r){
				console.log(r);	
			});
		});
		it('should work 33233', function(){
			utils.calcChange.standard(33233, 'USD', function(r){
				console.log(r);	
			});
		});
		it('should work 10', function(){
			utils.calcChange.standard(10, 'USD', function(r){
				console.log(r);	
			});
		});
		it('should work 2305', function(){
			utils.calcChange.standard(2305, 'USD', function(r){
				console.log(r);	
			});
		});
		it('should work 30000', function(){
			utils.calcChange.standard(30000, 'USD', function(r){
				console.log(r);	
			});
		});
	
	});
});
