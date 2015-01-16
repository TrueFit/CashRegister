package util

import (
  "testing"
)

func TestGetPlural(t *testing.T) {
  in := []string{"dollar", "quarter", "dime", "nickel", "penny"}
  want := []string{"dollars", "quarters", "dimes", "nickels", "pennies"}

  for i, test := range in {
    got := GetPlural(test)
    if got != want[i] {
      t.Errorf("GetPlural(%q) == %q, want %q", test, got, want[i])
    }
  }
}
