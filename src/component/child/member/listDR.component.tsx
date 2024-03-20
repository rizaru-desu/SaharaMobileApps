import React from 'react';
import {StyleSheet, Text, View, FlatList, ScrollView} from 'react-native';
import {Colors, Fonts} from '../../../assets/assets';
import {verticalScale as h} from 'react-native-size-matters';
import {Button, IconButton, TextInput} from '@react-native-material/core';
import {
  findDR,
  getDashbaoardDR,
  setRefreshDR,
} from '../../../redux/initializeRedux';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../../config/useRedux';
import {RefreshControl} from 'react-native';
import {navigate} from '../../../config/refNavigation';
import moment from 'moment';
import _ from 'lodash';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropShadow from 'react-native-drop-shadow';

const ListDR: React.FC<{
  previlege?: number;
}> = ({previlege}) => {
  const dispatch = useDispatch();
  const {listDR, refreshDR} = useAppSelector(
    state => state.initInitializeRedux,
  );

  const [noteShow, setNoteShow] = React.useState<boolean>(false);
  const [note, setNote] = React.useState<string>('');
  const [searchValue, setSearchValue] = React.useState<string>('');

  const onRefreshDR = React.useCallback(() => {
    dispatch(setRefreshDR({refreshDR: true}));
    getDashbaoardDR({dispatch});
  }, [dispatch]);

  if (previlege === 3) {
    return (
      <React.Fragment>
        <View style={styles.containerTextInput}>
          <TextInput
            placeholder="Please enter No Surat"
            variant="standard"
            trailing={
              <IconButton
                onPress={() => {
                  findDR({dispatch, value: searchValue});
                }}
                icon={
                  <Icon
                    name={'archive-search'}
                    size={Fonts.size.sm}
                    color={Colors.primary}
                  />
                }
                color="white"
              />
            }
            color={Colors.primary}
            inputStyle={styles.inputStyle}
            onChangeText={text => {
              setSearchValue(text);
            }}
            value={searchValue}
          />
        </View>

        <Text style={styles.labelTitle}>Delivery Order</Text>

        <FlatList
          data={listDR}
          refreshControl={
            <RefreshControl
              refreshing={refreshDR}
              onRefresh={onRefreshDR}
              progressViewOffset={-10000}
            />
          }
          ListEmptyComponent={
            <Text style={styles.labelEmpty}>Empty Delivery Request</Text>
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <DropShadow style={styles.dropShadowFlatlist}>
              <View style={styles.containerItemFlatlist}>
                <View style={styles.containerTopItem}>
                  <View style={styles.containerFlex}>
                    <View style={styles.containerIcon}>
                      <Icon
                        name="account-tie-hat"
                        size={h(15)}
                        color={Colors.text}
                      />
                      <Text style={styles.labelItem}>{item.noSurat}</Text>
                    </View>
                    <View style={styles.containerIcon}>
                      <Icon name="cart" size={h(15)} color={Colors.text} />
                      <Text style={styles.labelItem}>{item.orderNo}</Text>
                    </View>
                    <View style={styles.containerIcon}>
                      <Icon name="cube" size={h(15)} color={Colors.text} />
                      <Text style={styles.labelItem}>
                        Total Product:{' '}
                        {_.sumBy(item.suratJalanProduct, 'shipQty')}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[styles.containerFlex, {alignItems: 'flex-end'}]}>
                    <View style={styles.containerIcon}>
                      <Icon name="cube-send" size={h(15)} color={Colors.text} />
                      <Text style={styles.labelItem}>
                        {moment(item.shippingDate).format('DD/MM/YYYY HH:mm')}
                      </Text>
                    </View>
                    <Text style={[styles.labelItem, {textAlign: 'right'}]}>
                      onCreate:
                    </Text>
                    <Text style={[styles.labelItem, {textAlign: 'right'}]}>
                      {item.createdBy}
                    </Text>

                    <Text style={[styles.labelItem, {textAlign: 'right'}]}>
                      Status: {item.status}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.labelItem, {fontWeight: '800'}]}>
                  Detail Customer
                </Text>

                <View style={styles.containerTopItem}>
                  <View style={styles.containerFlex}>
                    <View style={styles.containerIcon}>
                      <Icon
                        name="account-box"
                        size={h(15)}
                        color={Colors.text}
                      />
                      <Text style={styles.labelItem}>{item.customerName}</Text>
                    </View>

                    <View style={styles.containerIcon}>
                      <Icon
                        name="google-maps"
                        size={h(15)}
                        color={Colors.text}
                      />
                      <Text style={styles.labelItem}>
                        {item.deliveryAddress}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[styles.containerFlex, {alignItems: 'flex-end'}]}>
                    <View style={styles.containerIcon}>
                      <Text style={styles.labelItem}>{item.totalWeight}</Text>
                      <Icon
                        name="weight-kilogram"
                        size={h(15)}
                        color={Colors.text}
                      />
                    </View>

                    <Button
                      compact
                      variant="contained"
                      color={Colors.primary}
                      pressEffectColor={Colors.primary}
                      title="Delivery Note"
                      titleStyle={[styles.labelItem, {color: 'white'}]}
                      leading={
                        <Icon name="note-alert" size={h(15)} color={'white'} />
                      }
                      onPress={() => {
                        setNote(item.deliveryNote);
                        setNoteShow(true);
                      }}
                    />
                  </View>
                </View>

                <Text style={[styles.labelItem, {fontWeight: '800'}]}>
                  Log Surat:
                </Text>

                <View style={styles.containerTopItem}>
                  <View style={styles.containerFlex}>
                    <View style={styles.containerLog}>
                      <Text style={styles.labelItem}>Recaive Date:</Text>
                      <Text style={styles.labelItem}>{item.recaiveDate}</Text>
                    </View>

                    <View style={styles.containerLog}>
                      <Text style={styles.labelItem}>Recaive By:</Text>
                      <Text style={styles.labelItem}>{item.recaiveBy}</Text>
                    </View>

                    <Button
                      compact
                      variant="contained"
                      color={Colors.primary}
                      pressEffectColor={Colors.primary}
                      title="Recaive Note"
                      titleStyle={[styles.labelItem, {color: 'white'}]}
                      leading={
                        <Icon name="note-alert" size={h(15)} color={'white'} />
                      }
                      onPress={() => {
                        setNote(item.recaiveNote);
                        setNoteShow(true);
                      }}
                    />

                    <Button
                      compact
                      variant="contained"
                      color={Colors.primary}
                      pressEffectColor={Colors.primary}
                      title="Detail Product"
                      titleStyle={[styles.labelItem, {color: 'white'}]}
                      leading={
                        <Icon name="cube" size={h(15)} color={'white'} />
                      }
                      onPress={() => {
                        const labelBox = _.map(
                          item.suratJalanProduct,
                          'labelBoxId',
                        );
                        navigate({
                          route: 'InitProductDRPages',
                          params: {
                            title: item.noSurat,
                            labelId: labelBox,
                          },
                        });
                      }}
                    />
                  </View>
                </View>
              </View>
            </DropShadow>
          )}
        />

        <ModalNote
          inVisible={noteShow}
          onClose={() => setNoteShow(false)}
          isNote={note}
        />
      </React.Fragment>
    );
  } else {
    return null;
  }
};

const ModalNote: React.FC<{
  inVisible: boolean;
  isNote: string;
  onClose: () => void;
}> = ({inVisible, isNote, onClose}) => {
  return (
    <Modal isVisible={inVisible} style={styles.containerModalNote}>
      <View style={styles.containerModalContentNote}>
        <View style={styles.containerModalRowNote}>
          <Text
            style={{
              fontFamily: Fonts.family.bold,
              fontSize: Fonts.size.lg,
              color: Colors.text,
            }}>
            Title
          </Text>

          <IconButton
            onPress={onClose}
            color={Colors.primary}
            icon={
              <Icon
                name="close-circle-multiple"
                size={Fonts.size.lg}
                color={'red'}
              />
            }
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              fontFamily: Fonts.family.regular,
              fontSize: Fonts.size.md,
              color: Colors.text,
            }}>
            {isNote}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ListDR;

const styles = StyleSheet.create({
  containerTextInput: {gap: 10},
  containerTopItem: {
    flexDirection: 'row',
  },
  containerFlex: {flex: 1, gap: 10},
  containerIcon: {flexDirection: 'row', gap: 5, alignItems: 'center'},
  containerLog: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerItemFlatlist: {
    borderRadius: 5,
    borderColor: Colors.primary,
    borderWidth: 1,
    backgroundColor: 'white',
    gap: 10,
    padding: 10,
  },
  containerModalNote: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  containerModalContentNote: {
    backgroundColor: 'white',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    padding: 10,
    maxHeight: h(250),
    gap: 10,
  },
  containerModalRowNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 2,
    borderBottomWidth: 2,
  },

  inputStyle: {
    fontFamily: Fonts.family.regular,
    color: Colors.text,
    padding: 0,
  },
  labelTitle: {
    fontFamily: Fonts.family.bold,
    fontSize: Fonts.size.xl,
    textAlign: 'center',
    color: Colors.text,
  },
  labelEmpty: {
    color: Colors.text,
    fontSize: Fonts.size.md,
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
  },
  labelItem: {
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.sm,
    color: Colors.text,
  },

  dropShadowFlatlist: {
    shadowColor: '#ff690073',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    gap: 5,
    padding: 10,
  },
});
