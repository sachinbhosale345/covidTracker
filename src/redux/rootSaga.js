import { all } from 'redux-saga/effects';
import covidTrackerSaga from '../Component/CovidTracker/saga'


export default function* rootSaga() {
    console.log('Saga is Running');
    yield all([
        covidTrackerSaga()
    ]);
}