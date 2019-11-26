import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Dropzone from './Dropzone';
import ChangeDue from './ChangeDue';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { API_ENDPOINT } from '../config/constants';
import { CurrencyContext } from '../context/CurrencyContext';
import ResultsDownload from './ResultsDownload';
import Settings from './Settings';
import Hero from './Hero';
// TODO Limit to CSV files
// TODO Allow to reset / clear previous CSV files

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
}));

export default function CashRegister() {
  const classes = useStyles();
  const [transactions, setTransactions] = useState([]);
  //const [paymentCountry, setPaymentCountry] = useState('USD');
  //const [changeCountry, setCahngeCountry] = useState('USD');
  let { state, dispatch } = React.useContext(CurrencyContext);

  useEffect(() => {
    // New list of Transactions provideded
    // Send List of transactions to API endpoint to determine change due
    if (transactions.length < 1) {
      return;
    }
    axios
      .post(API_ENDPOINT, {
        transactions: transactions,
        specialFnc: state.specialFnc,
        currency: {
          payment_country: state.paymentCC,
          change_country: state.changeCC,
        },
      })
      .then(function(response) {
        dispatch({ type: 'update_change_due', payload: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }, [transactions]);

  return (
    <div className="cashregister">
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Hero />
          </Grid>
          <Grid item xs={6}>
            <Settings display={!(state.changeDue.length > 0)} />
          </Grid>
        </Grid>
        <Container>
          <ResultsDownload />
          <Container maxWidth="md">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Dropzone setTransactions={setTransactions} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <ChangeDue />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Container>
      </Container>
    </div>
  );
}
