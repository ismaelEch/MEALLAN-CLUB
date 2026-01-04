import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  Platform, TouchableOpacity, Linking
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Accented } from '../components/formatting.component';
import { Header } from '../components/header.component';
import { RestaurantCard } from '../components/restaurant-card.component';
import { Screens } from '../config/constants';
import MealSearch from '../components/meal-search.component';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { parseJwt } from '../utils/decode';
import { LOGIN_USER, USER_DATA } from '../redux/types/authentication_types';
import { fetchRestaurants } from '../redux/actions/retaurantAction';
import useSearchRestaurant from '../hoc/useSearchResturants';
import { useTranslation } from 'react-i18next';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {XColors} from '../config/constants';


function HomeScreen(props): JSX.Element {
  const [locationStatus, setLocationStatus] = useState<'granted' | 'denied' | 'unknown'>('unknown');
  const backgroundStyle = { backgroundColor: XColors.lighter };
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.authentication.login_user);
  const { allRestaurants, isLoadingRestaurant } = useSelector(
    state => state.allRestaurantsReducer,
  );
  const { onSearchResults, searchResults, loading } = useSearchRestaurant();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRestaurants().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
  const checkLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await check(permission);

      if (result === RESULTS.GRANTED) {
        setLocationStatus('granted');
      } else if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        setLocationStatus('denied');
      } else {
        setLocationStatus('unknown');
      }
    } catch (e) {
      setLocationStatus('unknown');
    }
  };

  checkLocationPermission();
}, []);


  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const userProfileData = parseJwt(token);
        dispatch({
          type: USER_DATA,
          payload: {
            ...(userProfileData || {}),
            id: parseInt(userProfileData?.sub),
          },
        });
        dispatch({ type: LOGIN_USER, payload: true });
      } else {
        dispatch({ type: LOGIN_USER, payload: false });

      }
    };
    checkAuth();
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchRestaurants();
    }, []),
  );



  

  useEffect(() => {
    if (allRestaurants?.length > 0) {
      console.log('[HomeScreen] First restaurant:', JSON.stringify(allRestaurants[0]).substring(0, 200));
    }
  }, [allRestaurants, isLoadingRestaurant]);

  const renderEmptyState = () => {
  // Cas 1 : localisation refusée
  if (locationStatus === 'denied') {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          {t('Location disabled')}
        </Text>
        <Text style={styles.emptyText}>
          {t(
            'No data msg',
          )}
        </Text>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.settingsButtonText}>
            {t('Open settings')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Cas 2 (par défaut) : aucun restaurant
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>🍽️ {t('No restaurant nearby')}</Text>
      <Text style={styles.emptyText}>
        {t('try later')}
      </Text>
    </View>
  );
};

  const renderSpeciallySelected = () => (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{
        paddingHorizontal: 20,
        marginBottom: 150,
        backgroundColor: '#FFFFFF',
      }}>
      <View style={styles.specialSectionHeader}>
      {allRestaurants?.length > 0 && (
        <Text style={styles.specialSectionTitle}>
          {t('Specially Selected For You')}
        </Text>
        )}
        <Accented>
          <AntDesign name="arrowright" size={24} />
        </Accented>
      </View>
      <ScrollView horizontal>
        {allRestaurants?.slice(0, 5).map((rest, index) => (
          <RestaurantCard
            key={index}
            {...rest}
            onClick={() =>
              props.navigation.navigate(Screens.RESTAURANT_SCREEN, {
                id: rest?.id,
                distance: rest?.distance,
              })
            }
            width={280}
            heartIcon="hearto"
          />
        ))}
      </ScrollView>
      <View style={styles.verticalSectionHeader}>
      {allRestaurants?.length > 0 && (
        <Text style={styles.verticalSectionTitle}>
          {t('More Restaurants For You')}
        </Text>
        )}
      </View>
      {allRestaurants?.slice(5).map((rest, index) => (
        <RestaurantCard
          key={index}
          {...rest}
          onClick={() =>
            props.navigation.navigate(Screens.RESTAURANT_SCREEN, {
              id: rest?.id,
              distance: rest?.distance,
            })
          }
          width="100%"
          heartIcon="hearto"
        />
      ))}
    </ScrollView>
  );

  const renderSimpleList = () => (
    <View style={styles.verticalSectionHeader}>
      <Text style={styles.verticalSectionTitle}>{t('Restaurants')}</Text>
      <ScrollView>
        {allRestaurants.length > 0 &&
          allRestaurants?.map((rest, index) => (
            <RestaurantCard
              key={index}
              {...rest}
              onClick={() =>
                props.navigation.navigate(Screens.RESTAURANT_SCREEN, {
                  distance: rest?.distance,
                  id: rest?.id,
                })
              }
              width="100%"
              heartIcon="hearto"
            />
          ))}
        {!isLoadingRestaurant && allRestaurants.length === 0 && (
          <Text>{t('No restaurants found!')}</Text>
        )}
      </ScrollView>
    </View>
  );



  return (
    <View style={{ ...backgroundStyle, ...styles.screen }}>
      <Header
        onPressMenu={() => props.navigation.openDrawer()}
        onPressUser={() => props.navigation.navigate(Screens.PROFILE_SCREEN)}
        onPressHeart={() => props.navigation.navigate(Screens.FAVORITE_SCREEN)}
        inputProps={{
          onChangeText: async needle => {
            setSearchInput(needle);
            await onSearchResults(needle.toLowerCase(), allRestaurants);
          },
        }}
        switchIcon="hearto"
      />

<View style={{ flex: 1 }}>
  {loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 }}>
      <ActivityIndicator size="large" color={XColors.primary} />
    </View>
  ) : searchInput.trim() === '' ? (
    allRestaurants.length > 0 ? (
      renderSpeciallySelected()
    ) : (
      renderEmptyState()
    )
  ) : searchResults.length > 0 ? (
    <MealSearch results={searchResults} heartIcon="hearto" />
  ) : (
    renderEmptyState()
  )}
</View>




    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
  flex: 1,
},
  specialSectionHeader: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specialSectionTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: XColors.dark,
  },
  verticalSectionHeader: {
    paddingBottom: 80,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  verticalSectionTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: XColors.dark,
  },
  emptyContainer: {
  flex: 1,
  marginTop: 80,
  paddingHorizontal: 30,
  justifyContent: 'center',
  alignItems: 'center',
},

emptyTitle: {
  fontSize: 22,
  fontWeight: '600',
  textAlign: 'center',
  marginBottom: 12,
  color: '#2c2c2c',
},

emptyText: {
  fontSize: 16,
  textAlign: 'center',
  color: '#666',
  marginBottom: 20,
},

settingsButton: {
  backgroundColor: '#000',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 8,
},

settingsButtonText: {
  color: '#fff',
  fontSize: 15,
  fontWeight: '500',
}
});

export default HomeScreen;