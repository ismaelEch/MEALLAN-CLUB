const initialState = {
  allRestaurants: [],
  isLoadingRestaurant: false,
};
const allRestaurantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_RESTAURANTS':
      return {...state, allRestaurants: action.payload};
    case 'IS_LOADING_RESTAURANTS':
      return {...state, isLoadingRestaurant: action.payload};
    default:
      return state;
  }
};

export default allRestaurantsReducer;
