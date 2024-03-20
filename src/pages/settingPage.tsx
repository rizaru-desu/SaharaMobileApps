import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {useAppSelector} from '../config/useRedux';
import {goBack, replace} from '../config/refNavigation';
import {verticalScale as h} from 'react-native-size-matters';
import {Formik} from 'formik';
import {Loading} from '../component/loading.component';
import {SaharaClient, getToken, notAuth} from '../config/apis';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Avatar, Button, TextInput} from '@react-native-material/core';
import {Colors, Fonts} from '../assets/assets';
import {CHANGE_PASS_API} from '../config/apis';
import {Alert} from '../component/alert.component';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import Header from '../component/header.component';

interface PageProps {
  route: RouteProp<any>;
  navigation: NavigationProp<any>;
}

function Page({route, navigation}: PageProps): JSX.Element {
  const dispatch = useDispatch();
  const [showPass, setShowPass] = React.useState<boolean>(false);

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
          Loading.show();

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
    <SafeAreaView style={styles.container}>
      <Header onBack={() => goBack()} title={route.params?.title} />
      <KeyboardAwareScrollView
        enableAutomaticScroll
        showsVerticalScrollIndicator={false}>
        <View style={styles.containerHeader}>
          <Avatar
            label={detailUser?.fullname}
            size={h(100)}
            style={{alignSelf: 'center'}}
          />

          <View style={styles.containerIcon}>
            <Icon name="account-tie-hat" size={h(15)} color={Colors.text} />
            <Text style={styles.labelItem}>{detailUser?.fullname}</Text>
          </View>

          <View style={styles.containerIcon}>
            <Icon name="phone-classic" size={h(15)} color={Colors.text} />
            <Text style={styles.labelItem}>{detailUser?.phone}</Text>
          </View>

          <View style={styles.containerIcon}>
            <Icon name="calendar" size={h(15)} color={Colors.text} />
            <Text style={styles.labelItem}>{detailUser?.dateOfBirth}</Text>
          </View>

          <View style={styles.containerIcon}>
            <Icon name="email" size={h(15)} color={Colors.text} />
            <Text style={styles.labelItem}>{detailUser?.email}</Text>
          </View>

          <Formik
            validationSchema={formSchema}
            initialValues={{password: '', confirmPassword: ''}}
            onSubmit={values => changePassword({values})}>
            {({handleChange, handleBlur, handleSubmit, errors, values}) => (
              <View style={styles.containerTextInput}>
                <View style={styles.containerTextInput}>
                  <Text style={styles.label}>New Password</Text>
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

                <View style={styles.containerTextInput}>
                  <Text style={styles.label}>Confirm Password</Text>
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
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                  />
                </View>

                {errors.confirmPassword && (
                  <Text style={styles.errorLabel}>
                    {errors.confirmPassword}
                  </Text>
                )}

                <Button
                  compact
                  title="Save Password"
                  onPress={handleSubmit as () => void}
                  titleStyle={styles.labelButton}
                  color={Colors.button}
                />

                <Button
                  compact
                  title="Logout"
                  onPress={() => {
                    notAuth();
                  }}
                  titleStyle={styles.labelButton}
                  color={Colors.button}
                />
              </View>
            )}
          </Formik>

          <Text style={styles.footerText}>
            Copyright © {new Date().getFullYear()} PT.SAHARA BOGATAMA INDONESIA
          </Text>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
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
    alignSelf: 'center',
  },

  /** LABEL */
  label: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.regular,
    color: Colors.text,
  },
  errorLabel: {
    fontSize: Fonts.size.sm,
    color: 'red',
    fontFamily: Fonts.family.bold,
  },
  labelButton: {fontFamily: Fonts.family.bold, color: 'white'},
  labelItem: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.xl,
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
