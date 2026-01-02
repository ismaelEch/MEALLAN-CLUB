import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { Settings } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import 'intl-pluralrules';

import store from './src/redux/store';
import { Routes } from './src/routes';
import SplashScreen from './src/screens/splash.screen';
import Toast from 'react-native-toast-message';
import i18n from './src/utils/i18n';
import { I18nextProvider } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';

if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setKeyboardDistanceFromTextField(10);
  KeyboardManager.setEnableAutoToolbar(false);
}

GoogleSignin.configure({
  webClientId:
    '1094405681856-rm8vvfdegidmdb5i7totf2gtalar8hal.apps.googleusercontent.com',
  iosClientId: '1094405681856-hr6d569cpp0qeel6crt6tsj4pqjq1dqk.apps.googleusercontent.com'
});

Settings.setAppID('1063334835206710');
Settings.initializeSDK();

function App() {
  const backgroundStyle = {
    backgroundColor: '#FFFFFF',
  };

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const initialDistance = await AsyncStorage.getItem('distance');
      if (initialDistance) return;
      await AsyncStorage.setItem('distance', '100');
    })();

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <SafeAreaView style={{ ...backgroundStyle, ...styles.app }}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <NavigationContainer>
              <Routes />
              <Toast />
            </NavigationContainer>
          </Provider>
        </I18nextProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  app: { display: 'flex', flex: 1 },
});

export default App;
