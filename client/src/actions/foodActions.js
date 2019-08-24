import axios from 'axios';

export const getFoods = owner => dispatch => {
    axios
        .get('/api/foods')
        .then(res => {
            dispatch({
                type: "GET_FOODS",
                foods: res.data
            })
        })
        .catch(err =>
            console.log(err.response.data, err.response.status)
        )
};

export const searchFoods = keyword => dispatch => {
    dispatch({
        type: "SEARCH_FOODS",
        keyword
    })
};

export const addFood = food => dispatch => {

    const formData = new FormData();
    formData.append('image', food.image);
    formData.append('name', food.name);
    formData.append('quantity', food.quantity);
    formData.append('price', food.price);
    formData.append('owner', food.owner);

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    axios
        .post('/api/foods', formData, config)
        .then(res =>
            dispatch({
                type: "FOOD_ADDED_SUCCESS",
                food: res.data
            })
        )
        .catch(err =>
            console.log(err.response.data, err.response.status)
        );
}

export const updateFood = food => dispatch => {

    const formData = new FormData();
    formData.append('image', food.image);
    formData.append('name', food.name);
    formData.append('quantity', food.quantity);
    formData.append('price', food.price);
    formData.append('owner', food.owner);

    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    axios
        .patch('/api/foods/' + food.id, formData, config)
        .then(res =>
            dispatch({
                type: "UPDATE_FOOD",
                food: res.data
            })
        )
        .catch(err =>
            console.log(err.response.data, err.response.status)
        )
}

export const deleteFood = id => dispatch => {
    axios
        .delete('/api/foods/' + id)
        .then(res =>
            dispatch({
                type: "DELETE_FOOD",
                id
            })
        )
        .catch(err =>
            console.log(err.response.data, err.response.status)
        );
};

export const crementFood = (id) => dispatch => {
    axios
        .post('/api/foods/' + id)
        .then(res => {
            dispatch({
                type: "CREMENT_FOOD",
                id
            })
        })
        .catch(err =>
            console.log(err.response.data, err.response.status)
        );
};