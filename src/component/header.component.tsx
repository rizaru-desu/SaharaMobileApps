import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import {IconButton} from '@react-native-material/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fonts} from '../assets/assets';
import {verticalScale as h} from 'react-native-size-matters';

const Header: React.FC<{
  title?: string;
  onBack: () => void;
}> = ({onBack, title}) => {
  return (
    <DropShadow style={styles.dropShadow}>
      <View style={styles.containerHeader}>
        <IconButton
          onPress={onBack}
          icon={<Icon name="arrow-left-circle" size={h(25)} color={'white'} />}
        />

        <Text style={styles.labelTitle}>{title}</Text>
      </View>
    </DropShadow>
  );
};

export default Header;

const styles = StyleSheet.create({
  /** CONTAINER */
  containerHeader: {
    backgroundColor: '#FF9D59',
    borderRadius: 25,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  /** LABEL */
  labelTitle: {
    fontFamily: Fonts.family.bold,
    fontSize: h(18),
    color: 'white',
  },

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
