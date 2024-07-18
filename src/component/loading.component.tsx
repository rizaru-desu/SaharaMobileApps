import React from 'react';
import {View, StyleSheet, Text, Modal} from 'react-native';
//import Modal from 'react-native-modal';
import {Colors, Fonts} from '../assets/assets';
import {ActivityIndicator} from 'react-native';

export type LoadingRef = {
  show: ({title}: {title?: string}) => void;
  hide: () => void;
};

export class Loading {
  static alertRef: React.MutableRefObject<LoadingRef>;

  static setLoadingRef = (ref: any) => {
    this.alertRef = ref;
  };

  static show = ({title}: {title?: string}) => {
    this.alertRef.current?.show({title});
  };

  static hide = () => {
    this.alertRef.current?.hide();
  };
}

export const LoadingBase = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [titles, setTitles] = React.useState('');

  const modalRef = React.useRef<LoadingRef>();

  React.useLayoutEffect(() => {
    Loading.setLoadingRef(modalRef);
  }, []);

  React.useImperativeHandle(
    modalRef,
    () => ({
      show: ({title}: {title?: string}) => {
        setModalVisible(true);
        setTitles(title ?? '');
      },
      hide: () => {
        setModalVisible(false);
      },
    }),
    [],
  );

  return (
    <Modal
      /*  animationIn={'fadeIn'}
      animationInTiming={1000}
      animationOutTiming={1000}
      animationOut={'fadeOut'} */
      //backdropOpacity={1}

      presentationStyle="overFullScreen"
      //isVisible={modalVisible}
      visible={modalVisible}
      transparent={true}
      accessible={true}
      accessibilityViewIsModal={true}
      accessibilityLabelledBy="Loading dialog"
      accessibilityRole="none"
      accessibilityLabel="Loading dialog"
      accessibilityHint="Displays a loading indicator and a message to wait">
      <View
        style={styles.Modal}
        accessible={true}
        accessibilityLabel="Modal content container parent">
        <View
          accessible={true}
          accessibilityLabel="Modal content container"
          style={styles.containerContent}>
          <ActivityIndicator
            accessible={true}
            accessibilityLabel="Loading indicator"
            size="large"
            color={Colors.primary}
          />
          <Text
            accessible={true}
            accessibilityLabel="Loading message"
            style={styles.label}>
            {titles ? titles : 'Please Wait...'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  Modal: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  containerContent: {
    justifyContent: 'center',
    borderColor: Colors.button,
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },

  label: {
    fontSize: Fonts.size.md,
    fontFamily: Fonts.family.bold,
    color: Colors.text,
  },
});
