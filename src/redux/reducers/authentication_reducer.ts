// reducers/authentication_reducer.js

import { IS_LOADING_AUTH, LOGIN_USER, USER_DATA } from '../types/authentication_types';

const initialState = {
  is_loading: false,
  user_data: {},
  login_user: false, 
};

const authenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_DATA:
      return { ...state, user_data: action.payload };
    case LOGIN_USER:
      return { ...state, login_user: action.payload }; // Update login_user in state
    case IS_LOADING_AUTH:
      return { ...state, is_loading: action.payload };
    default:
      return state;
  }
};

export default authenticationReducer;
