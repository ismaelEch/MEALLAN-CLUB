import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useDispatch} from 'react-redux';
import HomeStack from './home-stack.navigator';
import SettingsScreen from '../screens/settings.screen';
import {Screens, XColors} from '../config/constants';
import {LOGIN_USER, USER_DATA} from '../redux/types/authentication_types';
import {useNavigationState, useNavigation} from '@react-navigation/native';
import MyProgram from '../screens/my-program.screen';
import {useTranslation} from 'react-i18next';

const Drawer = createDrawerNavigator();

const getActiveRouteName = (state: any) => {
  if (!state || !state.routes || state.routes.length === 0) {
    return null;
  }
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
};


const DrawerContent = (props: any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentRouteName = useNavigationState(state =>
    getActiveRouteName(state),
  );
  const [activeRoute, setActiveRoute] = useState(currentRouteName);
  const {t} = useTranslation();

  useEffect(() => {
    setActiveRoute(currentRouteName);
  }, [currentRouteName]);

  const handleLogout = async () => {
    dispatch({type: LOGIN_USER, payload: false});
    dispatch({type: USER_DATA, payload: {}});
    await AsyncStorage.setItem('token', '');
    navigation.navigate(Screens.LOGIN_SCREEN);
  };

  const handleNavigate = (screen: string) => {
    setActiveRoute(screen);
    if (screen === Screens.HOME_SCREEN) {
      navigation.reset({
        index: 0,
        routes: [{name: screen}],
      });
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {/* <DrawerItem
        label={t(Screens.HOME_SCREEN)}
        onPress={() => handleNavigate(Screens.HOME_SCREEN)}
        style={{
          backgroundColor: activeRoute === Screens.HOME_SCREEN ? '#cff7ff' : 'transparent',
          color: activeRoute === Screens.HOME_SCREEN ? XColors.accent : 'black',
        }}
      /> */}
      <DrawerItem label={t('Sign out')} onPress={handleLogout} />
    </DrawerContentScrollView>
  );
};

export default function HomeDrawer() {
  const currentRouteName = useNavigationState(state =>
    getActiveRouteName(state),
  );
  const [activeRoute, setActiveRoute] = useState(currentRouteName);
  const {t} = useTranslation();

  useEffect(() => {
    setActiveRoute(currentRouteName ?? Screens.HOME_SCREEN);
  }, [currentRouteName]);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#cff7ff',
        drawerActiveTintColor: XColors.accent,
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="DrawerHome"
        component={HomeStack}
        options={{
          title: t('Home'),
          drawerActiveBackgroundColor:
            activeRoute === Screens.HOME_SCREEN ? '#cff7ff' : 'transparent',
          drawerActiveTintColor:
            activeRoute === Screens.HOME_SCREEN ? XColors.accent : 'black',
          unmountOnBlur: true,
        }}
      />
      <Drawer.Screen
        name={Screens.SETTINGS_SCREEN}
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: t(Screens.SETTINGS_SCREEN),
          drawerActiveBackgroundColor:
            activeRoute === Screens.SETTINGS_SCREEN ? '#cff7ff' : 'transparent',
          drawerActiveTintColor:
            activeRoute === Screens.SETTINGS_SCREEN ? XColors.accent : 'black',
        }}
      />

      <Drawer.Screen
        name={Screens.MY_PROGRAM_SCREEN}
        component={MyProgram}
        options={{
          title: t(Screens.MY_PROGRAM_SCREEN),
          drawerActiveBackgroundColor:
            activeRoute === Screens.MY_PROGRAM_SCREEN
              ? '#cff7ff'
              : 'transparent',
          drawerActiveTintColor:
            activeRoute === Screens.MY_PROGRAM_SCREEN
              ? XColors.accent
              : 'black',
        }}
      />
    </Drawer.Navigator>
  );
}
