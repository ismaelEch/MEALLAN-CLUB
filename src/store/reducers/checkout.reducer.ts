import {Action} from 'redux';

import {CartItemProps} from './../../screens/cart.screen';

import {ADD_TO_CART, REMOVE_FROM_CART, EMPTY_CART} from './../action-types';

export type CheckoutState = {
  cart: Array<CartItemProps>;
};

export type CheckoutAction = Action & {
  payload?: CartItemProps;
};

export const checkoutReducer = (
  state: CheckoutState = {cart: []},
  action: CheckoutAction,
) => {
  switch (action.type) {
    case ADD_TO_CART:
      if (!action.payload) {
        throw 'ADD_TO_CART action requires payload';
      }
      return {...state, cart: state.cart.concat(action.payload)};
    case REMOVE_FROM_CART:
      if (!action.payload) {
        throw 'REMOVE_FROM_CART action requires payload';
      }
      return {
        ...state,
        cart: state.cart.filter(el => el.title !== action.payload!.title),
      };
    case EMPTY_CART:
      break;

    default:
      return state;
  }
};
