let initialUser = {
    login: false,
    userid: null,
    fname: null,
    role: null,
    token: null
}

export const LoginReducer = (state = initialUser, action) => {
    switch (action.type) {
        case "LOGIN":
            let newState = {
                login: true,
                userid: action.payload.id,
                fname: action.payload.fname,
                role: action.payload.role,
                token: action.payload.token
            }
            return newState
        case "LOGOUT":
            return initialUser
        default:
            return state
    }
}