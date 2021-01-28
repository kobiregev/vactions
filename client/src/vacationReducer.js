let initialVacations = []

export const VacationsReducer = (state = initialVacations, action) => {
    switch (action.type) {
        case "SETVACATIONS":
            let newState = action.payload
            return newState
        default:
            return state
    }
}