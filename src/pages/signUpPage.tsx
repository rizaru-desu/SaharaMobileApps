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
import {Formik, useFormikContext} from 'formik';
import {Button, TextInput} from '@react-native-material/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useMaskedInputProps} from 'react-native-mask-input';
import {replace} from '../config/refNavigation';
import {SIGNUP_API, SaharaClient} from '../config/apis';
import {Loading} from '../component/loading.component';
import {Alert} from '../component/alert.component';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import DatePicker from 'react-native-date-picker';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';

function Page(): JSX.Element {
  const [showPass, setShowPass] = React.useState<boolean>(false);
  const [showDate, setShowDate] = React.useState<boolean>(false);

  let formSchema = yup.object().shape({
    fullname: yup
      .string()
      .min(3, ({min}) => `Fullname must be at least ${min} characters`)
      .required('Fullname is required'),
    phone: yup
      .string()
      .min(12, ({min}) => `Phone must be at least ${min} characters`)
      .required('Phone is required'),
    bornDate: yup.string().required('Date of Birth is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(6, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });

  const alertUseable = ({message}: {message: any}) => {
    Alert.show({title: 'Notification', desc: message, autoDismiss: true});
  };

  const radioButtons: RadioButtonProps[] = React.useMemo(
    () => [
      {
        id: '6467c855-165d-4dc8-88b5-68c54599e930',
        label: 'Booth Owner',
        value: 'Booth Owner',
        borderColor: Colors.primary,
        color: Colors.primary,
      },
      {
        id: '503da001-3e56-414b-81c0-4329287ea6c7',
        label: 'Booth Member',
        value: 'Booth Member',
        borderColor: Colors.primary,
        color: Colors.primary,
      },
    ],
    [],
  );

  const registerUser = async ({
    values,
  }: {
    values: {
      email: string;
      password: string;
      bornDate: string;
      fullname: string;
      phone: string;
      roles: string;
    };
  }) => {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show();
        const client = await SaharaClient.post(SIGNUP_API, {
          email: values.email,
          fullname: values.fullname,
          phone: values.phone,
          bod: values.bornDate,
          roles: values.roles,
          password: values.password,
        });

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
      <KeyboardAwareScrollView
        enableAutomaticScroll
        showsVerticalScrollIndicator={false}>
        <View style={styles.containerImage}>
          <FastImage
            style={{width: h(100), height: h(100)}}
            source={Images.logoSahara}
            resizeMode={FastImage.resizeMode.contain}
          />

          <FastImage
            style={{width: h(100), height: h(100)}}
            source={Images.logoSignUp}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <View style={styles.containerForm}>
          <Text style={styles.titleLogin}>
            Join Us: Create Your Account Today!
          </Text>
          <Formik
            validationSchema={formSchema}
            initialValues={{
              email: '',
              password: '',
              bornDate: '',
              fullname: '',
              phone: '',
              roles: '',
            }}
            onSubmit={values => registerUser({values})}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              errors,
              values,
            }) => (
              <View style={styles.containerTextInput}>
                <View style={styles.containerTextInput}>
                  <Text style={styles.label}>Fullname</Text>
                  <TextInput
                    placeholder="Please enter the fullname"
                    variant="outlined"
                    leading={
                      <Icon
                        name="card-account-details"
                        size={Fonts.size.md}
                        color={Colors.primary}
                      />
                    }
                    color={Colors.primary}
                    inputStyle={styles.inputStyle}
                    onChangeText={handleChange('fullname')}
                    onBlur={handleBlur('fullname')}
                    value={values.fullname}
                  />
                </View>

                {errors.fullname && (
                  <Text style={styles.errorLabel}>{errors.fullname}</Text>
                )}

                <PhoneInput />

                <View style={styles.containerTextInput}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TextInput
                    placeholder="Please enter the date of birth"
                    variant="outlined"
                    leading={
                      <Icon
                        name="calendar"
                        size={Fonts.size.md}
                        color={Colors.primary}
                      />
                    }
                    trailing={
                      <TouchableOpacity onPress={() => setShowDate(true)}>
                        <Icon
                          name="calendar-edit"
                          size={Fonts.size.md}
                          color={Colors.primary}
                        />
                      </TouchableOpacity>
                    }
                    color={Colors.primary}
                    inputStyle={styles.inputStyle}
                    onBlur={handleBlur('bornDate')}
                    value={values.bornDate}
                    readOnly
                  />
                </View>

                <DatePicker
                  modal
                  title="Date of Birth"
                  mode="date"
                  open={showDate}
                  date={new Date()}
                  androidVariant="nativeAndroid"
                  onConfirm={date => {
                    setShowDate(false);
                    setFieldValue(
                      'bornDate',
                      moment(date).format('DD-MM-YYYY').toString(),
                    );
                  }}
                  onCancel={() => {
                    setShowDate(false);
                  }}
                />

                {errors.bornDate && (
                  <Text style={styles.errorLabel}>{errors.bornDate}</Text>
                )}

                <RadioGroup
                  radioButtons={radioButtons}
                  onPress={handleChange('roles')}
                  selectedId={values.roles}
                  layout="row"
                  labelStyle={{
                    color: Colors.text,
                    fontFamily: Fonts.family.regular,
                    fontSize: Fonts.size.md,
                  }}
                />

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

                <Button
                  title="Signup"
                  onPress={handleSubmit as () => void}
                  titleStyle={styles.labelButton}
                  color={Colors.button}
                />

                <TouchableOpacity
                  style={styles.alignSignIn}
                  onPress={() => {
                    replace({route: 'InitLoginPages'});
                  }}>
                  <Text style={styles.label}>
                    If you already have an account,{' '}
                    <Text
                      style={[
                        styles.label,
                        {color: Colors.primary, fontFamily: Fonts.family.bold},
                      ]}>
                      Sign In here
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const PhoneInput: React.FC = () => {
  const {
    values: value,
    handleChange: onChangeText,
    errors: err,
    handleBlur: handleBlurs,
  } = useFormikContext<{
    phone: string;
  }>();

  const maskedInputProps = useMaskedInputProps({
    value: value.phone,
    onChangeText: onChangeText('phone'),
    mask: [
      '+',
      '6',
      '2',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  });

  return (
    <>
      <View style={styles.containerTextInput}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          variant="outlined"
          leading={
            <Icon
              name="phone-classic"
              size={Fonts.size.md}
              color={Colors.primary}
            />
          }
          color={Colors.primary}
          inputStyle={styles.inputStyle}
          keyboardType="phone-pad"
          onBlur={handleBlurs('phone')}
          {...maskedInputProps}
        />
      </View>
      {err.phone && <Text style={styles.errorLabel}>{err.phone}</Text>}
    </>
  );
};

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

  alignSignIn: {alignSelf: 'center'},
});
