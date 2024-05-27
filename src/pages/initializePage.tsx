import React from 'react';

import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {NavigationProp} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {getInitialize, setRefreshMember} from '../redux/initializeRedux';
import {Fonts, Images} from '../assets/assets';
import {useAppSelector} from '../config/useRedux';
import {verticalScale as h} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Profiles from '../component/profile.component';
import IcV from 'react-native-vector-icons/EvilIcons';
import IcAnt from 'react-native-vector-icons/AntDesign';
import IcMateI from 'react-native-vector-icons/MaterialIcons';
import {navigate} from '../config/refNavigation';
import DetailOwner from '../component/child/member/detailOwner.component';
import ListMemberOwner from '../component/child/member/listMember.component';
import ModalNewOwner from '../component/child/member/modalAddDetailOwner.component';
import ListDR from '../component/child/member/listDR.component';
import _ from 'lodash';
import Accordion from 'react-native-collapsible/Accordion';
import PointHistory from '../component/child/member/pointHistory.component';

interface PageProps {
  navigation: NavigationProp<any>;
}

function Page({navigation}: PageProps): JSX.Element {
  const dispatch = useDispatch();
  const {
    detailUser,
    internalUser,
    dataDashboardMember,
    previlege,
    addDetailOwner,
    refreshMember,
  } = useAppSelector(state => state.initInitializeRedux);

  const [activeSection, setActiveSection] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getInitialize({dispatch});
    });

    return unsubscribe;
  }, [dispatch, navigation]);

  const onRefresh = React.useCallback(() => {
    dispatch(setRefreshMember({refreshList: true}));
    getInitialize({dispatch});
  }, [dispatch]);

  const renderHeader = (section: any, index: number, isActive: boolean) => {
    return section.title === 'Reedem Point' ? (
      <TouchableOpacity
        onPress={() => {
          setActiveSection([]);
          navigate({
            route: 'redeemPage',
            params: {title: 'Redeem Package'},
          });
        }}
        style={{
          borderRadius: 10,
          borderWidth: 2,
          borderColor: '#F4901E',
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginVertical: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'black',
            fontFamily: Fonts.family.bold,
            fontSize: Fonts.size.lg,
          }}>
          {section.title}
        </Text>

        <IcMateI name={'keyboard-arrow-right'} size={h(25)} color={'#F4901E'} />
      </TouchableOpacity>
    ) : (
      <View
        style={{
          borderRadius: 10,
          borderWidth: 2,
          borderColor: '#F4901E',
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginVertical: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'black',
            fontFamily: Fonts.family.bold,
            fontSize: Fonts.size.lg,
          }}>
          {section.title}
        </Text>

        <IcMateI
          name={!isActive ? 'keyboard-arrow-right' : 'keyboard-arrow-down'}
          size={h(25)}
          color={'#F4901E'}
        />
      </View>
    );
  };

  const renderContent = (section: any) => {
    return (
      <View>
        {section.title === 'Booth Member List' && (
          <ListMemberOwner
            previlege={1 || 2}
            dataOwner={dataDashboardMember}
            listMember={section.data}
          />
        )}

        {section.title === 'Point History' && (
          <PointHistory previlege={1 || 2} historyPoint={section.data} />
        )}
      </View>
    );
  };

  const updateSections = (activeSections: any) => {
    setActiveSection(activeSections);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F4901E', '#F4901E']}
        style={styles.containerLinear}>
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
            {previlege === 3 && (
              <TouchableOpacity
                onPress={() => navigate({route: 'InitCretedDRPages'})}>
                <IcV name="envelope" size={25} color={'#F4901E'} />
              </TouchableOpacity>
            )}

            {previlege === 1 || previlege === 2 ? (
              <TouchableOpacity
                onPress={() =>
                  navigate({
                    route: 'InitScanQRPages',
                    params: {createDR: false},
                  })
                }>
                <IcAnt name="qrcode" size={25} color={'#F4901E'} />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() => {
                navigate({route: 'settingPage', params: {title: 'Setting'}});
              }}>
              <IcV name="gear" size={25} color={'#F4901E'} />
            </TouchableOpacity>
          </View>

          <Profiles
            detail={detailUser}
            userInternal={internalUser}
            point={
              dataDashboardMember
                ? dataDashboardMember.currentPoint?.loyaltyPoint
                : 0
            }
          />

          {previlege === 1 || previlege === 2 ? (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshMember}
                  onRefresh={onRefresh}
                  progressViewOffset={-10000}
                />
              }
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={{gap: 5}}>
              <DetailOwner
                previlege={previlege}
                dataOwner={dataDashboardMember}
              />

              {!_.isEmpty(dataDashboardMember?.campaign) && (
                <View>
                  <Carousel
                    width={Dimensions.get('screen').width * 0.9}
                    height={Dimensions.get('screen').width * 0.4}
                    autoPlay={true}
                    data={dataDashboardMember?.campaign}
                    pagingEnabled={true}
                    snapEnabled={true}
                    autoPlayInterval={2000}
                    mode="parallax"
                    modeConfig={{
                      parallaxScrollingScale: 0.9,
                      parallaxScrollingOffset: 0,
                    }}
                    renderItem={({item}: {item: any}) => (
                      <View
                        style={{
                          flex: 1,
                          gap: 5,
                          justifyContent: 'center',
                        }}>
                        <FastImage
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 10,
                            borderWidth: 3,
                            borderColor: '#00000078',
                          }}
                          source={{
                            uri: item.photo,
                          }}
                          resizeMode={FastImage.resizeMode.stretch}
                        />

                        <View
                          style={{
                            position: 'absolute',
                            backgroundColor: '#00000078',
                            width: '100%',
                            bottom: 0,
                            left: 0,
                            padding: 5,
                            borderBottomStartRadius: 10,
                            borderBottomEndRadius: 10,
                          }}>
                          <Text
                            style={[
                              styles.label,
                              {fontFamily: Fonts.family.bold},
                            ]}>
                            {item.campaignName}
                          </Text>

                          <Text
                            numberOfLines={2}
                            style={[styles.label, {fontSize: Fonts.size.sm}]}>
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    )}
                  />
                </View>
              )}

              <Accordion
                sections={
                  dataDashboardMember
                    ? previlege === 1
                      ? [
                          dataDashboardMember?.listMember,
                          dataDashboardMember?.historyPoint,
                          {title: 'Reedem Point', data: []},
                        ]
                      : [
                          dataDashboardMember?.historyPoint,
                          {title: 'Reedem Point', data: []},
                        ]
                    : []
                }
                activeSections={activeSection}
                renderHeader={renderHeader}
                renderContent={renderContent}
                onChange={updateSections}
                touchableComponent={TouchableOpacity}
              />
            </ScrollView>
          ) : null}

          {previlege === 3 && <ListDR previlege={previlege} />}
        </View>
      </LinearGradient>

      <ModalNewOwner invisible={previlege === 1 && addDetailOwner} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerLinear: {flex: 1},
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
    justifyContent: 'space-between',
  },

  containerTabMenu: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FF9D59',
    margin: 5,
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 10,
    gap: 20,
  },
  containerTabButton: {alignItems: 'center', gap: 5},
  label: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.regular,
    color: 'white',
    textAlign: 'justify',
  },
  dropShadow: {
    shadowColor: '#ff690073',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});

export default Page;
