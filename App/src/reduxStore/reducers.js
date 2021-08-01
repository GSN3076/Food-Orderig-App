import { combineReducers } from 'redux';
import {persistReducer,persistStore} from 'redux-persist';
import {  USER_LOGIN,USER_LOGOUT } from "./actions" //Import the actions types constant we defined in our actions
import cartReducer from './cartReducer';
import wishlistReducer from './wishlistReducer';

let userState = { 
        user:null,
    };


    
console.log(userState.user)
const userReducer = (state = userState, action) => {
        switch (action.type) {
        case USER_LOGIN:
            return {...state,user:action.payload};
        case USER_LOGOUT:
            return {...state,user:null};
        default:    
            return state;
        }
};


// Combine all the reducers
const rootReducer = combineReducers({
        userReducer,
        wishlistReducer,
        cartReducer
    });


export default rootReducer;
