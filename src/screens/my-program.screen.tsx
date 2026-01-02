import React, { useCallback, useState } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { XColors } from '../config/constants';
import { Accented } from '../components/formatting.component';
import { Header } from '../components/header.component';
import {
  RestaurantCard,
  RestaurantCardProps,
} from '../components/restaurant-card.component';
import { Screens } from '../config/constants';
import MealSearch from '../components/meal-search.component';
import { MealBarProps } from '../components/meal-bar.component';
import { axiosInstance } from '../utils/axiosInstance';
import { useSelector } from 'react-redux';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useSearchRestaurant from '../hoc/useSearchResturants';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { haversineDistanceCalculation } from '../utils/location';

export type RestaurantSearchData = RestaurantCardProps & {
  meals: Array<MealBarProps>;
};

function MyProgram(props) {
  const state = useSelector(x => x.authentication);

  const backgroundStyle = {
    backgroundColor: XColors.lighter
  };

  const [restaurantData, setRestaurantData] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { onSearchResults, searchResults } = useSearchRestaurant();
  const { allRestaurants } = useSelector(state => state.allRestaurantsReducer);

  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      const fetchProgramData = async () => {
        if (!state.user_data?.id) {
          navigation.navigate(Screens.LOGIN_SCREEN);
          return;
        }

        try {
          const [myLatitude, myLongitude] = await Promise.all([
            AsyncStorage.getItem('latitude'),
            AsyncStorage.getItem('longitude'),
          ]);

          const res = await axiosInstance.get(
            `/membership/${state?.user_data?.id}/${myLatitude}/${myLongitude}`,
          );

          setRestaurantData(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchProgramData();
    }, [isFocused, state.user_data?.id]),
  );
  useFocusEffect(
    useCallback(() => {
      if (isFocused && !state.user_data?.id) {
        navigation.navigate(Screens.LOGIN_SCREEN);
      }
    }, [isFocused, navigation, state]),
  );

  return (
    <View style={{ ...backgroundStyle, ...styles.screen }}>
      <Header
        onPressMenu={() => props.navigation.openDrawer()}
        onPressUser={() =>
          props.navigation.navigate('DrawerHome', {
            screen: Screens.PROFILE_SCREEN,
          })
        }
        onPressHeart={() =>
          props.navigation.navigate('DrawerHome', {
            screen: Screens.FAVORITE_SCREEN,
          })
        }
        inputProps={{
          onChangeText: async needle =>
            await onSearchResults(needle.toLowerCase(), allRestaurants),
        }}
        switchIcon={t('hearto')}
      />
      {searchResults.length ? (
        <MealSearch results={searchResults} heartIcon={t('hearto')} />
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
              {t('My program')}
            </Text>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Accented>
                <AntDesign name={t('arrowright')} size={24} />
              </Accented>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ paddingHorizontal: 20, marginBottom: 220 }}>
            {restaurantData.map((rest, index) => (
              <RestaurantCard
                key={index}
                {...rest}
                onClick={() =>
                  props.navigation.navigate('DrawerHome', {
                    screen: Screens.RESTAURANT_SCREEN,
                    params: {
                      points: rest.points,
                      id: rest?.id,
                      initialTabRoute: Screens.MY_PROGRAM_SCREEN,
                      distance: rest.distance,
                      from: 'My program',
                    },
                  })
                }
                heartIcon={t('hearto')}
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

export default MyProgram;
