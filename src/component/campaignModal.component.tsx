import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {verticalScale as h, scale as w} from 'react-native-size-matters';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../assets/assets';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button, IconButton} from '@react-native-material/core';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-reanimated-carousel';
import {useDispatch} from 'react-redux';
import {setShowCampaign} from '../redux/initializeRedux';

const CampaignModal: React.FC<{
  isVisible?: boolean;
  campaignData?: any;
}> = ({isVisible, campaignData}) => {
  const dispatch = useDispatch();
  const PAGE_WIDTH = w(270);

  return (
    <Modal
      animationIn={'fadeIn'}
      animationInTiming={1000}
      animationOutTiming={1000}
      animationOut={'fadeOut'}
      backdropOpacity={0.9}
      style={styles.Modal}
      isVisible={isVisible}>
      <View style={styles.containerContent}>
        <IconButton
          onPress={() => {
            dispatch(setShowCampaign({showCampaign: false}));
          }}
          style={{alignSelf: 'flex-end'}}
          icon={<Icon name="close" color={'red'} size={30} />}
        />
        <Carousel
          loop
          width={PAGE_WIDTH}
          height={PAGE_WIDTH * 1.5}
          autoPlay={true}
          data={campaignData}
          pagingEnabled={true}
          snapEnabled={true}
          autoPlayInterval={2000}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.8,
            parallaxScrollingOffset: 100,
          }}
          renderItem={({item}: {item: any}) => (
            <View
              style={{
                flex: 1,
                gap: 5,
              }}>
              <FastImage
                style={{width: '100%', height: '80%'}}
                source={{
                  uri: item.photo,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />

              <View
                style={{
                  borderWidth: 2,
                  borderColor: Colors.primary,
                  borderRadius: 5,
                  padding: 10,
                  borderStyle: 'dotted',
                  backgroundColor: 'white',
                }}>
                <Text style={[styles.label, {fontFamily: Fonts.family.bold}]}>
                  {item.campaignName}
                </Text>
                <Text
                  numberOfLines={3}
                  style={[styles.label, {fontSize: Fonts.size.sm}]}>
                  {item.description}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

export default CampaignModal;

const styles = StyleSheet.create({
  Modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerContent: {
    borderColor: Colors.button,
    backgroundColor: 'white',
    padding: 10,
    gap: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  label: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.regular,
    color: Colors.text,
    textAlign: 'justify',
  },
});
