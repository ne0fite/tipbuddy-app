import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';

import { AppLoading, Font, Icon } from 'expo';

import theme from './theme';
import AppNavigator from './navigation/AppNavigator';
import JobDAO from './dao/JobDAO';
import TipDAO from './dao/TipDAO';

import rootReducer from './modules/index';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  async componentDidMount() {
    try {
      const jobDao = new JobDAO();
      await jobDao.init();
      const tipDao = new TipDAO();
      await tipDao.init();
    } catch (error) {
      console.log('failed to init table', error);
    }
  }

  loadResourcesAsync = async () => Promise.all([
    // Asset.loadAsync([
    //   require('./assets/images/robot-dev.png'),
    //   require('./assets/images/robot-prod.png'),
    // ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Icon.Ionicons.font,
    }),
  ]);

  handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }

    return (
      <PaperProvider theme={theme}>
        <StoreProvider store={store}>
          <AppNavigator />
        </StoreProvider>
      </PaperProvider>
    );
  }
}
