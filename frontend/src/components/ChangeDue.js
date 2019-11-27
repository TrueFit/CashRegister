import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { CurrencyContext } from '../context/CurrencyContext';
import { currencyFormatter } from '../utils/formatters';

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

export default function ChangeDue() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  let { state } = React.useContext(CurrencyContext);

  let createData = (tid, owed, tendered, change_due) => {
    let change_string = change_due.join();
    let amt_owed = currencyFormatter(state.changeCC, owed);
    let amt_tendered = currencyFormatter(state.paymentCC, tendered);
    return { tid, amt_owed, amt_tendered, change_string };
  };

  useEffect(() => {
    if (state.changeDue !== undefined && state.changeDue.length < 1) {
      return;
    }
    // Itterate changeDue context and prepar data to display
    // convert change list to string & format currency to country code
    let updatedRows = [];
    // Created unique ID for List Item Key
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
    // Update local state to re-render dom with update change
    setRows(updatedRows);
  }, [state.changeDue]);

  if (state.loading) {
    return <CircularProgress className={classes.progress} />;
  } else if (state.changeDue.length < 1) {
    return null;
  }
  // Render table with transaction details including the API provided change due
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
