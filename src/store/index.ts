import {createStore, combineReducers} from 'redux';
import {authReducer} from './reducers/auth.reducer';

const rootReducer = combineReducers({auth: authReducer});

export const store = createStore(rootReducer);
