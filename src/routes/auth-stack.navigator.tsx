import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Screens} from '../config/constants';

import SignupScreen from '../screens/signup.screen';
import LoginScreen from '../screens/login.screen';
import ForgotPasswordScreen from '../screens/forgot-password.screen';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={Screens.LOGIN_SCREEN} component={LoginScreen} />
      <Stack.Screen name={Screens.SIGN_UP_SCREEN} component={SignupScreen} />
      <Stack.Screen
        name={Screens.FORGOT_PASSWORD_SCREEN}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}
