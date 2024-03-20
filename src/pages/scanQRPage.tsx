import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {goBack} from '../config/refNavigation';
import {Button} from '@react-native-material/core';
import {Colors, Fonts} from '../assets/assets';
import DropShadow from 'react-native-drop-shadow';
import Header from '../component/header.component';
import {scanLabelBox} from '../redux/createDRRedux';
import {useDispatch} from 'react-redux';
import {addPointLoyalty} from '../redux/initializeRedux';

interface PageProps {
  route: RouteProp<any>;
  navigation: NavigationProp<any>;
}

function Page({route}: PageProps): JSX.Element {
  const dispatch = useDispatch();
  const device = useCameraDevice('back');
  const [labelQR, setLabelQR] = React.useState<any>(undefined);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      setLabelQR(codes[0].value);
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerViewPad}>
        <Header onBack={() => goBack()} title={'Scan QR'} />
      </View>

      {device == null ? null : (
        <Camera
          style={styles.containerCamera}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
      )}

      <View style={styles.containerViewPad}>
        <DropShadow style={styles.dropShadow}>
          <View
            style={{
              borderRadius: 10,
              backgroundColor: '#FF9D59',
              padding: 10,
              gap: 10,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: Fonts.size.md,
                fontFamily: Fonts.family.bold,
                textAlign: 'center',
              }}>
              Result
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: Fonts.size.sm,
                fontFamily: Fonts.family.regular,
                textAlign: 'center',
              }}>
              {labelQR}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <Button
                compact
                title={'Reset'}
                onPress={() => setLabelQR(undefined)}
                titleStyle={styles.labelButton}
                color={Colors.button}
              />
              <Button
                compact
                title={'Save'}
                onPress={() => {
                  if (route.params?.createDR) {
                    scanLabelBox({
                      dispatch,
                      label: labelQR,
                      currentData: route.params.currentData,
                    });
                  } else {
                    addPointLoyalty({label: labelQR});
                  }
                }}
                titleStyle={styles.labelButton}
                color={Colors.button}
              />
            </View>
          </View>
        </DropShadow>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /** CONTAINER */
  container: {
    flex: 1,
    backgroundColor: 'white',
    gap: 25,
  },
  containerViewPad: {padding: 25},
  containerCamera: {flex: 1},

  /** LABEL */
  labelButton: {fontFamily: Fonts.family.bold, color: 'white'},

  /** SHADOW */
  dropShadow: {
    shadowColor: '#ff690073',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});

export default Page;
