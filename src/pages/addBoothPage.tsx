import React from 'react';
import {StyleSheet, SafeAreaView, View, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {goBack} from '../config/refNavigation';
import {Formik} from 'formik';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Header from '../component/header.component';
import * as yup from 'yup';
import {Button, IconButton, TextInput} from '@react-native-material/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors, Fonts} from '../assets/assets';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {addBooth, getUser} from '../redux/addBoothRedux';
import {useAppSelector} from '../config/useRedux';

interface PageProps {
  route?: RouteProp<any>;
  navigation: NavigationProp<any>;
}

function Page({route, navigation}: PageProps): JSX.Element {
  const dispatch = useDispatch();
  const {dataUser} = useAppSelector(state => state.initAddBoothRedux);

  let formSchema = yup.object().shape({
    userId: yup.string().required('Please search account member'),
    alamatBooth: yup.string().required('Please enter addreess booth'),
    base64: yup.string().required('Please take or pick from gallery'),
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {});

    return unsubscribe;
  }, [dispatch, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => goBack()} title={'Create DR'} />

      <KeyboardAwareScrollView
        enableAutomaticScroll
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        <Formik
          validationSchema={formSchema}
          initialValues={{
            email: '',
            userId: '',
            alamatBooth: '',
            photoBooth: '',
            base64: '',
          }}
          onSubmit={values => {
            addBooth({
              dispatch,
              values: values,
              boothOwnerId: route?.params?.boothOwnerId,
            });
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            values,
            setFieldValue,
          }) => (
            <View style={styles.containerTextInput}>
              <View style={styles.containerTextInput}>
                <Text style={styles.label}>Search User</Text>
                <View style={styles.containerTrailing}>
                  <View style={{flex: 1}}>
                    <TextInput
                      variant="outlined"
                      leading={
                        <Icon
                          name="account"
                          size={Fonts.size.md}
                          color={Colors.primary}
                        />
                      }
                      color={Colors.primary}
                      inputStyle={styles.inputStyle}
                      keyboardType="email-address"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                    />
                  </View>

                  <IconButton
                    onPress={() => {
                      getUser({dispatch, email: values.email});
                    }}
                    icon={
                      <Icon
                        name="account-search"
                        size={Fonts.size.xl}
                        color={Colors.primary}
                      />
                    }
                  />
                  <IconButton
                    disabled={!dataUser}
                    onPress={() => {
                      setFieldValue('userId', dataUser?.userId);
                    }}
                    icon={
                      <Icon
                        name="content-save"
                        size={Fonts.size.xl}
                        color={!dataUser ? '#808080' : Colors.primary}
                      />
                    }
                  />
                </View>
              </View>

              {errors.userId && (
                <Text style={styles.errorLabel}>{errors.userId}</Text>
              )}

              <View style={styles.containerTextInput}>
                <Text style={styles.label}>Alamat Booth</Text>
                <TextInput
                  variant="outlined"
                  leading={
                    <Icon
                      name="google-maps"
                      size={Fonts.size.md}
                      color={Colors.primary}
                    />
                  }
                  color={Colors.primary}
                  inputStyle={styles.inputStyle}
                  onChangeText={handleChange('alamatBooth')}
                  onBlur={handleBlur('alamatBooth')}
                  value={values.alamatBooth}
                />
              </View>

              {errors.alamatBooth && (
                <Text style={styles.errorLabel}>{errors.alamatBooth}</Text>
              )}

              <View style={styles.containerTextInput}>
                <Text style={styles.label}>Photo Booth</Text>

                <View style={styles.containerTrailing}>
                  <View style={{flex: 1}}>
                    <TextInput
                      variant="outlined"
                      leading={
                        <Icon
                          name="file-image"
                          size={Fonts.size.md}
                          color={Colors.primary}
                        />
                      }
                      color={Colors.primary}
                      inputStyle={styles.inputStyle}
                      onChangeText={handleChange('photoBooth')}
                      onBlur={handleBlur('photoBooth')}
                      value={values.photoBooth}
                      readOnly
                    />
                  </View>

                  <IconButton
                    onPress={async () => {
                      const result = await launchCamera({
                        cameraType: 'back',
                        quality: 0.3,
                        maxHeight: 1000,
                        maxWidth: 750,
                        mediaType: 'photo',
                        includeBase64: true,
                      });

                      if (!result.didCancel) {
                        setFieldValue('photoBooth', result.assets?.[0].uri);
                        setFieldValue('base64', result.assets?.[0].base64);
                      }
                    }}
                    icon={
                      <Icon
                        name="camera"
                        size={Fonts.size.xl}
                        color={Colors.primary}
                      />
                    }
                  />
                  <IconButton
                    onPress={async () => {
                      const result = await launchImageLibrary({
                        quality: 0.3,
                        maxHeight: 1000,
                        maxWidth: 750,
                        mediaType: 'photo',
                        includeBase64: true,
                      });

                      if (!result.didCancel) {
                        setFieldValue('photoBooth', result.assets?.[0].uri);
                        setFieldValue('base64', result.assets?.[0].base64);
                      }
                    }}
                    icon={
                      <Icon
                        name="file-image-plus"
                        size={Fonts.size.xl}
                        color={Colors.primary}
                      />
                    }
                  />
                </View>
              </View>

              {errors.alamatBooth && (
                <Text style={styles.errorLabel}>{errors.alamatBooth}</Text>
              )}

              <Button
                title="Add Booth"
                onPress={handleSubmit as () => void}
                titleStyle={styles.labelButton}
                color={Colors.button}
              />
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default Page;

const styles = StyleSheet.create({
  /** CONTAINER */
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 25,
    gap: 25,
  },
  containerTextInput: {gap: 10},
  containerTrailing: {flexDirection: 'row', gap: 20},

  /** LABEL */
  label: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.regular,
    color: Colors.text,
  },
  labelContentItemAccordion: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.family.regular,
    color: 'white',
  },
  errorLabel: {
    fontSize: Fonts.size.sm,
    color: 'red',
    fontFamily: Fonts.family.bold,
  },
  labelButton: {fontFamily: Fonts.family.bold, color: 'white'},

  /** INPUT */
  inputStyle: {
    fontFamily: Fonts.family.regular,
    color: Colors.text,
    padding: 0,
  },

  /** LABEL */
  labelItem: {
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.sm,
    color: 'white',
  },
  labelHeaderAccordion: {
    color: 'white',
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.bold,
  },
});
