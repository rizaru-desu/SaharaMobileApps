import {createSlice} from '@reduxjs/toolkit';
import {Alert} from '../component/alert.component';
import NetInfo from '@react-native-community/netinfo';
import {Loading} from '../component/loading.component';
import {
  SaharaClient,
  getToken,
  getFullname,
  notAuth,
  FIND_USER_BOOTH,
  ADD_BOOTH,
} from '../config/apis';
import {goBack} from '../config/refNavigation';

interface InitialState {
  dataUser: any;
}

const initialState: InitialState = {
  dataUser: undefined,
};

export const ReduxSlice = createSlice({
  name: 'initAddBoothRedux',
  initialState,
  reducers: {
    setDataUser: (state, action) => {
      state.dataUser = action.payload.dataUser;
    },

    resetState: () => initialState,
  },
});

export const {setDataUser, resetState} = ReduxSlice.actions;

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

export const getUser = async ({
  dispatch,
  email,
}: {
  dispatch: any;
  email: string;
}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({});

        const token = await getToken();

        const client = await SaharaClient.post(
          FIND_USER_BOOTH,
          {email},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const {findUser} = client.data;

          dispatch(setDataUser({dataUser: findUser}));
          alertUseable({
            message: 'User found.',
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

export const addBooth = async ({
  dispatch,
  values,
  boothOwnerId,
}: {
  dispatch: any;
  values: any;
  boothOwnerId: string;
}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({});

        const token = await getToken();
        const fullname = await getFullname();

        const payload = {
          userId: values.userId,
          boothOwnerId: boothOwnerId,
          email: values.email,
          alamatBooth: values.alamatBooth,
          photoBooth: values.base64,
          createdBy: fullname,
        };

        const client = await SaharaClient.post(ADD_BOOTH, payload, {
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
              dispatch(resetState());
              goBack();
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
