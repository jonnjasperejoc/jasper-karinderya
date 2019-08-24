// Expenses Reducer
const defaultState = {
    orders: [],
    orderTotal: 0
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "ADD_ORDER":
            return {
                ...state,
                orders: [...state.orders, action.order]
            };
        case "GET_ORDERS":
            return {
                ...state,
                orders: action.orders
            };
        case "CREMENT_ORDER":
            const orders = state.orders.map(order => {
                if (order._id === action.id) {
                    order.quantity = action.quantity;
                }
                return order;
            });
            return {
                ...state,
                orders
            };
        case "DELETE_ORDER":
            let _orders = state.orders;
            _orders = _orders.filter(order => {
                if (order._id !== action.id) {
                    return order;
                }
                return undefined;
            });

            return {
                ...state,
                orders: _orders
            };
        default:
            return state;
    }
};
