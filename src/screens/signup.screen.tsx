import React from 'react';
import {Alert, Image, Platform} from 'react-native';
import {StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Accented, Heading} from '../components/formatting.component';
import {Input, PasswordInput} from '../components/input.component';
import {Screens, XColors} from '../config/constants';
import {
  _accountRegister,
  _login_facebook,
  _login_google,
} from '../redux/actions/authentication';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import { _login_apple } from '../redux/actions/authentication'; 

function SignupScreen(props): JSX.Element {
  const [profile, setProfile] = React.useState('CLIENT');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [cnPassword, setCnPassword] = React.useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  const handleSignUp = async () => {
    const userData = {email, password, cnPassword};
    const responseData = await dispatch(_accountRegister(userData));

    Toast.show({
      type: 'success',
      text1: t('Account created successfully, please login now'),
    });
    navigation.navigate(Screens.LOGIN_SCREEN);
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
              _login_facebook({authToken: result}),
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
              _login_facebook({authToken: result?.accessToken}),
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
      } catch (error) {}
    };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      const signInResult = await GoogleSignin.signIn();
      let idToken = signInResult.data?.idToken;

      if (idToken) {
        const responseData = await dispatch(_login_google({idToken}));

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

      const { identityToken } = appleAuthRequestResponse;

      if (identityToken) {
        const responseData = await dispatch(_login_apple({ identityToken }));
        if (!responseData?.error) {
            props.navigation.navigate(Screens.HOME_SCREEN);
        }
      }
    } catch (error) { /* gestion erreur */ }
  };

  return (
    <View style={{...backgroundStyle, ...styles.screen}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{width: 200, height: 150}}
          source={require('../../assets/logo.jpg')}
        />
        <Heading level={1}>
          <Text>{t('Create Account')}</Text>
        </Heading>
      </View>

      <View style={{backgroundColor: 'white', padding: 20}}>
        <Input
          icon="mail"
          placeholder={t('Email')}
          keyboardType="email-address"
          onChangeText={val => setEmail(val)}
        />
        <View style={{height: 20}} />
        <PasswordInput
          icon="lock1"
          placeholder={t('Password')}
          onChangeText={val => setPassword(val)}
        />
        <View style={{height: 20}} />
        <PasswordInput
          icon="lock1"
          placeholder={t('Confirm Password')}
          onChangeText={val => setCnPassword(val)}
        />
        <View style={{height: 20}} />

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              overflow: 'hidden',
              borderRadius: 50,
              elevation: 3,
            }}>
            <TouchableNativeFeedback onPress={() => handleSignUp()}>
              <View
                style={{
                  backgroundColor: XColors.accent,
                  paddingVertical: 15,
                  paddingHorizontal: 30,
                  borderRadius: 50,
                }}>
                <Text style={{flexWrap: 'nowrap'}} numberOfLines={1}>
                  {t('Sign Up')}
                </Text>
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
          <Text style={{color: 'grey'}}>{t('Already have an Account?')}</Text>
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => props.navigation.navigate(Screens.LOGIN_SCREEN)}>
            <Accented>
              <Text>{t('Login')}</Text>
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
          <TouchableOpacity onPress={() => handleFBLogin()}>
            <Image
              style={{width: 50, height: 50}}
              source={require('../../assets/facebook.png')}
            />
          </TouchableOpacity>
          <View style={{width: 20}} />
          <TouchableOpacity onPress={() => handleGoogleLogin()}>
            <Image
              style={{width: 50, height: 50}}
              source={require('../../assets/google.png')}
            />
          </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <>
            <View style={{ width: 20 }} />
            <TouchableOpacity onPress={handleAppleLogin}>
              <Image style={{ width: 50, height: 50 }} source={require('../../assets/apple.png')} />
            </TouchableOpacity>
          </>
        )}

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: 'white', justifyContent: 'center'},
});

export default SignupScreen;
