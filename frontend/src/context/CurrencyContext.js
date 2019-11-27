import React from 'react';
const initialState = {
  changeDue: [],
  loading: false,
  paymentCC: 'USD',
  changeCC: 'USD',
  specialFnc: {
    divisibleBy3: true,
    excludeFives: false,
  },
};
let reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'update_change_due':
      return { ...state, changeDue: action.payload };
    case 'update_loading':
      return { ...state, loading: !state.loading };
    case 'update_payment_cc':
      return { ...state, paymentCC: action.payload };
    case 'update_change_cc':
      return { ...state, changeCC: action.payload };
    case 'divisibleBy3':
      return {
        ...state,
        specialFnc: { ...state.specialFnc, divisibleBy3: action.payload },
      };
    case 'excludeFives':
      return {
        ...state,
        specialFnc: { ...state.specialFnc, excludeFives: action.payload },
      };
    default:
      return { state };
  }
};

const CurrencyContext = React.createContext({});

function CurrencyContextProvider(props) {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };

  return (
    <CurrencyContext.Provider value={value}>
      {props.children}
    </CurrencyContext.Provider>
  );
}

let CurrencyContextConsumer = CurrencyContext.Consumer;

export { CurrencyContext, CurrencyContextProvider, CurrencyContextConsumer };
