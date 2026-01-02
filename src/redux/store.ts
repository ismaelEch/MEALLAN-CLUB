import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import addFavoritesReducer from './reducers/addFavorites_reducer';
import authentication_reducer from './reducers/authentication_reducer';
import allRestaurantsReducer from './reducers/restaurant_reducer';
import { settingReducer } from './reducers/setting_reducer';

const reducers = combineReducers({
  authentication: authentication_reducer,
  addFavoritesReducer,
  allRestaurantsReducer,
  settingReducer,
});

const store = createStore(reducers, applyMiddleware(thunk));

export default store;
