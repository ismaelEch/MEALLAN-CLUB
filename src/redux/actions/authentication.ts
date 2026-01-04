import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIURL} from '../../config/Url';
import {call} from '../helper';
import {
  IS_LOADING_AUTH,
  LOGIN_USER,
  USER_DATA,
} from '../types/authentication_types';
import axios from 'axios';
import {parseJwt} from '../../utils/decode';

export const _logOut = (navigation: any) => {
  return async (dispatch: (arg0: {type: string; payload: {}}) => void) => {
    await AsyncStorage.removeItem('token');
    dispatch({type: LOGIN_USER, payload: false});
    dispatch({type: USER_DATA, payload: {}});
  };
};

export const _accountRegister = (data: {
  email: any;
  password: any;
  cnPassword: any;
}) => {
  return async (dispatch: (arg0: {type: string; payload: boolean}) => void) => {
    dispatch({type: IS_LOADING_AUTH, payload: true});
    try {
      const requestData = {
        firstname: 'null',
        lastname: 'null',
        email: data.email,
        password: data.password,
        phone: 'null',
      };

      const response = await axios.post(
        APIURL + '/users/signup/CLIENT',
        requestData,
      );

      if (response?.status === 201) {
        dispatch({type: IS_LOADING_AUTH, payload: false});
        return response;
      } else {
        dispatch({type: IS_LOADING_AUTH, payload: false});
        return response;
      }
    } catch (error) {
      console.log(error.response);
      dispatch({type: IS_LOADING_AUTH, payload: false});
    }
  };
};

export const _login_google = (data: {idToken: string}) => {
  return async (dispatch: (arg0: {type: string; payload: {}}) => void) => {
    dispatch({type: IS_LOADING_AUTH, payload: true});

    try {
      const response = await axios.post(APIURL + '/google/signin', {
        idToken: data.idToken,
      });

      if (response?.status === 201) {
        const token = response.data?.token;

        await AsyncStorage.setItem('token', token);

        const userProfileData = parseJwt(token);

        dispatch({
          type: USER_DATA,
          payload: {
            ...(userProfileData || {}),
            id: parseInt(userProfileData?.sub),
          },
        });
        dispatch({type: LOGIN_USER, payload: true});
        dispatch({ type: 'SET_GUEST', payload: false });
        return response;
      } else {
        return {error: 'Failed to login with google'};
      }
    } catch (error) {
      console.warn(error);
      if (error?.response?.status === 503) {
        return {error: 'Internal server error, please try again later'};
      } else {
        return {error: 'Failed to login with google'};
      }
    } finally {
      dispatch({type: IS_LOADING_AUTH, payload: false});
    }
  };
};

export const _login_facebook = (data: {authToken: string}) => {
  return async (dispatch: (arg0: {type: string; payload: {}}) => void) => {
    dispatch({type: IS_LOADING_AUTH, payload: true});

    try {
      const response = await axios.post(APIURL + '/facebook/signin', {
        authToken: data.authToken,
      });


      if (response?.status === 201) {
        const token = response.data?.token;
        await AsyncStorage.setItem('token', token);

        const userProfileData = parseJwt(token);

        dispatch({
          type: USER_DATA,
          payload: {
            ...(userProfileData || {}),
            id: parseInt(userProfileData?.sub),
          },
        });
        dispatch({type: LOGIN_USER, payload: true});
        dispatch({ type: 'SET_GUEST', payload: false });
        return response;
      } else {
        return {error: 'Failed to login with google'};
      }
    } catch (error) {
      console.warn(error);
      if (error?.response?.status === 503) {
        return {error: 'Internal server error, please try again later'};
      } else {
        return {error: 'Failed to login with facebook'};
      }
    } finally {
      dispatch({type: IS_LOADING_AUTH, payload: false});
    }
  };
};

/**
 * Action pour l'authentification via Apple
 * @param data contient le identityToken fourni par le SDK Apple
 */
export const _login_apple = (data: { identityToken: string }) => {
  return async (dispatch: (arg0: { type: string; payload: {} }) => void) => {
    // Déclenche l'état de chargement
    dispatch({ type: IS_LOADING_AUTH, payload: true });

    try {
      // Envoi du token au backend (ajustez l'URL selon votre API)
      const response = await axios.post(APIURL + '/apple/signin', {
        idToken: data.identityToken,
      });

      // Si le backend valide le token et crée/connecte l'utilisateur
      if (response?.status === 201 || response?.status === 200) {
        const token = response.data?.token || response.data; // Adaptez selon le format de votre réponse API
        
        // Stockage du JWT localement
        await AsyncStorage.setItem('token', token);

        // Décodage du JWT pour récupérer les infos utilisateur
        const userProfileData = parseJwt(token);

        dispatch({
          type: USER_DATA,
          payload: {
            ...(userProfileData || {}),
            id: parseInt(userProfileData?.sub),
          },
        });
        
        // Marque l'utilisateur comme connecté
        dispatch({ type: LOGIN_USER, payload: true });
        dispatch({ type: 'SET_GUEST', payload: false });
        return response;
      } else {
        return { error: 'Failed to login with Apple' };
      }
    } catch (error: any) {
      console.warn('Apple Login Error:', error);
      if (error?.response?.status === 503) {
        return { error: 'Internal server error, please try again later' };
      } else {
        return { error: 'Failed to login with Apple' };
      }
    } finally {
      // Arrête le spinner de chargement dans tous les cas
      dispatch({ type: IS_LOADING_AUTH, payload: false });
    }
  };
};

export const _login = (data: {email: any; password: any}) => {
  return async (dispatch: (arg0: {type: string; payload: {}}) => void) => {
    dispatch({type: IS_LOADING_AUTH, payload: true});

    try {
      const requestData = {
        email: data.email,
        password: data.password,
      };

      const response = await axios.post(
        APIURL + '/users/client/signin',
        requestData,
      );

      if (response?.status === 201) {
        const token = response.data;
        await AsyncStorage.setItem('token', token);

        const userProfileData = parseJwt(token);

        dispatch({
          type: USER_DATA,
          payload: {
            ...(userProfileData || {}),
            id: parseInt(userProfileData?.sub),
          },
        });
        dispatch({type: LOGIN_USER, payload: true});
        dispatch({ type: 'SET_GUEST', payload: false });
        return response;
      } else {
        return {error: 'Invalid email or password'};
      }
    } catch (error) {
      console.warn(error);
      if (error?.response?.status === 503) {
        return {error: 'Internal server error, please try again later'};
      } else {
        return {error: 'Invalid email or password'};
      }
    } finally {
      dispatch({type: IS_LOADING_AUTH, payload: false});
    }
  };
};

export const update_password = (data: {email: any; newpassword: any}) => {
  return async (dispatch: (arg0: {type: string; payload: boolean}) => void) => {
    dispatch({type: IS_LOADING_AUTH, payload: true});
    try {
      const token = await AsyncStorage.getItem('token');
      const requestData = {
        token,
        email: data.email,
        password: data.newpassword,
      };
      const responseData = await call('/users/changePassword', requestData);
      dispatch({type: IS_LOADING_AUTH, payload: false});
    } catch (error) {
      console.log(error);
      dispatch({type: IS_LOADING_AUTH, payload: false});
      // Handle error or show a message
    }
  };
};
