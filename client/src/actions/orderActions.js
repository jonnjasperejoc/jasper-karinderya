//import axios from 'axios';

export const getOrders = (orders) => dispatch => {
    dispatch({
        type: "GET_ORDERS",
        orders: orders
    })
};

export const crementOrder = (id, quantity) => dispatch => {
    dispatch({
        type: "CREMENT_ORDER",
        id,
        quantity
    })
};

export const addOrder = (order) => dispatch => {
    dispatch({
        type: "ADD_ORDER",
        order
    })
};

export const deleteOrder = (id) => dispatch => {
    dispatch({
        type: "DELETE_ORDER",
        id
    })
};
