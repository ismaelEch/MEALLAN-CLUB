import React, {
  useCallback,
  useState,
  useContext,
  createContext,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Animated,
  PanResponder,
  TouchableNativeFeedback,
  ActivityIndicator,
  Dimensions,
  Alert,
  Modal,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import { Screens, XColors } from '../config/constants';

import { Accented, Heading } from '../components/formatting.component';
import { MealBar } from '../components/meal-bar.component';
import { DealBar } from '../components/deal-bar.component';
import { useDispatch, useSelector } from 'react-redux';
import { CDNURL } from '../config/Url';
import { axiosInstance } from '../utils/axiosInstance';
import { BarcodeCreatorView, BarcodeFormat } from 'react-native-barcode-creator';
import { useTranslation } from 'react-i18next';
import { RefreshControl } from 'react-native-gesture-handler';
import { fetchRestaurants } from '../redux/actions/retaurantAction';
import { convertCurrency } from '../utils/currency';
import { addToFavorites, fetchAllFavoriteRestaurant, removeFavorites, removeFromFavorites } from '../redux/actions/addfavoriteaction';

const Tab = createMaterialTopTabNavigator();
const RestaurantContext = createContext({});

interface Props {
  user: {
    isConnected: boolean;
    adhesionCode: string;
  } | null;
}


const RestaurantScreen: React.FC<Props> = ({ user }) => {
  const [showQrModal, setShowQrModal] = useState(false);
  const [membership, setMembership] = useState({});
  const [restaurant, setRestaurant] = useState({});
  const favorites = useSelector(state => state.addFavoritesReducer?.allFavorites || []);
  const isFavorite = favorites.some(fav => fav.id == '1');
  const [favorite, setFavorite] = useState(isFavorite);

  const dispatch = useDispatch();
  const [favoriteDto, setFavoriteDto] = useState<any>({
    isFavorite: false,
    favId: null,
  });
  const backgroundStyle = {
    backgroundColor: XColors.lighter
  };

  useEffect(() => {
    // Si l'utilisateur est connecté, on ouvre le modal automatiquement
    if (isLogin && membership?.code) {
      setShowQrModal(true);
    } else {
      console.log("Utilisateur NON connecté<<<<<<<<<<<<");
    }
  }, [membership]);


  const fetchFavorites = async () => {
    try {
      const response = await axiosInstance.get(
        `/favorites/${state?.user_data?.id}`,
      );

      const favArr = response.data;

      const isFavoriteRestaurant = favArr.some(
        (item) => item?.restaurant?.id === restaurantId,
      );

      const favId = favArr.find(
        (item) => item?.restaurant?.id === restaurantId,
      )?.id;

      setFavoriteDto((prev) => ({
        ...prev,
        isFavorite: isFavoriteRestaurant,
        favId: favId,
      }));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [restaurantId])
  );

  const { t } = useTranslation();

  const fadeAnim = React.useRef(new Animated.Value(330)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.moveX < 50) return;
        Animated.timing(fadeAnim, {
          toValue: gestureState.moveY,
          useNativeDriver: false,
        }).start();
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    }),
  ).current;

  const route = useRoute();
  const navigation = useNavigation();
  const state = useSelector(state => state.authentication);

  const initialTabRoute = route.params?.initialTabRoute || Screens.MENU_SCREEN;
  const points = route.params?.points || 0;
  const restaurantId = route.params?.id;
  const distance = route.params?.distance;

  const [refreshing, setRefreshing] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        console.log("route.params?.from", route.params?.from)
        if (route.params?.from === 'Favorites') {
          navigation.navigate('Favorites');
        } else if (route.params?.from === 'My program') {
          navigation.navigate('My program'); // or whatever screen you mean
        } else {
          navigation.navigate(Screens.HOME_SCREEN); // default fallback
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }, [navigation, route.params])
  );
  const handleFetchRestaurant = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/restaurant/${id}/${state?.user_data?.id}`,
      );

      setRestaurant(response?.data?.restaurant);
      if (response?.data?.membership) {
        setMembership(response?.data?.membership);
      }
    } catch (err) {
      console.log('err: ', err);
    }
  };


  const handleAddToFavorites = async () => {
    let dto = {
      userId: state?.user_data?.id,
      restaurantId: restaurantId,
    };

    try {
      if (favoriteDto.isFavorite) {
        let res = await axiosInstance.delete(`/favorites/${favoriteDto.favId}`);
        if (res) {
          fetchFavorites();
          dispatch(fetchAllFavoriteRestaurant() as any);

          ToastAndroid.show(t('Removed from Favorites'), ToastAndroid.SHORT);
        }
      } else {
        let res = await axiosInstance.post('/favorites/add', dto);
        if (res) {
          fetchFavorites();
          dispatch(fetchAllFavoriteRestaurant() as any);
          ToastAndroid.show(t('Added in Favorites'), ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      // handle error
    }
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRestaurants();
    handleFetchRestaurant(restaurantId).finally(() => setRefreshing(false));
  }, [restaurantId]);

  useFocusEffect(
    useCallback(() => {
      restaurantId && handleFetchRestaurant(restaurantId);
    }, [restaurantId, favorites, dispatch]),
  );
  const isLogin = useSelector(state => state.authentication.login_user);
  return (
    <View
      style={{ ...backgroundStyle, ...styles.screen }}>

      <Modal
        visible={showQrModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQrModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowQrModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {t('Your membership code')} :  <Text style={styles.boldCode}>{membership?.code}</Text>
                </Text>

                {membership?.code ? (
                  <BarcodeCreatorView
                    value={JSON.stringify(membership.code)}
                    background={'#FFFFFF'}
                    foregroundColor={'#000000'}
                    format={BarcodeFormat.QR}
                    style={{ width: 200, height: 200 }}
                  />
                ) : (
                  <Text>{t('No code available')}</Text>
                )}

                <Text style={styles.pointBalance}>
                  {t('Balance')} : <Text style={styles.boldCode}>{membership?.points ?? 0}</Text> {t('Points')}
                </Text>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowQrModal(false)}
                >
                  <Text style={styles.closeButtonText}>{t('Close')} </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.headerButtonsRight}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(Screens.HOME_SCREEN)
          }}>
          <View style={styles.iconButton}>
            <Accented>
              <AntDesign name="arrowleft" size={20} />
            </Accented>
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          {isLogin && (
            <TouchableOpacity
              onPress={handleAddToFavorites}
              style={styles.iconButton}>
              <AntDesign
                name={favoriteDto.isFavorite ? 'heart' : 'hearto'}
                size={20}
                color="red"
              />
            </TouchableOpacity>

          )}

          <View style={{ ...styles.iconButton, marginRight: 20 }}>
            <TouchableOpacity
              hitSlop={{ right: 20, bottom: 20 }}
              onPress={() => navigation.navigate(Screens.PROFILE_SCREEN)}>
              <Accented>
                <AntDesign name="user" size={16} />
              </Accented>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={[styles.banner]}
      >
        <View style={[styles.bannerImage]}>
          <View style={StyleSheet.absoluteFill}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'lightgrey',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}>
              <Image
                style={{ width: '100%', height: 200, resizeMode: 'cover' }}
                source={{
                  uri: CDNURL + 'no-image.jpg',
                }}
              />
            </View>
            <Image
              style={{ width: '100%', height: 200, resizeMode: 'cover' }}
              source={{
                uri: CDNURL + restaurant.picture
              }}
            />
          </View>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Heading level={1}>
              <Text style={{ textTransform: 'uppercase' }}>
                {restaurant?.title}
              </Text>
            </Heading>


          </View>
          <Text style={{ color: 'grey' }}>
            {distance?.toFixed(1)} {t('km away')}
          </Text>
          {restaurant?.menu?.menuGroups[0]?.meals.length > 0 ? (
            <Text style={{ color: 'grey' }}>
              {restaurant?.menu?.menuGroups[0]?.meals[0]?.label ?? ''} •{' '}
              {restaurant?.menu?.menuGroups[0]?.meals[1]?.label ?? ''} •{' '}
              {restaurant?.menu?.menuGroups[0]?.meals[2]?.label ?? ''}
            </Text>
          ) : (
            <Text>{t('No meals available')}</Text>
          )}
        </View>
      </View>
      <RestaurantContext.Provider value={restaurant}>
        <Tab.Navigator initialRouteName={initialTabRoute}>
          <Tab.Screen
            options={{ tabBarLabel: t('Menu') }}
            name={Screens.MENU_SCREEN}
            component={MenuTab}
          />
          <Tab.Screen
            options={{ tabBarLabel: t('Deals') }}
            name={Screens.DEALS_SCREEN}
            component={DealsTab}
          />
          <Tab.Screen
            options={{ tabBarLabel: t('My program') }}
            name={Screens.MY_PROGRAM_SCREEN}
            component={MyProgramTab}
            initialParams={{ points, restaurantId: restaurant?.id }}
          />
        </Tab.Navigator>
      </RestaurantContext.Provider>
    </View>

  );
}

function MenuTab(props) {

  const restaurant = useContext(RestaurantContext);
  const [selectedMenu, setSelectedMenu] = useState(
    restaurant?.menu?.menuGroups[0],
  );

  useEffect(() => {
    setSelectedMenu(restaurant?.menu?.menuGroups[0]);
  }, [restaurant?.menu?.menuGroups]);

  return (
    <ScrollView>
      <View style={{ paddingHorizontal: 20 }}>
        <ScrollView horizontal>
          {restaurant?.menu?.menuGroups?.map(item => (
            <TouchableOpacity
              onPress={() => setSelectedMenu(item)}
              key={item?.label + item?.id}>
              <Text
                style={{
                  marginRight: 20,
                  marginVertical: 10,
                  fontWeight:
                    selectedMenu?.label === item?.label ? 'bold' : 'normal',
                  color: selectedMenu?.label === item?.label ? 'black' : 'grey',
                  textTransform: 'capitalize',
                }}>
                {item?.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ height: 20 }} />
        {selectedMenu?.meals?.map((meal, i) => (
          <MealBar
            currencySymbol={convertCurrency(restaurant?.currency?.code || '$')}
            key={i}
            {...meal}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function Accordion({ mealGroup, points, currency }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const label = mealGroup?.reduce((acc, meal) => {
    return acc + meal.label + ', ';
  }, '');

  return (
    <View>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{points} {t('Points')}</Text>
          <Text style={styles.cardPoints}>{label}</Text>
        </View>
      </TouchableOpacity>
      {expanded && (
        <>
          <Text style={{ color: '#000' }}>
            {t('free_meals_description', { points })}
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>{t('Meals')}</Text>
              <Text style={styles.tableHeader}>{t('Price')}</Text>
            </View>
            {mealGroup?.map((detail, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{detail.label}</Text>
                <Text style={styles.tableCell}>
                  {currency}
                  {detail.price}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function MyProgramTab(props) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const { t } = useTranslation();

  const state = useSelector(x => x.authentication);
  const restaurant = useContext(RestaurantContext);

  const [isSubscribing, setIsSubscribing] = useState(false);
  const [membership, setMembership] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProgram().finally(() => setRefreshing(false));
  }, [restaurant?.id, state?.user_data?.id]);

  const fetchProgram = async () => {
    try {
      const res = await axiosInstance.get(
        `/restaurant/${restaurant?.id}/${state?.user_data?.id}`,
      );

      if (res?.data?.membership) {
        setMembership(res?.data?.membership);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    restaurant?.id && state?.user_data?.id && fetchProgram();
  }, [state?.user_data?.id, restaurant?.id, isFocused]);

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      await axiosInstance.post(
        `/restaurant/subscribe/${state?.user_data?.id}/${restaurant?.id}`,
      );
    } catch (err) {
      console.log('failed subscribe api', err);
    } finally {
      fetchProgram();
      setIsSubscribing(false);
    }
  };
  const { width, height } = Dimensions.get('window');

  const paddingVertical = height * 0.02;
  const paddingHorizontal = width * 0.05;

  const menuGroups = restaurant?.menu?.menuGroups || [];

  const allMeals = menuGroups.reduce((acc: any[], group: any) => {
    if (group?.meals?.length) {
      acc.push(...group.meals);
    }
    return acc
  }, []);

  const groupedMeals = allMeals.reduce(
    (acc: { [pointsToBuy: string]: any[] }, meal: { pointsToBuy: any }) => {
      const pointsToBuy = meal.pointsToBuy;

      if (!acc[pointsToBuy]) {
        acc[pointsToBuy] = [];
      }

      acc[pointsToBuy].push(meal);
      return acc;
    },
    {},
  );
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View>
        {state.login_user && membership?.code && (
          <View>
            <View
              style={{
                width: '100%',
                backgroundColor: XColors.accent,
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 24,
              }}>
              <Heading level={1} style={{ color: '000', margin: 0 }}>
                <Text>
                  {membership?.points} {t('Points')}
                </Text>
              </Heading>
              <BarcodeCreatorView
                value={JSON.stringify(membership?.code)}
                background={'#FFFFFF'}
                foregroundColor={'#000000'}
                format={BarcodeFormat.QR}
                style={{ width: 80, height: 80 }}
              />
              <TouchableOpacity
                onPress={() => Alert.alert(t('Points code'), JSON.stringify(membership?.code))}>
                <Text>{t('Show Code')}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 20,
              }}>
              {Object.entries(groupedMeals || {}).map(([key, value]) =>
                key && key !== 'null' ? (
                  <Accordion
                    currency={convertCurrency(
                      restaurant?.currency?.code || '$',
                    )}
                    key={key}
                    points={key}
                    mealGroup={value}
                  />
                ) : null,
              )}
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {!membership?.code ? (
            <TouchableNativeFeedback
              disabled={isSubscribing}
              onPress={() => {
                if (!state.login_user) {
                  navigation.navigate(Screens.LOGIN_SCREEN);
                } else {
                  handleSubscribe();
                }
              }}>
              <View
                style={{
                  backgroundColor: XColors.accent,
                  paddingVertical: paddingVertical,
                  paddingHorizontal: paddingHorizontal,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                {isSubscribing ? (
                  <ActivityIndicator color={'white'} size={20} />
                ) : (
                  <Text>{!state.login_user ? t('login') : t('Register')}</Text>
                )}
              </View>
            </TouchableNativeFeedback>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

function DealsTab(props) {
  const restaurant = useContext(RestaurantContext);

  return (
    <ScrollView>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ height: 20 }} />
        {restaurant?.deals?.map(deal => (
          <DealBar {...deal} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { height: '100%' },


  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  boldCode: {
    fontWeight: 'bold',
    color: '#000',
  },
  pointBalance: {
    marginTop: 15,
    fontSize: 16,
    color: '#444',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#4dc6e2',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: { fontSize: 18, marginBottom: 20, fontWeight: 'bold' },
  codeText: { marginTop: 10, fontSize: 16, fontWeight: '600' },


  iconButton1: {
    width: 40,
    height: 40,
    backgroundColor: XColors.lightgrey,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 45,
    height: 45,
    backgroundColor: XColors.lightgrey,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 10,
  },
  banner: {
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  bannerImage: {
    position: 'relative',
    height: 185,
  },
  headerButtonsRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    zIndex: 9999,
    width: '100%',
  },
  card: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  cardPoints: {
    fontSize: 14,
    color: 'grey',
  },
  table: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1, // Add border width for the table
    borderColor: '#ddd', // Add border color for the table
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1, // Add bottom border for each row
    borderBottomColor: '#ddd', // Add bottom border color for each row
  },
  tableHeader: {
    color: '#000',
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 14,
    color: '#000',
  },
});

export default RestaurantScreen;
