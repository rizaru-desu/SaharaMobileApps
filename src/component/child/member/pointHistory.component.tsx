import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Colors, Fonts} from '../../../assets/assets';
import {verticalScale as h} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropShadow from 'react-native-drop-shadow';
import _ from 'lodash';
import moment from 'moment';

const PointHistory: React.FC<{
  previlege?: number;
  historyPoint?: any;
}> = ({previlege, historyPoint}) => {
  if (previlege === 1) {
    return (
      <React.Fragment>
        <Text style={styles.labelTitle}>History Point</Text>
        <DropShadow style={styles.dropShadow}>
          <ScrollView
            nestedScrollEnabled
            style={[styles.containerBorder, {maxHeight: h(250)}]}>
            {!_.isEmpty(historyPoint) ? (
              _.map(historyPoint, (item: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.containerList,
                    {
                      alignItems: 'flex-start',
                      borderBottomColor: Colors.primary,
                      borderBottomWidth: 3,
                      borderStyle: 'dotted',
                    },
                  ]}>
                  <View style={styles.containerFlexIcon}>
                    <View style={styles.containerRowIconMember}>
                      <Icon
                        name="qrcode-scan"
                        size={h(15)}
                        color={Colors.text}
                      />
                      <Text style={styles.labelNameIcon}>
                        {_.isEmpty(item.scanDate)
                          ? ' - '
                          : moment().format('DD/MM/YYYY HH:mm')}
                      </Text>
                    </View>
                    <View style={styles.containerRowIconMember}>
                      <Icon
                        name="inbox-multiple"
                        size={h(15)}
                        color={Colors.text}
                      />
                      <Text style={styles.labelNameIcon}>
                        {item.productName}
                      </Text>
                    </View>
                    <View style={styles.containerRowIconMember}>
                      <Icon
                        name="link-box-variant"
                        size={h(15)}
                        color={Colors.text}
                      />
                      <Text style={styles.labelNameIcon}>
                        {item.labelProducts}
                      </Text>
                    </View>
                    <View style={styles.containerRowIconMember}>
                      <Icon
                        name="note-alert"
                        size={h(15)}
                        color={Colors.text}
                      />
                      <Text style={styles.labelNameIcon}>{item.remark}</Text>
                    </View>
                  </View>

                  <View style={styles.containerFlexIcon}>
                    <View style={styles.containerRowIconMember}>
                      <Icon name="hand-coin" size={h(15)} color={Colors.text} />
                      <Text style={styles.labelNameIcon}>
                        Point: {item.loyaltyPoint}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.labelEmpty}>Empty history point</Text>
            )}
          </ScrollView>
        </DropShadow>
      </React.Fragment>
    );
  } else {
    return null;
  }
};

export default PointHistory;

const styles = StyleSheet.create({
  containerBorder: {
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
  containerFlexIcon: {flex: 1, gap: 10},
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
