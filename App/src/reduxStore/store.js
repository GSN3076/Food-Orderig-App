import { createStore, applyMiddleware } from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
  };

// Connect our store to the reducers
export const persistedReducer = persistReducer(persistConfig,rootReducer) 
export const store =  createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
