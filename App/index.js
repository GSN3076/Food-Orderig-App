/**
 * @format
 */
import React from "react"
import {Alert, AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


import { PersistGate } from 'redux-persist/integration/react'
import { persistor,store } from './src/reduxStore/store';
import { Provider } from 'react-redux';



const MainApp = () => (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
        </PersistGate>
    </Provider>
)

AppRegistry.registerComponent(appName, () => MainApp);
