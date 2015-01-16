package main

import (
	"fmt"
  "log"
	"os"

	"money"
  "util"
)

const docString = `
Creative Cash Register
This cash register computes the amount and type of currency denominations needed to give a customer their change for a transaction.  Transactions are submitted in batches via a file.  By default the cash register will present the most efficient combination of currency denominations to give to the customer.  If however, the amount due back to the customer is divisible by 3 (by hundredths) then the combination suggested will be random (but still accurate).

USAGE: cashregister <transactionsFile>

transactionsFile should have lines of two numbers representing the amount owed by the customer and the amount the customer gave to cover the amount owed in the format:
  3.45,5.23
  4.56,7.12
  7.89,12.43
  1.67,5.00

It will then output a file with lines corresponding to each line in the transactionsFile like this:
  1 dollar,3 quarters,3 pennies
  2 dollars,2 quarters,1 nickel,1 penny
  4 dollars,2 quarters,4 pennies
  4 quarters,12 dimes,18 nickels,22 pennies
`

func main() {
  // display the help string if no transactions file is given
	if len(os.Args) < 2 || os.Args[1] == "help" {
		fmt.Println(docString)
		return
	}

  config := util.GetConfig("cashregister.config")

  logFile := util.GetLogFile(config.LogFile)
  defer logFile.Close()

  logger := log.New(logFile, "cashregister: ", log.LstdFlags)
  
  fileIn, errIn := os.Open(config.InputFile)
  if errIn != nil {
    // abort if something goes wrong with our file input
    logger.Fatal("Failed to open transaction file.  Aborting.")
  }
  defer fileIn.Close()

  fileOut, errOut := os.OpenFile(config.OutputFile, os.O_WRONLY|os.O_CREATE, 0644)
  if errOut != nil {
    // abort if something goes wrong with our file input
    logger.Fatal("Failed to open output file.  Aborting.")
  }
  defer fileOut.Close()

	myRegister := money.NewRegister(&money.CreativeCashRegister{Currency: money.USCurrency, InputFile: fileIn, OutputFile: fileOut})
  logger.Println("Register initialized.")

	// creates a channel that transactions can be received on
  incomingTransactions := myRegister.GetTransactions()
  logger.Println("Getting transactions.")

	// loop over values received until the channel is closed
	for transaction := range incomingTransactions {
    logger.Println("Received transaction: " + transaction.ToString())
    // get the right quantity of each denomination necessary to pay the customer's change
		moneyStacks := myRegister.GetDenominationsDue(transaction)
    // send the string representation of the change returned to the registers output
		myRegister.RenderOutput(money.FormatDenominationStacks(moneyStacks))
	}
  logger.Println("Reached the end of the transactions.  Exiting now.")

  return
}
