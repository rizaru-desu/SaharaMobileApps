import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Fonts} from '../../../assets/assets';
import {IconButton} from '@react-native-material/core';
import {verticalScale as h} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropShadow from 'react-native-drop-shadow';

const DetailOwner: React.FC<{
  previlege?: number;
  dataOwner?: any;
}> = ({previlege, dataOwner}) => {
  if (previlege === 1) {
    return (
      <React.Fragment>
        <DropShadow style={styles.dropShadow}>
          <View style={styles.containerBorder}>
            <Text style={styles.labelTitle}>Owner Detail</Text>
            <View style={styles.containerRowIconMember}>
              <Icon name="clipboard-list" size={h(15)} color={Colors.text} />
              <Text style={styles.labelNameIcon}>
                Total Booth: {dataOwner?.dataOwner?.totalBooth || 0}
              </Text>
            </View>
            <View style={styles.containerRowIconMember}>
              <Icon name="calendar-account" size={h(15)} color={Colors.text} />
              <Text style={styles.labelNameIcon}>
                Berdisi Sejak {dataOwner?.dataOwner?.dateEstablishment}
              </Text>
            </View>
            <View style={styles.containerRowIconMember}>
              <Icon name="google-maps" size={h(15)} color={Colors.text} />
              <Text style={styles.labelNameIcon}>
                {dataOwner?.dataOwner?.alamatOwner}
              </Text>
            </View>

            <View style={styles.containerSocial}>
              <IconButton
                icon={<Icon name="facebook" size={h(25)} color={Colors.text} />}
              />

              <IconButton
                icon={
                  <Icon name="instagram" size={h(25)} color={Colors.text} />
                }
              />

              <IconButton
                icon={<Icon name="shopping" size={h(25)} color={Colors.text} />}
              />
            </View>
          </View>
        </DropShadow>
      </React.Fragment>
    );
  } else {
    return null;
  }
};

export default DetailOwner;

const styles = StyleSheet.create({
  containerBorder: {
    margin: 10,
    padding: 10,
    borderWidth: 2,
    backgroundColor: 'white',
    borderColor: Colors.primary,
    borderRadius: 10,
    gap: 10,
  },
  containerRowIconMember: {flexDirection: 'row', gap: 10, alignItems: 'center'},
  containerList: {
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  containerSocial: {flexDirection: 'row', gap: 10, alignSelf: 'center'},
  labelTitle: {
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.xl,
    textAlign: 'center',
    color: Colors.text,
  },
  labelNameIcon: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.md,
    color: Colors.text,
    flex: 1,
    flexWrap: 'wrap',
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
