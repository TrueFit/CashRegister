package money

import (
  "strconv"
  "strings"

  "util"
)


type CurrencyUnit int


// DenominationType defines a named value object (like a coin or bill)
type DenominationType struct {
  value CurrencyUnit
  friendlyName string
}


// ByValue implements sort.Interface for []DenominationType based on the value field
type DenominationByValue []DenominationType

func (d DenominationByValue) Len() int {
  return len(d)
}
func (d DenominationByValue) Swap(a int, b int) {
  d[a], d[b] = d[b], d[a]
}
func (d DenominationByValue) Less(a int, b int) bool {
  return d[a].value < d[b].value
}


// DenominationStack could be replaced by an array, this way should be marginally
// smaller in memory
type DenominationStack struct {
  quantity int
  denomination DenominationType
}


func (ds *DenominationStack) ToString() string {
  denominationStack := strconv.Itoa(int(ds.quantity)) + " "

  if ds.quantity == -1 { // signifies an exceptional case
    denominationStack = ds.denomination.friendlyName
  } else if ds.quantity == 1 {
    denominationStack += ds.denomination.friendlyName
  } else {
    denominationStack += util.GetPlural(ds.denomination.friendlyName)
  }

  return denominationStack
}


func FormatDenominationStacks(ds []DenominationStack) string {
  var stackDescriptions []string

  for _,stack := range ds {
    stackDescriptions = append(stackDescriptions, stack.ToString())
  }

  return strings.Join(stackDescriptions, ",")
}
