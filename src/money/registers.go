package money

import (
  "bufio"
  "errors"
  "math/rand"
  "os"
  "regexp"
  "sort"
  "strconv"
  "time"
)


// PRECISION_FACTOR use this to convert float values to/from ints for rounding/truncating
const PRECISION_FACTOR = 100


// A transaction represents money the customer owes for the transaction
// and the amount the customer gave to cover the amountOwed
type Transaction struct {
  amountOwed CurrencyUnit
  amountReceived CurrencyUnit
}


func (t *Transaction) ToString() string {
  return "{amountOwed: " + strconv.Itoa(int(t.amountOwed)) + ", amountReceived: " + strconv.Itoa(int(t.amountReceived)) + "}"
}


// IsEmpty checks to see if both transaction values are zero
func (t *Transaction) IsEmpty() bool {
  return t.amountOwed == 0 && t.amountReceived == 0
}


// GetChangDue calculates the total change due to the customer
func (t *Transaction) GetChangeDue() CurrencyUnit {
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
  InputFile *os.File
  OutputFile *os.File
}


func (r *CreativeCashRegister) initialize() {
  // sort our currency by descending value
  sort.Sort(sort.Reverse(DenominationByValue(r.Currency)))
}


func (r *CreativeCashRegister) GetTransactions() <-chan Transaction {
  out := make(chan Transaction)
  go r.getTransactionsFromFile(out)
  return out
}


func (r *CreativeCashRegister) getTransactionsFromFile(out chan Transaction) {
  reader := bufio.NewReader(r.InputFile)
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

    value1, err := strconv.ParseFloat(values[0], 64)
    if err != nil {
      value1 = 0
    }
    value2, err := strconv.ParseFloat(values[1], 64)
    if err != nil {
      value2 = 0
    }


    t = Transaction{amountOwed: CurrencyUnit(value1 * 100), amountReceived: CurrencyUnit(value2 * 100)}
  }

  return t
}


// GetDenominationsDue determines how to come up with the proper denominations necessary
func (r *CreativeCashRegister) GetDenominationsDue(t Transaction) []DenominationStack {
  moneyStack := []DenominationStack{}
  amountDue := t.GetChangeDue()

  if t.IsEmpty() {
    // pass
  } else if amountDue < 0 {
    moneyStack = append(moneyStack, DenominationStack{quantity: -1, denomination: DenominationType{value: 0, friendlyName: "customer has not paid enough"}})
  } else if amountDue == 0 {
    // if no change is due report that the user needs to give back zero of the
    // smallest denomination we have (r.currency is sorted in descending order)
    moneyStack = append(moneyStack, DenominationStack{quantity: -1, denomination: DenominationType{value: 0, friendlyName: "no change to give"}})
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
func getDenominationsForAmount(currency []DenominationType, amount CurrencyUnit, denominationAlgorithm pickDenominationStack) []DenominationStack {
  validCurrency := currency
  moneyStack := []DenominationStack{}

  // iterate through each type of currency that fits in the amount
  for amount > 0 {
    validCurrency = getValidDenominations(amount, validCurrency)
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
    amount -= CurrencyUnit(newStack.quantity) * newStack.denomination.value
    validCurrency = validCurrency[1:]
  }

  return moneyStack
}


type pickDenominationStack func (amount CurrencyUnit, denomination DenominationType) DenominationStack


// efficientDenominations puts as many of the denomination in as will fit in the amount
func efficientDenominations(amount CurrencyUnit, denomination DenominationType) DenominationStack {
  quantity := amount / denomination.value
  return DenominationStack{quantity: int(quantity), denomination: denomination}
}


// randomDenominations chooses a random quantity for the denomination between zero and the
// highest multiple that will fit in the amount
func randomDenominations(amount CurrencyUnit, denomination DenominationType) DenominationStack {
  rand.Seed(time.Now().Unix())

  maxQuantity := amount / denomination.value
  return DenominationStack{quantity: rand.Intn(int(maxQuantity)), denomination: denomination}
}


// getValidDenominations returns all denominations whose value is less than or equal to amount
// This function assumes that the denominationList is sorted in descending order by denomination value
func getValidDenominations(amount CurrencyUnit, denominationList []DenominationType) []DenominationType {
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
  _, err := r.OutputFile.WriteString(s + "\n")
  if err != nil {
    panic(errors.New("Can't render output.  Aborting."))
  }
}
