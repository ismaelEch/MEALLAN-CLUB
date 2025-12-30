import Geolocation from '@react-native-community/geolocation';
import {Alert, Platform} from 'react-native';
import {axiosInstance} from '../../utils/axiosInstance';
import store from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchRestaurants = async () => {
  try {
    const defaultDistance = await AsyncStorage.getItem('distance');

    store.dispatch({type: 'IS_LOADING_RESTAURANTS', payload: true});
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
  

        await AsyncStorage.setItem('latitude', String(latitude));
        await AsyncStorage.setItem('longitude', String(longitude));

        const apiUrl = `restaurants/${latitude}/${longitude}?distance=${defaultDistance}`;

        try {
          let response = await axiosInstance.get(apiUrl, {
            timeout: 30000, // 30 second timeout
          });

          store.dispatch({type: 'IS_LOADING_RESTAURANTS', payload: false});
          store.dispatch({type: 'ALL_RESTAURANTS', payload: response.data});
      
        } catch (apiError: any) {
          console.error('[fetchRestaurants] API Error:', apiError);
        
          store.dispatch({type: 'IS_LOADING_RESTAURANTS', payload: false});
          Alert.alert(
            'API Error',
            `Failed to fetch restaurants: ${
              apiError?.message || 'Unknown error'
            }`,
            [{text: 'OK'}],
          );
        }
      },
      async error => {
        // Handle error when location access is denied or any other error occurs
        console.error('[fetchRestaurants] Location Error:', error);
        console.error('[fetchRestaurants] Location Error code:', error.code);
        console.error(
          '[fetchRestaurants] Location Error message:',
          error.message,
        );

        // Try fallback: Use default location (user's coordinates)
        try {
          const defaultLat = '31.470935548330335'; // User's location (Lahore area)
          const defaultLng = '74.27212274905754';

          // Update stored location to use new coordinates
          await AsyncStorage.setItem('latitude', defaultLat);
          await AsyncStorage.setItem('longitude', defaultLng);

        
          const defaultDistance = await AsyncStorage.getItem('distance');
          const apiUrl = `restaurants/${defaultLat}/${defaultLng}?distance=${defaultDistance}`;
         

          try {
            const startTime = Date.now();
            let response = await axiosInstance.get(apiUrl, {
              timeout: 30000, // 30 second timeout
            });
            const endTime = Date.now();
           
            if (response.data) {
              console.log(
                '[fetchRestaurants] Fallback API Response data sample:',
                JSON.stringify(response.data).substring(0, 300),
              );
            }
            store.dispatch({type: 'IS_LOADING_RESTAURANTS', payload: false});
            store.dispatch({type: 'ALL_RESTAURANTS', payload: response.data});
          
            return; // Success, don't show alert
          } catch (apiError: any) {
            console.error(
              '[fetchRestaurants] API Error with stored location:',
              apiError,
            );
          
          }
        } catch (fallbackError) {
          store.dispatch({type: 'IS_LOADING_RESTAURANTS', payload: false});
          Alert.alert(
            'Location Required',
            'We need access to your location to show nearby restaurants. Please enable location services in your device settings.',
            [{text: 'OK'}],
          );
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 15000, // Reduced timeout
        maximumAge: 10000000,
      },
    );
  } catch (err) {
    console.error('[fetchRestaurants] General Error:', err);
    store.dispatch({type: 'IS_LOADING_RESTAURANTS', payload: false});
    console.log('Error fetching restaurants:', err);

    // Fallback: Use default location (user's coordinates)
    try {
      const defaultLat = '31.470935548330335'; // User's location (Lahore area)
      const defaultLng = '74.27212274905754';

      // Update stored location to use new coordinates
      await AsyncStorage.setItem('latitude', defaultLat);
      await AsyncStorage.setItem('longitude', defaultLng);


      const defaultDistance = await AsyncStorage.getItem('distance');
      const apiUrl = `restaurants/${defaultLat}/${defaultLng}?distance=${defaultDistance}`;

      try {
        let response = await axiosInstance.get(apiUrl, {
          timeout: 30000, // 30 second timeout
        });
        store.dispatch({type: 'IS_LOADING_RESTAURANTS', payload: false});
        store.dispatch({type: 'ALL_RESTAURANTS', payload: response.data});
    
      } catch (apiError) {
        console.error(
          '[fetchRestaurants] API Error with default location:',
          apiError,
        );
      }
    } catch (fallbackError) {
      console.error('[fetchRestaurants] Fallback error:', fallbackError);
    }
  }
};
