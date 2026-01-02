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
  Platform,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import { _login_apple } from '../redux/actions/authentication';

import { Accented, Heading } from '../components/formatting.component';
import { Input, PasswordInput } from '../components/input.component';

import { Screens, XColors } from '../config/constants';
import {
  _login,
  _login_facebook,
  _login_google,
} from '../redux/actions/authentication';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

function LoginScreen(props) {
  const paddingVertical = height * 0.02;
  const paddingHorizontal = width * 0.05;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const isLoading = useSelector(state => state?.authentication?.is_loading);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { t } = useTranslation();

  const backgroundStyle = {
    backgroundColor: XColors.lighter
  };

  const handleSignIn = async () => {
    const userData = { email, password };

    const responseData = await dispatch(_login(userData));

    if (responseData?.error) {
      Toast.show({
        type: 'error',
        text1: responseData?.error,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: t('Login successfully'),
      });

      props.navigation.navigate(Screens.HOME_SCREEN);
    }
  };

  const handleFBLogin = async () => {
    try {
      await LoginManager.logInWithPermissions(
        ['public_profile', 'email'],
        'limited',
        'my_nonce',
      );

      if (Platform.OS === 'ios') {

        const result = await AuthenticationToken.getAuthenticationTokenIOS();

        if (result) {
          const responseData = await dispatch(
            _login_facebook({ authToken: result }),
          );

          if (responseData?.error) {
            Toast.show({
              type: 'error',
              text1: responseData?.error,
            });
          } else {
            Toast.show({
              type: 'success',
              text1: t('Login successfully'),
            });

            props.navigation.navigate(Screens.HOME_SCREEN);
          }
        } else {
          throw new Error('Failed to get token');
        }
      } else {
        const result = await AccessToken.getCurrentAccessToken();

        if (result?.accessToken) {
          const responseData = await dispatch(
            _login_facebook({ authToken: result?.accessToken }),
          );

          if (responseData?.error) {
            Toast.show({
              type: 'error',
              text1: responseData?.error,
            });
          } else {
            Toast.show({
              type: 'success',
              text1: t('Login successfully'),
            });

            props.navigation.navigate(Screens.HOME_SCREEN);
          }
        } else {
          throw new Error('Failed to get token');
        }
      }
    } catch (error) { }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken;

      if (idToken) {
        const responseData = await dispatch(_login_google({ idToken }));

        if (responseData?.error) {
          Toast.show({
            type: 'error',
            text1: responseData?.error,
          });
        } else {
          Toast.show({
            type: 'success',
            text1: t('Login successfully'),
          });

          props.navigation.navigate(Screens.HOME_SCREEN);
        }
      } else {
        Alert.alert('Error', 'Failed to get token');
      }
    } catch (error: any) {
      console.log('ERRRO ==========> ', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const handleAppleLogin = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, nonce } = appleAuthRequestResponse;

      if (identityToken) {
        // Dispatch vers votre action Redux
        const responseData = await dispatch(_login_apple({ identityToken, nonce }));

        if (responseData?.error) {
          Toast.show({ type: 'error', text1: responseData?.error });
        } else {
          Toast.show({ type: 'success', text1: t('Login successfully') });
          props.navigation.navigate(Screens.HOME_SCREEN);
        }
      }
    } catch (error: any) {
      if (error.code !== appleAuth.Error.CANCELED) {
        console.error(error);
      }
    }
  };
  const keyboardOffset = Platform.OS === 'ios' ? 64 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundStyle.backgroundColor }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardOffset}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="always"   // iOS: évite que ça passe sous la barre
          keyboardShouldPersistTaps="handled"       // garder les press sur les inputs
          contentContainerStyle={{ flexGrow: 1 }}
        >

          <View style={{ ...backgroundStyle, ...styles.screen }}>
            <View style={styles.headerButtonsRight}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(Screens.HOME_SCREEN);
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
                <Text>{t('Login')}</Text>
              </Heading>
            </View>

            <View style={{ backgroundColor: 'white', padding: 20 }}>
              <Input
                icon="mail"
                placeholder={t('Email')}
                textContentType="emailAddress" // auto-fill ios
                autoComplete="email"            // auto-fill android
                keyboardType="email-address"
                onChangeText={val => setEmail(val)}
              />
              <View style={{ height: 20 }} />
              <View style={{ alignItems: 'flex-end' }}>
                <PasswordInput
                  icon="lock1"
                  placeholder={t('Password')}
                  onChangeText={val => setPassword(val)}
                />
                <TouchableOpacity
                  style={{ marginTop: 10 }}
                  onPress={() => navigation.navigate(Screens.FORGOT_PASSWORD_SCREEN)}>
                  <Accented>
                    <Text>{t('Forgot Password?')}</Text>
                  </Accented>
                </TouchableOpacity>
              </View>
              <View style={{ height: 20 }} />

              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View
                  style={{
                    overflow: 'hidden',
                    borderRadius: 50,
                    elevation: 3,
                  }}>
                  <TouchableNativeFeedback onPress={() => handleSignIn()}>
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
                        <Text style={styles.loginButtonText} numberOfLines={1}>
                          {t('LOGIN')}
                        </Text>
                      )}
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 20,
                  justifyContent: 'center',
                }}>
                <Text style={{ color: 'grey' }}>{t("Don't have an Account?")} </Text>
                <TouchableOpacity
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  onPress={() => props.navigation.navigate(Screens.SIGN_UP_SCREEN)}>
                  <Accented>
                    <Text>{t('Sign Up')}</Text>
                  </Accented>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: 'relative',
                  borderBottomWidth: 0.5,
                  borderColor: 'grey',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Text
                  style={{
                    color: 'grey',
                    position: 'absolute',
                    top: -10,
                    backgroundColor: 'white',
                    paddingHorizontal: 25,
                  }}>
                  {t('OR')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <TouchableOpacity onPress={handleFBLogin}>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require('../../assets/facebook.png')}
                  />
                </TouchableOpacity>
                <View style={{ width: 20 }} />
                <TouchableOpacity onPress={handleGoogleLogin}>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require('../../assets/google.png')}
                  />
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                  <>
                    <View style={{ width: 20 }} />
                    <TouchableOpacity onPress={handleAppleLogin}>
                      <Image
                        style={{ width: 50, height: 50 }}
                        source={require('../../assets/apple.png')} // Assurez-vous d'avoir l'icône
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  loginButtonText: {
    flexWrap: 'nowrap',
  },
});

export default LoginScreen;
