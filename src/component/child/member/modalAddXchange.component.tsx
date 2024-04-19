import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Colors, Fonts} from '../../../assets/assets';
import {Button} from '@react-native-material/core';
import {Formik} from 'formik';
import Modal from 'react-native-modal';
import * as yup from 'yup';
import {useAppSelector} from '../../../config/useRedux';
import {useDispatch} from 'react-redux';
import {addRedeem, setModalRedeem} from '../../../redux/redeemRedux';

const ModalXchangePackage: React.FC<{
  invisible: boolean;
  packageId: string;
}> = ({invisible, packageId}) => {
  const dispatch = useDispatch();
  const {listAgent} = useAppSelector(state => state.initRedeemRedux);
  const [isFocus, setIsFocus] = React.useState(false);
  let formSchema = yup.object().shape({
    agentId: yup.string().required(' established since (Berdiri Sejak?)'),
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
        <Text style={[styles.labelTitle, {fontSize: Fonts.size.md}]}>
          Please select nearest agent.
        </Text>

        <Formik
          validationSchema={formSchema}
          initialValues={{
            agentId: '',
          }}
          onSubmit={values => {
            addRedeem({dispatch, packageId, agentId: values.agentId});
          }}>
          {({setFieldValue, handleSubmit, errors, values}) => (
            <View style={styles.containerTextInput}>
              <View style={styles.containerTextInput}>
                <Text style={styles.selectedTextStyle}>Agent</Text>

                <Dropdown
                  style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={styles.selectedTextStyle}
                  data={listAgent}
                  search
                  maxHeight={300}
                  labelField="customerName"
                  valueField="agentId"
                  placeholder={!isFocus ? 'Select agnet' : '...'}
                  searchPlaceholder="Search..."
                  value={values.agentId}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setFieldValue('agentId', item.agentId);
                    setIsFocus(false);
                  }}
                />
              </View>

              {errors.agentId && (
                <Text style={styles.errorLabel}>{errors.agentId}</Text>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'space-between',
                }}>
                <Button
                  title="Redeem Code"
                  onPress={handleSubmit as () => void}
                  titleStyle={styles.labelButton}
                  color={Colors.button}
                />
                <Button
                  title="Cancel"
                  onPress={() => {
                    dispatch(setModalRedeem({modalRedeem: false}));
                  }}
                  titleStyle={styles.labelButton}
                  color={Colors.button}
                />
              </View>
            </View>
          )}
        </Formik>
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
  dropdown: {
    height: 50,
    borderColor: Colors.primary,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  selectedTextStyle: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.regular,
    color: Colors.text,
  },
  placeholderStyle: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.regular,
  },

  errorLabel: {
    fontSize: Fonts.size.sm,
    color: 'red',
    fontFamily: Fonts.family.bold,
  },
  labelButton: {fontFamily: Fonts.family.bold, color: 'white'},
  labelTitle: {
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.md,
    color: 'white',
  },
});

export default ModalXchangePackage;
