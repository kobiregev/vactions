import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { combineReducers, createStore } from 'redux'
import { LoginReducer } from './loginReducer'
import {VacationsReducer} from './vacationReducer'
import { Provider } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import storage from 'redux-persist/lib/storage'


const presistConfig = {
    key: 'root', storage
}

const reducers = {
    LoginReducer: persistReducer(presistConfig, LoginReducer),
    VacationsReducer
}
let store = createStore(combineReducers(reducers))
let persistor = persistStore(store)

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
