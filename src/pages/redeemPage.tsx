import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Animated,
  TouchableOpacity,
  FlatList,
  Text,
  RefreshControl,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {goBack} from '../config/refNavigation';
import Header from '../component/header.component';
import {getPackage, setModalRedeem, setRefreshList} from '../redux/redeemRedux';
import {SceneMap, TabView} from 'react-native-tab-view';
import F5 from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Fonts} from '../assets/assets';
import {useAppSelector} from '../config/useRedux';
import {Button} from '@react-native-material/core';
import FastImage from 'react-native-fast-image';
import {verticalScale} from 'react-native-size-matters';
import ModalXchangePackage from '../component/child/member/modalAddXchange.component';
import moment from 'moment';

interface PageProps {
  route: RouteProp<any>;
  navigation: NavigationProp<any>;
}

const FirstRoute: React.FC = () => {
  const dispatch = useDispatch();
  const {listPackage, modalRedeem, refreshList} = useAppSelector(
    state => state.initRedeemRedux,
  );

  const [packageId, setPackageId] = React.useState('');

  const onRefresh = React.useCallback(() => {
    dispatch(setRefreshList({refreshList: true}));
    getPackage({dispatch});
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={listPackage}
        keyExtractor={(i, idx: number) => idx.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshList}
            onRefresh={onRefresh}
            progressViewOffset={-10000}
          />
        }
        renderItem={(
          {item}, // Changed idx to index
        ) => (
          <View
            style={{
              borderRadius: 10,
              gap: 10,
              padding: 5,
              borderWidth: 2,
              borderColor: '#FF9D59',
              marginVertical: 10,
            }}>
            <FastImage
              style={{width: '100%', height: 150}}
              source={{
                uri: item.photo,
              }}
              resizeMode={FastImage.resizeMode.stretch}
            />

            <Text
              style={{
                fontFamily: Fonts.family.bold,
                color: Colors.text,
                fontSize: Fonts.size.lg,
              }}>
              Pont: {item.point}
              {'\n'}Limit: {item.currentLimit}/{item.limit}
            </Text>

            <Text
              style={{
                fontFamily: Fonts.family.bold,
                color: Colors.text,
                fontSize: Fonts.size.lg,
                textAlign: 'center',
              }}>
              {item.packageName}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.family.regular,
                color: Colors.text,
                fontSize: Fonts.size.md,
                textAlign: 'justify',
              }}>
              {item.packageDesc}
            </Text>
            <Button
              disabled={!item.active || item.userLimit}
              compact
              title="Redeem"
              contentContainerStyle={{height: verticalScale(48)}}
              titleStyle={styles.labelButton}
              color={Colors.button}
              onPress={() => {
                dispatch(setModalRedeem({modalRedeem: !modalRedeem}));
                setPackageId(item.packageId);
              }}
            />
          </View>
        )}
      />
      <ModalXchangePackage invisible={modalRedeem} packageId={packageId} />
    </View>
  );
};

const SecondRoute: React.FC = () => {
  const dispatch = useDispatch();
  const {listMyRedeem, refreshList} = useAppSelector(
    state => state.initRedeemRedux,
  );
  const onRefresh = React.useCallback(() => {
    dispatch(setRefreshList({refreshList: true}));
    getPackage({dispatch});
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={listMyRedeem}
        refreshControl={
          <RefreshControl
            refreshing={refreshList}
            onRefresh={onRefresh}
            progressViewOffset={-10000}
          />
        }
        keyExtractor={(i, idx: number) => idx.toString()}
        renderItem={(
          {item}, // Changed idx to index
        ) => (
          <View
            style={{
              borderRadius: 10,
              gap: 10,
              padding: 5,
              borderWidth: 2,
              borderColor: '#FF9D59',
              marginVertical: 10,
            }}>
            <View
              style={{
                backgroundColor: Colors.secondary,
                padding: 10,
                borderRadius: 100,
                marginVertical: 10,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.family.bold,
                  color: Colors.text,
                  fontSize: verticalScale(20),
                  textAlign: 'center',
                }}>
                {item.redemCode}
              </Text>
            </View>

            <Text
              style={{
                fontFamily: Fonts.family.bold,
                color: Colors.text,
                fontSize: Fonts.size.lg,
              }}>
              Package Name: {item.packageName}
            </Text>

            <Text
              style={{
                fontFamily: Fonts.family.bold,
                color: Colors.text,
                fontSize: Fonts.size.lg,
              }}>
              Location of exchange: {item.agentName}
            </Text>

            <Text
              style={{
                fontFamily: Fonts.family.bold,
                color: Colors.text,
                fontSize: Fonts.size.lg,
              }}>
              Status: {item.status}
            </Text>

            <Text
              style={{
                fontFamily: Fonts.family.bold,
                color: Colors.text,
                fontSize: Fonts.size.lg,
              }}>
              Date: {moment(item.createdAt).format('DD-MMMM-YYYY HH:mm')}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={{
              fontFamily: Fonts.family.bold,
              color: Colors.text,
              fontSize: Fonts.size.lg,
              textAlign: 'center',
            }}>
            Empty data
          </Text>
        }
      />
    </View>
  );
};

function Page({route, navigation}: PageProps): JSX.Element {
  const dispatch = useDispatch();
  const [index, setIndex] = React.useState(0);

  const routes = [
    {key: 'first', title: 'Package Redeem'},
    {key: 'second', title: 'My Redeem'},
  ];

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPackage({dispatch});
    });
    return unsubscribe;
  }, [dispatch, navigation]);

  const _handleIndexChange = (indexs: number) => setIndex(indexs);

  const _renderTabBar = (props: any) => {
    const inputRange = props.navigationState.routes.map(
      (x: any, i: number) => i,
    );
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((r: any, i: number) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex: number) =>
              inputIndex === i ? 1 : 0.5,
            ),
          });
          return (
            <TouchableOpacity
              key={r.key}
              style={styles.tabItem}
              onPress={() => setIndex(i)}>
              <F5 name={i === 0 ? 'gift' : 'gift-open'} size={Fonts.size.md} />
              <Animated.Text
                style={{
                  opacity,
                  fontFamily: Fonts.family.regular,
                  color: Colors.text,
                  fontSize: Fonts.size.md,
                }}>
                {r.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={() => goBack()} title={route.params?.title} />

      <TabView
        swipeEnabled={false}
        navigationState={{index, routes}}
        renderScene={_renderScene}
        renderTabBar={_renderTabBar}
        onIndexChange={_handleIndexChange}
      />
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
  tabBar: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  labelButton: {fontFamily: Fonts.family.bold, color: 'white'},
});
