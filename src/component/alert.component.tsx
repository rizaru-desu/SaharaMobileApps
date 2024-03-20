import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import IIcon from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts} from '../assets/assets';

export type AlertRef = {
  show: ({
    title,
    desc,
    autoDismiss,
    onBack,
    onDismiss,
  }: {
    title?: string;
    desc?: string;
    autoDismiss?: boolean;
    onBack?: () => void;
    onDismiss?: () => void;
  }) => void;
  hide: () => void;
};

export class Alert {
  static alertRef: React.MutableRefObject<AlertRef>;

  static setAlertRef = (ref: any) => {
    this.alertRef = ref;
  };

  static show = ({
    title,
    desc,
    autoDismiss,
    onBack,
    onDismiss,
  }: {
    title?: string;
    desc?: string;
    autoDismiss?: boolean;
    onBack?: () => void;
    onDismiss?: () => void;
  }) => {
    this.alertRef.current?.show({title, desc, autoDismiss, onBack, onDismiss});
  };

  static hide = () => {
    this.alertRef.current?.hide();
  };
}

export const AlertBase = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isTitle, setTitle] = React.useState('');
  const [isDesc, setDesc] = React.useState('');
  const [autoDis, setAutoDis] = React.useState(false);

  const onDismissRef = React.useRef<(() => void) | undefined>(() => {});

  const onBackRef = React.useRef<(() => void) | undefined>(() => {});

  const modalRef = React.useRef<AlertRef>();

  React.useLayoutEffect(() => {
    Alert.setAlertRef(modalRef);
  }, []);

  React.useImperativeHandle(
    modalRef,
    () => ({
      show: ({title, desc, onBack, autoDismiss, onDismiss}) => {
        setModalVisible(true);
        setTitle(title ?? '');
        setDesc(desc ?? '');
        setAutoDis(autoDismiss ?? false);

        onDismissRef.current = onDismiss;
        onBackRef.current = onBack;

        if (autoDismiss) {
          setTimeout(() => {
            setModalVisible(false);
          }, 3000);
        }
      },
      hide: () => {
        setModalVisible(false);
      },
    }),
    [],
  );

  return (
    <Modal
      animationIn={'slideInUp'}
      animationInTiming={1000}
      animationOutTiming={1000}
      animationOut={'slideOutDown'}
      backdropOpacity={0.9}
      style={styles.bottomModal}
      onDismiss={() => onDismissRef}
      isVisible={modalVisible}>
      <View style={styles.containerContent}>
        <View style={styles.containerInfo}>
          <Text style={styles.labelTitle}>{isTitle}</Text>

          <Text numberOfLines={4} style={styles.labelSubtitle}>
            {isDesc}
          </Text>
        </View>

        {autoDis ? null : (
          <TouchableOpacity
            onPress={() => {
              if (onDismissRef.current) {
                onDismissRef.current();
              }
            }}
            style={styles.buttonDismiss}>
            <IIcon name={'close-circle'} size={Fonts.size.md} color={'white'} />
            <Text style={styles.labelDismiss}>Dismiss</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 10,
  },

  containerContent: {
    backgroundColor: 'white',
    borderColor: Colors.primary,
    borderStartWidth: 3,
    borderEndWidth: 3,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    columnGap: 5,
  },

  containerInfo: {
    rowGap: 5,
    flex: 1,
  },

  containerButton: {rowGap: 5},

  labelTitle: {
    color: Colors.text,
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.md,
  },

  labelSubtitle: {
    color: Colors.text,
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.sm,
  },

  labelDismiss: {
    color: 'white',
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.sm,
  },

  buttonDismiss: {
    backgroundColor: Colors.button,
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
    borderRadius: 10,
  },
});
