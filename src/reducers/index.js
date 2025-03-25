import {combineReducers} from 'redux';
import roleReducer from './role';
import reloadReducer from './reload';

const allReducers = combineReducers({
    roleReducer,
    reloadReducer
});

export default allReducers;