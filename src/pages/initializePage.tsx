import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {getInitialize} from '../redux/initializeRedux';
import {Fonts, Images} from '../assets/assets';
import {useAppSelector} from '../config/useRedux';
import {verticalScale as h} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Profiles from '../component/profile.component';
import DropShadow from 'react-native-drop-shadow';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigate} from '../config/refNavigation';
import DetailOwner from '../component/child/member/detailOwner.component';
import ListMemberOwner from '../component/child/member/listMember.component';
import PointHistory from '../component/child/member/pointHistory.component';
import ModalNewOwner from '../component/child/member/modalAddDetailOwner.component';
import ListDR from '../component/child/member/listDR.component';
import CampaignModal from '../component/campaignModal.component';
import _ from 'lodash';

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
    showCampaign,
  } = useAppSelector(state => state.initInitializeRedux);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getInitialize({dispatch});
    });

    return unsubscribe;
  }, [dispatch, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ff690073', '#fcb90038']}
        style={styles.containerLinear}>
        <FastImage
          style={styles.containerImage}
          source={Images.logoSahara}
          resizeMode={FastImage.resizeMode.contain}
        />

        <Profiles
          detail={detailUser}
          userInternal={internalUser}
          point={
            dataDashboardMember
              ? dataDashboardMember.currentPoint?.loyaltyPoint
              : 0
          }
        />

        <View style={styles.containerDashboard}>
          {previlege === 1 || previlege === 2 ? (
            <ScrollView nestedScrollEnabled contentContainerStyle={{gap: 20}}>
              <DetailOwner
                previlege={previlege}
                dataOwner={dataDashboardMember}
              />

              <ListMemberOwner
                previlege={previlege}
                dataOwner={dataDashboardMember}
                listMember={dataDashboardMember?.listMember}
              />

              <PointHistory
                previlege={previlege}
                historyPoint={dataDashboardMember?.historyPoint}
              />
            </ScrollView>
          ) : null}

          {previlege === 3 && <ListDR previlege={previlege} />}

          {previlege === 0 && <View style={{flex: 1}} />}

          <DropShadow style={styles.dropShadow}>
            <View style={styles.containerTabMenu}>
              {previlege === 1 && (
                <TouchableOpacity style={styles.containerTabButton}>
                  <Icon
                    name="wallet-giftcard"
                    size={Fonts.size.xl}
                    color={'white'}
                  />
                  <Text>Redem Point</Text>
                </TouchableOpacity>
              )}

              {previlege === 3 && (
                <TouchableOpacity
                  onPress={() => navigate({route: 'InitCretedDRPages'})}
                  style={styles.containerTabButton}>
                  <Icon
                    name="email-newsletter"
                    size={Fonts.size.xl}
                    color={'white'}
                  />
                  <Text>Create Delivery</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  navigate({route: 'settingPage', params: {title: 'Setting'}});
                }}
                style={styles.containerTabButton}>
                <Icon
                  name="account-settings"
                  size={Fonts.size.xl}
                  color={'white'}
                />
                <Text>Setting</Text>
              </TouchableOpacity>
            </View>
          </DropShadow>
        </View>
      </LinearGradient>

      <CampaignModal
        isVisible={previlege === 1 && !addDetailOwner && showCampaign}
        campaignData={dataDashboardMember?.campaign}
      />
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
    width: h(70),
    height: h(25),
    marginHorizontal: 25,
    margin: 25,
  },
  containerDashboard: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 25,
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
