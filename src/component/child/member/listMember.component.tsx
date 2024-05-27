import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Colors, Fonts} from '../../../assets/assets';
import {verticalScale as h} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropShadow from 'react-native-drop-shadow';
import FastImage from 'react-native-fast-image';
import {Button} from '@react-native-material/core';
import {navigate} from '../../../config/refNavigation';
import _ from 'lodash';

const ListMemberOwner: React.FC<{
  previlege?: number;
  dataOwner?: any;
  listMember?: any[];
}> = ({previlege, dataOwner, listMember}) => {
  if (previlege === 1) {
    return (
      <React.Fragment>
        <View style={styles.containerBorder}>
          <Button
            tintColor="white"
            style={{alignSelf: 'flex-end'}}
            color={Colors.button}
            titleStyle={styles.labelButton}
            compact
            title="Add Member"
            trailing={<Icon name="account-plus" size={h(15)} color={'white'} />}
            onPress={() => {
              navigate({
                route: 'InitAddBooth',
                params: {boothOwnerId: dataOwner?.dataOwner?.boothOwnerId},
              });
            }}
          />

          <ScrollView nestedScrollEnabled style={{maxHeight: h(250)}}>
            {!_.isEmpty(listMember) ? (
              _.map(listMember, (item: any, index: number) => (
                <View key={index} style={styles.containerList}>
                  <FastImage
                    style={{width: h(100), height: h(100)}}
                    source={{uri: item.photoBooth}}
                    resizeMode={FastImage.resizeMode.contain}
                  />

                  <View style={styles.containerFlexIcon}>
                    <View style={styles.containerRowIconMember}>
                      <Icon
                        name="card-account-details-star"
                        size={h(15)}
                        color={Colors.text}
                      />
                      <Text style={styles.labelNameIcon}>{item.fullname}</Text>
                    </View>
                    <View style={styles.containerRowIconMember}>
                      <Icon
                        name="phone-classic"
                        size={h(15)}
                        color={Colors.text}
                      />
                      <Text style={styles.labelNameIcon}>{item.phone}</Text>
                    </View>
                    <View style={styles.containerRowIconMember}>
                      <Icon name="email" size={h(15)} color={Colors.text} />
                      <Text style={styles.labelNameIcon}>{item.email}</Text>
                    </View>
                    <View style={styles.containerRowIconMember}>
                      <Icon
                        name="google-maps"
                        size={h(15)}
                        color={Colors.text}
                      />
                      <Text style={styles.labelNameIcon}>
                        {item.alamatBooth}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.labelEmpty}>Empty Member Booth</Text>
            )}
          </ScrollView>
        </View>
      </React.Fragment>
    );
  } else {
    return null;
  }
};

export default ListMemberOwner;

const styles = StyleSheet.create({
  containerBorder: {
    padding: 10,
    borderWidth: 2,
    backgroundColor: 'white',
    borderColor: '#FF9D59',
    borderRadius: 10,
    gap: 10,
  },
  containerRowIconMember: {flexDirection: 'row', gap: 10, alignItems: 'center'},
  containerList: {
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderColor: Colors.primary,
    borderStyle: 'dotted',
  },
  containerFlexIcon: {flex: 1, gap: 10},
  labelEmpty: {
    color: Colors.text,
    fontSize: Fonts.size.md,
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
  },
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
  labelButton: {
    color: 'white',
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.sm,
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
