import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Dropzone from './Dropzone';
import ChangeDue from './ChangeDue';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { API_ENDPOINT } from '../config/settings';
import { CurrencyContext } from '../context/CurrencyContext';
import Settings from './Settings';
import Hero from './Hero';

export default function CashRegister() {
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
    dispatch({ type: 'update_loading' });
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
        dispatch({ type: 'update_loading' });
      })
      .catch(function(error) {
        console.log(error);
      });
  }, [transactions]);

  return (
    <div className="cashregister">
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Hero />
          </Grid>
          <Grid item xs={12}>
            <Settings />
          </Grid>
        </Grid>
        <Container>
          <Container maxWidth="md">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper>
                  <Dropzone setTransactions={setTransactions} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper>
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
