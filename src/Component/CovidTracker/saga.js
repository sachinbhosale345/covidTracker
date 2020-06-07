import { put, takeLatest, all, call } from 'redux-saga/effects';
import { REQUEST_COVID_DATA, GET_COVID_DATA, ERROR_FETCH_COVID_DATA } from './constants'
import { fetchData, postData } from '../../Services'

export default function* saga() {
    console.log('Covid Tracker Saga is Running');
    yield takeLatest('REQUEST_COVID_DATA', fetchCovidData);
}

function* fetchCovidData() {
    try {
        let url = 'https://corona.lmao.ninja/v2/countries?yesterday&sort';
        
        const response = yield call(fetchData, url)
        yield put({ type: 'GET_COVID_DATA', data: response })
    } catch (error) {
        yield put({ type: 'ERROR_FETCH_COVID_DATA', data: error })
    }

}