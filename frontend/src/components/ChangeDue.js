import React, { useState, useEffect } from 'react';
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
  head: {
    fontWeight: '700',
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
  if (country === 'EUR') {
    return eurFormatter.format(ammount / 100);
  } else if (country === 'USD') {
    return usdFormatter.format(ammount / 100);
  }
}

export default function ChangeDue() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  let { state } = React.useContext(CurrencyContext);

  function createData(tid, owed, tendered, change_due) {
    let change_string = change_due.join();
    let amt_owed = currencyFormatter(state.changeCC, owed);
    let amt_tendered = currencyFormatter(state.paymentCC, tendered);
    return { tid, amt_owed, amt_tendered, change_string };
  }

  useEffect(() => {
    if (state.changeDue !== undefined && state.changeDue.length < 1) {
      return;
    }
    let updatedRows = [];
    let transactionId = 0;
    state.changeDue.forEach(trans => {
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
  }, [state.changeDue]);

  if (state.changeDue.length < 1) {
    return null;
  }
  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.head}>Amount Owed</TableCell>
            <TableCell className={classes.head}>Amount Tendered</TableCell>
            <TableCell className={classes.head} align="right">
              Change Due
            </TableCell>
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
