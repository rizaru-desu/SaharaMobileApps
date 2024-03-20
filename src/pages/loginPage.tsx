import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Fonts, Images} from '../assets/assets';
import {verticalScale as h} from 'react-native-size-matters';
import {Formik} from 'formik';
import {Button, TextInput} from '@react-native-material/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Alert} from '../component/alert.component';
import {LOGIN_API, SaharaClient} from '../config/apis';
import {Loading} from '../component/loading.component';
import {navigate, replace} from '../config/refNavigation';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        Loading.show();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.containerImage}>
        <FastImage
          style={{width: h(100), height: h(100)}}
          source={Images.logoSahara}
          resizeMode={FastImage.resizeMode.contain}
        />

        <FastImage
          style={{width: h(125), height: h(125)}}
          source={Images.logoLogin}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>

      <View style={styles.containerForm}>
        <Text style={styles.titleLogin}>Log In to you Account</Text>
        <Formik
          validationSchema={formSchema}
          initialValues={{email: '', password: ''}}
          onSubmit={values => loginUser({values})}>
          {({handleChange, handleBlur, handleSubmit, errors, values}) => (
            <KeyboardAwareScrollView
              enableAutomaticScroll
              showsVerticalScrollIndicator={false}>
              <View style={styles.containerTextInput}>
                <View style={styles.containerTextInput}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    placeholder="Please enter the email address"
                    variant="outlined"
                    leading={
                      <Icon
                        name="email"
                        size={Fonts.size.md}
                        color={Colors.primary}
                      />
                    }
                    color={Colors.primary}
                    inputStyle={styles.inputStyle}
                    onChangeText={handleChange('email')}
                    keyboardType="email-address"
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                </View>

                {errors.email && (
                  <Text style={styles.errorLabel}>{errors.email}</Text>
                )}

                <View style={styles.containerTextInput}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    placeholder="Please enter the password"
                    variant="outlined"
                    leading={
                      <Icon
                        name="account-key"
                        size={Fonts.size.md}
                        color={Colors.primary}
                      />
                    }
                    trailing={
                      <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                        <Icon
                          name={showPass ? 'eye-off' : 'eye'}
                          size={Fonts.size.md}
                          color={Colors.primary}
                        />
                      </TouchableOpacity>
                    }
                    secureTextEntry={!showPass}
                    color={Colors.primary}
                    inputStyle={styles.inputStyle}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                </View>

                {errors.password && (
                  <Text style={styles.errorLabel}>{errors.password}</Text>
                )}

                <View style={styles.alignForgot}>
                  <TouchableOpacity
                    onPress={() => {
                      navigate({route: 'InitForgotPassPages'});
                    }}>
                    <Text style={styles.label}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                <Button
                  title="Login"
                  onPress={handleSubmit as () => void}
                  titleStyle={styles.labelButton}
                  color={Colors.button}
                />

                <TouchableOpacity
                  style={styles.alignSignUp}
                  onPress={() => {
                    replace({route: 'InitSignUpPages'});
                  }}>
                  <Text style={styles.label}>
                    Don't have an Account?{' '}
                    <Text
                      style={[
                        styles.label,
                        {color: Colors.primary, fontFamily: Fonts.family.bold},
                      ]}>
                      SignUp
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          )}
        </Formik>
      </View>
    </SafeAreaView>
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
    gap: 20,
    justifyContent: 'center',
  },

  containerTextInput: {gap: 10},

  label: {
    fontSize: Fonts.size.md,
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
    color: 'red',
    fontFamily: Fonts.family.bold,
  },

  labelButton: {fontFamily: Fonts.family.bold, color: 'white'},

  titleLogin: {
    color: Colors.text,
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.lg,
    textAlign: 'center',
  },

  alignForgot: {alignItems: 'flex-end'},
  alignSignUp: {alignSelf: 'center'},
});
