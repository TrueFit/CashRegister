#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const cashRegister = require('./cashRegister');

function run(options) {
  const inputContents = fs.readFileSync(options.input, 'utf-8');
  const output = inputContents.split('\n')
    .filter(row => !!row)
    .map(row => row.split(/,\s*/g))
    .map(([owed, paid]) => cashRegister(owed, paid))
    .join('\n');

  if (options.output) {
    fs.writeFileSync(options.output, output);
  } else {
    console.log(output);
  }
}

program.version('1.0.0')
  .name('CashRegister')
  .requiredOption('-i, --input <path>', 'The path to the input file to be read and processed')
  .option('-o, --output <path>', 'The path to the output file to be written to.  If not specified, will output to the console.');

program.parse(process.argv);
run(program);
