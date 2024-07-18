import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Avatar} from '@react-native-material/core';
import {verticalScale as h} from 'react-native-size-matters';
import {Colors, Fonts} from '../assets/assets';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigate} from '../config/refNavigation';

const Profiles: React.FC<{
  detail: any;
  userInternal: boolean;
  point?: number;
}> = ({detail, userInternal, point}) => {
  return (
    <View style={styles.containerHeader}>
      <Avatar
        label={detail?.fullname}
        size={h(70)}
        color="white"
        style={{backgroundColor: '#e5e5e5'}}
        labelStyle={{
          color: Colors.text,
          fontFamily: Fonts.family.bold,
          fontSize: h(30),
        }}
      />
      <View style={styles.containerDetail}>
        <View style={styles.containerWithLogo}>
          <Icon name="account-check" size={h(18)} color={'red'} />
          <Text
            style={{
              color: Colors.text,
              fontFamily: Fonts.family.bold,
              fontSize: h(15),
            }}>
            {detail?.fullname}
          </Text>
        </View>

        {userInternal ? (
          <View style={styles.containerWithLogo}>
            <Icon name="account-tie-hat" size={h(18)} color={'blue'} />
            <Text
              style={{
                color: Colors.text,
                fontFamily: Fonts.family.italic,
                fontSize: h(15),
              }}>
              {detail?.leader || '-'}
            </Text>
          </View>
        ) : (
          <View style={styles.containerWithLogo}>
            <Icon name="hand-coin" size={h(18)} color={'#FF9D59'} />
            <Text
              style={{
                color: Colors.text,
                fontFamily: Fonts.family.regular,
                fontSize: h(15),
                textDecorationLine: 'underline',
              }}>
              Point {point}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Profiles;

const styles = StyleSheet.create({
  /** CONTAINER */
  containerHeader: {
    borderRadius: 25,
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
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
