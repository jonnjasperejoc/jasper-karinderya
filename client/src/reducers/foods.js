// Foods Reducer
const defaultState = {
    originalFoods: [],
    foods: [],
    foodAddedSuccess: false,
    foodQuantity: null
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "GET_FOODS":
            return {
                ...state,
                foods: action.foods,
                originalFoods: action.foods
            };
        case "SEARCH_FOODS":
            let results = state.originalFoods;
            results = results.filter(food => {
                if (food.name.toLowerCase().indexOf(action.keyword.toLowerCase()) >= 0) {
                    return food;
                }
                return undefined;
            });
            return {
                ...state,
                foods: results
            };
        case "FOOD_ADDED_SUCCESS":
            return {
                ...state,
                foods: [...state.foods, action.food],
                originalFoods: [...state.foods, action.food],
                foodAddedSuccess: true
            };
        case "UPDATE_FOOD":
            let results_ = state.originalFoods.map(food => {
                if (food._id === action.food._id) {
                    food.name = action.food.name;
                    food.quantity = action.food.quantity;
                    food.price = action.food.price;
                }
                return food;
            });
            return {
                ...state,
                foods: results_
            };
        case "DELETE_FOOD":
            let _results = state.foods;
            _results = _results.filter(food => {
                if (food._id !== action.id) {
                    return food;
                }
                return undefined;
            });
            return {
                ...state,
                originalFoods: _results,
                foods: _results
            };
        case "CREMENT_FOOD":
            let foodQuantity = null;
            let __results = state.originalFoods.map(food => {
                if (food._id === action.id) {
                    food.quantity = food.quantity - 1;
                    foodQuantity = food.quantity;
                }
                return food;
            });
            return {
                ...state,
                foods: __results,
                foodQuantity
            };
        default:
            return state;
    }
};
