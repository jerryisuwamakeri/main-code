import React, { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import AppContainer from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import * as Updates from 'expo-updates';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ImageBackground,
  LogBox
} from "react-native";
import { Provider } from "react-redux";
import {
  FirebaseProvider,
  store
} from 'common';
import AppCommon from './AppCommon';
import { FirebaseConfig } from './config/FirebaseConfig';
import { colors } from './src/common/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {

  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs([
      'Setting a timer',
      'SplashScreen.show'
    ])

    const ReactNative = require('react-native');
    try {
        ReactNative.I18nManager.allowRTL(false);
    } catch (e) {
        console.log(e);
    }

    onLoad();
  }, []);

  const _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/background.jpg'),
        require('./assets/images/logo165x90white.png'),
        require('./assets/images/bg.jpg'),
        require('./assets/images/intro.jpg'),
        require('./assets/images/g4.gif'),
        require('./assets/images/lodingDriver.gif')
      ]),
      Font.loadAsync({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
        'Ubuntu-Regular': require('./assets/fonts/Ubuntu-Regular.ttf'),
        'Ubuntu-Medium': require('./assets/fonts/Ubuntu-Medium.ttf'),
        'Ubuntu-Light': require('./assets/fonts/Ubuntu-Light.ttf'),
        'Ubuntu-Bold': require('./assets/fonts/Ubuntu-Bold.ttf'),
        "DancingScript-Bold":require('./assets/fonts/DancingScript-Bold.ttf'),
        "DancingScript-Medium":require('./assets/fonts/DancingScript-Medium.ttf'),
        "DancingScript-SemiBold":require('./assets/fonts/DancingScript-SemiBold.ttf')
      }),
    ]);
  };

  const onLoad = async () => {
    if (__DEV__) {
      _loadResourcesAsync().then(() => {
        setAssetsLoaded(true);
      });
    } else {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
        _loadResourcesAsync().then(() => {
          setAssetsLoaded(true);
        })
      } catch (error) {
        _loadResourcesAsync().then(() => {
          setAssetsLoaded(true);
        })
      }
    }
  }

  if (!assetsLoaded) {
    return <View style={styles.container}>
      <ImageBackground
        source={require('./assets/images/intro.jpg')}
        resizeMode="stretch"
        style={styles.imagebg}
      >
        <ActivityIndicator style={{ paddingBottom: 100 }} color={colors.INDICATOR_BLUE} size='large' />
      </ImageBackground>
    </View>
  }

  return (
    <Provider store={store}>
      <FirebaseProvider config={FirebaseConfig} AsyncStorage={AsyncStorage}>
        <AppCommon>
          <AppContainer />
        </AppCommon>
      </FirebaseProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imagebg: {
    flex:1,
    justifyContent: "flex-end",
    alignItems: 'center'
  }
});