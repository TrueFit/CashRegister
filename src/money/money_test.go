package money

import (
  "fmt"
  "testing"
)

var TestCurrency = []DenominationType {
  DenominationType{value: 100, friendlyName: "dollar"},
  DenominationType{value: 25, friendlyName: "quarter"},
  DenominationType{value: 10, friendlyName: "dime"},
  DenominationType{value: 5, friendlyName: "nickel"},
  DenominationType{value: 1, friendlyName: "penny"},
}


// check output string sent to user
func TestFormatDenominationStacks(t *testing.T) {
  in := []DenominationStack{{quantity: 4, denomination: TestCurrency[0]},
    {quantity: 5, denomination: TestCurrency[1]},
    {quantity: 6, denomination: TestCurrency[2]}}
  want := "4 dollars,5 quarters,6 dimes"

  got := FormatDenominationStacks(in)
  if got != want {
    t.Errorf("FormatDenominationStacks(%q) == %q, want %q", in, got, want)
  }
}


// make sure denomination amounts are never greater than the amount left
// this is a private package function and upstream should never allow for
// denomination values greater than the amount
func TestPickDenominationStack(t *testing.T) {
  denominations := TestCurrency
  amounts := []CurrencyUnit{200, 25, 32, 5000, 42}
  want := []DenominationStack{{quantity: 2, denomination: TestCurrency[0]},
    {quantity: 1, denomination: TestCurrency[1]},
    {quantity: 3, denomination: TestCurrency[2]},
    {quantity: 1000, denomination: TestCurrency[3]},
    {quantity: 42, denomination: TestCurrency[4]}}

  for i, amount := range amounts {
    gotRandom := randomDenominations(amount, denominations[i])
    gotTotal := gotRandom.quantity * int(gotRandom.denomination.value)
    wantTotal := want[i].quantity * int(want[i].denomination.value)
    if gotTotal > wantTotal {
      t.Errorf("randomDenominations(%q, %q) total amount %q, want %q", amount, denominations[i], gotTotal, wantTotal)
    }

    gotEfficient := efficientDenominations(amount, denominations[i])
    gotTotal = gotEfficient.quantity * int(gotEfficient.denomination.value)
    wantTotal = want[i].quantity * int(want[i].denomination.value)
    if gotTotal > wantTotal {
      t.Errorf("efficientDenominations(%q, %q) total amount %q, want %q", amount, denominations[i], gotTotal, wantTotal)
    }
  }
}


// make sure we never use a denomination that won't fit in the amount
// this is a private method and upstream should never allow amounts <= 0
func TestGetValidDenominations(t *testing.T) {
  in := TestCurrency
  amounts := []CurrencyUnit{200, 20, 0}
  want := [3][]DenominationType{TestCurrency, TestCurrency[2:], []DenominationType{}}

  for i, amount := range amounts {
    got := getValidDenominations(amount, in)
    if fmt.Sprintf("%v", got) != fmt.Sprintf("%v", want[i]) {
      t.Errorf("getValidDenominations(%q, %q) == %q, want %q", in, amount, got, want[i])
    }
  }
}
