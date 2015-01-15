package money


// Assumption: We don't give back anything bigger than a one dollar bill
//   and we don't see 50 cent pieces frequently enough to include them in the
//   change recommendation
var USCurrency = []DenominationType {
  DenominationType{value: 1.00, friendlyName: "dollar"},
  DenominationType{value: .25, friendlyName: "quarter"},
  DenominationType{value: .10, friendlyName: "dime"},
  DenominationType{value: .05, friendlyName: "nickel"},
  DenominationType{value: .01, friendlyName: "penny"},
}
