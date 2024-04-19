import {createSlice} from '@reduxjs/toolkit';
import {Alert} from '../component/alert.component';
import NetInfo from '@react-native-community/netinfo';
import {Loading} from '../component/loading.component';
import {
  SaharaClient,
  getToken,
  getFullname,
  notAuth,
  PACKAGE_REDEEM,
  CLAIM_REDEEM,
} from '../config/apis';

interface InitialState {
  listPackage: any[];
  listMyRedeem: any[];
  listAgent: any[];
  modalRedeem: boolean;
  refreshList: boolean;
}

const initialState: InitialState = {
  listPackage: [],
  listMyRedeem: [],
  listAgent: [],
  modalRedeem: false,
  refreshList: false,
};

export const ReduxSlice = createSlice({
  name: 'initRedeemRedux',
  initialState,
  reducers: {
    setListPackage: (state, action) => {
      state.listPackage = action.payload.listPackage;
    },
    setListMyRedeem: (state, action) => {
      state.listMyRedeem = action.payload.listMyRedeem;
    },
    setListAgent: (state, action) => {
      state.listAgent = action.payload.listAgent;
    },
    setModalRedeem: (state, action) => {
      state.modalRedeem = action.payload.modalRedeem;
    },
    setRefreshList: (state, action) => {
      state.refreshList = action.payload.refreshList;
    },
    resetState: () => initialState,
  },
});

export const {
  setListPackage,
  setListMyRedeem,
  setListAgent,
  setModalRedeem,
  resetState,
  setRefreshList,
} = ReduxSlice.actions;

const alertUseable = ({
  message,
  onDismiss,
}: {
  message: any;
  onDismiss?: () => void;
}) => {
  Alert.show({
    title: 'Notification',
    desc: message,
    autoDismiss: true,
    onDismiss,
  });
};

export const getPackage = async ({dispatch}: {dispatch: any}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show();

        const token = await getToken();

        const client = await SaharaClient.post(
          PACKAGE_REDEEM,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const {packageReedem, myRedeem, listAgent} = client.data;

          dispatch(setListPackage({listPackage: packageReedem}));
          dispatch(setListMyRedeem({listMyRedeem: myRedeem}));
          dispatch(setListAgent({listAgent: listAgent}));
          dispatch(setRefreshList({refreshList: false}));
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

export const addRedeem = async ({
  dispatch,
  packageId,
  agentId,
}: {
  dispatch: any;
  packageId: string;
  agentId: string;
}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show();

        const token = await getToken();
        const fullname = await getFullname();

        const payload = {
          packageId,
          agentId,
          createdBy: fullname,
        };

        const client = await SaharaClient.post(CLAIM_REDEEM, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (client.status === 200) {
          Loading.hide();

          const {message} = client.data;
          alertUseable({
            message: message,
            onDismiss: () => {
              dispatch(setModalRedeem({modalRedeem: false}));
              getPackage({dispatch});
            },
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
