const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-middleware');
const compiler = webpack(require('./webpack.config'));
const express = require('express');
const fileUpload = require('express-fileupload');
const processTransactionsList = require('./utils/processTransactionsList');
const quirks = require('./quirks');
const app = express();

// Because we're hosting the client and API inside of the same app, use these two middleware to host the client app
// at the root url in development mode. Webpack-dev-middleware accomplishes what webpack-dev-server would in a normal set up
// and webpack-hot-middleware handles browser reloading. Note our development nodemon command ignores changes in public because
// these middleware handle that for us.
app.use(webpackDevServer(compiler, {
  publicPath: '/'
}));

app.use(require("webpack-hot-middleware")(compiler));

app.use(fileUpload());

// This endpoint expects the text file containing the transaction data.
// For each transaction, it tests the value against each of our 'quirks' and returns the correct
// denominations based on that quirk, ignoring the rest once a condition is met. Note that this means
// the order of quirks matters. If none of the quirks' conditions are meant, we simply return the regular
// change denominations
app.post('/transactionsList', (req, res, next) => {

  if (!req.files || Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const denominationValues = {
    dollars: 1,
    quarters: 0.25,
    dimes: 0.1,
    nickles: 0.05,
    pennies: 0.01
  }

  // Function for calculating change normally (Ideally this code could be broken out into a module)
  function makeChange(transaction) {
    // Do all of our math in terms of pennies to get around how bad JS is at floating point math
    const changeAsPennies = transaction.paid*100-transaction.owed*100;
    let remaining = changeAsPennies;

    // For each denomination, find out how many times it goes into the remain change then 
    // subtract that number times the denomination's value from our total
    let denominations = {
      dollars: 100,
      quarters: 25,
      dimes: 10,
      nickles: 5,
      pennies: 1
    }

    let result = {
      quirkId: null,
      change: changeAsPennies/100,
      denominations: {}
    }

    Object.keys(denominations).map(key => {
      // Calculate how many times this denomination fits into remaining change
      const count = Math.floor(remaining/denominations[key])

      // Store the denomination count and decrement our remaining change
      result.denominations[key] = count;
      remaining -= denominations[key]*count;
    })

    return result;
  }

  // User our processTransactionsList module to part the file in the data asynchronously
  processTransactionsList(req.files.file).then((transactions) => {
    res.json({
      transactions: transactions.map(transaction => {

        // Find the first quirk that this transaction satifies the condition for
        const quirkFound = quirks.find(quirk => quirk.condition(transaction) );

        // If one was found, evaluate with it's callback, if not make change normally
        return quirkFound ? quirkFound.callback(transaction) : makeChange(transaction);
      })
    })
  }, (err) => {
    res.status(400).send(err);
  })

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))