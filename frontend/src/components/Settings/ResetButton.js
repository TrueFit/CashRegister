import React from 'react';
import { CurrencyContext } from '../../context/CurrencyContext';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles(theme => ({
  resetBtn: {
    background: 'linear-gradient(45deg, #f56276 30%, #db001e 90%)',
    color: 'black',
    margin: theme.spacing(5),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function ResetButton() {
  const classes = useStyles();
  let { dispatch } = React.useContext(CurrencyContext);
  let reset = () => dispatch({ type: 'reset' });
  return (
    <Fab
      onClick={reset}
      variant="extended"
      color="secondary"
      aria-label="add"
      className={classes.resetBtn}
    >
      <CancelIcon className={classes.extendedIcon} />
      Reset Data
    </Fab>
  );
}
