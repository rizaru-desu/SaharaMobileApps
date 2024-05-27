import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors, Fonts} from '../../../assets/assets';
import {verticalScale as h} from 'react-native-size-matters';
import IconAwesome from 'react-native-vector-icons/FontAwesome5';
import DropShadow from 'react-native-drop-shadow';
import _ from 'lodash';

const DetailOwner: React.FC<{
  previlege?: number;
  dataOwner?: any;
}> = ({previlege, dataOwner}) => {
  if (previlege === 1) {
    return (
      <React.Fragment>
        <View style={styles.containerBorder}>
          <View style={styles.containerRowIconMember}>
            <IconAwesome name="box" size={h(15)} color={'red'} />
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text
                style={{
                  width: '25%',
                  fontFamily: Fonts.family.regular,
                  fontSize: Fonts.size.md,
                  color: Colors.text,
                }}>
                Total Booth
              </Text>
              <Text style={styles.labelNameIcon}>
                : {_.size(dataOwner?.listMember?.data) || 0}
              </Text>
            </View>
          </View>
          <View style={styles.containerRowIconMember}>
            <IconAwesome name="clock" size={h(15)} color={'red'} />
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text
                style={{
                  width: '25%',
                  fontFamily: Fonts.family.regular,
                  fontSize: Fonts.size.md,
                  color: Colors.text,
                }}>
                Since
              </Text>
              <Text style={styles.labelNameIcon}>
                : {dataOwner?.dataOwner?.dateEstablishment}
              </Text>
            </View>
          </View>
          <View style={styles.containerRowIconMember}>
            <IconAwesome name="map-marker-alt" size={h(15)} color={'red'} />

            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text
                style={{
                  width: '25%',
                  fontFamily: Fonts.family.regular,
                  fontSize: Fonts.size.md,
                  color: Colors.text,
                }}>
                Address
              </Text>
              <Text style={styles.labelNameIcon}>
                : {dataOwner?.dataOwner?.alamatOwner}
              </Text>
            </View>
          </View>

          <View style={styles.containerRowIconMember}>
            <IconAwesome name="facebook" size={h(15)} color={'red'} />
            <Text style={styles.labelNameIcon}>
              {dataOwner?.dataOwner?.facebook}
            </Text>
          </View>

          <View style={styles.containerRowIconMember}>
            <IconAwesome name="instagram" size={h(15)} color={'red'} />
            <Text style={styles.labelNameIcon}>
              {dataOwner?.dataOwner?.instagram}
            </Text>
          </View>

          <View style={styles.containerRowIconMember}>
            <IconAwesome name="shopping-bag" size={h(15)} color={'red'} />
            <Text style={styles.labelNameIcon}>
              {dataOwner?.dataOwner?.ecommerce}
            </Text>
          </View>
        </View>
      </React.Fragment>
    );
  } else {
    return null;
  }
};

export default DetailOwner;

const styles = StyleSheet.create({
  containerBorder: {
    padding: 10,
    borderWidth: 2,
    backgroundColor: 'white',
    borderColor: 'silver',
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
