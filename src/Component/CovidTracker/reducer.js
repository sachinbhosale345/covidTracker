import { GET_COVID_DATA, ERROR_FETCH_COVID_DATA } from './constants'
const initialState = {}

const covidTrackerReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_COVID_DATA:
            return {
                ...state,
                covidData: action.data
            }
        case ERROR_FETCH_COVID_DATA:
            return {
                ...state,
                covidFetchError: action.data
            }
        default:
            return state;
    }
}


export default covidTrackerReducer;