import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationProp} from '@react-navigation/native';
import {useAppSelector} from '../config/useRedux';
import {goBack, navigate} from '../config/refNavigation';
import {Dropdown} from 'react-native-element-dropdown';
import {verticalScale as h} from 'react-native-size-matters';
import {Formik, useFormikContext} from 'formik';
import Header from '../component/header.component';
import * as yup from 'yup';
import {Button, IconButton, TextInput} from '@react-native-material/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors, Fonts} from '../assets/assets';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Accordion from 'react-native-collapsible/Accordion';
import _ from 'lodash';
import moment from 'moment';
import {getAgent, setProductList, submitDR} from '../redux/createDRRedux';
import DatePicker from 'react-native-date-picker';

interface PageProps {
  navigation: NavigationProp<any>;
}

function Page({navigation}: PageProps): JSX.Element {
  const dispatch = useDispatch();
  const [showDate, setShowDate] = React.useState<boolean>(false);
  const [isFocusDropdown, setIsFocusDropdown] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState([]);

  const {productList, agentList} = useAppSelector(
    state => state.initCreateDRRedux,
  );

  let formSchema = yup.object().shape({
    customerName: yup
      .string()
      .required('Please enter Agent Name from select Agent'),
    deliveryAddress: yup
      .string()
      .required('Please enter Agent Name from select Agent'),
    shippingDate: yup.string().required('Please enter shipping date'),
    productList: yup.array().min(1, 'Please add at least one product'),
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAgent({dispatch});
    });

    return unsubscribe;
  }, [dispatch, navigation]);

  const renderHeader = (section: any, index: number, isActive: boolean) => {
    return (
      <View key={index.toString()} style={styles.containerHeaderAccordion}>
        <Text style={styles.labelHeaderAccordion}>
          {section.labelBox} ({section.totalWeight} KG)
        </Text>

        <View style={styles.containerHeaderIcon}>
          <Icon
            name={!isActive ? 'package-variant-closed' : 'package-variant'}
            size={Fonts.size.lg}
            color={'white'}
          />

          <IconButton
            onPress={() => {
              const product = productList;

              const final = _.reject(product, (item: any) => {
                return item.labelBox === section.labelBox;
              });

              dispatch(setProductList({productList: final}));
            }}
            icon={
              <Icon
                name={'delete-empty'}
                size={Fonts.size.lg}
                color={'white'}
              />
            }
          />
        </View>
      </View>
    );
  };

  const renderContent = (section: any) => {
    return (
      <View style={styles.containerContentAccordion}>
        {_.map(section.product, (Item: any, index: number) => (
          <View
            key={index.toString()}
            style={styles.containerContentItemAccordion}>
            <View style={styles.containerIcon}>
              <Icon name="label" size={h(15)} color={'white'} />
              <Text style={styles.labelItem}>{Item.labelProducts}</Text>
            </View>
            <Text style={styles.labelContentItemAccordion}>
              {Item.productCode} - {Item.productName}
            </Text>

            <View style={styles.containerIcon}>
              <Icon name="calendar-check" size={h(15)} color={'white'} />
              <Text style={styles.labelItem}>
                Best Before: {moment(Item.bestBefore).format('DD/MM/YYYY')}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const updateSections = (activeSections: any) => {
    setActiveSection(activeSections);
  };

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
            noSurat: '',
            noOrder: '',
            agentId: '',
            customerName: '',
            deliveryAddress: '',
            deliveryNote: '',
            shippingDate: '',
            productList: [],
            totalWeight: 0,
            status: 1,
          }}
          onSubmit={values => {
            submitDR({dispatch, values: values});
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
                <Text style={styles.label}>No Surat</Text>
                <TextInput
                  variant="outlined"
                  leading={
                    <Icon
                      name="email-newsletter"
                      size={Fonts.size.md}
                      color={Colors.primary}
                    />
                  }
                  color={Colors.primary}
                  inputStyle={styles.inputStyle}
                  onChangeText={handleChange('noSurat')}
                  onBlur={handleBlur('noSurat')}
                  value={values.noSurat}
                  readOnly
                />
              </View>

              <View style={styles.containerTextInput}>
                <Text style={styles.label}>No Order</Text>
                <TextInput
                  variant="outlined"
                  leading={
                    <Icon
                      name="cart-arrow-right"
                      size={Fonts.size.md}
                      color={Colors.primary}
                    />
                  }
                  color={Colors.primary}
                  inputStyle={styles.inputStyle}
                  onChangeText={handleChange('noOrder')}
                  onBlur={handleBlur('noOrder')}
                  value={values.noOrder}
                  readOnly
                />
              </View>

              <View style={styles.containerTextInput}>
                <Text style={styles.label}>Shipping Date</Text>
                <TextInput
                  placeholder="Please enter the shipping date"
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
                  onBlur={handleBlur('shippingDate')}
                  value={values.shippingDate}
                  readOnly
                />
              </View>

              <DatePicker
                modal
                title="Date of Birth"
                mode="datetime"
                open={showDate}
                date={new Date()}
                androidVariant="nativeAndroid"
                onConfirm={date => {
                  setShowDate(false);
                  setFieldValue('shippingDate', date.toISOString());
                }}
                onCancel={() => {
                  setShowDate(false);
                }}
              />

              {errors.shippingDate && (
                <Text style={styles.errorLabel}>{errors.shippingDate}</Text>
              )}

              <View style={styles.containerTextInput}>
                <Text style={styles.label}>Agent</Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocusDropdown && {borderColor: Colors.primary},
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={{
                    fontSize: Fonts.size.md,
                    fontFamily: Fonts.family.regular,
                    color: Colors.text,
                  }}
                  iconStyle={styles.iconStyle}
                  data={agentList}
                  search
                  maxHeight={300}
                  labelField="customerName"
                  valueField="agentId"
                  placeholder={!isFocusDropdown ? 'Select Agent' : '...'}
                  searchPlaceholder="Search..."
                  value={values.agentId}
                  onFocus={() => setIsFocusDropdown(true)}
                  onBlur={() => setIsFocusDropdown(false)}
                  onChange={item => {
                    setFieldValue('agentId', item.agentId);
                    setFieldValue('customerName', item.customerName);
                    setFieldValue('deliveryAddress', item.alamatToko);
                    setIsFocusDropdown(false);
                  }}
                  renderLeftIcon={() => (
                    <Icon
                      style={styles.icon}
                      color={Colors.primary}
                      name="storefront"
                      size={Fonts.size.md}
                    />
                  )}
                />
              </View>

              <View style={styles.containerTextInput}>
                <Text style={styles.label}>Agent Name</Text>
                <TextInput
                  readOnly
                  variant="outlined"
                  leading={
                    <Icon
                      name="store"
                      size={Fonts.size.md}
                      color={Colors.primary}
                    />
                  }
                  color={Colors.primary}
                  inputStyle={styles.inputStyle}
                  value={values.customerName}
                />
              </View>

              {errors.customerName && (
                <Text style={styles.errorLabel}>{errors.customerName}</Text>
              )}

              <View style={styles.containerTextInput}>
                <Text style={styles.label}>Agent Address</Text>
                <TextInput
                  readOnly
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
                  value={values.deliveryAddress}
                  multiline
                />
              </View>

              {errors.deliveryAddress && (
                <Text style={styles.errorLabel}>{errors.deliveryAddress}</Text>
              )}

              <View style={styles.containerTextInput}>
                <Text style={styles.label}>Delivery Note</Text>
                <TextInput
                  placeholder="Optional..."
                  variant="outlined"
                  leading={
                    <Icon
                      name="note"
                      size={Fonts.size.md}
                      color={Colors.primary}
                    />
                  }
                  color={Colors.primary}
                  inputStyle={styles.inputStyle}
                  onChangeText={handleChange('deliveryNote')}
                  onBlur={handleBlur('deliveryNote')}
                  value={values.deliveryNote}
                />
              </View>

              <View style={styles.containerTextInput}>
                <View style={styles.containerProductHeader}>
                  <Text style={styles.label}>Product</Text>
                  <IconButton
                    onPress={() =>
                      navigate({
                        route: 'InitScanQRPages',
                        params: {createDR: true, currentData: productList},
                      })
                    }
                    icon={
                      <Icon
                        name="plus-circle"
                        size={Fonts.size.xl}
                        color={Colors.primary}
                      />
                    }
                  />
                </View>
              </View>

              <Accordion
                sections={values.productList}
                activeSections={activeSection}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={updateSections}
                touchableComponent={TouchableOpacity}
              />

              {errors.productList && (
                <Text style={styles.errorLabel}>{errors.productList}</Text>
              )}

              <AutoFormik />

              <View style={styles.containerTextInput}>
                <Text style={styles.label}>Total Weight</Text>
                <TextInput
                  readOnly
                  variant="outlined"
                  leading={
                    <Icon
                      name="weight-kilogram"
                      size={Fonts.size.md}
                      color={Colors.primary}
                    />
                  }
                  color={Colors.primary}
                  inputStyle={styles.inputStyle}
                  onBlur={handleBlur('totalWeight')}
                  value={String(values.totalWeight)}
                />
              </View>

              <Button
                title="Create DR"
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

const AutoFormik = () => {
  const {setFieldValue} = useFormikContext();
  const {productList, lastNoOrder, lastNoSurat} = useAppSelector(
    state => state.initCreateDRRedux,
  );

  React.useEffect(() => {
    setFieldValue('productList', productList);
    setFieldValue('noSurat', 'FG/OUT/' + String(_.add(lastNoSurat?.value, 1)));
    setFieldValue('noOrder', String(_.add(lastNoOrder?.value, 1)));
    if (!_.isEmpty(productList)) {
      setFieldValue('totalWeight', _.sumBy(productList, 'totalWeight'));
    }
  }, [setFieldValue, productList, lastNoSurat?.value, lastNoOrder?.value]);
  return null;
};

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
  containerProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerIcon: {flexDirection: 'row', gap: 5, alignItems: 'center'},
  containerContentAccordion: {
    marginVertical: 5,
  },
  containerContentItemAccordion: {
    backgroundColor: Colors.button,
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  containerHeaderAccordion: {
    backgroundColor: Colors.button,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 5,
  },
  containerHeaderIcon: {flexDirection: 'row', gap: 10, alignItems: 'center'},

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

  /** DROPDOWN */
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 10,
  },
  placeholderStyle: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.regular,
    color: Colors.text,
  },
  selectedTextStyle: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.regular,
    color: Colors.text,
  },
  iconStyle: {
    width: h(15),
    height: h(15),
  },
  inputSearchStyle: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.regular,
    color: Colors.text,
  },
});
