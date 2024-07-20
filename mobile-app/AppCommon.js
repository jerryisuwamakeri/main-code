import { useState, useEffect, useRef } from 'react';
import { api, store } from 'common';
import { useSelector, useDispatch } from 'react-redux';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';
import i18n from 'i18n-js';
import { colors } from './src/common/theme';
import GetPushToken from './src/components/GetPushToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment/min/moment-with-locales';
import {
  AuthLoadingScreen,
} from './src/screens';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }) => {
  if (error) {
    console.log(error);
    return;
  }
  if (locations.length > 0) {
    let location = locations[locations.length - 1];
    if (location.coords) {
      store.dispatch({
        type: 'UPDATE_GPS_LOCATION',
        payload: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }
      });
    }
  }
});

export default function AppCommon({ children }) {

  const { t } = i18n;
  const dispatch = useDispatch();
  const gps = useSelector(state => state.gpsdata);
  const activeBooking = useSelector(state => state.bookinglistdata.tracked);
  const lastLocation = useSelector(state => state.locationdata.coords);
  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settingsdata.settings);
  const watcher = useRef();
  const locationOn = useRef(false);
  const languagedata = useSelector(state => state.languagedata);
  const initialFunctionsNotCalled = useRef(true);
  const authStillNotResponded = useRef(true);
  const authState = useRef('loading');
  const locationLoading = useRef(true);
  const fetchingToken = useRef(true);
  const langCalled = useRef();
  const tasks = useSelector(state => state.taskdata.tasks);
  const [playedSounds, setPlayedSounds] = useState([]);
  const [deviceId,setDeviceId] = useState();

  useEffect(() => {
      AsyncStorage.getItem('deviceId', (err, result) => {
        if (result) {
          setDeviceId(result);
        } else {
          const ID = "id" + new Date().getTime();
          AsyncStorage.setItem('deviceId',ID);
          setDeviceId(ID);
        }
      });
  }, []);

  useEffect(() => {
    if (api) {
        dispatch(api.fetchSettings());
        dispatch(api.fetchLanguages());
        dispatch(api.fetchCarTypes());
        langCalled.current = true;
    }
  }, [api]);

  useEffect(() => {
    if (languagedata.langlist && langCalled.current) {
      let obj = {};
      let defl = {};
      for (const value of Object.values(languagedata.langlist)) {
        obj[value.langLocale] = value.keyValuePairs;
        if (value.default) {
          defl = value;
        }
      }
      i18n.translations = obj;
      i18n.fallbacks = true;
      AsyncStorage.getItem('lang', (err, result) => {
        if (result) {
          i18n.locale = JSON.parse(result)['langLocale'];
          moment.locale(JSON.parse(result)['dateLocale']);
        } else {
          i18n.locale = defl.langLocale;
          moment.locale(defl.dateLocale);
        }
      });
      dispatch(api.fetchUser());
    }
  }, [languagedata.langlist,langCalled.current]);

  useEffect(() => {
    if (auth.profile && auth.profile.usertype && auth.profile.usertype == 'driver' && tasks && tasks.length > 0) {
      notifyBooking();
    }
  }, [auth.profile, tasks]);

  const notifyBooking = async () => {
    for(let i=0;i<tasks.length;i++){
      if(!playedSounds.includes(tasks[i].id)){
        await Notifications.scheduleNotificationAsync({
          content: {
            title: t('notification_title'),
            body: t('new_booking_notification'),
            sound: Platform.OS === 'ios' ? (settings.CarHornRepeat? 'repeat.wav': 'horn.wav'):null
          },
          trigger:Platform.OS === 'ios'? null: {
            seconds: 1,
            channelId: settings.CarHornRepeat? 'bookings-repeat': 'bookings', 
            },
        });
        let newArr = [...playedSounds];
        newArr.push(tasks[i].id);
        setPlayedSounds(newArr);
      }
    }
  }

  useEffect(() => {
    if (gps.location && gps.location.lat && gps.location.lng) {
      locationLoading.current = false;
      if (auth.profile && auth.profile.usertype && auth.profile.usertype == 'driver' ) {
        api.saveUserLocation({
          lat: gps.location.lat,
          lng: gps.location.lng
        });
      }
      if (activeBooking && auth.profile && auth.profile.usertype && auth.profile.usertype == 'driver') {
        if (lastLocation && (activeBooking.status == 'ACCEPTED' || activeBooking.status == 'STARTED')) {
          let diff = api.GetDistance(lastLocation.lat, lastLocation.lng, gps.location.lat, gps.location.lng);
          if (diff > 0.010 && activeBooking.driverDeviceId === deviceId) {
            api.saveTracking(activeBooking.id, {
              at: new Date().getTime(),
              status: activeBooking.status,
              lat: gps.location.lat,
              lng: gps.location.lng
            });
          }
        }
        if(!lastLocation && activeBooking.status == 'ACCEPTED'){
          api.saveTracking(activeBooking.id, {
            at: new Date().getTime(),
            status: activeBooking.status,
            lat: gps.location.lat,
            lng: gps.location.lng
          });
        }
        if (activeBooking.status == 'ACCEPTED') {
          let diff = api.GetDistance(activeBooking.pickup.lat, activeBooking.pickup.lng, gps.location.lat, gps.location.lng);
          if (diff < 0.02) {
            let bookingData = activeBooking;
            bookingData.status = 'ARRIVED';
            store.dispatch(api.updateBooking(bookingData));
            api.saveTracking(activeBooking.id, {
              at: new Date().getTime(),
              status: 'ARRIVED',
              lat: gps.location.lat,
              lng: gps.location.lng
            });
          }
        }
      }
    }
  }, [gps.location]);

  useEffect(() => {
    if (auth.profile
      && auth.profile.usertype
      && auth.profile.usertype == 'driver'
      && auth.profile.driverActiveStatus
    ) {
      if (!locationOn.current) {
        locationOn.current = true;
        if (Platform.OS == 'android') {
          AsyncStorage.getItem('firstRun', (err, result) => {
            if (result) {
              StartBackgroundLocation();
            } else {
              Alert.alert(
                t('disclaimer'),
                t('disclaimer_text'),
                [
                  {
                    text: t('ok'), onPress: () => {
                      AsyncStorage.setItem('firstRun', 'OK');
                      StartBackgroundLocation();
                    }
                  }
                ],
                { cancelable: false }
              );
            }
          });
        } else {
          StartBackgroundLocation();
        }
      }
    }
    if (auth.profile
      && auth.profile.usertype
      && auth.profile.usertype == 'driver'
      && auth.profile.driverActiveStatus == false
    ) {
      if (locationOn.current) {
        locationOn.current = false;
        StopBackgroundLocation();
      } else {
        store.dispatch({
          type: 'UPDATE_GPS_LOCATION',
          payload: {
            error:true
          }
        });
        locationLoading.current = false;
      }
    }
    if (auth.profile
      && auth.profile.usertype
      && auth.profile.usertype == 'customer'
    ) {
      if (!locationOn.current) {
        locationOn.current = true;
        GetOneTimeLocation();
      }
    }
  }, [auth.profile]);

  const saveToken = async () => {
    let token = await GetPushToken();
    if((auth.profile && auth.profile.pushToken && auth.profile.pushToken != token) || !(auth.profile && auth.profile.pushToken) ){
      api.updatePushToken(
        token ? token : 'token_error',
        Platform.OS == 'ios' ? 'IOS' : 'ANDROID'
      );
    }
  };

  const GetOneTimeLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      try {
        let tempWatcher = await Location.watchPositionAsync({
          accuracy: Location.Accuracy.Balanced
        }, location => {
          store.dispatch({
            type: 'UPDATE_GPS_LOCATION',
            payload: {
              lat: location.coords.latitude,
              lng: location.coords.longitude
            }
          });
          tempWatcher.remove();
        })
      } catch (error) {
        store.dispatch({
          type: 'UPDATE_GPS_LOCATION',
          payload: {
            error:true
          }
        });
        locationLoading.current = false;
      }
    } else {
      store.dispatch({
        type: 'UPDATE_GPS_LOCATION',
        payload: {
          error:true
        }
      });
      locationLoading.current = false;
    }
  }

  const StartBackgroundLocation = async () => {
    let permResp = await Location.requestForegroundPermissionsAsync();
    let tempWatcher = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.Balanced
    }, location => {
      store.dispatch({
        type: 'UPDATE_GPS_LOCATION',
        payload: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }
      });
      tempWatcher.remove();
    })
    if (permResp.status == 'granted') {
      try {
        let { status } = await Location.requestBackgroundPermissionsAsync();
        if (status === 'granted') {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.BestForNavigation,
            showsBackgroundLocationIndicator: true,
            activityType: Location.ActivityType.AutomotiveNavigation,
            foregroundService: {
              notificationTitle: t('locationServiveTitle'),
              notificationBody: t('locationServiveBody'),
              notificationColor: colors.SKY
            }
          });
        } else {
          if (__DEV__) {
            StartForegroundGeolocation();
          } else {
            store.dispatch({
              type: 'UPDATE_GPS_LOCATION',
              payload: {
                error:true
              }
            });
            locationLoading.current = false;
          }
        }
      } catch (error) {
        if (__DEV__) {
          StartForegroundGeolocation();
        } else {
          store.dispatch({
            type: 'UPDATE_GPS_LOCATION',
            payload: {
              error:true
            }
          });
          locationLoading.current = false;
        }
      }
    } else {
      store.dispatch({
        type: 'UPDATE_GPS_LOCATION',
        payload: {
          error:true
        }
      });
      locationLoading.current = false;
    }
  }

  const StartForegroundGeolocation = async () => {
    watcher.current = await Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      activityType: Location.ActivityType.AutomotiveNavigation,
    }, location => {
      store.dispatch({
        type: 'UPDATE_GPS_LOCATION',
        payload: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }
      });
    });
  }

  const StopBackgroundLocation = async () => {
    locationOn.current = false;
    try {
      TaskManager.getRegisteredTasksAsync().then((res) => {
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].taskName == LOCATION_TASK_NAME) {
              Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
              break;
            }
          }
        } else {
          if (watcher.current) {
            watcher.current.remove();
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (auth.profile && languagedata && languagedata.langlist && settings && initialFunctionsNotCalled.current) {
      authStillNotResponded.current = false;
      if (auth.profile.usertype) {
        authState.current= auth.profile.usertype;
        if (auth.profile.lang) {
          const lang = auth.profile.lang;
          i18n.locale = lang['langLocale'];
          moment.locale(lang['dateLocale']);
        }
        let role = auth.profile.usertype;
          saveToken();
          fetchingToken.current = false;
          if (role === 'customer') {
            dispatch(api.fetchDrivers('app'));
            dispatch(api.fetchBookings());
            dispatch(api.fetchCancelReasons());
            dispatch(api.fetchPaymentMethods());
            dispatch(api.fetchPromos());
            dispatch(api.fetchUserNotifications());
            dispatch(api.fetchAddresses());
            dispatch(api.fetchWalletHistory());
            dispatch(api.fetchComplain());
            initialFunctionsNotCalled.current = false;
          } else if (role === 'driver') {
            dispatch(api.fetchBookings());
            dispatch(api.fetchPaymentMethods());
            dispatch(api.fetchTasks());
            dispatch(api.fetchUserNotifications());
            dispatch(api.fetchCars());
            dispatch(api.fetchWalletHistory());
            dispatch(api.fetchPromos());
            dispatch(api.fetchCancelReasons());
            dispatch(api.fetchComplain());
            initialFunctionsNotCalled.current = false;
          }
          else {
            Alert.alert(t('alert'), t('not_valid_user_type'));
            dispatch(api.signOff());
          }
      } else {
        Alert.alert(t('alert'), t('user_issue_contact_admin'));
        dispatch(api.signOff());
      }
    }
  }, [auth.profile, languagedata, languagedata.langlist, settings]);


  useEffect(() => {
    if (api && languagedata && languagedata.langlist && auth.error && auth.error.msg && !auth.profile && settings) {
      locationLoading.current = false;
      authState.current= 'failed';
      authStillNotResponded.current = false;
      initialFunctionsNotCalled.current = true;
      fetchingToken.current = false;
      StopBackgroundLocation();
      dispatch(api.clearLoginError());
    }
    dispatch(api.fetchusedreferral())
  }, [auth.error, auth.error.msg, languagedata && languagedata.langlist, settings]);

  if (authStillNotResponded.current || !(languagedata && languagedata.langlist) || !settings || authState.current == 'loading') {
    return <AuthLoadingScreen />;
  }

  const hideSplash = async () => {
    await SplashScreen.hideAsync();
  };
  hideSplash();

  return children;
}
