CC=go
PROJECT_PATH=src/
FILE=cashregister
GOPATH := ${PWD}
export GOPATH

default: run

run:
	$(CC) run $(PROJECT_PATH)$(FILE).go "tests/transactions1.txt"

build: clean
	$(CC) build $(PROJECT_PATH)$(FILE).go

test:
	go test

fmt:
	$(CC) fmt $(PROJECT_PATH)$(FILE).go

.PHONY: clean
clean:
	- rm $(FILE)
