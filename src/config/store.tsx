import {configureStore} from '@reduxjs/toolkit';
import {
  InitializeSlize,
  addBoothSlice,
  createDRSlice,
  redeemSlice,
} from '../redux';

import reactotron from './reactotron';

export const store = configureStore({
  reducer: {
    initInitializeRedux: InitializeSlize,
    initCreateDRRedux: createDRSlice,
    initAddBoothRedux: addBoothSlice,
    initRedeemRedux: redeemSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  enhancers: getDefaultEnhancers =>
    getDefaultEnhancers().concat(reactotron.createEnhancer()),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
