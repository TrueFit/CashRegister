package util

import (
  "strconv"
)


// GetPlural takes a string denoting one object and makes it plural.
// For this application the only deviation from adding an 's' to the end is 'penny'.
func GetPlural(s string) string {
  if string(s[len(s)-1]) == "y" {
    s = s[0:len(s)-1] + "ies"
  } else {
    s = s + "s"
  }

  return s
}


// ParseFloat32 parses a string into a 32-bit float.
// The return value is set to 0.0 if the string cannot be parsed.
func ParseFloat32(s string) float32 {
  value,err := strconv.ParseFloat(s, 32)
  if err != nil {
    value = 0.0
  }

  return float32(value)
}
