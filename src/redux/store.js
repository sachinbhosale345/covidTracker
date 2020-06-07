import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import reducer from './rootReducer';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = typeof window === 'object' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] ?
    window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({}) : compose;
const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware)
);

const store = createStore(
    reducer, enhancer
);
sagaMiddleware.run(rootSaga)

export default store;