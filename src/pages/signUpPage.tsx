import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput as TxI,
  View,
} from 'react-native';
import {Colors, Fonts, Images} from '../assets/assets';
import {verticalScale as h} from 'react-native-size-matters';
import {Formik, useFormikContext} from 'formik';
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
        Loading.show({});
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
            source={Images.logoN}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <View style={styles.containerForm}>
          <Text style={styles.titleLogin}>Create an Account</Text>
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
                  <TxI
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 100,
                      paddingHorizontal: 20,
                      color: 'black',
                      fontFamily: Fonts.family.regular,
                      fontSize: Fonts.size.lg,
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder="Fullname"
                    onChangeText={handleChange('fullname')}
                    onBlur={handleBlur('fullname')}
                    value={values.fullname}
                    placeholderTextColor={Colors.placeholder}
                  />
                </View>

                {errors.fullname && (
                  <Text style={styles.errorLabel}>{errors.fullname}</Text>
                )}

                <PhoneInput />

                <TouchableOpacity
                  onPress={() => {
                    setShowDate(true);
                  }}
                  style={styles.containerTextInput}>
                  <TxI
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 100,
                      paddingHorizontal: 20,
                      color: 'black',
                      fontFamily: Fonts.family.regular,
                      fontSize: Fonts.size.lg,
                      borderColor: 'black',
                      borderWidth: 1,
                    }}
                    placeholder="Date of birth"
                    onBlur={handleBlur('bornDate')}
                    value={values.bornDate}
                    readOnly
                    placeholderTextColor={Colors.placeholder}
                  />
                </TouchableOpacity>

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

                <View style={styles.containerTextInput}>
                  <TxI
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 100,
                      paddingHorizontal: 20,
                      color: 'black',
                      fontFamily: Fonts.family.regular,
                      fontSize: Fonts.size.lg,
                      borderColor: 'black',
                      borderWidth: 1,
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
                      borderColor: 'black',
                      borderWidth: 1,
                      alignItems: 'center',
                    }}>
                    <TxI
                      style={{
                        width: '95%',
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
                    <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                      <Icon
                        name={showPass ? 'eye-off' : 'eye'}
                        size={Fonts.size.xl}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {errors.password && (
                  <Text style={styles.errorLabel}>{errors.password}</Text>
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

                <TouchableOpacity
                  onPress={handleSubmit as () => void}
                  style={{
                    paddingHorizontal: 30,
                    paddingVertical: 10,
                    backgroundColor: '#FEB941',
                    borderRadius: 20,
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.label, {color: '#505050'}]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>

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
                      Login
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
        <TxI
          style={{
            backgroundColor: 'white',
            borderRadius: 100,
            paddingHorizontal: 20,
            color: 'black',
            fontFamily: Fonts.family.regular,
            fontSize: Fonts.size.lg,
            borderColor: 'black',
            borderWidth: 1,
          }}
          keyboardType="phone-pad"
          onBlur={handleBlurs('phone')}
          placeholderTextColor={Colors.placeholder}
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
    padding: 30,
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
    color: Colors.error,
    fontFamily: Fonts.family.bold,
  },

  labelButton: {fontFamily: Fonts.family.bold, color: 'white'},

  titleLogin: {
    color: Colors.text,
    fontFamily: Fonts.family.bold,
    fontSize: h(20),
    textAlign: 'left',
  },

  alignSignIn: {alignSelf: 'center'},
});
