import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {goBack} from '../config/refNavigation';
import {verticalScale as h} from 'react-native-size-matters';
import Header from '../component/header.component';
import {Colors, Fonts} from '../assets/assets';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Accordion from 'react-native-collapsible/Accordion';
import _ from 'lodash';
import moment from 'moment';
import {useAppSelector} from '../config/useRedux';
import {RefreshControl} from 'react-native';
import {findProductDR, setRefreshProductDR} from '../redux/initializeRedux';

interface PageProps {
  route: RouteProp<any>;
  navigation: NavigationProp<any>;
}

function Page({route, navigation}: PageProps): JSX.Element {
  const dispatch = useDispatch();
  const {productDR, refreshProductDR} = useAppSelector(
    state => state.initInitializeRedux,
  );
  const [activeSection, setActiveSection] = React.useState([]);

  const onRefreshDR = React.useCallback(() => {
    dispatch(setRefreshProductDR({refreshProductDR: true}));
    findProductDR({dispatch, value: route.params?.labelId});
  }, [dispatch, route.params?.labelId]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      findProductDR({dispatch, value: route.params?.labelId});
    });

    return unsubscribe;
  }, [dispatch, navigation, route.params?.labelId]);

  const renderHeader = (section: any, index: number, isActive: boolean) => {
    return (
      <View key={index.toString()} style={styles.containerHeaderAccordion}>
        <Text style={styles.labelHeaderAccordion}>
          {section.labelBox} ({section.totalWeight} KG)
        </Text>

        <Icon
          name={!isActive ? 'package-variant-closed' : 'package-variant'}
          size={Fonts.size.lg}
          color={'white'}
        />
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
      <Header onBack={() => goBack()} title={route.params?.title} />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshProductDR}
            onRefresh={onRefreshDR}
            progressViewOffset={-10000}
          />
        }
        showsVerticalScrollIndicator={false}>
        <Accordion
          sections={productDR}
          activeSections={activeSection}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={updateSections}
          touchableComponent={TouchableOpacity}
        />
      </ScrollView>
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
