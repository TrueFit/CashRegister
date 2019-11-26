import React from 'react';
import './App.css';
import { Main } from './layouts/';
import CashRegister from './components/CashRegister';
import { CurrencyContextProvider } from './context/CurrencyContext';

function App() {
  return (
    <div className="App">
      <Main>
        <CurrencyContextProvider>
          <CashRegister />
        </CurrencyContextProvider>
      </Main>
    </div>
  );
}

export default App;
