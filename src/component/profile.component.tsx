import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, IconButton} from '@react-native-material/core';
import {verticalScale as h} from 'react-native-size-matters';
import {Colors, Fonts} from '../assets/assets';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropShadow from 'react-native-drop-shadow';
import {navigate} from '../config/refNavigation';

const Profiles: React.FC<{
  detail: any;
  userInternal: boolean;
  point?: number;
}> = ({detail, userInternal, point}) => {
  return (
    <DropShadow style={styles.dropShadow}>
      <View style={styles.containerHeader}>
        <Avatar
          label={detail?.fullname}
          size={h(50)}
          color="white"
          labelStyle={{
            color: Colors.text,
            fontFamily: Fonts.family.bold,
            fontSize: Fonts.size.xl,
          }}
        />
        <View style={styles.containerDetail}>
          <Text
            style={{
              color: Colors.text,
              fontFamily: Fonts.family.bold,
              fontSize: Fonts.size.md,
            }}>
            {detail?.fullname}
          </Text>

          {userInternal ? (
            <View style={styles.containerWithLogo}>
              <Icon name="account-tie-hat" size={h(15)} color={Colors.text} />
              <Text
                style={{
                  color: Colors.text,
                  fontFamily: Fonts.family.italic,
                  fontSize: Fonts.size.sm,
                }}>
                {detail?.leader || '-'}
              </Text>
            </View>
          ) : (
            <View style={styles.containerWithLogo}>
              <Icon name="hand-coin" size={h(15)} color={Colors.text} />
              <Text
                style={{
                  color: Colors.text,
                  fontFamily: Fonts.family.regular,
                  fontSize: Fonts.size.sm,
                }}>
                {point}
              </Text>
            </View>
          )}
        </View>

        {userInternal ? null : (
          <IconButton
            onPress={() => {
              navigate({
                route: 'InitScanQRPages',
                params: {createDR: false},
              });
            }}
            icon={<Icon name="qrcode-scan" size={h(15)} color={Colors.text} />}
          />
        )}
      </View>
    </DropShadow>
  );
};

export default Profiles;

const styles = StyleSheet.create({
  /** CONTAINER */
  containerHeader: {
    backgroundColor: '#FF9D59',
    borderRadius: 25,
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  containerDetail: {flex: 1},
  containerWithLogo: {gap: 5, flexDirection: 'row', alignItems: 'center'},

  /** SHADOW */
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
