import React, {useCallback} from 'react';
import {NavigationProp} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Fonts, Images} from '../assets/assets';
import LinearGradient from 'react-native-linear-gradient';
import {verticalScale as h, scale as w} from 'react-native-size-matters';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {replace} from '../config/refNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

interface SplashPageProps {
  navigation: NavigationProp<any>;
}

function SplashPage({navigation}: SplashPageProps): JSX.Element {
  const redirect = async () => {
    return await AsyncStorage.getItem('cookies-user');
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
              replace({route: 'InitLandingPages'});
            }
          });
          break;

        case RESULTS.GRANTED:
          const redirects = await redirect();
          if (redirects) {
            replace({route: 'InitHomePages'});
          } else {
            replace({route: 'InitLandingPages'});
          }

          break;
      }
    });
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const timeoutId = setTimeout(() => {
        permissionCheck();
      }, 5000);

      return () => {
        clearTimeout(timeoutId);
      };
    });

    return unsubscribe;
  }, [navigation, permissionCheck]);

  return (
    <LinearGradient
      colors={[Colors.secondary, Colors.primary]}
      style={styles.container}>
      <View style={styles.containerImage}>
        <Animatable.Image
          style={styles.images}
          source={Images.logoSahara}
          resizeMode="contain"
          animation="fadeInDown"
          duration={3000}
        />
      </View>

      <View>
        <Text style={styles.footerText}>
          Copyright © {new Date().getFullYear()} PT.SAHARA BOGATAMA INDONESIA
        </Text>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </LinearGradient>
  );
}

export default SplashPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  containerImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
  },

  images: {height: h(225), width: w(225)},

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
