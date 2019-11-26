import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { CurrencyContext } from '../context/CurrencyContext';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
});

// Create USD currency formatter.
var usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
var eurFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
});

function currencyFormatter(country, ammount) {
  console.log('Currency formtatter ' + country + ' ' + ammount);
  if (country === 'EUR') {
    return eurFormatter.format(ammount);
  } else if (country === 'USD') {
    return usdFormatter.format(ammount);
  }
}
// For row in transaction:

export default function ChangeDue(props) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const selectedCurrency = useContext(CurrencyContext);

  function createData(tid, owed, tendered, change_due) {
    let change_string = change_due.join();
    let amt_owed = currencyFormatter(selectedCurrency.change_cc, owed);
    let amt_tendered = currencyFormatter(selectedCurrency.payment_cc, tendered);
    return { tid, amt_owed, amt_tendered, change_string };
  }

  useEffect(() => {
    console.log('ROWS', rows);
  }, [rows]);

  useEffect(() => {
    if (props.changeDue !== undefined && props.changeDue.length < 1) {
      return;
    }
    let updatedRows = [];
    let transactionId = 0;
    props.changeDue.forEach(trans => {
      //updatedRows.push(createData(element[0], element[1], element[2]));
      //console.log(transaction);

      updatedRows.push(
        createData(
          transactionId,
          trans.amt_owed,
          trans.amt_tendered,
          trans.change_due,
        ),
      );
      transactionId++;
    });
    setRows(updatedRows);
  }, [props.changeDue]);

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Amount Owed</TableCell>
            <TableCell>Amount Tendered</TableCell>
            <TableCell align="right">Change Due</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.tid}>
              <TableCell>{row.amt_owed}</TableCell>
              <TableCell>{row.amt_tendered}</TableCell>
              <TableCell align="right">{row.change_string}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
