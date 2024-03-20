import React from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {Button} from '@react-native-material/core';
import {Colors, Fonts, Images} from '../assets/assets';
import {verticalScale as h} from 'react-native-size-matters';
import {navigate} from '../config/refNavigation';
import FastImage from 'react-native-fast-image';

function Page(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerHeader}>
        <FastImage
          style={{width: h(100), height: h(100)}}
          source={Images.logoSahara}
          resizeMode={FastImage.resizeMode.contain}
        />

        <FastImage
          style={{width: h(200), height: h(200)}}
          source={Images.logoMan}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>

      <View style={styles.containerForm}>
        <View style={styles.containerGap}>
          <Text style={styles.label}>Selamat Datang!</Text>
          <Text style={styles.subLabel}>
            Produsen Makanan Daging Olahan Berkualitas dan Terpercaya
          </Text>
        </View>

        <View style={styles.containerGap}>
          <Button
            title="Sign Up"
            titleStyle={styles.buttonTitleSign}
            color={Colors.button}
            tintColor="white"
            onPress={() => {
              navigate({route: 'InitSignUpPages'});
            }}
          />

          <Button
            title="Login"
            variant="outlined"
            titleStyle={styles.buttonTitleLogin}
            tintColor="white"
            color={Colors.button}
            onPress={() => {
              navigate({route: 'InitLoginPages'});
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
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
    fontSize: Fonts.size.xl,
    fontFamily: Fonts.family.bold,
    color: Colors.text,
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
