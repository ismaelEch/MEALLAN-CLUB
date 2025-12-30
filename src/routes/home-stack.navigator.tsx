import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Screens} from '../config/constants';

import HomeScreen from '../screens/home.screen';
import RestaurantScreen from '../screens/restaurant.screen';
import CartScreen from '../screens/cart.screen';
import ProductScreen from '../screens/product.screen';
import FavoritesScreen from '../screens/favorites.screen';
import ProfileScreen from '../screens/profile.screen';
// import MyProgram from '../screens/my-program.screen';
import LoginScreen from '../screens/login.screen';
import SignupScreen from '../screens/signup.screen';
import ForgotPasswordScreen from '../screens/forgot-password.screen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator   initialRouteName={Screens.HOME_SCREEN} screenOptions={{headerShown: false}}>
      <Stack.Screen name={Screens.HOME_SCREEN} component={HomeScreen} />
      {/* <Stack.Screen name={Screens.MY_PROGRAM_SCREEN} component={MyProgram} /> */}
      <Stack.Screen
        name={Screens.FAVORITE_SCREEN}
        component={FavoritesScreen}
      />
      <Stack.Screen
        name={Screens.RESTAURANT_SCREEN}
        component={RestaurantScreen}
      />
      <Stack.Screen
        name={Screens.PROFILE_SCREEN}
        component={ProfileScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name={Screens.LOGIN_SCREEN}
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Screens.SIGN_UP_SCREEN}
        component={SignupScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Screens.FORGOT_PASSWORD_SCREEN}
        component={ForgotPasswordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name={Screens.PRODUCT_SCREEN} component={ProductScreen} />
    </Stack.Navigator>
  );
}
