import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CurrencySwitcher from './CurrencySwitcher';
import SpecialCases from './SpecialCases';
import ActionButtons from './ActionButtons';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(5),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
}));

// TODO Organize reset and export buttons next to each other
// TODO - always show reset, make disabled orginally

export default function Settings() {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <SpecialCases />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <CurrencySwitcher />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <ActionButtons />
      </Grid>
    </Grid>
  );
}
