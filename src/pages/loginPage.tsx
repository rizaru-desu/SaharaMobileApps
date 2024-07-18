import React from 'react';
import {
  ImageBackground,
  TextInput as TxI,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Fonts, Images} from '../assets/assets';
import {
  verticalScale as h,
  moderateVerticalScale,
} from 'react-native-size-matters';
import {Formik} from 'formik';
import {Alert} from '../component/alert.component';
import {LOGIN_API, SaharaClient} from '../config/apis';
import {Loading} from '../component/loading.component';
import {navigate, replace} from '../config/refNavigation';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropShadow from 'react-native-drop-shadow';
import {BlurView} from '@react-native-community/blur';

function Page(): JSX.Element {
  const [showPass, setShowPass] = React.useState<boolean>(false);

  let formSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(6, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });

  const alertUseable = ({message}: {message: any}) => {
    Alert.show({title: 'Notification', desc: message, autoDismiss: true});
  };

  const loginUser = async ({
    values,
  }: {
    values: {email: string; password: string};
  }) => {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({title: 'Logingin....'});
        const client = await SaharaClient.post(LOGIN_API, values);

        if (client.status === 200) {
          Loading.hide();

          const {userData} = client.data;

          const jsonValue = JSON.stringify(userData);
          await AsyncStorage.setItem('cookies-user', jsonValue);

          replace({route: 'InitHomePages'});
        }
      } catch (error: any) {
        Loading.hide();
        let status = '';
        switch (error.response?.status) {
          case 404:
            status = 'Error: Resource not found';
            break;
          case 500:
            status = 'Error: Internal Server Error';
            break;
          case 403:
            status = 'Error: Forbidden';
            break;
          case 401:
            status = 'Error: Unauthorized';
            break;
          default:
            status = `Error: Unexpected status code ${error.response?.status}`;
        }

        alertUseable({
          message: `Status ${error.response?.status} - ${status}\n${error.response.data.message}`,
        });
      }
    } else {
      alertUseable({message: 'Please check your connection internet'});
    }
  };

  return (
    <ImageBackground
      source={Images.logoBG}
      resizeMode="cover"
      style={styles.container}>
      <View style={styles.containerImage}>
        <DropShadow
          style={{
            shadowColor: '#807569',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 1,
            shadowRadius: 0.5,
          }}>
          <FastImage
            style={{width: h(100), height: h(100)}}
            source={Images.logoN}
            resizeMode={FastImage.resizeMode.contain}
          />
        </DropShadow>
      </View>

      <View style={styles.containerForm}>
        <Formik
          validationSchema={formSchema}
          initialValues={{email: '', password: ''}}
          onSubmit={values => loginUser({values})}>
          {({handleChange, handleBlur, handleSubmit, errors, values}) => (
            <DropShadow
              style={{
                shadowColor: '#fff',
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 1,
                shadowRadius: 2,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  paddingVertical: 50,
                  paddingHorizontal: 10,
                  borderWidth: 2,
                  borderRadius: 20,
                  borderColor: 'white',
                  overflow: 'hidden',
                  backgroundColor: 'rgba(35,43,43, 0.2)',
                }}>
                <BlurView
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    top: 0,
                    right: 0,
                  }}
                  blurType="light"
                  blurAmount={20}
                  reducedTransparencyFallbackColor="white"
                />
                <View style={styles.containerTextInput}>
                  <View style={styles.containerTextInput}>
                    <TxI
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 100,
                        paddingHorizontal: 20,
                        color: 'black',
                        fontFamily: Fonts.family.regular,
                        fontSize: Fonts.size.lg,
                      }}
                      placeholder="Email"
                      onChangeText={handleChange('email')}
                      keyboardType="email-address"
                      onBlur={handleBlur('email')}
                      value={values.email}
                      placeholderTextColor={Colors.placeholder}
                    />
                  </View>

                  {errors.email && (
                    <Text style={styles.errorLabel}>{errors.email}</Text>
                  )}

                  <View style={styles.containerTextInput}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        borderRadius: 100,
                        paddingHorizontal: 20,
                        alignItems: 'center',
                      }}>
                      <TxI
                        style={{
                          width: '87%',
                          color: 'black',
                          fontFamily: Fonts.family.regular,
                          fontSize: Fonts.size.lg,
                        }}
                        placeholder="Password"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        secureTextEntry={!showPass}
                        autoCapitalize="none"
                        keyboardType="default"
                        placeholderTextColor={Colors.placeholder}
                      />
                      <TouchableOpacity
                        style={{
                          height: moderateVerticalScale(48),
                          width: moderateVerticalScale(48),
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => setShowPass(!showPass)}>
                        <Icon
                          name={showPass ? 'eye-off' : 'eye'}
                          size={moderateVerticalScale(25)}
                          color={'#AF6420'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {errors.password && (
                    <Text style={styles.errorLabel}>{errors.password}</Text>
                  )}

                  <View style={styles.alignForgot}>
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 5,
                        paddingVertical: 15,
                        alignItems: 'center',
                        height: h(48),
                      }}
                      onPress={() => {
                        navigate({route: 'InitForgotPassPages'});
                      }}>
                      <Text style={styles.label}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={handleSubmit as () => void}
                    style={{
                      paddingHorizontal: 30,
                      paddingVertical: 14,
                      backgroundColor: '#FF6500',
                      borderRadius: 1000,
                      alignSelf: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={[styles.label, {color: '#1E1E1E'}]}>
                      Login
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.alignSignUp}>
                    <Text style={styles.label}>don't have an Account?</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      replace({route: 'InitSignUpPages'});
                    }}
                    style={{
                      paddingHorizontal: 30,
                      paddingVertical: 14,
                      backgroundColor: '#FEB941',
                      borderRadius: 1000,
                      alignItems: 'center',
                    }}>
                    <Text style={[styles.label, {color: '#505050'}]}>
                      Create Account
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </DropShadow>
          )}
        </Formik>
      </View>
    </ImageBackground>
  );
}

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    gap: 20,
    backgroundColor: 'white',
  },

  containerImage: {alignItems: 'center', gap: 10},

  containerForm: {
    flex: 1,
    justifyContent: 'center',
  },

  containerTextInput: {gap: 10},

  label: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.family.regular,
    color: Colors.text,
  },

  inputStyle: {
    fontFamily: Fonts.family.regular,
    color: Colors.text,
    padding: 0,
  },

  errorLabel: {
    fontSize: Fonts.size.sm,
    color: Colors.error,
    fontFamily: Fonts.family.bold,
  },

  labelButton: {fontFamily: Fonts.family.bold, color: 'white'},

  titleLogin: {
    color: Colors.text,
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.md,
    textAlign: 'center',
  },

  alignForgot: {alignItems: 'flex-end'},
  alignSignUp: {alignSelf: 'center'},
});
