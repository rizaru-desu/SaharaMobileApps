import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeMemberPage, SettingPage} from '.';
import {MyTabBar} from '../component/myTab.component';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {Loading} from '../component/loading.component';
import {DETAIL_USER, SaharaClient, getToken, notAuth} from '../config/apis';
import NetInfo from '@react-native-community/netinfo';
import {Alert} from '../component/alert.component';
import _ from 'lodash';
import {getDashbaoardDR} from '../redux/dashboardDRRedux';
import {useDispatch} from 'react-redux';
import {getDashbaoardMember} from '../redux/dashboardMemberRedux';

interface PageProps {
  navigation: NavigationProp<any>;
}

function Page({navigation}: PageProps): JSX.Element {
  const dispatch = useDispatch();
  const [settingRole, setSettingRole] = React.useState<boolean>(false);
  const [deliveryRole, setDeliveryRole] = React.useState<boolean>(false);
  const [load, setLoad] = React.useState<boolean>(true);

  const Tab = createBottomTabNavigator();

  const customTab = React.useCallback(
    (props: any) => <MyTabBar allowAsProps={true} {...props} />,
    [],
  );

  const alertUseable = ({message}: {message: any}) => {
    Alert.show({title: 'Notification', desc: message, autoDismiss: true});
  };

  const detailUser = React.useCallback(async () => {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show();

        const token = await getToken();

        const client = await SaharaClient.post(
          DETAIL_USER,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const {userDetail, stringRole} = client.data;

          const excDR = _.filter(
            stringRole,
            (item: any) =>
              ![
                '8f595a1e-cb1f-11ee-b237-38f9d362e2c9',
                '6467c855-165d-4dc8-88b5-68c54599e930',
                '503da001-3e56-414b-81c0-4329287ea6c7',
              ].includes(item.stringId),
          );

          const isEqualRoleSetting = _.intersectionBy(
            stringRole,
            userDetail?.roles as any,
            'stringId',
          );

          const isEqualRoleDR = _.intersectionBy(
            excDR,
            userDetail?.roles as any,
            'stringId',
          );

          setSettingRole(!_.isEmpty(isEqualRoleSetting));
          setDeliveryRole(!_.isEmpty(isEqualRoleDR));

          if (!_.isEmpty(isEqualRoleDR)) {
            getDashbaoardDR({dispatch});
          } else {
            getDashbaoardMember({dispatch});
          }

          setLoad(false);
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
            notAuth();
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
  }, [dispatch]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      detailUser();
    });

    return unsubscribe;
  }, [detailUser, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* {load ? null : (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
          tabBar={customTab}>
          {deliveryRole ? (
            <Tab.Screen
              name="homePage"
              options={{title: 'Home'}}
              component={HomePage}
            />
          ) : (
            <>
              <Tab.Screen
                name="homeMemberPage"
                options={{title: 'Home'}}
                component={HomeMemberPage}
              />
              <Tab.Screen
                name="redemPage"
                options={{title: 'Redem Point'}}
                component={HomeMemberPage}
              />
            </>
          )}

          {settingRole ? (
            <Tab.Screen
              name="settingPage"
              options={{title: 'Setting'}}
              component={SettingPage}
            />
          ) : null}
        </Tab.Navigator>
      )} */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default Page;
