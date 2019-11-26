import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import EuroIcon from '@material-ui/icons/Euro';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CurrencyContext } from '../context/CurrencyContext';

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
});

export default function CurrancySwitcher(props) {
  const classes = useStyles();
  let { state, dispatch } = React.useContext(CurrencyContext);

  let setPaymentCurrency = cc => () =>
    dispatch({ type: 'update_payment_cc', payload: cc });
  let setChangeCurrency = cc => () =>
    dispatch({ type: 'update_change_cc', payload: cc });
  return (
    <div className={classes.heroButtons}>
      <Grid container spacing={2} justify="center">
        <Grid item>
          <Typography variant="h6" gutterBottom>
            Payment Currency
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={setPaymentCurrency('USD')}
            variant={state.paymentCC == 'USD' ? 'contained' : 'outline'}
            color={state.paymentCC == 'USD' ? 'primary' : 'default'}
          >
            <AttachMoneyIcon /> USD
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={setPaymentCurrency('EUR')}
            color={state.paymentCC == 'EUR' ? 'primary' : 'default'}
            variant={state.paymentCC == 'EUR' ? 'contained' : 'outline'}
          >
            <EuroIcon />
            Euro
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} justify="center">
        <Grid item>
          <Typography variant="h6" gutterBottom>
            Change Currency
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={setChangeCurrency('USD')}
            variant={state.changeCC == 'USD' ? 'contained' : 'outline'}
            color={state.changeCC == 'USD' ? 'primary' : 'default'}
          >
            <AttachMoneyIcon /> USD
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={setChangeCurrency('EUR')}
            variant={state.changeCC == 'EUR' ? 'contained' : 'outline'}
            color={state.changeCC == 'EUR' ? 'primary' : 'default'}
          >
            <EuroIcon />
            Euro
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
