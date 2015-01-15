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


const PRECISION_FACTOR = 100


type Transaction struct {
  amountOwed float32
  amountReceived float32
}


func (t *Transaction) IsEmpty() bool {
  return t.amountOwed == 0.0 && t.amountReceived == 0.0
}


func (t *Transaction) GetChangeDue() float32 {
  return t.amountReceived - t.amountOwed
}


type Register interface {
  initialize()
  GetTransactions() <-chan Transaction
  GetDenominationsDue(t Transaction) []DenominationStack
  RenderOutput(s string)
}


func NewRegister(r Register) Register {
  r.initialize()
  return r
}


// we have infinite amounts of each Denomination in our register
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
    panic(errors.New("Failed to open transaction file.  Aborting."))
  }
  defer fileIn.Close()

  reader := bufio.NewReader(fileIn)
  scanner := bufio.NewScanner(reader)

  scanner.Split(bufio.ScanLines)

  for scanner.Scan() {
    out <- GetTransactionFromLine(scanner.Text())
  }

  close(out)
}

func GetTransactionFromLine(line string) Transaction {
  re := regexp.MustCompile("[0-9]*[.]{1}[0-9]{2}")
  values := re.FindAllString(line, 2)

  var t Transaction
  if len(values) == 2 {
    t.amountOwed = util.ParseFloat32(values[0])
    t.amountReceived = util.ParseFloat32(values[1])
  }

  return t
}


func (r *CreativeCashRegister) GetDenominationsDue(t Transaction) []DenominationStack {
  moneyStack := []DenominationStack{}
  amountDue := t.GetChangeDue()

  if t.IsEmpty() {
    // pass
  } else if amountDue == 0.00 {
    // if no change is due report that the user needs to give back zero of the
    // smallest denomination we have (r.Currency is sorted in descending order)
    moneyStack = append(moneyStack, DenominationStack{Quantity: 0, Denomination: r.Currency[len(r.Currency) - 1]})
  } else if int(t.amountOwed  * 100) % 3 == 0 {
    // if the amount returned to the customer is divisible by 3 pennies
    // give back random change
    moneyStack = getDenominationsForAmount(r.Currency, amountDue, randomDenominations)
  } else {
    moneyStack = getDenominationsForAmount(r.Currency, amountDue, efficientDenominations)
  }

  return moneyStack
}


func getDenominationsForAmount(currency []DenominationType, amount float32, denominationAlgorithm pickDenominationStack) []DenominationStack {
  validCurrency := currency
  moneyStack := []DenominationStack{}

  for i := 0; int(amount * PRECISION_FACTOR) > 0; i++ { // cast to int to deal with float oddities
    validCurrency = getValidDenominations(validCurrency, amount)
    newStack := DenominationStack{}

    if len(validCurrency) > 1 {
      newStack = denominationAlgorithm(amount, validCurrency[0])
    } else {
      newStack = efficientDenominations(amount, validCurrency[0])
    }
    moneyStack = append(moneyStack, newStack)
    amount = amount - float32(newStack.Quantity) * newStack.Denomination.value
    validCurrency = validCurrency[1:]
  }

  return moneyStack
}


type pickDenominationStack func (amount float32, denomination DenominationType) DenominationStack


func efficientDenominations(amount float32, denomination DenominationType) DenominationStack {
  quantity := int(amount * PRECISION_FACTOR) / int(denomination.value * PRECISION_FACTOR)
  return DenominationStack{Quantity: uint32(quantity), Denomination: denomination}
}


func randomDenominations(amount float32, denomination DenominationType) DenominationStack {
  rand.Seed(time.Now().Unix())

  maxQuantity := int(amount * PRECISION_FACTOR) / int(denomination.value * PRECISION_FACTOR) + 1
  return DenominationStack{Quantity: uint32(rand.Intn(maxQuantity - 1) + 1), Denomination: denomination}
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
