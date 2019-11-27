import React from 'react';
import Grid from '@material-ui/core/Grid';
import ResetButton from './ResetButton';
import ResultsDownload from './ResultsDownload';
import { CurrencyContext } from '../../context/CurrencyContext';

export default function ActionButtons() {
  let { state } = React.useContext(CurrencyContext);
  if (state.changeDue.length < 1) {
    return null;
  }

  return (
    <Grid container alignContent={'center'} alignItems={'center'} spacing={3}>
      <Grid item xs={6}>
        <ResetButton />
      </Grid>
      <Grid item xs={6}>
        <ResultsDownload />
      </Grid>
    </Grid>
  );
}
