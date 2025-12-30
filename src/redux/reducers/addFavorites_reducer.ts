
const initialState = {
  favorites: [],
  allFavorites: [],
};

const addFavoritesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'ADD_FAVORITES':
      return { ...state, favorites: payload };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.allFavorites.filter(fav => fav.restaurantId !== payload),
      };

    case 'ALL_FAVORITES':
      return { ...state, allFavorites: payload };
    default:
      return state;
  }
};

export default addFavoritesReducer;

