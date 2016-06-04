import "babel-polyfill";
import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {createStore} from "redux";
import change from "./reducers/change";
import App from "./components/App";

const store = createStore(change, window.devToolsExtension ? window.devToolsExtension() : undefined);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('cashRegister')
)

