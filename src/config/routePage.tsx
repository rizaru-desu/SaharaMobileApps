import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  ForgotPassPage,
  LandingPage,
  LoginPage,
  SplashPage,
  SignUpPage,
  CreateDRPage,
  ScanQRPage,
  ProductDRPage,
  HomePage,
  SettingPage,
  AddBooth,
  RedeemPage,
} from '../pages';

const Stack = createStackNavigator();

function RoutePages() {
  return (
    <Stack.Navigator
      initialRouteName="InitSplashPages"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="InitSplashPages" component={SplashPage} />
      <Stack.Screen name="InitLandingPages" component={LandingPage} />
      <Stack.Screen name="InitLoginPages" component={LoginPage} />
      <Stack.Screen name="InitForgotPassPages" component={ForgotPassPage} />
      <Stack.Screen name="InitSignUpPages" component={SignUpPage} />
      <Stack.Screen name="InitHomePages" component={HomePage} />
      <Stack.Screen name="InitAddBooth" component={AddBooth} />
      <Stack.Screen name="InitCretedDRPages" component={CreateDRPage} />
      <Stack.Screen name="InitProductDRPages" component={ProductDRPage} />
      <Stack.Screen name="InitScanQRPages" component={ScanQRPage} />
      <Stack.Screen
        name="settingPage"
        options={{title: 'Setting'}}
        component={SettingPage}
      />
      <Stack.Screen
        name="redeemPage"
        options={{title: 'Redeem Package'}}
        component={RedeemPage}
      />
    </Stack.Navigator>
  );
}

export default RoutePages;
