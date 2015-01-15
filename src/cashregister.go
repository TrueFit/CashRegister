package main

import (
	"fmt"
	"os"

	"money"
)

const docString = `
EXAMPLE USAGE: cashregister myTransactionsFile.txt
`

func main() {
  // display the help string if no transactions file is given
	if len(os.Args) < 2 || os.Args[1] == "help" {
		fmt.Println(docString)
		return
	}

  // path to file with transactions in it
	transactionsFile := os.Args[1]

	myRegister := money.NewRegister(&money.CreativeCashRegister{Currency: money.USCurrency, InputFileName: transactionsFile})

	// creates a channel that transactions can be received on
  incomingTransactions := myRegister.GetTransactions()

	// loop over values received until the channel is closed
	for transaction := range incomingTransactions {
    // get the right quantity of each denomination necessary to pay the customer's change
		moneyStacks := myRegister.GetDenominationsDue(transaction)
    // send the string representation of the change returned to the registers output
		myRegister.RenderOutput(money.FormatDenominationStacks(moneyStacks))
	}

}
