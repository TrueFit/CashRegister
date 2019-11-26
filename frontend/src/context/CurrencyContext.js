import React from 'react';
const initialState = { paymentCC: 'USD', changeCC: 'USD' };
let reducer = (state, action) => {
  switch (action.type) {
    case 'update_payment_cc':
      return { ...state, paymentCC: action.payload };
    case 'update_change_cc':
      return { ...state, changeCC: action.payload };
    default:
      return { state };
  }
};

const CurrencyContext = React.createContext({});
/*
export const CurrencyProvider = CurrencyContext.Provider;
export const CurrencyConsumer = CurrencyContext.Consumer;
export default CurrencyContext;
*/
function CurrencyContextProvider(props) {
  // [A]
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };

  // [B]
  return (
    <CurrencyContext.Provider value={value}>
      {props.children}
    </CurrencyContext.Provider>
  );
}

let CurrencyContextConsumer = CurrencyContext.Consumer;

// [C]
export { CurrencyContext, CurrencyContextProvider, CurrencyContextConsumer };
