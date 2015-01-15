package money

import (
  "bufio"
  "errors"
  "fmt"
  "math/rand"
  "os"
  "regexp"
  "sort"
  "time"

  "util"
)


// PRECISION_FACTOR use this to convert float values to/from ints for rounding/truncating
const PRECISION_FACTOR = 100


// A transaction represents money the customer owes for the transaction
// and the amount the customer gave to cover the amountOwed
type Transaction struct {
  amountOwed float32
  amountReceived float32
}


// IsEmpty checks to see if both transaction values are zero
func (t *Transaction) IsEmpty() bool {
  return t.amountOwed == 0.0 && t.amountReceived == 0.0
}


// GetChangDue calculates the total change due to the customer
func (t *Transaction) GetChangeDue() float32 {
  return t.amountReceived - t.amountOwed
}


// Register defines functions a register needs to possess
type Register interface {
  initialize()
  GetTransactions() <-chan Transaction
  GetDenominationsDue(t Transaction) []DenominationStack
  RenderOutput(s string)
}

// NewRegister initializes a struct that implements Register
func NewRegister(r Register) Register {
  r.initialize()
  return r
}


// CreativeCashRegister shows denominations necessary to give back change
type CreativeCashRegister struct {
  Currency []DenominationType
  InputFileName string
}


func (r *CreativeCashRegister) initialize() {
  // sort our currency by descending value
  sort.Sort(sort.Reverse(DenominationByValue(r.Currency)))
}


func (r *CreativeCashRegister) GetTransactions() <-chan Transaction {
  out := make(chan Transaction)
  go getTransactionsFromFile(r.InputFileName, out)
  return out
}


func getTransactionsFromFile(fileName string, out chan Transaction) {
  fileIn, err := os.Open(fileName)
  if err != nil {
    // abort if something goes wrong with our file input
    panic(errors.New("Failed to open transaction file.  Aborting."))
  }
  defer fileIn.Close()

  reader := bufio.NewReader(fileIn)
  scanner := bufio.NewScanner(reader)

  scanner.Split(bufio.ScanLines)

  for scanner.Scan() {
    out <- getTransactionFromLine(scanner.Text())
  }

  close(out)
}


// getTransactionFromLine uses regular expressions to get the two transaction
// values from a line in the file, this allows the file to be a little messy
// or change delimiters and still allow the application to get the information it needs
func getTransactionFromLine(line string) Transaction {
  re := regexp.MustCompile("[0-9]*[.]{1}[0-9]{2}")
  values := re.FindAllString(line, 2)

  var t Transaction
  if len(values) == 2 {
    t.amountOwed = util.ParseFloat32(values[0])
    t.amountReceived = util.ParseFloat32(values[1])
  }

  return t
}


// GetDenominationsDue determines how to come up with the proper denominations necessary
func (r *CreativeCashRegister) GetDenominationsDue(t Transaction) []DenominationStack {
  moneyStack := []DenominationStack{}
  amountDue := t.GetChangeDue()

  if t.IsEmpty() {
    // pass
  } else if amountDue == 0.00 {
    // if no change is due report that the user needs to give back zero of the
    // smallest denomination we have (r.Currency is sorted in descending order)
    moneyStack = append(moneyStack, DenominationStack{quantity: 0, denomination: r.Currency[len(r.Currency) - 1]})
  } else if int(amountDue  * 100) % 3 == 0 {
    // if the amount returned to the customer is divisible by 3 pennies
    // give back random change
    moneyStack = getDenominationsForAmount(r.Currency, amountDue, randomDenominations)
  } else {
    moneyStack = getDenominationsForAmount(r.Currency, amountDue, efficientDenominations)
  }

  return moneyStack
}


// getDenominationsForAmount iterates through all available denominations until the amount is reduced to zero
func getDenominationsForAmount(currency []DenominationType, amount float32, denominationAlgorithm pickDenominationStack) []DenominationStack {
  validCurrency := currency
  moneyStack := []DenominationStack{}

  // iterate through each
  for int(amount * PRECISION_FACTOR) > 0 { // cast to int to deal with float oddities
    validCurrency = getValidDenominations(validCurrency, amount)
    newStack := DenominationStack{}

    // currency is sorted in descending order by value so if we are at our lowest currency
    // we have to fill in the rest of the amount with it
    if len(validCurrency) > 1 {
      newStack = denominationAlgorithm(amount, validCurrency[0])
    } else {
      newStack = efficientDenominations(amount, validCurrency[0])
    }

    // this covers if a random algorithm returns zero quantity denomination
    if newStack.quantity > 0 {
      moneyStack = append(moneyStack, newStack)
    }

    // update our values
    amount -= float32(newStack.quantity) * newStack.denomination.value
    validCurrency = validCurrency[1:]
  }

  return moneyStack
}


type pickDenominationStack func (amount float32, denomination DenominationType) DenominationStack


// efficientDenominations puts as many of the denomination in as will fit in the amount
func efficientDenominations(amount float32, denomination DenominationType) DenominationStack {
  quantity := int(amount * PRECISION_FACTOR) / int(denomination.value * PRECISION_FACTOR)
  return DenominationStack{quantity: uint32(quantity), denomination: denomination}
}


// randomDenominations chooses a random quantity for the denomination between zero and the
// highest multiple that will fit in the amount
func randomDenominations(amount float32, denomination DenominationType) DenominationStack {
  rand.Seed(time.Now().Unix())

  maxQuantity := int(amount * PRECISION_FACTOR) / int(denomination.value * PRECISION_FACTOR) + 1
  return DenominationStack{quantity: uint32(rand.Intn(maxQuantity)), denomination: denomination}
}


// getValidDenominations returns all denominations whose value is less than or equal to amount
// This function assumes that the denominationList is sorted in descending order by denomination value
func getValidDenominations(denominationList []DenominationType, amount float32) []DenominationType {
  var validDenominations []DenominationType

  for i, denomination := range denominationList {
    if (denomination.value <= amount) {
      validDenominations = denominationList[i:]
      break
    }
  }

  return validDenominations
}


func (r *CreativeCashRegister) RenderOutput(s string) {
  fmt.Println(s)
}
