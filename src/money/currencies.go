package money


// We don't give back anything bigger than a one dollar bill and we don't see
// 50 cent pieces frequently enough to include them in the change recommendation
var USCurrency = []DenominationType {
  DenominationType{value: 100, friendlyName: "dollar"},
  DenominationType{value: 25, friendlyName: "quarter"},
  DenominationType{value: 10, friendlyName: "dime"},
  DenominationType{value: 5, friendlyName: "nickel"},
  DenominationType{value: 1, friendlyName: "penny"},
}
