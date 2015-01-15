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
	if len(os.Args) < 2 || os.Args[1] == "help" {
		fmt.Println(docString)
		return
	}

	transactionsFile := os.Args[1]

	myRegister := money.NewRegister(&money.CreativeCashRegister{Currency: money.USCurrency, InputFileName: transactionsFile})

	incomingTransactions := myRegister.GetTransactions()

	// loop over values received
	for transaction := range incomingTransactions {
		moneyStacks := myRegister.GetDenominationsDue(transaction)
		myRegister.RenderOutput(money.FormatDenominationStacks(moneyStacks))
	}

}
