"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var populateAmounts = function populateAmounts() {
    /*\ 
     * FETCH DATA
      *  - grab cash register JSON data
      *  - fire showAmounts() with data.register param
     \*/
    fetch('data.json', {
      headers: {
        Accept: 'application/json'
      }
    }).then(function (results) {
      return results.json();
    }).then(function (data) {
      showAmounts(data.register);
    }); // end fetch()

    /*\ 
     * SHOWAMOUNTS()
     * 	- fire function to loop over all amounts to calculate & display each denomination
     *  - push values to array and generage list items for each array item
    \*/

    var showAmounts = function showAmounts(amounts) {
      var finals = [];
      amounts.forEach(function (v) {
        var remainingAmount = '',
            change = parseFloat(v.amountOwed - v.amountPaid).toFixed(2).split('-')[1];
        var dollarCount = (change / 1.00).toString().split('.')[0];
        remainingAmount = (change - dollarCount).toFixed(2);
        var quarterCount = (remainingAmount / .25).toString().split('.')[0];
        remainingAmount = (remainingAmount - quarterCount * .25).toFixed(2);
        var remainder = parseFloat(v.amountOwed % 3).toString().split('.')[0],
            nickelCount = '',
            dimeCount = '';

        if (remainder == 0) {
          nickelCount = (remainingAmount / .05).toString().split('.')[0];
          remainingAmount = (remainingAmount - nickelCount * .05).toFixed(2);
        } else {
          dimeCount = (remainingAmount / .10).toString().split('.')[0];
          remainingAmount = (remainingAmount - dimeCount * .10).toFixed(2);
        }

        var pennyCount = (remainingAmount / .01).toString().split('.')[0];
        finals.push({
          dollars: dollarCount,
          quarters: quarterCount,
          dimes: dimeCount,
          nickels: nickelCount,
          pennies: pennyCount
        });
      }); // end forEach() amounts

      var output = '<ul>',
          text = document.querySelector('#all-amounts');
      finals.forEach(function (allAmounts) {
        output += '<li>' + '<p>' + allAmounts.dollars + '</p>' + (allAmounts.dollars == 0 || allAmounts.dollars > 1 ? ' dollars, ' : ' dollar, ') + '<p>' + allAmounts.quarters + '</p>' + (allAmounts.quarters == 0 || allAmounts.quarters > 1 ? ' quarters, ' : ' quarter, ') + (allAmounts.dimes ? '<p>' + allAmounts.dimes + '</p>' + (allAmounts.dimes == 0 || allAmounts.dimes > 1 ? ' dimes, ' : ' dime, ') : '') + (allAmounts.nickels ? '<p>' + allAmounts.nickels + '</p>' + (allAmounts.nickels == 0 || allAmounts.nickels > 1 ? ' nickels, ' : ' nickel, ') : '') + '<p>' + allAmounts.pennies + '</p>' + (allAmounts.pennies == 0 || allAmounts.pennies > 1 ? ' pennies' : ' penny') + '</li>';
      }); // end forEach() finals

      output += '</ul>';
      text.innerHTML = output;
    }; // end showAmounts()

  }; // end populateAmounts()

  /*\
   * INIT
   * - fire populateAmounts()
  \*/


  var init = function init() {
    populateAmounts();
  };

  init();
});