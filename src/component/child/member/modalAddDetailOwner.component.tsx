import React from 'react';

import {Text, View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {addDetailOwner} from '../../../redux/initializeRedux';
import {Colors, Fonts} from '../../../assets/assets';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button, TextInput} from '@react-native-material/core';
import {Formik} from 'formik';
import Modal from 'react-native-modal';
import * as yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ModalNewOwner: React.FC<{
  invisible: boolean;
}> = ({invisible}) => {
  const dispatch = useDispatch();

  let formSchema = yup.object().shape({
    alamatOwner: yup
      .string()
      .min(3, ({min}) => `Address must be at least ${min} characters`)
      .required('Address is required'),
    berdiriSejak: yup.string().required(' established since (Berdiri Sejak?)'),
  });

  return (
    <Modal
      animationIn={'slideInUp'}
      animationInTiming={1000}
      animationOutTiming={1000}
      animationOut={'slideOutDown'}
      backdropOpacity={0.9}
      style={styles.bottomModal}
      isVisible={invisible}>
      <View style={styles.containerContent}>
        <KeyboardAwareScrollView
          enableAutomaticScroll
          showsVerticalScrollIndicator={false}>
          <Text style={[styles.labelTitle, {fontSize: Fonts.size.md}]}>
            Please fill in this form
          </Text>

          <Formik
            validationSchema={formSchema}
            initialValues={{
              alamatOwner: '',
              instagram: '',
              facebook: '',
              ecommerce: '',
              berdiriSejak: '',
            }}
            onSubmit={values => {
              addDetailOwner({
                dispatch,
                values,
              });
            }}>
            {({handleChange, handleBlur, handleSubmit, errors, values}) => (
              <View style={styles.containerTextInput}>
                <View style={styles.containerTextInput}>
                  <Text style={styles.label}>Owner Address</Text>
                  <TextInput
                    placeholder="Please enter the Owner Address"
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
                    onChangeText={handleChange('alamatOwner')}
                    onBlur={handleBlur('alamatOwner')}
                    value={values.alamatOwner}
                  />
                </View>

                {errors.alamatOwner && (
                  <Text style={styles.errorLabel}>{errors.alamatOwner}</Text>
                )}

                <View style={styles.containerTextInput}>
                  <Text style={styles.label}>Facebook</Text>
                  <TextInput
                    placeholder="Please enter username the facebook"
                    variant="outlined"
                    leading={
                      <Icon
                        name="facebook"
                        size={Fonts.size.md}
                        color={Colors.primary}
                      />
                    }
                    color={Colors.primary}
                    inputStyle={styles.inputStyle}
                    onChangeText={handleChange('facebook')}
                    onBlur={handleBlur('facebook')}
                    value={values.facebook}
                  />
                </View>

                {errors.facebook && (
                  <Text style={styles.errorLabel}>{errors.facebook}</Text>
                )}

                <View style={styles.containerTextInput}>
                  <Text style={styles.label}>Instagram</Text>
                  <TextInput
                    placeholder="Please enter username the instagram"
                    variant="outlined"
                    leading={
                      <Icon
                        name="instagram"
                        size={Fonts.size.md}
                        color={Colors.primary}
                      />
                    }
                    color={Colors.primary}
                    inputStyle={styles.inputStyle}
                    onChangeText={handleChange('instagram')}
                    onBlur={handleBlur('instagram')}
                    value={values.instagram}
                  />
                </View>

                {errors.instagram && (
                  <Text style={styles.errorLabel}>{errors.instagram}</Text>
                )}

                <View style={styles.containerTextInput}>
                  <Text style={styles.label}>Ecommerce</Text>
                  <TextInput
                    placeholder="Please enter username the ecommerce"
                    variant="outlined"
                    leading={
                      <Icon
                        name="shopping"
                        size={Fonts.size.md}
                        color={Colors.primary}
                      />
                    }
                    color={Colors.primary}
                    inputStyle={styles.inputStyle}
                    onChangeText={handleChange('eCommerce')}
                    onBlur={handleBlur('eCommerce')}
                    value={values.ecommerce}
                  />
                </View>

                {errors.ecommerce && (
                  <Text style={styles.errorLabel}>{errors.ecommerce}</Text>
                )}

                <View style={styles.containerTextInput}>
                  <Text style={styles.label}>
                    established since (Berdiri Sejak?)
                  </Text>
                  <TextInput
                    placeholder="Please enter the  established since (year)"
                    variant="outlined"
                    keyboardType="numeric"
                    maxLength={4}
                    leading={
                      <Icon
                        name="card-account-details"
                        size={Fonts.size.md}
                        color={Colors.primary}
                      />
                    }
                    color={Colors.primary}
                    inputStyle={styles.inputStyle}
                    onChangeText={handleChange('berdiriSejak')}
                    onBlur={handleBlur('berdiriSejak')}
                    value={values.berdiriSejak}
                  />
                </View>

                {errors.berdiriSejak && (
                  <Text style={styles.errorLabel}>{errors.berdiriSejak}</Text>
                )}

                <Button
                  title="Save"
                  onPress={handleSubmit as () => void}
                  titleStyle={styles.labelButton}
                  color={Colors.button}
                />
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerContent: {
    backgroundColor: 'white',
    borderColor: Colors.primary,
    borderStartWidth: 3,
    borderEndWidth: 3,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 5,
    padding: 10,
    columnGap: 5,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 10,
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
});

export default ModalNewOwner;
