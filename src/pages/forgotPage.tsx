import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Colors, Fonts} from '../assets/assets';
import {Formik} from 'formik';
import {Button, IconButton, TextInput} from '@react-native-material/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {goBack} from '../config/refNavigation';
import {FORGOT_PASS_API, SIGNUP_API, SaharaClient} from '../config/apis';
import {Loading} from '../component/loading.component';
import {Alert} from '../component/alert.component';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';

function Page(): JSX.Element {
  const alertUseable = ({message}: {message: any}) => {
    Alert.show({title: 'Notification', desc: message, autoDismiss: true});
  };

  let formSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  const newPassword = async ({
    values,
  }: {
    values: {
      email: string;
    };
  }) => {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show();
        const client = await SaharaClient.post(FORGOT_PASS_API, values);

        if (client.status === 200) {
          Loading.hide();
          const {message} = client.data;
          alertUseable({
            message: message,
          });
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
      <IconButton
        onPress={() => {
          goBack();
        }}
        icon={
          <Icon
            name="arrow-left-circle"
            size={Fonts.size.xl}
            color={Colors.primary}
          />
        }
      />

      <Text
        style={{
          fontSize: Fonts.size.xl,
          fontFamily: Fonts.family.bold,
          color: Colors.text,
        }}>
        Forgot Password?
      </Text>
      <Text
        style={{
          fontSize: Fonts.size.md,
          fontFamily: Fonts.family.regular,
          color: Colors.text,
        }}>
        we just need you registered emmail address to send password.
      </Text>

      <View style={styles.containerForm}>
        <Formik
          validationSchema={formSchema}
          initialValues={{email: ''}}
          onSubmit={values => newPassword({values})}>
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

                <Button
                  title="Send Passowrd"
                  onPress={handleSubmit as () => void}
                  titleStyle={styles.labelButton}
                  color={Colors.button}
                />
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

  titleSend: {
    color: Colors.text,
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.lg,
    textAlign: 'center',
  },
});
