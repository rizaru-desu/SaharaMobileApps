import React from 'react';
import {
  StyleSheet,
  TextInput as TxI,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationProp} from '@react-navigation/native';
import {useAppSelector} from '../config/useRedux';
import {goBack, replace} from '../config/refNavigation';
import {
  moderateScale as h,
  moderateVerticalScale,
} from 'react-native-size-matters';
import {Formik} from 'formik';
import {Loading} from '../component/loading.component';
import {SaharaClient, getToken, notAuth} from '../config/apis';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Avatar, IconButton} from '@react-native-material/core';
import {Colors, Fonts, Images} from '../assets/assets';
import {CHANGE_PASS_API} from '../config/apis';
import {Alert} from '../component/alert.component';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

interface PageProps {
  navigation: NavigationProp<any>;
}

function Page({navigation}: PageProps): JSX.Element {
  const dispatch = useDispatch();
  const [showPass, setShowPass] = React.useState<boolean>(false);
  const [showPassConfirm, setShowPassConfirm] = React.useState<boolean>(false);

  const {detailUser} = useAppSelector(state => state.initInitializeRedux);

  let formSchema = yup.object().shape({
    password: yup
      .string()
      .min(6, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const alertUseable = ({message}: {message: any}) => {
    Alert.show({title: 'Notification', desc: message, autoDismiss: true});
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {});
    return unsubscribe;
  }, [dispatch, navigation]);

  const changePassword = async ({
    values,
  }: {
    values: {
      password: string;
      confirmPassword: string;
    };
  }) => {
    try {
      const networkConnetion = await NetInfo.fetch();

      if (
        networkConnetion.isConnected &&
        networkConnetion.isInternetReachable
      ) {
        try {
          Loading.show({});

          const token = await getToken();

          const client = await SaharaClient.post(
            CHANGE_PASS_API,
            {
              newPassword: values.confirmPassword,
              createdBy: detailUser?.fullname,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (client.status === 200) {
            Loading.hide();

            const {message} = client.data;

            alertUseable({
              message: message,
            });
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
              notAuth();
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
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <LinearGradient colors={['#F4901E', '#F4901E']} style={styles.container}>
      <FastImage
        style={styles.containerImage}
        source={Images.logoNW}
        resizeMode={FastImage.resizeMode.stretch}
      />

      <View style={styles.containerDashboard}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <IconButton
            onPress={() => {
              goBack();
            }}
            icon={
              <Icon
                name="arrow-left-circle-outline"
                size={h(25)}
                color={'#F4901E'}
              />
            }
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Avatar
            label={detailUser?.fullname}
            size={h(80)}
            color="white"
            style={{backgroundColor: '#e5e5e5'}}
            labelStyle={{
              color: Colors.text,
              fontFamily: Fonts.family.bold,
              fontSize: h(30),
            }}
          />

          <View>
            <View style={styles.containerIcon}>
              <Icon name="account-tie-hat" size={h(17)} color={Colors.text} />
              <Text style={styles.labelItem}>{detailUser?.fullname}</Text>
            </View>

            <View style={styles.containerIcon}>
              <Icon name="phone-classic" size={h(17)} color={Colors.text} />
              <Text style={styles.labelItem}>{detailUser?.phone}</Text>
            </View>

            <View style={styles.containerIcon}>
              <Icon name="calendar" size={h(17)} color={Colors.text} />
              <Text style={styles.labelItem}>{detailUser?.dateOfBirth}</Text>
            </View>

            <View style={styles.containerIcon}>
              <Icon name="email" size={h(17)} color={Colors.text} />
              <Text style={styles.labelItem}>{detailUser?.email}</Text>
            </View>
          </View>
        </View>

        <KeyboardAwareScrollView
          enableAutomaticScroll
          showsVerticalScrollIndicator={false}
          style={{marginTop: 20}}>
          <Formik
            validationSchema={formSchema}
            initialValues={{password: '', confirmPassword: ''}}
            onSubmit={values => changePassword({values})}>
            {({handleChange, handleBlur, handleSubmit, errors, values}) => (
              <View style={styles.containerTextInput}>
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
                      accessibilityLabel="Toggle Password Visibility"
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
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {errors.password && (
                  <Text style={styles.errorLabel}>{errors.password}</Text>
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
                        width: '87%',
                        color: 'black',
                        fontFamily: Fonts.family.regular,
                        fontSize: Fonts.size.lg,
                      }}
                      placeholder="Password Confirm"
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      value={values.confirmPassword}
                      secureTextEntry={!showPassConfirm}
                      autoCapitalize="none"
                      keyboardType="default"
                      placeholderTextColor={Colors.placeholder}
                    />
                    <TouchableOpacity
                      accessibilityLabel="Toggle Confirm Password Visibility"
                      style={{
                        height: moderateVerticalScale(48),
                        width: moderateVerticalScale(48),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => setShowPassConfirm(!showPassConfirm)}>
                      <Icon
                        name={showPassConfirm ? 'eye-off' : 'eye'}
                        size={moderateVerticalScale(25)}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {errors.confirmPassword && (
                  <Text style={styles.errorLabel}>
                    {errors.confirmPassword}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={handleSubmit as () => void}
                  style={{
                    paddingHorizontal: 30,
                    paddingVertical: 14,
                    backgroundColor: '#FEB941',
                    borderRadius: 1000,
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.label, {color: 'white'}]}>
                    Change Password
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    notAuth();
                  }}
                  style={{
                    paddingHorizontal: 30,
                    paddingVertical: 14,
                    backgroundColor: '#FEB941',
                    borderRadius: 1000,
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.label, {color: 'white'}]}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </View>
    </LinearGradient>
  );
}

export default Page;

const styles = StyleSheet.create({
  /** CONTAINER */
  container: {
    flex: 1,
  },
  containerImage: {
    width: h(170),
    height: h(60),
    marginVertical: 30,
    alignSelf: 'center',
  },
  containerDashboard: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    gap: 10,
  },
  containerHeader: {
    flex: 1,
    gap: 10,
    justifyContent: 'space-around',
    marginVertical: 25,
  },
  containerForm: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
  },
  containerTextInput: {gap: 10},
  containerIcon: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },

  /** LABEL */
  label: {
    fontSize: Fonts.size.lg,
    fontFamily: Fonts.family.regular,
    color: Colors.text,
  },
  errorLabel: {
    fontSize: Fonts.size.sm,
    color: Colors.error,
    fontFamily: Fonts.family.bold,
  },
  labelButton: {fontFamily: Fonts.family.bold, color: 'white'},
  labelItem: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.md,
    color: Colors.text,
  },
  footerText: {
    fontSize: Fonts.size.sm,
    fontFamily: Fonts.family.italic,
    color: Colors.text,
    textAlign: 'center',
  },

  /** INPUT */
  inputStyle: {
    fontFamily: Fonts.family.regular,
    color: Colors.text,
    padding: 0,
  },
});
