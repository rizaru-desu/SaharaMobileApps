import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Linking,
} from 'react-native';
import {Button} from '@react-native-material/core';
import {Colors, Fonts, Images} from '../assets/assets';
import {verticalScale as h} from 'react-native-size-matters';
import {navigate} from '../config/refNavigation';
import FastImage from 'react-native-fast-image';
import {PixelRatio} from 'react-native';

const supportedURL = 'https://google.com';

const unsupportedURL = 'slack://open?team=123456';

function Page(): JSX.Element {
  const handlePress = React.useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL('https://google.com');

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL('https://google.com');
    } else {
      console.log('Error');
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 10}}>
        <FastImage
          style={{width: h(100), height: h(100), alignSelf: 'center'}}
          source={Images.logoN}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.label}>App Loyalty Sahara</Text>

        <Text
          style={{
            fontSize: 28 * PixelRatio.getFontScale(),
            fontFamily: Fonts.family.regular,
            color: 'white',
            textAlign: 'center',
          }}>
          Membangun Bisnis sejak tahun 2016 dirintis dari tahun 1999
        </Text>

        <Text
          style={{
            marginVertical: 10,
            fontSize: 25 * PixelRatio.getFontScale(),
            fontFamily: Fonts.family.regular,
            color: 'white',
            textAlign: 'justify',
          }}>
          PT. Sahara Bogatama Indonesia berdiri sejak tahun 2016, dirintis dari
          tahun 1999 mulai dari industri rumah tangga, kemudian membentuk CV.
          Sahara Bogatama pada tahun 2007 hingga resmi menjadi PT. Sahara
          Bogatama Indonesia pada tahun 2016 dan berfokus menjadi produsen
          daging kebab halal berkualitas.
        </Text>

        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <FastImage
            style={{
              width: 200 * PixelRatio.getFontScale(),
              height: 200 * PixelRatio.getFontScale(),
            }}
            source={{
              uri: 'https://saharabogatama.co.id/wp-content/uploads/2020/04/Kebab-Premium.png',
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <FastImage
            style={{
              width: 200 * PixelRatio.getFontScale(),
              height: 200 * PixelRatio.getFontScale(),
            }}
            source={{
              uri: 'https://saharabogatama.co.id/wp-content/uploads/2020/04/Tortilla.png',
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <FastImage
            style={{
              width: 200 * PixelRatio.getFontScale(),
              height: 200 * PixelRatio.getFontScale(),
            }}
            source={{
              uri: 'https://saharabogatama.co.id/wp-content/uploads/2020/09/burger-new.png',
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <Text
          style={{
            marginVertical: 10,
            fontSize: 25 * PixelRatio.getFontScale(),
            fontFamily: Fonts.family.regular,
            color: 'white',
            textAlign: 'center',
          }}>
          Informasi lebih lanjut seputar Daging Kebab Sahara
        </Text>
        <Text
          style={{
            marginVertical: 10,
            fontSize: 25 * PixelRatio.getFontScale(),
            fontFamily: Fonts.family.regular,
            color: 'white',
            textAlign: 'center',
          }}>
          Jl. Dr. Ratna Gg. HM. Idrus 1 No.15 A, Jatikramat Jatiasih Bekasi -
          08119992180 - saharabogatama@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  containerLinear: {flex: 1},

  containerHeader: {justifyContent: 'center', alignItems: 'center'},

  containerForm: {
    flex: 1,
    marginVertical: 20,
    gap: 10,
    justifyContent: 'space-around',
  },

  containerGap: {gap: 10},

  label: {
    fontSize: 28 * PixelRatio.getFontScale(),
    fontFamily: Fonts.family.bold,
    color: Colors.secondary,
    textAlign: 'center',
  },

  subLabel: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.italic,
    color: Colors.text,
    textAlign: 'center',
  },

  buttonTitleSign: {fontFamily: Fonts.family.bold, color: 'white'},
  buttonTitleLogin: {fontFamily: Fonts.family.bold, color: Colors.text},
});
