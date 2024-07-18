import {createSlice} from '@reduxjs/toolkit';
import {Alert} from '../component/alert.component';
import NetInfo from '@react-native-community/netinfo';
import {Loading} from '../component/loading.component';
import {
  ADD_DR,
  FIND_AGENT,
  FIND_LABELBOX,
  SaharaClient,
  getToken,
  getFullname,
  notAuth,
} from '../config/apis';
import _ from 'lodash';
import {goBack} from '../config/refNavigation';

interface InitialState {
  productList: any[];
  agentList: any[];
  lastNoSurat: any;
  lastNoOrder: any;
}

const initialState: InitialState = {
  productList: [],
  agentList: [],
  lastNoSurat: undefined,
  lastNoOrder: undefined,
};

export const ReduxSlice = createSlice({
  name: 'initCreateDRRedux',
  initialState,
  reducers: {
    setProductList: (state, action) => {
      state.productList = action.payload.productList;
    },
    setAgentList: (state, action) => {
      state.agentList = action.payload.agentList;
    },
    setNoSurat: (state, action) => {
      state.lastNoSurat = action.payload.lastNoSurat;
    },
    setNoOrder: (state, action) => {
      state.lastNoOrder = action.payload.lastNoOrder;
    },

    resetState: () => initialState,
  },
});

export const {
  setProductList,
  setAgentList,
  setNoSurat,
  setNoOrder,
  resetState,
} = ReduxSlice.actions;

const alertUseable = ({message}: {message: any}) => {
  Alert.show({title: 'Notification', desc: message, autoDismiss: true});
};

export const getAgent = async ({dispatch}: {dispatch: any}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({});

        const token = await getToken();

        const client = await SaharaClient.post(
          FIND_AGENT,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const {agentList, lastNoOrder, lastNoSurat} = client.data;

          dispatch(setAgentList({agentList: agentList}));
          dispatch(setNoOrder({lastNoOrder: lastNoOrder}));
          dispatch(setNoSurat({lastNoSurat: lastNoSurat}));
        }
      } catch (error: any) {
        Loading.hide();
        let status = '';
        switch (error.response?.status) {
          case 404:
            status = 'Error: Resource not found';
            break;
          case 500:
            status = 'Error: Internal Server Error';
            break;
          case 403:
            status = 'Error: Forbidden';
            break;
          case 401:
            notAuth();
            status = 'Error: Unauthorized';
            break;
          default:
            status = `Error: Unexpected status code ${error.response?.status}`;
        }

        alertUseable({
          message: `Status ${error.response?.status} - ${status}\n${error.response.data.message}`,
        });
      }
    } else {
      alertUseable({message: 'Please check your connection internet'});
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const scanLabelBox = async ({
  dispatch,
  label,
  currentData,
}: {
  dispatch: any;
  label: string;
  currentData: any[];
}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({});

        const token = await getToken();

        const client = await SaharaClient.post(
          FIND_LABELBOX,
          {value: label},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const {dataBox} = client.data;

          const current = _.clone(currentData);

          const groupedData = _.chain(dataBox)
            .groupBy('labelBoxs')
            .map((products, labelBoxs) => ({
              labelBox: labelBoxs,
              labelBoxId: products[0].labelBoxId,
              status: 2,
              shipQty: _.size(products),
              totalWeight: _.sumBy(products, product => Number(product.weight)),
              product: _.map(products),
            }))
            .value()[0];

          if (!_.isEmpty(dataBox)) {
            const existingItemIndex = _.findIndex<any>(current, {
              labelCodeBox: groupedData.labelBox,
            });

            if (existingItemIndex !== -1) {
              current[existingItemIndex] = dataBox;
            } else {
              current.push(groupedData);
            }

            dispatch(setProductList({productList: current}));
            goBack();
          } else {
            alertUseable({
              message: 'Label Box not found',
            });
          }
        }
      } catch (error: any) {
        Loading.hide();
        let status = '';
        switch (error.response?.status) {
          case 404:
            status = 'Error: Resource not found';
            break;
          case 500:
            status = 'Error: Internal Server Error';
            break;
          case 403:
            status = 'Error: Forbidden';
            break;
          case 401:
            notAuth();
            status = 'Error: Unauthorized';
            break;
          default:
            status = `Error: Unexpected status code ${error.response?.status}`;
        }

        alertUseable({
          message: `Status ${error.response?.status} - ${status}\n${error.response.data.message}`,
        });
      }
    } else {
      alertUseable({message: 'Please check your connection internet'});
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const submitDR = async ({
  dispatch,
  values,
}: {
  dispatch: any;
  values: any;
}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({});

        const token = await getToken();
        const fullname = await getFullname();

        const client = await SaharaClient.post(
          ADD_DR,
          {data: values, createdBy: fullname},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const {message} = client.data;

          goBack();
          dispatch(resetState());

          alertUseable({
            message: message,
          });
        }
      } catch (error: any) {
        Loading.hide();
        let status = '';
        switch (error.response?.status) {
          case 404:
            status = 'Error: Resource not found';
            break;
          case 500:
            status = 'Error: Internal Server Error';
            break;
          case 403:
            status = 'Error: Forbidden';
            break;
          case 401:
            notAuth();
            status = 'Error: Unauthorized';
            break;
          default:
            status = `Error: Unexpected status code ${error.response?.status}`;
        }

        alertUseable({
          message: `Status ${error.response?.status} - ${status}\n${error.response.data.message}`,
        });
      }
    } else {
      alertUseable({message: 'Please check your connection internet'});
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default ReduxSlice.reducer;
