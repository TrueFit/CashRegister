var fs = require("fs");
var inputFileName = "amounts.txt";
var lines = fs.readFileSync(inputFileName).toString().split('\n');
var currencyDenominations = require("./currencyDenominations.js");
var currencyDenominationsForShuffle = require("./currencyDenominationsShuffle.js");
var amountData = [];

var parseData = function (data) {
  lines.forEach(function (item, index) {
    if (item.length) {
      var segments = item.split(',');
      amountData.push({
        "owed": segments[0],
        "given": segments[1]
      });
    }
  });
};


// this will do the actual computing to return the change
var cashRegister = {
  total: 0,
  change: 0,
  setTotal: function (amount) {
    this.total = amount;
  },
  getPaid: function (amountPaid) {
    if (this.total > amountPaid) {
      console.log("Not enough!");
    } else {
      this.change = (amountPaid - this.total).toFixed(2);

      if (this.change % 3 === 0) {
        var randomDenominations = this.shuffle(currencyDenominationsForShuffle);

        this.printResults(randomDenominations, this.change);
      } else {
        this.printResults(currencyDenominations, this.change);
      }
    }
  },
  howManyCoins: function (coinAmount, totalAmount) {
    var coins = Math.floor(totalAmount / coinAmount);
    return coins;
  },
  shuffle: function (array) {
    var currentIndex = array.length,
      temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },
  printResults: function (data, amountLeft) {
    var results = [];
    data.forEach(function (item) {
      // this is focusing on one coin at a time. This is a pure loop.
      var coins = this.howManyCoins(item.value, amountLeft);
      amountLeft = (amountLeft - (item.value * coins)).toFixed(2);

      if (coins > 0 && coins < 2) {
        results.push(coins + " " + item.type);
      } else if (coins > 0 && item.type === "penny") {
        results.push(coins + " pennies");
      } else if (coins > 0) {
        results.push(coins + " " + item.type + "s");
      }
    }, this);
    console.log(results.toString());
    fs.appendFile('./output.txt', results.toString() + '\n', function(err){
      if(err)
        console.log(err);
    });
  }
};

// This is the actual entry point for the "cash register"
var enterAmounts = function (array) {
  cashRegister.setTotal(array.owed);
  cashRegister.getPaid(array.given);
};
fs.writeFile('./output.txt', '', function(err){if(err) console.log(err);});
parseData(lines);
amountData.forEach(enterAmounts);
