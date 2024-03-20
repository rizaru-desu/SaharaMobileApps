import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {Colors, Fonts} from '../assets/assets';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropShadow from 'react-native-drop-shadow';

type MyTabBarProps = BottomTabBarProps;

export const MyTabBar: React.FC<MyTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <DropShadow style={styles.dropShadow}>
      <View style={styles.containerTab}>
        {state.routes.map((route: any, index: any) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const iconNames = {
            homePage: 'home',
            homeMemberPage: 'home',
            RedemPage: 'wallet-giftcard',
            deliveryRequestPage: 'file-plus',
            settingPage: 'account-settings',
          } as any;

          const IconName = iconNames[route.name];

          return (
            <TouchableOpacity
              key={index.toString()}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{flex: 1, alignItems: 'center'}}>
              <Icon
                name={IconName}
                color={isFocused ? 'white' : Colors.text}
                size={Fonts.size.md}
              />
              <Text
                style={[
                  styles.label,
                  {color: isFocused ? 'white' : Colors.text},
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </DropShadow>
  );
};

const styles = StyleSheet.create({
  containerTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FF9D59',
    margin: 25,
    borderRadius: 25,
    padding: 10,
    gap: 10,
  },

  label: {fontFamily: Fonts.family.bold, fontSize: Fonts.size.sm},

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
