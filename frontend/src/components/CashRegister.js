import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Dropzone from './Dropzone';
import ChangeDue from './ChangeDue';
import CurrancySwitcher from './CurrancySwitcher';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { API_ENDPOINT } from '../config/constants';
import { CurrencyContext } from '../context/CurrencyContext';
// TODO Limit to CSV files
// TODO Allow to reset / clear previous CSV files

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function Hero() {
  const classes = useStyles();
  return (
    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Cash Register
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Something short and leading about the collection below—its contents,
          the creator, etc. Make it short and sweet, but not too short so folks
          don&apos;t simply skip over it entirely.
        </Typography>
        <CurrancySwitcher />
      </Container>
    </div>
  );
}

export default function CashRegister() {
  const classes = useStyles();
  const [transactions, setTransactions] = useState([]);
  const [changeDue, setChangeDue] = useState([]);
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
        currency: {
          payment_country: state.paymentCC,
          change_country: state.changeCC,
        },
      })
      .then(function(response) {
        setChangeDue(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
    // TODO Call API to Get Change!
  }, [transactions]);

  return (
    <div className="cashregister">
      <Hero />
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Dropzone setTransactions={setTransactions} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <ChangeDue changeDue={changeDue} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
