import store from '../store';
import { axiosInstance } from '../../utils/axiosInstance';


export const addToFavorites =
  (dto: { userId: string; restaurantId: string }) => async (dispatch: any) => {
    try {
      const res = await axiosInstance.post('/favorites/add', dto);

      if (res.status === 200 || res.status === 201) {
        const { allRestaurantsReducer, addFavoritesReducer } = store.getState();

        const restaurant = allRestaurantsReducer.allRestaurants.find(
          r => r.id === dto.restaurantId,
        );

        if (restaurant) {
          const updatedFavorites = [
            ...addFavoritesReducer.favorites,
            restaurant,
          ];

          dispatch({ type: 'ADD_FAVORITE', payload: updatedFavorites });
        }
      }
    } catch (err) {
      console.log('Error adding favorite:', err);
    }
  };

export const removeFavorites =
  (dto: { userId: string; restaurantId: string }) => (dispatch: any) => {
    const { addFavoritesReducer } = store.getState();
    let favorites = [...addFavoritesReducer.favorites];
    let filteredArr = favorites.filter(x => {
      x.id !== dto.userId && x.restaurantId !== dto.restaurantId;
    });
    dispatch({ type: 'ADD_FAVORITE', payload: filteredArr });
  };

// In your actions file (e.g., `favoritesActions.js`)
export const removeFromFavorites = (restaurantId) => {
  return {
    type: 'REMOVE_FAVORITE',
    payload: restaurantId,
  };
};


export const fetchAllFavoriteRestaurant = () => async (dispatch, getState) => {
  try {
    const userId = getState().authentication?.user_data?.id;
    if (!userId) return;

    const res = await axiosInstance.get(`/favorites/${userId}`);

    dispatch({
      type: 'ALL_FAVORITES',
      payload: res.data,
    });
  } catch (err) {
    console.log('❌ fetchAllFavoriteRestaurant error', err);
  }
};

