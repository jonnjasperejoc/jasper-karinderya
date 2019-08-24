import axios from 'axios';

// Get all users
export const getUsers = (users) => dispatch => {
    dispatch({
        type: "GET_USERS",
        users
    })
}

// Login User
export const login = ({ email, password }) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Request body
    const body = JSON.stringify({ email, password });

    axios
        .post('/api/auth', body, config)
        .then(res =>
            dispatch({
                type: "LOGIN_SUCCESS",
                user: res.data
            })
        )
        .catch(err => {
            dispatch({
                type: "LOGIN_FAILED",
                data: err.response.data.msg
            })
        });
};

//Signup
export const signup = (data) => dispatch => {
    dispatch({
        type: "SIGN_UP",
        token: data.token,
        user: data.user
    })
};

export const getUser = (id) => dispatch => {
    axios
        .get('/api/users/' + id)
        .then(res =>
            dispatch({
                type: "GET_USER",
                id: res.data.id,
                name: res.data.name,
                userType: res.data.type
            })
        )
        .catch(err =>
            console.log(err.response.data, err.response.status)
        );
}

export const updateUser = (id, type) => dispatch => {
    axios
        .patch('/api/users/' + id, { type })
        .then(res => {
            dispatch({
                type: "UPDATE_USER",
                id,
                userType: type
            })
        })
        .catch(err =>
            console.log(err.response.data, err.response.status)
        );
}

export const checkToken = () => dispatch => {
    dispatch({
        type: "CHECK_TOKEN"
    })
}

export const logout = () => dispatch => {
    dispatch({
        type: "LOGOUT"
    })
}