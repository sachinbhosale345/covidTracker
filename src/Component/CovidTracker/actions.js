import { REQUEST_COVID_DATA, GET_COVID_DATA, ERROR_FETCH_COVID_DATA } from './constants'

export const fetchCovidData = () => {
    return {
        type: REQUEST_COVID_DATA,
        data: null
    }
}