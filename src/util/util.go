package util

import (
  "bytes"
  "encoding/json"
  "errors"
  "io"
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
  f, _ := os.OpenFile(filename, os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0444)
  return f
}

type Config struct {
  InputFile string
  OutputFile string
  LogFile string
}

func GetConfig(configFileName string) Config {
  f, err := os.Open(configFileName)
  if err != nil {
    panic(errors.New("Failed to open configuration file.  Aborting"))
  }

  buf := bytes.NewBuffer(nil)
  io.Copy(buf, f)

  config := Config{}
  errRead := json.Unmarshal(buf.Bytes(), &config)
  if errRead != nil {
    panic(errors.New("Failed to parse configuration file.  Aborting."))
  }

  return config
}
