import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { CurrencyContext } from '../context/CurrencyContext';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function SpecialCases() {
  const classes = useStyles();
  let { state, dispatch } = React.useContext(CurrencyContext);

  const handleChange = name => event => {
    dispatch({ type: name, payload: event.target.checked });
  };

  return (
    <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">Special Functions</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.specialFnc.divisibleBy3}
              onChange={handleChange('divisibleBy3')}
              value="randomDivisible3"
            />
          }
          label="Random Change When Amount Due Divisible by 3"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state.specialFnc.excludeFives}
              onChange={handleChange('excludeFives')}
              value="excludeFives"
            />
          }
          label="Exclude 5 Dollars / Euros in Change Returned"
        />
      </FormGroup>
    </FormControl>
  );
}
