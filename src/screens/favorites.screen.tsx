import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { XColors } from '../config/constants';
import { useDispatch, useSelector } from 'react-redux';
import { Accented } from '../components/formatting.component';
import { Header } from '../components/header.component';
import { MealBarProps } from '../components/meal-bar.component';
import MealSearch from '../components/meal-search.component';
import {
  RestaurantCard,
  RestaurantCardProps,
} from '../components/restaurant-card.component';
import { Screens } from '../config/constants';
import useSearchRestaurant from '../hoc/useSearchResturants';
import { fetchAllFavoriteRestaurant } from '../redux/actions/addfavoriteaction';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosInstance } from '../utils/axiosInstance';

export type RestaurantSearchData = RestaurantCardProps & {
  meals: Array<MealBarProps>;
};

function FavoritesScreen(props) {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const state = useSelector(s => s.authentication);

  const backgroundStyle = {
    backgroundColor: XColors.lighter
  };

  const { onSearchResults, searchResults } = useSearchRestaurant();
  const { allRestaurants } = useSelector(state => state.allRestaurantsReducer);

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const restaurantData = useSelector(
    state => state.addFavoritesReducer.allFavorites,
  );
  const fetchData = async () => {
    if (!state.user_data?.id) {
      navigation.navigate(Screens.LOGIN_SCREEN);
      return;
    }

    try {
      // Get location
      const [myLatitude, myLongitude] = await Promise.all([
        AsyncStorage.getItem('latitude'),
        AsyncStorage.getItem('longitude'),
      ]);

      // Fetch all restaurants
      const restaurantRes = await axiosInstance.get(
        `/membership/${state?.user_data?.id}/${myLatitude}/${myLongitude}`
      );
      const allRestaurants = restaurantRes.data;

      // Fetch favorites
      const favRes = await axiosInstance.get(
        `/favorites/${state?.user_data?.id}`
      );
      const favoriteArr = favRes.data;
      // Create a Set of favorite restaurant IDs
      const favoriteRestaurantIds = new Set(
        favoriteArr.map(fav => fav?.restaurant?.id)
      );

      // Filter restaurants that are in favorites
      const onlyFavoriteRestaurants = allRestaurants.filter(restaurant =>
        favoriteRestaurantIds.has(restaurant?.id)
      );

      // Save filtered result to state
      setFavoriteRestaurants(onlyFavoriteRestaurants);

    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };
  const { t } = useTranslation();

  useEffect(() => {
    if (isFocused && !state.user_data?.id) {
      navigation.navigate(Screens.LOGIN_SCREEN);
    }
  }, [isFocused, navigation, state]);

  useEffect(() => {
    dispatch(fetchAllFavoriteRestaurant() as any);
    fetchData();
  }, [state, isFocused, dispatch]);

  return (
    <View style={{ ...backgroundStyle, ...styles.screen }}>
      <Header
        onPressMenu={() => props.navigation.openDrawer()}
        onPressUser={() => props.navigation.navigate(Screens.PROFILE_SCREEN)}
        onPressHeart={() => props.navigation.navigate(Screens.HOME_SCREEN)}
        inputProps={{
          onChangeText: async needle =>
            await onSearchResults(needle.toLowerCase(), allRestaurants),
        }}
        switchIcon="home"
      />
      {searchResults.length ? (
        <MealSearch results={searchResults} heartIcon="hearto" />
      ) : (
        <>
          <View
            style={{
              padding: 20,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 24, fontWeight: '500', color: XColors.dark }}>
              {t('Your Favorite Restaurants')}
            </Text>
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 10,
              }}
              onPress={() => navigation.goBack()}>
              <Accented>
                <AntDesign name="arrowright" size={24} />
              </Accented>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal>
            {favoriteRestaurants.map((rest, index) => (
              <RestaurantCard
                key={index}
                {...rest}
                onClick={() =>
                  props.navigation.navigate(Screens.RESTAURANT_SCREEN, {
                    id: rest.id,
                    distance: rest.distance,
                    from: 'Favorites',
                  })
                }
                width={280}
                heartIcon="hearto"
              />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {},
});

export default FavoritesScreen;
