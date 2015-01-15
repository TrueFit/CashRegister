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


func TestParseFloat32(t *testing.T) {
  in := []string{"3.45", "12465.34432", "testing"}
  want := []float32{float32(3.45), float32(12465.34432), float32(0.0)}

  for i, test := range in {
    got := ParseFloat32(test)
    if got != want[i] {
      t.Errorf("ParseFloat32(%q) == %q, want %q", test, got, want[i])
    }
  }
}
