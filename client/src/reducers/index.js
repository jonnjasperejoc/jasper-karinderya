import { combineReducers } from 'redux';
import foodReducer from "../reducers/foods";
import userReducer from "../reducers/user";
import orderReducer from "../reducers/orders";

export default combineReducers({
    food: foodReducer,
    user: userReducer,
    order: orderReducer
});