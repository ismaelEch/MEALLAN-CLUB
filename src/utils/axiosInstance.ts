import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {APIURL} from '../config/Url';

export const axiosInstance = axios.create({
  baseURL: APIURL,
});

axiosInstance.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  const lang = await AsyncStorage.getItem('language');

  if (token) {
    config.headers.Authorization = token;
  }

  if (lang) {
    config.params = {...config.params, lang};
  }

  return config;
});

axiosInstance.interceptors.response.use(
  value => {
    return value;
  },
  async error => {
    if (error?.response?.status === 401) {
      await AsyncStorage.clear();
    }
    throw error;
  },
);
