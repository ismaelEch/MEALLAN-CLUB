import Geolocation from '@react-native-community/geolocation';
import {Alert} from 'react-native';
import {axiosInstance} from '../../utils/axiosInstance';
import store from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const fetchRestaurants = async () => {

  const state = store.getState();

const restaurants =
  state.allRestaurantsReducer?.allRestaurants;

if (restaurants && restaurants.length > 0) {
  return;
}


  store.dispatch({ type: 'IS_LOADING_RESTAURANTS', payload: true });

  try {
    const distance =
      (await AsyncStorage.getItem('distance')) ?? '10';

    let coords;

    try {
      coords = await getPosition();
    } catch (locationError) {
      console.warn('[fetchRestaurants] Location unavailable', locationError);

      Alert.alert(
        'Location required',
        'Please enable location services to see nearby restaurants.',
        [{ text: 'OK' }],
      );

      return; 
    }

    const latitude = String(coords.latitude);
    const longitude = String(coords.longitude);

    await AsyncStorage.setItem('latitude', latitude);
    await AsyncStorage.setItem('longitude', longitude);

    const apiUrl = `restaurants/${latitude}/${longitude}?distance=${distance}`;

    const response = await axiosInstance.get(apiUrl, {
      timeout: 30000,
    });

    if (Array.isArray(response.data) && response.data.length > 0) {
      store.dispatch({
        type: 'ALL_RESTAURANTS',
        payload: response.data,
      });
    } else {
      console.warn('[fetchRestaurants] API returned empty list');
    }
  } catch (err) {
    console.error('[fetchRestaurants] Error:', err);
  } finally {
    store.dispatch({ type: 'IS_LOADING_RESTAURANTS', payload: false });
  }
};


const getPosition = (): Promise<{ latitude: number; longitude: number }> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      err => reject(err),
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000000,
      },
    );
  });


