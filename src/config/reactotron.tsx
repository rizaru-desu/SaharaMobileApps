import {NativeModules} from 'react-native';
import Reactotron, {
  networking,
  trackGlobalErrors,
  trackGlobalLogs,
} from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {scriptURL} = NativeModules.SourceCode;
const hostName = scriptURL.split('://')[1].split(':')[0];

const reactotron = Reactotron.configure({
  name: 'Sahara - MOBILE',
  host: hostName,
  port: 9090,
})
  .setAsyncStorageHandler(AsyncStorage)
  .useReactNative({
    asyncStorage: true,
    networking: {
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    overlay: false,
  })
  .use(
    networking({
      ignoreContentTypes: /^(image)\/.*$/i,
      ignoreUrls: /\/(logs|symbolicate)$/,
    }) as any,
  )
  .use(trackGlobalErrors() as any)
  .use(trackGlobalLogs() as any)
  .use(reactotronRedux())
  .connect();

export default reactotron;
