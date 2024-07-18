import {createSlice} from '@reduxjs/toolkit';
import {Alert} from '../component/alert.component';
import NetInfo from '@react-native-community/netinfo';
import {Loading} from '../component/loading.component';
import {
  ADD_DETAIL_OWNER,
  ADD_POINT_LOYALTY,
  DASHBOARD_DR,
  DASHBOARD_MEMBER,
  DETAIL_USER,
  FIND_DR,
  FIND_PRODUCTDR,
  SaharaClient,
  getDetail,
  getFullname,
  getToken,
  notAuth,
} from '../config/apis';
import _ from 'lodash';
import {goBack} from '../config/refNavigation';

interface InitialState {
  detailUser: any;
  internalUser: boolean;
  previlege: number;
  dataDashboardMember: any;
  addDetailOwner: boolean;
  showCampaign: boolean;

  listDR: any[];
  productDR: any[];
  refreshDR: boolean;
  refreshProductDR: boolean;
  refreshMember: boolean;
}

const initialState: InitialState = {
  detailUser: undefined,
  internalUser: false,
  previlege: 0,
  dataDashboardMember: undefined,
  addDetailOwner: false,
  showCampaign: false,

  listDR: [],
  productDR: [],
  refreshDR: false,
  refreshProductDR: false,
  refreshMember: false,
};

export const ReduxSlice = createSlice({
  name: 'initInitializeRedux',
  initialState,
  reducers: {
    detailUsers: (state, action) => {
      state.detailUser = action.payload.detailUser;
    },
    setInternalUsers: (state, action) => {
      state.internalUser = action.payload.internalUser;
    },
    setShowCampaign: (state, action) => {
      state.showCampaign = action.payload.showCampaign;
    },
    setPrevilegeUsers: (state, action) => {
      state.previlege = action.payload.previlege;
    },
    setDataDashboardMember: (state, action) => {
      state.dataDashboardMember = action.payload.dataDashboardMember;
    },
    setDetailOwner: (state, action) => {
      state.addDetailOwner = action.payload.addDetailOwner;
    },
    setListDR: (state, action) => {
      state.listDR = action.payload.listDR;
    },
    setProductDR: (state, action) => {
      state.productDR = action.payload.productDR;
    },
    setRefreshDR: (state, action) => {
      state.refreshDR = action.payload.refreshDR;
    },
    setRefreshProductDR: (state, action) => {
      state.refreshProductDR = action.payload.refreshProductDR;
    },
    setRefreshMember: (state, action) => {
      state.refreshMember = action.payload.refreshMember;
    },
  },
});

export const {
  detailUsers,
  setInternalUsers,
  setPrevilegeUsers,
  setDataDashboardMember,
  setDetailOwner,
  setListDR,
  setProductDR,
  setRefreshDR,
  setRefreshProductDR,
  setShowCampaign,
  setRefreshMember,
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

export const getInitialize = async ({dispatch}: {dispatch: any}) => {
  try {
    const detail = await getDetail();

    const interenal = _.chain(detail.previlege)
      .filter(role =>
        [
          '6467c855-165d-4dc8-88b5-68c54599e930',
          '503da001-3e56-414b-81c0-4329287ea6c7',
        ].includes(role.stringId),
      )
      .isEmpty()
      .value();

    interface PrivilegeMapping {
      [key: string]: number;
    }

    const privilegeMapping: PrivilegeMapping = {
      '6467c855-165d-4dc8-88b5-68c54599e930': 1, //owner
      '503da001-3e56-414b-81c0-4329287ea6c7': 2, //member
      '8f595a1e-cb1f-11ee-b237-38f9d362e2c9': 3, //admin delivery
      'd4ead12a-564e-4f32-b5bb-84ccd253f904': 3, //super user
    };

    const privilege = privilegeMapping[detail.previlege[0].stringId] || 4;

    dispatch(setInternalUsers({internalUser: interenal}));
    dispatch(setPrevilegeUsers({previlege: privilege}));
    getDetailUser({dispatch});

    if (privilege === 1) {
      getDahsboardMember({dispatch, isOwner: true});
    } else if (privilege === 2) {
      getDahsboardMember({dispatch, isOwner: false});
    } else if (privilege === 3) {
      getDashbaoardDR({dispatch});
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getDetailUser = async ({dispatch}: {dispatch: any}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({});

        const token = await getToken();

        const client = await SaharaClient.post(
          DETAIL_USER,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const {userDetail} = client.data;

          dispatch(detailUsers({detailUser: userDetail}));
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

export const getDahsboardMember = async ({
  dispatch,
  isOwner,
}: {
  dispatch: any;
  isOwner: boolean;
}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({});

        const token = await getToken();

        const client = await SaharaClient.post(
          DASHBOARD_MEMBER,
          {isOwner},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const result = client.data;
          dispatch(
            setDetailOwner({addDetailOwner: result?.dataOwner ? false : true}),
          );

          const finalResult = {
            campaign: _.get(result, 'campaign', []),
            historyPoint: {
              title: 'Point History',
              data: _.get(result, 'historyPoint', []),
            },
            listMember: {
              title: 'Booth Member List',
              data: _.get(result, 'listMember', []),
            },
            currentPoint: result.currentPoint,
            dataOwner: result?.dataOwner,
          };

          dispatch(setDataDashboardMember({dataDashboardMember: finalResult}));
          dispatch(
            setShowCampaign({
              showCampaign: !_.isEmpty(result?.campaign) ? true : false,
            }),
          );
          dispatch(setRefreshMember({refreshMember: false}));
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

export const getDashbaoardDR = async ({dispatch}: {dispatch: any}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({});

        const token = await getToken();

        const client = await SaharaClient.post(
          DASHBOARD_DR,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const {deliveryList} = client.data;

          dispatch(setListDR({listDR: deliveryList}));
          dispatch(setRefreshDR({refreshDR: false}));
        }
      } catch (error: any) {
        dispatch(setRefreshDR({refreshDR: false}));
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

export const findDR = async ({
  dispatch,
  value,
}: {
  dispatch: any;
  value: string;
}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({});

        const token = await getToken();

        const client = await SaharaClient.post(
          FIND_DR,
          {value},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const {deliveryList} = client.data;
          dispatch(setListDR({listDR: deliveryList}));
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

export const findProductDR = async ({
  dispatch,
  value,
}: {
  dispatch: any;
  value: string;
}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({});

        const token = await getToken();

        const client = await SaharaClient.post(
          FIND_PRODUCTDR,
          {labelId: value},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const {productList: productDR} = client.data;

          const groupedData = _.chain(productDR)
            .groupBy('labelBoxs')
            .map((products, labelBoxs) => ({
              labelBox: labelBoxs,
              totalWeight: _.sumBy(products, product => Number(product.weight)),
              product: _.map(products),
            }))
            .value();

          dispatch(setProductDR({productDR: groupedData}));
          dispatch(setRefreshProductDR({refreshProductDR: false}));
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

export const addDetailOwner = async ({
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

        let obj = values;
        _.set(obj, 'createdBy', fullname);

        const client = await SaharaClient.post(ADD_DETAIL_OWNER, obj, {
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
              dispatch(setDetailOwner({addDetailOwner: false}));
              getDahsboardMember({dispatch, isOwner: true});
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

export const addPointLoyalty = async ({label}: {label: any}) => {
  try {
    const networkConnetion = await NetInfo.fetch();

    if (networkConnetion.isConnected && networkConnetion.isInternetReachable) {
      try {
        Loading.show({});

        const token = await getToken();
        const fullname = await getFullname();

        const client = await SaharaClient.post(
          ADD_POINT_LOYALTY,
          {
            label,
            createdBy: fullname,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (client.status === 200) {
          Loading.hide();

          const {message} = client.data;

          alertUseable({
            message: message,
            onDismiss: () => {
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
