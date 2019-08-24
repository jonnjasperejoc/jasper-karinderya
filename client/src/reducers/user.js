// User Reducer
const user = () => {
    let token = localStorage.getItem("token");
    let user = null;
    if (token !== null) {
        let tokenArr = token.split('|');
        user = tokenArr[1];
    }
    return user;
}

const defaultState = {
    isAuthenticated: false,
    id: user(),
    name: null,
    userType: null,
    error: false,
    errorMessage: null,
    token: localStorage.getItem("token"),
    users: []
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "GET_USER":
            return {
                ...state,
                id: action.id,
                name: action.name,
                userType: action.userType
            }
        case "GET_USERS":
            return {
                ...state,
                users: action.users
            }
        case "UPDATE_USER":
            return {
                ...state,
                users: state.users.map(user => {
                    if (user._id === action.id) {
                        if (action.userType === "admin") {
                            user.type = "user";
                        } else if (action.userType === "user") {
                            user.type = "admin";
                        }
                    }
                    return user;
                })
            }
        case "LOGIN_SUCCESS":
            localStorage.setItem("token", action.user.token + '|' + action.user.user.id);
            return {
                ...state,
                isAuthenticated: true,
                id: action.user.user.id,
                name: action.user.user.name,
                error: false,
                errorMessage: null,
                token: localStorage.getItem("token")
            }
        case "LOGIN_FAILED":
            localStorage.removeItem("token");
            return {
                ...state,
                isAuthenticated: false,
                error: true,
                errorMessage: action.data
            }
        case "LOGOUT":
            localStorage.removeItem("token");
            return {
                ...state,
                isAuthenticated: false,
                error: true
            }
        case "SIGN_UP":
            localStorage.setItem("token", action.token + '|' + action.user.id);
            return {
                ...state,
                isAuthenticated: true,
                id: action.user.id,
                name: action.user.name,
                error: false,
                errorMessage: null,
                token: localStorage.getItem("token")
            }
        case "CHECK_TOKEN":
            if (state.token !== null) {
                return {
                    ...state,
                    isAuthenticated: true,
                    error: false
                };
            } else {
                return {
                    ...state,
                    error: true,
                    errorMessage: "Please authenticate!"
                }
            }
        default:
            return state;
    }
};
