import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authAdminReducer from './reducers/authAdminReducer';


// Kết hợp nhiều reducer (nếu có thể bạn có thêm userReducer, courseReducer,...)
const rootReducer = combineReducers({
    authAdminReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
