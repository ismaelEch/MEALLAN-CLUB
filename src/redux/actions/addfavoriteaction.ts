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


export const fetchAllFavoriteRestaurant = () => async (dispatch: any) => {
  try {
    const res = await axiosInstance.get(
      `/favorites/${store.getState().authentication?.user_data?.id}`,
    );

    const existingRestaurant =
      store.getState().allRestaurantsReducer.allRestaurants;

    const data: any = [];

    res?.data?.forEach(x => {
      const existingRes = existingRestaurant.find(
        v => v.id === x.restaurant?.id,
      );

      if (existingRes) {
        data.push(existingRes);
      }
    });

    store.dispatch({ type: 'ALL_FAVORITES', payload: data });
  } catch (err) {
    console.log(err);
  }
};
