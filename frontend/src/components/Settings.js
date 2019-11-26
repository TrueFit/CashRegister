import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CurrencySwitcher from './CurrencySwitcher';
import SpecialCases from './SpecialCases';
import ResetButton from './ResetButton';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(5),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
}));

export default function Settings(props) {
  const classes = useStyles();
  if (props.display === false) {
    return <ResetButton />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <SpecialCases />
        </Paper>
        <Paper className={classes.paper}>
          <CurrencySwitcher />
        </Paper>
      </Grid>
    </Grid>
  );
}
