import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';


import { Accented, Heading } from '../components/formatting.component';
import { Input } from '../components/input.component';

import { Screens, XColors } from '../config/constants';
import { _login } from '../redux/actions/authentication';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { axiosInstance } from '../utils/axiosInstance';

const { width, height } = Dimensions.get('window');

function ForgotPasswordScreen() {
  const paddingVertical = height * 0.02;
  const paddingHorizontal = width * 0.05;
  const [email, setEmail] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(false);

  const navigation = useNavigation();

  const { t } = useTranslation();

  const backgroundStyle = {
    backgroundColor: XColors.lighter
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    axiosInstance
      .post('users/forgotPassword', {
        email,
      })
      .then(() => {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: t('Reset link sent to your email address'),
        });

        navigation.navigate(Screens.LOGIN_SCREEN);
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: t('Failed to send reset link'),
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={{ ...backgroundStyle, ...styles.screen }}>
      <View style={styles.headerButtonsRight}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(Screens.LOGIN_SCREEN);
          }}>
          <View style={styles.iconButton}>
            <Accented>
              <AntDesign name="arrowleft" size={20} />
            </Accented>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{ width: 200, height: 150 }}
          source={require('../../assets/logo.jpg')}
        />
        <Heading level={1}>
          <Text>{t('Forgot Password')}</Text>
        </Heading>
      </View>

      <View style={{ backgroundColor: 'white', padding: 20 }}>
        <Input
          icon="mail"
          placeholder={t('Email')}
          textContentType="emailAddress" // auto-fill ios
          autoComplete="email" // auto-fill android
          keyboardType="email-address"
          onChangeText={val => setEmail(val)}
        />
        <View style={{ height: 20 }} />

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 50,
              width: 190,
              elevation: 3,
            }}>
            <TouchableNativeFeedback onPress={() => handleForgotPassword()}>
              <View
                style={{
                  backgroundColor: XColors.accent,
                  paddingVertical: paddingVertical,
                  paddingHorizontal: paddingHorizontal,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                }}>
                {isLoading ? (
                  <ActivityIndicator color={'white'} size={20} />
                ) : (
                  <Text>{t('Send reset link')}</Text>
                )}
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'white', justifyContent: 'center' },
  iconButton: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 0,
    marginTop: 10,
  },
  headerButtonsRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    zIndex: 9999,
    width: '100%',
  },
});

export default ForgotPasswordScreen;
