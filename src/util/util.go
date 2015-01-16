package util

import (
  "os"
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


func GetLogFile(filename string) *os.File {
  f, err := os.OpenFile(filename, os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0444)
  if err != nil {
    panic(err)
  }

  return f
}
