import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Modal from 'react-native-modal';
import {Colors, Fonts} from '../assets/assets';
import {ActivityIndicator} from 'react-native';

export type LoadingRef = {
  show: () => void;
  hide: () => void;
};

export class Loading {
  static alertRef: React.MutableRefObject<LoadingRef>;

  static setLoadingRef = (ref: any) => {
    this.alertRef = ref;
  };

  static show = () => {
    this.alertRef.current?.show();
  };

  static hide = () => {
    this.alertRef.current?.hide();
  };
}

export const LoadingBase = () => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const modalRef = React.useRef<LoadingRef>();

  React.useLayoutEffect(() => {
    Loading.setLoadingRef(modalRef);
  }, []);

  React.useImperativeHandle(
    modalRef,
    () => ({
      show: () => {
        setModalVisible(true);
      },
      hide: () => {
        setModalVisible(false);
      },
    }),
    [],
  );

  return (
    <Modal
      animationIn={'fadeIn'}
      animationInTiming={1000}
      animationOutTiming={1000}
      animationOut={'fadeOut'}
      backdropOpacity={0.9}
      style={styles.Modal}
      isVisible={modalVisible}>
      <View style={styles.containerContent}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.label}>Please Wait...</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  Modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },

  containerContent: {
    borderColor: Colors.button,
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  label: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.bold,
    color: Colors.text,
  },
});
