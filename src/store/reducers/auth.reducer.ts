import {LOGIN} from '../action-types';
import {LOGOUT} from '../action-types';

export const authReducer = (state = {isLoggedIn: false}, action) => {
  switch (action.type) {
    case LOGIN:
      return {...state, isLoggedIn: true};
    case LOGOUT:
      return {...state, isLoggedIn: false};

    default:
      return state;
  }
};
