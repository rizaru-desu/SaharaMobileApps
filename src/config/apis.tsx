import {DEMO_URL, PROD_URL} from '@env';
import axios from 'axios';
import {replace} from './refNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LOGIN_API = 'login';
export const SIGNUP_API = 'signUp';
export const FORGOT_PASS_API = 'forgotPassword';
export const CHANGE_PASS_API = 'changePassword';

export const DETAIL_USER = 'detailUser';
export const DASHBOARD_DR = 'dashboardDR';
export const DASHBOARD_MEMBER = 'dashboardMember';
export const FIND_DR = 'findDR';
export const FIND_AGENT = 'findAgent';
export const FIND_LABELBOX = 'findLabelBox';
export const FIND_PRODUCTDR = 'findProductDR';
export const ADD_DR = 'addDR';
export const ADD_DETAIL_OWNER = 'addDetailBoothOwner';
export const ADD_BOOTH = 'addBooth';
export const FIND_USER_BOOTH = 'findUserBooth';
export const ADD_USER_BOOTH = 'AddBooth';
export const ADD_POINT_LOYALTY = 'addPointUser';

export const SaharaClient = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? DEMO_URL : PROD_URL,
  timeout: 30000,
});

export const notAuth = () => {
  AsyncStorage.clear();
  replace({route: 'InitSplashPages'});
};

export const getToken = async () => {
  const data = await AsyncStorage.getItem('cookies-user');

  return JSON.parse(data || '').token;
};

export const getFullname = async () => {
  const data = await AsyncStorage.getItem('cookies-user');

  return JSON.parse(data || '').fullname;
};

export const getDetail = async () => {
  const data = await AsyncStorage.getItem('cookies-user');

  return JSON.parse(data || '');
};
