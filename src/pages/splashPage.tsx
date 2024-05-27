import React, {useCallback} from 'react';
import {NavigationProp} from '@react-navigation/native';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Colors, Fonts, Images} from '../assets/assets';
import {verticalScale as h, scale as w} from 'react-native-size-matters';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {replace} from '../config/refNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from 'react-native';

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
    <SafeAreaView style={styles.container}>
      <Image
        style={{alignSelf: 'center', height: h(70), width: w(70)}}
        source={Images.logoTop}
        resizeMode="contain"
      />
      <View style={styles.containerImage}>
        <Image
          style={styles.images}
          source={Images.logoN}
          resizeMode="contain"
        />

        <Text
          style={{
            fontFamily: Fonts.family.bold,
            fontSize: Fonts.size.md,
            color: 'black',
          }}>
          Customer Loyalty Application by Sahara
        </Text>
      </View>
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
