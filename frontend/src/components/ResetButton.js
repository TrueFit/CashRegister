import React from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { CurrencyContext } from '../context/CurrencyContext';

export default function ResetButton() {
  let { dispatch } = React.useContext(CurrencyContext);
  let reset = () => dispatch({ type: 'reset' });
  return (
    <Container>
      <Button variant="contained" color="secondary" onClick={reset}>
        Reset
      </Button>
    </Container>
  );
}
