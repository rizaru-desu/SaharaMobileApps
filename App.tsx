import React from 'react';
import RoutePages from './src/config/routePage';
import ErrorBoundary from 'react-native-error-boundary';
import {NavigationContainer} from '@react-navigation/native';
import {BackHandler, SafeAreaView, View} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/config/store';
import {refNavigation} from './src/config/refNavigation';
import {AlertBase} from './src/component/alert.component';
import {LoadingBase} from './src/component/loading.component';

function App(): JSX.Element {
  /* React.useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove();
    };
  }, []); */

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <NavigationContainer ref={refNavigation}>
          <RoutePages />
          <AlertBase />
          <LoadingBase />
        </NavigationContainer>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
