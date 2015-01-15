package money

import (
  "fmt"
  "testing"
)

var TestCurrency = []DenominationType {
  DenominationType{value: 1.00, friendlyName: "dollar"},
  DenominationType{value: .25, friendlyName: "quarter"},
  DenominationType{value: .10, friendlyName: "dime"},
  DenominationType{value: .05, friendlyName: "nickel"},
  DenominationType{value: .01, friendlyName: "penny"},
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
func TestPickDenominationStack(t *testing.T) {
  denominations := TestCurrency
  amounts := []float32{2.0, .2, .32, 0.0, .42}
  want := []DenominationStack{{quantity: 2, denomination: TestCurrency[0]},
    {quantity: 0, denomination: TestCurrency[1]},
    {quantity: 3, denomination: TestCurrency[2]},
    {quantity: 0, denomination: TestCurrency[3]},
    {quantity: 42, denomination: TestCurrency[4]}}

  for i, amount := range amounts {
    gotRandom := randomDenominations(amount, denominations[i])
    gotTotal := float32(gotRandom.quantity) * gotRandom.denomination.value
    wantTotal := float32(want[i].quantity) * want[i].denomination.value
    if int(gotTotal * PRECISION_FACTOR) > int(wantTotal * PRECISION_FACTOR) {
      t.Errorf("randomDenominations(%q, %q) total amount %q, want %q", amount, denominations[i], gotTotal, wantTotal)
    }

    gotEfficient := efficientDenominations(amount, denominations[i])
    gotTotal = float32(gotEfficient.quantity) * gotEfficient.denomination.value
    wantTotal = float32(want[i].quantity) * want[i].denomination.value
    if int(gotTotal * PRECISION_FACTOR) > int(wantTotal * PRECISION_FACTOR) {
      t.Errorf("efficientDenominations(%q, %q) total amount %q, want %q", amount, denominations[i], gotTotal, wantTotal)
    }
  }
}


// make sure we never use a denomination that won't fit in the amount
func TestGetValidDenominations(t *testing.T) {
  in := TestCurrency
  amounts := []float32{2.0, .2, 0.0}
  want := [3][]DenominationType{TestCurrency, TestCurrency[2:], []DenominationType{}}

  for i, amount := range amounts {
    got := getValidDenominations(in, amount)
    if fmt.Sprintf("%v", got) != fmt.Sprintf("%v", want[i]) {
      t.Errorf("getValidDenominations(%q, %q) == %q, want %q", in, amount, got, want[i])
    }
  }
}
