import React, {useCallback} from 'react';
import {NavigationProp} from '@react-navigation/native';
import {Linking, SafeAreaView, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../assets/assets';
import {verticalScale as h, scale as w} from 'react-native-size-matters';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {replace} from '../config/refNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LottieView from 'lottie-react-native';

import checkVersion from 'react-native-store-version';
import {Alert} from '../component/alert.component';
import {useNetInfo} from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';

interface SplashPageProps {
  navigation: NavigationProp<any>;
}

function SplashPage({navigation}: SplashPageProps): JSX.Element {
  const {isConnected, isInternetReachable} = useNetInfo();
  const redirect = async () => {
    return await AsyncStorage.getItem('cookies-user');
  };

  const checkUpdate = async () => {
    const checks = await checkVersion({
      version: DeviceInfo.getVersion(), // app local version
      iosStoreURL: 'ios app store url',
      androidStoreURL:
        'https://play.google.com/store/apps/details?id=id.co.saharabogatam.loyalty',
      country: 'id', // default value is 'jp'
    });

    return checks;
  };

  const permissionCheck = useCallback(() => {
    check(PERMISSIONS.ANDROID.CAMERA).then(async result => {
      switch (result) {
        case RESULTS.DENIED:
          request(PERMISSIONS.ANDROID.CAMERA).then(async () => {
            const redirects = await redirect();
            if (redirects) {
              replace({route: 'InitHomePages'});
            } else {
              replace({route: 'InitLoginPages'});
            }
          });
          break;

        case RESULTS.GRANTED:
          const redirects = await redirect();
          if (redirects) {
            replace({route: 'InitHomePages'});
          } else {
            replace({route: 'InitLoginPages'});
          }

          break;
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LottieView
        style={{height: '100%', width: '100%'}}
        resizeMode="cover"
        hardwareAccelerationAndroid
        source={require('../assets/images/Splash.json')}
        autoPlay
        loop={false}
        speed={0.5}
        onAnimationFinish={() => {
          if (isConnected && isInternetReachable) {
            permissionCheck();
            /* checkUpdate().then(value => {
              if (value.result !== 'new') {
                Alert.show({
                  title: 'Notification',
                  desc: 'Update is Avaiable.',
                  autoDismiss: false,
                  onDismiss() {
                    Linking.canOpenURL(
                      'https://play.google.com/store/apps/details?id=id.co.saharabogatam.loyalty',
                    )
                      .then(supported => {
                        if (supported) {
                          Linking.openURL(
                            'https://play.google.com/store/apps/details?id=id.co.saharabogatam.loyalty',
                          );
                        }
                      })
                      .catch((e: any) => {
                        console.log(e.message);
                      });
                  },
                });
              } else {
                permissionCheck();
              }
            }); */
          } else {
            Alert.show({
              title: 'Notification',
              desc: 'Please check your internet.',
              autoDismiss: false,
              onDismiss() {},
            });
          }
        }}
      />
    </SafeAreaView>
  );
}

export default SplashPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  containerImage: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
    flex: 1,
  },

  images: {height: h(100), width: w(200)},

  title: {
    fontSize: Fonts.size.xl,
    fontFamily: Fonts.family.bold,
    color: Colors.text,
    textAlign: 'center',
  },

  subTitle: {
    fontSize: Fonts.size.lg,
    fontFamily: Fonts.family.italic,
    color: Colors.text,
    textAlign: 'center',
  },

  footerText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.family.italic,
    color: Colors.text,
    textAlign: 'center',
  },
});
