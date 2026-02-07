const initialState = {
  favorites: [],
  allFavorites: [],  
};

const addFavoritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_FAVORITES':
      return {
        ...state,
        allFavorites: action.payload ?? [],
      };

    case 'ADD_FAVORITE':
      return {
        ...state,
        allFavorites: [...state.allFavorites, action.payload],
      };

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        allFavorites: state.allFavorites.filter(
          fav => fav.id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default addFavoritesReducer;
