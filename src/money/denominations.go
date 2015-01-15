package money

import (
  "strconv"
  "strings"

  "util"
)


// DenominationType defines a named value object (like a coin or bill)
type DenominationType struct {
  value float32
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
  quantity uint32 // you can't have negative coins or bills
  denomination DenominationType
}


func (ds *DenominationStack) ToString() string {
  denominationStack := strconv.Itoa(int(ds.quantity)) + " "

  if ds.quantity == 1 {
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
