const assert = require('assert');
const cash = require('../src/CashRegister.js');
const chai = require('chai');
const expect = chai.expect

describe('CashRegister', function(){
	describe('#getChange', function(){
		it('should return Invalid Transaction', function(){
			cash.getChange(10, 0, 'USD', function(d){
				assert.equal(d, 'Invalid Transaction - Someone Robbed the Register');	
			});	
		});
		it('should return Exact Payment - Nothing is Owed', function(){
			cash.getChange(100.01, 100.01, 'USD', function(d){
				assert.equal(d, 'Exact Payment - Nothing is Owed');	
			});	
		});

		it('should return 3 quarters,1 dimes,3 pennies\\n', function(){
			cash.getChange(2.12, 3.00, 'USD', function(d){
				console.log(d);
				assert.equal(d, '3 quarters,1 dimes,3 pennies\n');	
			});	
		});

		it('should return a string', function(){
			cash.getChange(3.33, 5.00, 'USD', function(d){
				console.log(d);
				expect(d).to.be.a('String');
			});	
		});


	});
});
