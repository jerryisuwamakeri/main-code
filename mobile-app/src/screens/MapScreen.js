import React, { useEffect, useState, useRef, useContext } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    Text,
    Platform,
    Alert,
    ScrollView,
    StatusBar,
    Animated,
    ImageBackground,
    Linking,
    ActivityIndicator
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { colors } from '../common/theme';
import * as Location from 'expo-location';
var { height, width } = Dimensions.get('window');
import i18n from 'i18n-js';
import DatePicker from 'react-native-date-picker';
import { useSelector, useDispatch } from 'react-redux';
import { api, FirebaseContext } from 'common';
import { OptionModal } from '../components/OptionModal';
import BookingModal, { appConsts, prepareEstimateObject } from '../common/sharedFunctions';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { CommonActions } from '@react-navigation/native';
import { MAIN_COLOR, CarHorizontal, CarVertical, validateBookingObj, SECONDORY_COLOR } from '../common/sharedFunctions';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';
import Button from '../components/Button';
import { fonts } from "../common/font";

const hasNotch = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && ((height === 780 || width === 780) || (height === 812 || width === 812) || (height === 844 || width === 844) || (height === 852 || width === 852) || (height === 896 || width === 896) || (height === 926 || width === 926) || (height === 932 || width === 932))

export default function MapScreen(props) {
    const {
        fetchAddressfromCoords,
        fetchDrivers,
        updateTripPickup,
        updateTripDrop,
        updatSelPointType,
        getDistanceMatrix,
        MinutesPassed,
        updateTripCar,
        getEstimate,
        clearEstimate,
        addBooking,
        clearBooking,
        clearTripPoints,
        GetDistance,
        updateProfile,
        updateProfileWithEmail,
        checkUserExists,
        storeAddresses
    } = api;
    const dispatch = useDispatch();
    const { config } = useContext(FirebaseContext);
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;

    const auth = useSelector(state => state.auth);
    const settings = useSelector(state => state.settingsdata.settings);
    const cars = useSelector(state => state.cartypes.cars);
    const tripdata = useSelector(state => state.tripdata);
    const usersdata = useSelector(state => state.usersdata);
    const estimatedata = useSelector(state => state.estimatedata);
    const providers = useSelector(state => state.paymentmethods.providers);
    const gps = useSelector(state => state.gpsdata);
    const activeBookings = useSelector(state => state.bookinglistdata.active);
    const addressdata = useSelector(state => state.addressdata);
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const latitudeDelta = 0.0922;
    const longitudeDelta = 0.0421;

    const [allCarTypes, setAllCarTypes] = useState([]);
    const [freeCars, setFreeCars] = useState([]);
    const [pickerConfig, setPickerConfig] = useState({
        selectedDateTime: new Date(),
        dateModalOpen: false,
        dateMode: 'date'
    });
    const [region, setRegion] = useState(null);
    const [optionModalStatus, setOptionModalStatus] = useState(false);
    const [bookingDate, setBookingDate] = useState(null);
    const [bookingModalStatus, setBookingModalStatus] = useState(false);
    const [bookLoading, setBookLoading] = useState(false);
    const [bookLaterLoading, setBookLaterLoading] = useState(false);
    const [initDate, setInitDate] = useState(new Date());

    const instructionInitData = {
        otherPerson: "",
        otherPersonPhone: "",
        pickUpInstructions: "",
        deliveryInstructions: "",
        parcelTypeIndex: 0,
        optionIndex: 0,
        parcelTypeSelected: null,
        optionSelected: null
    };
    const [instructionData, setInstructionData] = useState(instructionInitData);
    const bookingdata = useSelector(state => state.bookingdata);
    const [locationRejected, setLocationRejected] = useState(false);
    const mapRef = useRef();
    const [dragging, setDragging] = useState(0);

    const animation = useRef(new Animated.Value(4)).current;
    const [isEditing, setIsEditing] = useState(false);
    const [touchY, setTouchY] = useState();

    const [bookingType, setBookingType] = useState(false);
    const intVal = useRef();

    const [profile, setProfile] = useState();
    const [checkType, setCheckType] = useState(false);
    const pageActive = useRef();
    const [drivers, setDrivers] = useState();
    const [roundTrip, setRoundTrip] = useState(false);
    const [tripInstructions, setTripInstructions] = useState('');
    const [payment_mode, setPaymentMode] = useState(0);
    const [radioProps, setRadioProps] = useState([]);
    const [checkTerm, setCheckTerm] = useState(false);
    const [bookModelLoading, setBookModelLoading] = useState(false);
    const [term, setTerm] = useState(false);
    const [deliveryWithBid, setDeliveryWithBid] = useState(false);
    const [otherPerson, setOtherPerson] = useState(false)

    useEffect(() => {
        if (settings && settings.bookingFlow) {
            setDeliveryWithBid(settings.bookingFlow == "2" ? true : false)
        }
    }, [settings])
    
    const profileInitData = {
        firstName: auth && auth.profile && auth.profile.firstName ? auth.profile.firstName : "",
        lastName:  auth && auth.profile && auth.profile.lastName ? auth.profile.lastName : "",
        email: auth && auth.profile && auth.profile.email ? auth.profile.email : "",
    };
    const [profileData, setProfileData] = useState(profileInitData);
    const[bookingOnWait,setBookingOnWait] = useState();

    const addresses = useSelector(state => state.locationdata.addresses);
    
    useEffect(() => {
        if (auth.profile) {
            setTimeout(()=>{
                setTerm(true)
            },2000);
            setCheckTerm(auth.profile.term ? true : false)
            if(bookingOnWait){
                finaliseBooking(bookingOnWait);
                setBookingOnWait(null);
                setBookModelLoading(false);
            }
        }
    }, [auth.profile,bookingOnWait])

    useEffect(() => {
        if (settings && providers) {
            let arr = [{ label: t('wallet'), value: 0, cat: 'wallet' }];
            let val = 0;
            if (!settings.disable_online && providers && providers.length > 0) {
                val++;
                arr.push({ label: t('card'), value: val, cat: 'card' });
            }
            if (!settings.disable_cash) {
                val++;
                arr.push({ label: t('cash'), value: val, cat: 'cash' });
            }
            setRadioProps(arr);
        }
    }, [settings, providers]);
    
    useEffect(() => {
        if (usersdata.drivers) {
            const freeDrivers = usersdata.drivers.filter(d => !d.queue)
          let arr = [];
          for (let i = 0; i < freeDrivers.length; i++) {
            let driver = freeDrivers[i];
            if (!driver.carType) {
              let carTypes = allCarTypes;
              for (let i = 0; i < carTypes.length; i++) {
                let temp = { ...driver, carType: carTypes[i].name };
                arr.push(temp);
              }
            } else {
              arr.push(driver);
            }
          }
          setDrivers(arr);
        }
      }, [usersdata.drivers]);

    useEffect(() => {
        if (auth.profile && auth.profile.uid) {
            setProfile(auth.profile);
        } else {
            setProfile(null);
        }
    }, [auth.profile]);

    useEffect(() => {
        if (tripdata.drop && tripdata.drop.add) {
            setIsEditing(true);
        }
    }, [tripdata]);

    useEffect(() => easing => {
        Animated.timing(animation, {
            toValue: !isEditing ? 4 : 0,
            duration: 300,
            useNativeDriver: false,
            easing
        }).start();
    }, [isEditing]);

    useEffect(() => {
        if (cars) {
            resetCars();
        }
    }, [cars]);

    useEffect(() => {
        if (tripdata.pickup && drivers) {
            getDrivers();
        }
        if (tripdata.pickup && !drivers) {
            resetCars();
            setFreeCars([]);
        }
    }, [drivers, tripdata.pickup]);

    useEffect(() => {
        if (estimatedata.estimate) {
            if (!bookingdata.loading) {
                setBookingModalStatus(true);
            }
            setBookLoading(false);
            setBookLaterLoading(false);
        }
        if (estimatedata.error && estimatedata.error.flag) {
            setBookLoading(false);
            setBookLaterLoading(false);
            Alert.alert(estimatedata.error.msg);
            dispatch(clearEstimate());
        }
    }, [estimatedata.estimate, estimatedata.error, estimatedata.error.flag]);

    useEffect(() => {
        if (tripdata.selected && tripdata.selected == 'pickup' && tripdata.pickup && tripdata.pickup.source == 'search' && mapRef.current) {
            if (!locationRejected) {
                setTimeout(() => {
                    mapRef.current.animateToRegion({
                        latitude: tripdata.pickup.lat,
                        longitude: tripdata.pickup.lng,
                        latitudeDelta: latitudeDelta,
                        longitudeDelta: longitudeDelta
                    });
                }, 1000);
            } else {
                setRegion({
                    latitude: tripdata.pickup.lat,
                    longitude: tripdata.pickup.lng,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                });
            }
        }
        if (tripdata.selected && tripdata.selected == 'drop' && tripdata.drop && tripdata.drop.source == 'search' && mapRef.current) {
            if (!locationRejected) {
                setTimeout(() => {
                    mapRef.current.animateToRegion({
                        latitude: tripdata.drop.lat,
                        longitude: tripdata.drop.lng,
                        latitudeDelta: latitudeDelta,
                        longitudeDelta: longitudeDelta
                    });
                }, 1000)
            } else {
                setRegion({
                    latitude: tripdata.drop.lat,
                    longitude: tripdata.drop.lng,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                });
            }
        }
    }, [tripdata.selected, tripdata.pickup, tripdata.drop, mapRef.current]);

    useEffect(() => {
        if (bookingdata.booking) {
            const bookingStatus = bookingdata.booking.mainData.status;
            if (bookingStatus == 'PAYMENT_PENDING') {
                setTimeout(() => {
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'PaymentDetails',
                                    params: { booking: bookingdata.booking.mainData },
                                },
                            ],
                        })
                    );
                    dispatch(clearEstimate());
                    dispatch(clearBooking());
                    dispatch(clearTripPoints());
                }, 1000);
            } else {
                setTimeout(() => {
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'BookedCab',
                                    params: { bookingId: bookingdata.booking.booking_id },
                                },
                            ],
                        })
                    );
                    dispatch(clearEstimate());
                    dispatch(clearBooking());
                    dispatch(clearTripPoints());
                }, 1000);
            }
        }
        if (bookingdata.error && bookingdata.error.flag) {
            Alert.alert(bookingdata.error.msg);
            dispatch(clearBooking());
        }
        if (bookingdata.loading) {
            setBookLoading(true);
            setBookLaterLoading(true);
        }
    }, [bookingdata.booking, bookingdata.loading, bookingdata.error, bookingdata.error.flag]);

    useEffect(() => {
        if (gps.location) {
            if (gps.location.lat && gps.location.lng) {
                setDragging(0);
                if (region) {
                    mapRef.current.animateToRegion({
                        latitude: gps.location.lat,
                        longitude: gps.location.lng,
                        latitudeDelta: latitudeDelta,
                        longitudeDelta: longitudeDelta
                    });
                }
                else {
                    setRegion({
                        latitude: gps.location.lat,
                        longitude: gps.location.lng,
                        latitudeDelta: latitudeDelta,
                        longitudeDelta: longitudeDelta
                    });
                }
                updateAddresses({
                    latitude: gps.location.lat,
                    longitude: gps.location.lng
                }, region ? 'gps' : 'init');
            } else {
                setLocationRejected(true);
            }
        }
    }, [gps.location]);


    useEffect(() => {
        if (region && mapRef.current) {
            if (Platform.OS == 'ios') {
                mapRef.current.animateToRegion({
                    latitude: region.latitude,
                    longitude: region.longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                });
            }
        }
    }, [region, mapRef.current]);

    const resetCars = () => {
        if (cars) {
            let carWiseArr = [];
            const sorted = cars.sort((a, b) => a.pos - b.pos);
            for (let i = 0; i < sorted.length; i++) {
                let temp = { ...sorted[i], minTime: '', available: false, active: false };
                carWiseArr.push(temp);
            }
            setAllCarTypes(carWiseArr);
        }
    }

    const resetActiveCar = () => {
        let carWiseArr = [];
        const sorted = allCarTypes.sort((a, b) => a.pos - b.pos);
        for (let i = 0; i < sorted.length; i++) {
            let temp = { ...sorted[i], active: false };
            carWiseArr.push(temp);
        }
        setAllCarTypes(carWiseArr);
    }

    const locateUser = async () => {
        if (tripdata.selected == 'pickup') {
            let tempWatcher = await Location.watchPositionAsync({
                accuracy: Location.Accuracy.Balanced
            }, location => {
                dispatch({
                    type: 'UPDATE_GPS_LOCATION',
                    payload: {
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    }
                });
                tempWatcher.remove();
            })
        }
    }


  const setAddresses = async (pos, res, source) => {
    if (res) {
      if (tripdata.selected == "pickup") {
        dispatch(
          updateTripPickup({
            lat: pos.latitude,
            lng: pos.longitude,
            add: res,
            source: source,
          })
        );
        if (source == "init") {
          dispatch(
            updateTripDrop({
              lat: pos.latitude,
              lng: pos.longitude,
              add: null,
              source: source,
            })
          );
        }
      } else {
        dispatch(
          updateTripDrop({
            lat: pos.latitude,
            lng: pos.longitude,
            add: res,
            source: source,
          })
        );
      }
    }
  };

  const updateAddresses = async (pos, source) => {
    let latlng = pos.latitude + "," + pos.longitude;
    if (!pos.latitude) return;
    let res='';
    let  found = false;
    let savedAddresses = [];

    try {
      const value = addresses;
      if (value !== null) {
        savedAddresses = JSON.parse(value);
        for(let i =0; i<savedAddresses.length; i++){
          let distance = GetDistance(pos.latitude, pos.longitude, savedAddresses[i].lat, savedAddresses[i].lng);
          if(distance<0.25){
            res=savedAddresses[i].description;
            found = true;
            break;
          }
        }
      }
    } catch (error) {
      found = false;
    }

    if(found){
      setAddresses(pos, res, source);
    } else{
      fetchAddressfromCoords(latlng).then((add) => {  
        if (add) {
          savedAddresses.push({
            lat: pos.latitude,
            lng: pos.longitude,
            description: add
          });
          storeAddresses(savedAddresses);
          setAddresses(pos, add, source);
        }
      });
    }
  };

    const onRegionChangeComplete = (newregion, gesture) => {
        if((tripdata.pickup && tripdata.pickup.source =='mapSelect') || (tripdata.drop && tripdata.drop.source =='mapSelect')){
            if (gesture && gesture.isGesture) {
                updateAddresses({
                    latitude: newregion.latitude,
                    longitude: newregion.longitude
                }, 'mapSelect');
            }
        }
    }

    const selectCarType = (value, key) => {
        let carTypes = allCarTypes;
        for (let i = 0; i < carTypes.length; i++) {
            carTypes[i].active = false;
            if (carTypes[i].name == value.name) {
                carTypes[i].active = true;
                let instObj = { ...instructionData };
                if (Array.isArray(carTypes[i].parcelTypes)) {
                    instObj.parcelTypeSelected = carTypes[i].parcelTypes[0];
                    instObj.parcelTypeIndex = 0;
                }
                if (Array.isArray(carTypes[i].options)) {
                    instObj.optionSelected = carTypes[i].options[0];
                    instObj.optionIndex = 0;
                }
                setInstructionData(instObj);
            } else {
                carTypes[i].active = false;
            }
        }
        dispatch(updateTripCar(value));
    }

    const getDrivers = async () => {
        if (tripdata.pickup) {
            let availableDrivers = [];
            let arr = {};
            let startLoc = tripdata.pickup.lat + ',' + tripdata.pickup.lng;

            let distArr = [];
            let allDrivers = [];
            for (let i = 0; i < drivers.length; i++) {
                let driver = { ...drivers[i] };
                let distance = GetDistance(tripdata.pickup.lat, tripdata.pickup.lng, driver.location.lat, driver.location.lng);
                if (settings.convert_to_mile) {
                    distance = distance / 1.609344;
                }
                if (distance < ((settings && settings.driverRadius) ? settings.driverRadius : 10)) {
                    driver["distance"] = distance;
                    allDrivers.push(driver);
                }
            }

            const sortedDrivers = settings.useDistanceMatrix ? allDrivers.slice(0, 25) : allDrivers;

            if (sortedDrivers.length > 0) {
                let driverDest = "";
                for (let i = 0; i < sortedDrivers.length; i++) {
                    let driver = { ...sortedDrivers[i] };
                    driverDest = driverDest + driver.location.lat + "," + driver.location.lng
                    if (i < (sortedDrivers.length - 1)) {
                        driverDest = driverDest + '|';
                    }
                }

                if (settings.useDistanceMatrix) {
                    distArr = await getDistanceMatrix(startLoc, driverDest);
                } else {
                    for (let i = 0; i < sortedDrivers.length; i++) {
                        distArr.push({ timein_text: ((sortedDrivers[i].distance * 2) + 1).toFixed(0) + ' min', found: true })
                    }
                }


                for (let i = 0; i < sortedDrivers.length; i++) {
                    let driver = { ...sortedDrivers[i] };
                    if (distArr[i].found && cars) {
                        driver.arriveTime = distArr[i];
                        for (let i = 0; i < cars.length; i++) {
                            if (cars[i].name == driver.carType) {
                                driver.carImage = cars[i].image;
                            }
                        }
                        let carType = driver.carType;
                        if(carType && carType.length>0){
                            if (arr[carType] && arr[carType].sortedDrivers) {
                                arr[carType].sortedDrivers.push(driver);
                                if (arr[carType].minDistance > driver.distance) {
                                    arr[carType].minDistance = driver.distance;
                                    arr[carType].minTime = driver.arriveTime.timein_text;
                                }
                            } else {
                                arr[carType] = {};
                                arr[carType].sortedDrivers = [];
                                arr[carType].sortedDrivers.push(driver);
                                arr[carType].minDistance = driver.distance;
                                arr[carType].minTime = driver.arriveTime.timein_text;
                            }
                        } else{
                            let carTypes = allCarTypes;
                            for(let i=0;i<carTypes.length; i++){
                                let carType =carTypes[i];
                                if (arr[carType]  ) {
                                    arr[carType].sortedDrivers.push(driver);
                                    if (arr[carType].minDistance > driver.distance) {
                                        arr[carType].minDistance = driver.distance;
                                        arr[carType].minTime = driver.arriveTime.timein_text;
                                    }
                                } else {
                                    arr[carType] = {};
                                    arr[carType].sortedDrivers = [];
                                    arr[carType].sortedDrivers.push(driver);
                                    arr[carType].minDistance = driver.distance;
                                    arr[carType].minTime = driver.arriveTime.timein_text;
                                }
                            }
                        }
                        availableDrivers.push(driver);
                    }
                }
            }

            let carWiseArr = [];
            if (cars) {
                for (let i = 0; i < cars.length; i++) {
                    let temp = { ...cars[i] };
                    if (arr[cars[i].name]) {
                        temp['nearbyData'] = arr[cars[i].name].drivers;
                        temp['minTime'] = arr[cars[i].name].minTime;
                        temp['available'] = true;
                    } else {
                        temp['minTime'] = '';
                        temp['available'] = false;
                    }
                    temp['active'] = (tripdata.carType && (tripdata.carType.name == cars[i].name)) ? true : false;
                    carWiseArr.push(temp);
                }
            }

            setFreeCars(availableDrivers);
            setAllCarTypes(carWiseArr);
        }
    }

    const tapAddress = (selection) => {
        if (selection === tripdata.selected) {
            let savedAddresses = [];
            let allAddresses = profile.savedAddresses;
            for (let key in allAddresses) {
                savedAddresses.push(allAddresses[key]);
            }
            if (selection == 'drop') {
                props.navigation.navigate('Search', { locationType: "drop", addParam: savedAddresses });
            } else {
                props.navigation.navigate('Search', { locationType: "pickup", addParam: savedAddresses });
            }
        } else {
            setDragging(0)
            if (selection == 'drop' && tripdata.selected && tripdata.selected == 'pickup' && mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: tripdata.drop.lat,
                    longitude: tripdata.drop.lng,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                });
            }
            if (selection == 'pickup' && tripdata.selected && tripdata.selected == 'drop' && mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: tripdata.pickup.lat,
                    longitude: tripdata.pickup.lng,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta
                });
            }
            dispatch(updatSelPointType(selection));
        }

    };

    const onPressBook = async () => {
        if (parseFloat(profile.walletBalance) >= 0) {
            setCheckType(true);
            setBookLoading(true);
            if (!(profile.mobile && profile.mobile.length > 6)) {
                Alert.alert(t('alert'), t('mobile_need_update'));
                props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Profile', params: { fromPage: 'Map'} }] }));
                setBookLoading(false);
            } else {
                if ((settings && settings.imageIdApproval && auth.profile.verifyId && auth.profile.verifyIdImage) || (settings && !settings.imageIdApproval)) {
                 if(auth.profile.approved){
                    if (tripdata.pickup && tripdata.drop && tripdata.drop.add) {
                        if (!tripdata.carType) {
                            setBookLoading(false);
                            Alert.alert(t('alert'), t('car_type_blank_error'))
                        } else {
                            let driver_available = false;
                            for (let i = 0; i < allCarTypes.length; i++) {
                                let car = allCarTypes[i];
                                if (car.name == tripdata.carType.name && car.minTime) {
                                    driver_available = true;
                                    break;
                                }
                            }
                            if (driver_available) {
                                setBookingDate(null);
                                setBookingType(false);
                                if (appConsts.hasOptions) {
                                    setOptionModalStatus(true);
                                    setBookLaterLoading(false);
                                } else {
                                    let result = await prepareEstimateObject(tripdata, instructionData);
                                    if (result.error) {
                                        setBookLoading(false);
                                        Alert.alert(t('alert'), result.msg);
                                    } else {
                                        dispatch(getEstimate((await result).estimateObject));
                                    }
                                }
                            } else {
                                Alert.alert(t('alert'), t('no_driver_found_alert_messege'));
                                setBookLoading(false);
                            }
                        }
                    } else {
                        Alert.alert(t('alert'), t('drop_location_blank_error'));
                        setBookLoading(false);
                    }
                 }else{
                    Alert.alert(t('alert'), t('admin_contact'));
                    setBookLoading(false);
                 }
                } else {
                    Alert.alert(
                        t('alert'),
                        t('verifyid_error'),
                        [
                            { text: t('cancel'), onPress: () => { setBookLoading(true) }, style: 'cancel' },
                            { text: t('ok'), onPress: () =>   
                                props.navigation.dispatch(CommonActions.reset({index: 0, routes:[{ name: 'editUser', params: { fromPage: 'Map'} }]})) 
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
        } else {
            Alert.alert(
                t('alert'),
                t('wallet_balance_low')
            );
        }
    }


    const onPressBookLater = () => {
        setCheckType(false);
        if (parseFloat(profile.walletBalance) >= 0) {
            if (!(profile.mobile && profile.mobile.length > 6)) {
                Alert.alert(t('alert'), t('mobile_need_update'));
                props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Profile', params: { fromPage: 'Map'} }] }));
            } else {
                if ((settings && settings.imageIdApproval && auth.profile.verifyId && auth.profile.verifyIdImage) || (settings && !settings.imageIdApproval)) {
                  if(auth.profile.approved){
                    if (tripdata.pickup && tripdata.drop && tripdata.drop.add) {
                        if (tripdata.carType) {
                            setInitDate(new Date());
                            setDatePickerOpen(true);
                        } else {
                            Alert.alert(t('alert'), t('car_type_blank_error'))
                        }
                    } else {
                        Alert.alert(t('alert'), t('drop_location_blank_error'))
                    }
                  }else{
                    Alert.alert(t('alert'), t('admin_contact'))
                  }
                } else {
                    Alert.alert(
                        t('alert'),
                        t('verifyid_error'),
                        [
                            { text: t('cancel'), onPress: () => { }, style: 'cancel' },
                            { text: t('ok'), onPress: () =>   
                                props.navigation.dispatch(CommonActions.reset({index: 0, routes:[{ name: 'editUser', params: { fromPage: 'Map'} }]})) 
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
        } else {
            Alert.alert(
                t('alert'),
                t('wallet_balance_low')
            );
        }
    }

    const hideDatePicker = () => {
        setDatePickerOpen(false);
      };

      const handleDateConfirm = (date) => {
        setInitDate(date);
        setDatePickerOpen(false);
            setBookLaterLoading(true);
            setTimeout(async () => {
                let date1;
                try{
                    let res =  await fetch(`https://${config.projectId}.web.app/getservertime`, { method: 'GET', headers: {'Content-Type': 'application/json'}});
                    const json = await res.json();
                    if(json.time){
                        date1 = json.time;
                    } else{
                        date1 = new Date().getTime();
                    }
                }catch (err){
                    date1 = new Date().getTime();
                }
                
                const date2 = new Date(date);
                const diffTime = date2 - date1;
                const diffMins =  diffTime / (1000 * 60);

                if (diffMins < 15) {
                    setBookLaterLoading(false);
                    Alert.alert(
                        t('alert'),
                        t('past_booking_error'),
                        [
                            { text: t('ok'), onPress: () => { } }
                        ],
                        { cancelable: true }
                    );
                } else {
                    setBookingDate(date);
                    setBookingType(true);
                    if (appConsts.hasOptions) {
                        setOptionModalStatus(true);
                        setBookLaterLoading(false);
                    } else {
                        let result = await prepareEstimateObject(tripdata, instructionData);
                        if (result.error) {
                            setBookLoading(false);
                            Alert.alert(t('alert'), result.msg);
                        } else {
                            dispatch(getEstimate((await result).estimateObject));
                        }
                    }
                }
            }, 1000);
        
    };


    const handleGetEstimate = async () => {
        if (checkType) {
            setBookLoading(true);
        } else {
            setBookLaterLoading(true);
        }
        setOptionModalStatus(false);
        let result = await prepareEstimateObject(tripdata, instructionData);
        if (result.error) {
            setBookLoading(false);
            Alert.alert(t('alert'), result.msg);
        } else {
            dispatch(getEstimate(result.estimateObject));
        }
    }

    const handleParcelTypeSelection = (value) => {
        setInstructionData({
            ...instructionData,
            parcelTypeIndex: value,
            parcelTypeSelected: tripdata.carType.parcelTypes[value]
        });
    }

    const handleOptionSelection = (value) => {
        setInstructionData({
            ...instructionData,
            optionIndex: value,
            optionSelected: tripdata.carType.options[value]
        });
    }

    const onModalCancel = () => {
        setInstructionData(instructionInitData);
        setTripInstructions("");
        setRoundTrip(false);
        dispatch(updateTripCar(null));
        setBookingModalStatus(false);
        setOptionModalStatus(false);
        resetActiveCar();
        setBookLoading(false);
        setBookLaterLoading(false);
        dispatch(clearEstimate());
        setBookModelLoading(false);
    }

    const finaliseBooking = (bookingData) => {
        dispatch(addBooking(bookingData));
        setInstructionData(instructionInitData);
        setBookingModalStatus(false);
        setOptionModalStatus(false);
        resetCars();
        setTripInstructions("");
        setRoundTrip(false);
        resetCars();
    }

    const bookNow = async () => {
        setBookModelLoading(true);
        let wallet_balance = profile.walletBalance;
        let notfound = true;
        if (activeBookings) {
            for (let i = 0; i < activeBookings.length; i++) {
                if (activeBookings[i].payment_mode === 'wallet' && activeBookings[i].status !== 'PAID') {
                    notfound = false;
                    break;
                }
            }
        }
        const regx1 = /([0-9\s-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
        if ((otherPerson && /\S/.test(instructionData.otherPerson) && regx1.test(instructionData.otherPersonPhone) && instructionData.otherPersonPhone && instructionData.otherPersonPhone.length > 6) || !otherPerson) {
            if ((radioProps[payment_mode].cat === 'wallet' && notfound) || radioProps[payment_mode].cat !== 'wallet') {
                if ((radioProps[payment_mode].cat === 'wallet' && (parseFloat(wallet_balance) >= parseFloat(estimatedata.estimate.estimateFare)) && appConsts.checkWallet) || radioProps[payment_mode].cat !== 'wallet' || (radioProps[payment_mode].cat === 'wallet' && !appConsts.checkWallet)) {
                    const addBookingObj = {
                        pickup: estimatedata.estimate.pickup,
                        drop: estimatedata.estimate.drop,
                        carDetails: estimatedata.estimate.carDetails,
                        userDetails: auth.profile,
                        estimate: estimatedata.estimate,
                        tripdate: bookingType ? new Date(bookingDate).getTime() : new Date().getTime(),
                        bookLater: bookingType,
                        settings: settings,
                        booking_type_admin: false,
                        deliveryWithBid: deliveryWithBid ? deliveryWithBid : false,
                        payment_mode: radioProps[payment_mode].cat
                    };
                    if(auth && auth.profile && auth.profile.firstName && auth.profile.firstName.length > 0 && auth.profile.lastName && auth.profile.lastName.length > 0 && auth.profile.email && auth.profile.email.length > 0){
                        const result = await validateBookingObj(t, addBookingObj, instructionData, settings, bookingType, roundTrip, tripInstructions, tripdata, drivers, otherPerson);
                        if (result.error) {
                            Alert.alert(
                                t('alert'),
                                result.msg,
                                [
                                    { text: t('ok'), onPress: () => {setBookModelLoading(false) } }
                                ],
                                { cancelable: true }
                            );
                        } else {
                            finaliseBooking(result.addBookingObj);
                        }
                    }else{
                        setBookModelLoading(true);
                        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        if(/\S/.test( profileData.firstName) && /\S/.test(profileData.lastName) && auth){
                            const userData = {
                                firstName: profileData.firstName,
                                lastName: profileData.lastName
                            }
                            if(auth.profile.email){
                                const result = await validateBookingObj(t, addBookingObj, instructionData, settings, bookingType, roundTrip, tripInstructions, tripdata, drivers, otherPerson);
                                let bookingData = result.addBookingObj;
                                bookingData.userDetails.firstName = profileData.firstName;
                                bookingData.userDetails.lastName = profileData.lastName;
                                setBookingOnWait(bookingData);
                                setTimeout(()=>{
                                    dispatch(updateProfile(userData));
                                },200) 
                            } else{
                                if(re.test(profileData.email)){
                                    checkUserExists({email: profileData.email}).then(async(res) => {
                                        if (res.users && res.users.length > 0) {
                                            Alert.alert(t('alert'), t('user_exists'));
                                            setBookModelLoading(false);
                                        } else if(res.error){
                                            Alert.alert(t('alert'), t('email_or_mobile_issue'));
                                            setBookModelLoading(false);
                                        } else{
                                            const result = await validateBookingObj(t, addBookingObj, instructionData, settings, bookingType, roundTrip, tripInstructions, tripdata, drivers, otherPerson);
                                            if (result.error) {
                                                Alert.alert(
                                                    t('alert'),
                                                    result.msg,
                                                    [
                                                        { text: t('ok'), onPress: () => {setBookModelLoading(false) } }
                                                    ],
                                                    { cancelable: true }
                                                );
                                            } else {
                                                profileData['uid'] = auth.profile.uid;
                                                let bookingData = result.addBookingObj;
                                                bookingData.userDetails.firstName = profileData.firstName;
                                                bookingData.userDetails.lastName = profileData.lastName;
                                                bookingData.userDetails.email = profileData.email;
                                                setBookingOnWait(bookingData);
                                                setTimeout(()=>{
                                                    dispatch(updateProfileWithEmail(profileData));
                                                },200) 
                                            }
                                        }    
                                    });
                                }else{
                                    Alert.alert(t('alert'), t('proper_email'));
                                    setBookModelLoading(false);
                                }
                            }
                        }else{
                            Alert.alert(t('alert'), t('proper_input_name'));
                            setBookModelLoading(false);
                        }
                    }
                } else {
                    Alert.alert(
                        t('alert'),
                        t('wallet_balance_low')
                    );
                    setBookModelLoading(false);
                }
            } else {
                Alert.alert(
                    t('alert'),
                    t('wallet_booking_alert')
                );
                setBookModelLoading(false);
            }
        }else{
            Alert.alert(t('alert'), t('otherPersonDetailMissing'));
            setBookModelLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            pageActive.current = true;
            dispatch(fetchDrivers('app'));
            if (intVal.current == 0) {
                intVal.current = setInterval(() => {
                    dispatch(fetchDrivers('app'));
                }, 30000);
            }
        });
        return unsubscribe;
    }, [props.navigation, intVal.current]);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('blur', () => {
            pageActive.current = false;
            intVal.current ? clearInterval(intVal.current) : null;
            intVal.current = 0;
        });
        return unsubscribe;
    }, [props.navigation, intVal.current]);

    useEffect(() => {
        pageActive.current = true;
        const interval = setInterval(() => {
            dispatch(fetchDrivers('app'));
        }, 30000);
        intVal.current = interval;
        return () => {
            clearInterval(interval);
            intVal.current = 0;
        };
    }, []);

    const changePermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status != 'granted') {
     if(Platform.OS == 'ios'){
                Linking.openSettings()
            } else{
                startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
            }
         } 
    }
    const onTermAccept =  () => {        
        if(checkTerm == false){
           dispatch(updateProfile({term: true}));
       }
   }
    const  onTermLink  = async () => {
        Linking.openURL(settings.CompanyTermCondition).catch(err => console.error("Couldn't load page", err));
   }

const onMapSelectComplete = () => {
    if((tripdata.pickup && tripdata.pickup.source =='mapSelect') || (tripdata.drop && tripdata.drop.source =='mapSelect')){
       if(tripdata.selected === 'pickup'){
           dispatch(updateTripPickup({...tripdata.pickup, source:"region-change"}))
       } else{
           dispatch(updateTripDrop({...tripdata.drop, source:"region-change"}))
       }
    }
  }

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <View style={styles.mapcontainer}>
                {region && region.latitude && pageActive.current ?
                    <MapView
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        loadingEnabled
                        showsMyLocationButton={false}
                        style={styles.mapViewStyle}
                        initialRegion={region}
                        onRegionChangeComplete={onRegionChangeComplete}
                        onPanDrag={() => setDragging(30)}
                        minZoomLevel={11}
                    >
                        {freeCars ? freeCars.map((item, index) => {
                            return (
                                <Marker.Animated
                                    coordinate={{ latitude: item.location ? item.location.lat : 0.00, longitude: item.location ? item.location.lng : 0.00 }}
                                    key={index}
                                >
                                    <Image
                                        key={index}
                                        source={ settings && settings.carType_required && item.carImage ? {uri: item.carImage} : require('../../assets/images/microBlackCar.png')}
                                        style={{ height: 48, width: 48, resizeMode: 'contain' }}
                                    />
                                </Marker.Animated>

                            )
                        })
                            : null}
                    </MapView>
                    : null}
                {region ?
                    tripdata.selected == 'pickup' ?
                        <View pointerEvents="none" style={styles.mapFloatingPinView}>
                            <Image pointerEvents="none" style={[styles.mapFloatingPin, { marginBottom: Platform.OS == 'ios' ? (hasNotch ? (-10 + dragging) : 33) : 40 }]} resizeMode="contain" source={require('../../assets/images/green_pin.png')} />
                        </View>
                        :
                        <View pointerEvents="none" style={styles.mapFloatingPinView}>
                            <Image pointerEvents="none" style={[styles.mapFloatingPin, { marginBottom: Platform.OS == 'ios' ? (hasNotch ? (-10 + dragging) : 33) : 40 }]} resizeMode="contain" source={require('../../assets/images/rsz_2red_pin.png')} />
                        </View>
                    : null}
                {(!(tripdata.pickup && tripdata.pickup.source =='mapSelect')) ? tripdata.selected == 'pickup' ?
                    <View style={[styles.locationButtonView, {
                        bottom: settings && settings.horizontal_view ? 180 : isEditing ?
                            allCarTypes && allCarTypes.length > 0 ?
                                allCarTypes.length == 1 ?
                                    110
                                    :
                                    allCarTypes.length == 2 ?
                                        185
                                        :
                                        260
                                :
                                95
                            : 40
                    }]}>
                        <TouchableOpacity onPress={locateUser} style={styles.locateButtonStyle}>
                            <Icon
                                name='gps-fixed'
                                color={"#666699"}
                                size={26}
                            />
                        </TouchableOpacity>
                    </View>
                : null : null}
                {locationRejected ?
                    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                        <Text style={{fontFamily:fonts.Regular}} >{t('location_permission_error')}</Text>
                    </View>
                    : null}
            </View>
            <View style={[styles.buttonBar, { flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
                {bookLoading || bookLaterLoading ?
                <View style={{flex: 1, borderRadius: 10, height: 55, margin: 3, justifyContent:'center', borderWidth: 1, borderColor: MAIN_COLOR}}>
                    <ActivityIndicator color={MAIN_COLOR} size='large' />
                </View>
                : 
                <View style={[styles.buttonBar, { flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
                    <View style={{flex: 1, margin: 2, borderRadius: 10, height: 55}}>
                    <Button
                            title={((tripdata.pickup && tripdata.pickup.source =='mapSelect') || (tripdata.drop && tripdata.drop.source =='mapSelect')) ? t('cancel'): t('book_later_button')}
                            loading={bookLaterLoading}
                            loadingColor={{ color: colors.BLACK }}
                            buttonStyle={styles.buttonTitleStyle}
                            btnClick={((tripdata.pickup && tripdata.pickup.source =='mapSelect') || (tripdata.drop && tripdata.drop.source =='mapSelect')) ? onMapSelectComplete: onPressBookLater}
                            style={{ backgroundColor: SECONDORY_COLOR, height: '100%',padding:2 }}
                        />
                    </View>

                    <View style={{flex: 1, margin: 3, borderRadius: 10, height: 55, }}>
                        <Button
                            title={((tripdata.pickup && tripdata.pickup.source =='mapSelect') || (tripdata.drop && tripdata.drop.source =='mapSelect')) ? t('ok'): t('book_now_button')}
                            loading={bookLoading}
                            loadingColor={{ color: colors.WHITE }}
                            buttonStyle={[styles.buttonTitleStyle,{ color: colors.WHITE,  }]}
                            btnClick={((tripdata.pickup && tripdata.pickup.source =='mapSelect') || (tripdata.drop && tripdata.drop.source =='mapSelect')) ? onMapSelectComplete: onPressBook}
                            style={{ backgroundColor: MAIN_COLOR, height: '100%',padding:2 }}
                        />
                    </View>
                </View>
                }
            </View>
            <View style={styles.menuIcon}>
                <ImageBackground source={require('../../assets/images/white-grad6.png')} style={{ height: '100%', width: '100%' }}>
                    <Text style={{ color: colors.HEADER, fontFamily:fonts.Bold, fontSize: 20, alignSelf: 'center', marginTop: Platform.OS == 'android' ? (__DEV__ ? 20 : 40) : (hasNotch ? 48 : 20) }}>{((tripdata.pickup && tripdata.pickup.source =='mapSelect') || (tripdata.drop && tripdata.drop.source =='mapSelect')) ? t("drag_map") : t("book_ride") }</Text>
                </ImageBackground>
            </View>

            {gps.error || (!checkTerm && settings.term_required) || (!auth.profile.approved) ?
                <View style={{
                    position: 'absolute', width: width - 20, margin: 10, borderRadius: 8, flexDirection: 'column', alignItems: 'center', backgroundColor: colors.new,
                    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.75, shadowRadius: 4, elevation: 5,justifyContent:'space-evenly',
                    top: Platform.OS == 'android' ? (__DEV__ ? 65 : 65) : (hasNotch ? 85 : 80), height: 10 +(gps.error ? 70 : 0) +(!checkTerm && settings.term_required ? 70 : 0) +(!auth.profile.approved ? 70 : 0)
                }}>
                {gps.error ?
                    <View style={[styles.alrt,{flexDirection:isRTL?'row-reverse':'row'}]}>
                        <View style={[styles.alrt1,{flexDirection:isRTL? 'row-reverse':'row'}]}>
                            <Icon name="alert-circle" type="ionicon" color={colors.RED} size={18} />
                            <Text style={{ fontSize: 14, fontFamily:fonts.Bold, color: colors.BLACK, marginLeft: 3 }}>{t('allow_only')}</Text>
                        </View>
                        <Button btnClick={changePermission}
                            title={t('fix')} 
                            loading={false}
                            loadingColor={{ color: colors.WHITE }}
                            buttonStyle={styles.checkButtonTitle} 
                            style={styles.checkButtonStyle} 
                        />
                    </View>
                :null}
                  {!checkTerm && settings.term_required && term?
                    <View style={[styles.alrt,{flexDirection:isRTL?'row-reverse':'row'}]}>
                        <TouchableOpacity onPress={onTermLink} style={[styles.alrt1,{flexDirection:isRTL? 'row-reverse':'row',width:width-180,height:50}]}>
                            <Icon name="document-text" type="ionicon" color={colors.RED} size={18} />
                            <Text style={{ fontSize: 14, fontFamily:fonts.Bold, color: colors.SKY, marginLeft: 3,textDecorationLine:'underline' }}>{t('term_condition')}</Text>
                        </TouchableOpacity>
                        <Button btnClick={onTermAccept}
                            loading={false}
                            loadingColor={{ color: colors.WHITE }}
                            title={t('accept')}
                            style={styles.checkButtonStyle}
                            buttonStyle={styles.checkButtonTitle} 
                        />
                    </View>
                : null}
                 {!auth.profile.approved ?
                    <View style={[styles.alrt,{flexDirection:isRTL?'row-reverse':'row'}]}>
                        <View style={[styles.alrt1,{flexDirection:isRTL? 'row-reverse':'row'}]}>
                            <Icon name="alert-circle" type="ionicon" color={colors.RED} size={18} />
                            <Text style={{ fontSize: 14, fontFamily:fonts.Bold, color: colors.BLACK, marginLeft: 3 }}>{t('admin_contact')}</Text>
                        </View>
                    </View>
                :null}
                </View>
            :
                <View style={[styles.addressBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={styles.ballandsquare}>
                    {((tripdata.pickup && tripdata.pickup.source =='mapSelect') || (tripdata.drop && tripdata.drop.source =='mapSelect') )?
                        (tripdata.pickup && tripdata.pickup.source =='mapSelect') ? <View style={styles.hbox1} /> : <View style={styles.hbox3} /> :
                        <><View style={styles.hbox1} /><View style={styles.hbox2} /><View style={styles.hbox3} /></>
                    }
                    </View>

                    {((tripdata.pickup && tripdata.pickup.source =='mapSelect') || (tripdata.drop && tripdata.drop.source =='mapSelect') )?
                        <View style={[styles.addressStyle1,isRTL ? { paddingRight: 10 } : { paddingLeft: 10 }, { borderBottomWidth: 0}]}>
                            {(tripdata.pickup && tripdata.pickup.source =='mapSelect') ?
                                <Text numberOfLines={1} style={[styles.textStyle, tripdata.selected == 'pickup' ? { fontSize: 18 } : { fontSize: 14 }, { textAlign: isRTL ? "right" : "left" }]}>{tripdata.pickup && tripdata.pickup.add ? tripdata.pickup.add : t('map_screen_where_input_text')}</Text>
                                :
                                <Text numberOfLines={1} style={[styles.textStyle, tripdata.selected == 'drop' ? { fontSize: 18 } : { fontSize: 14 }, { textAlign: isRTL ? "right" : "left" }]}>{tripdata.drop && tripdata.drop.add ? tripdata.drop.add : t('map_screen_drop_input_text')}</Text>
                            }
                        </View>
                    :
                        <View style={[styles.contentStyle, isRTL ? { paddingRight: 10 } : { paddingLeft: 10 }, {height: 100}]}>
                            <TouchableOpacity onPress={() => tapAddress('pickup')} style={styles.addressStyle1}>
                                <Text numberOfLines={1} style={[styles.textStyle, tripdata.selected == 'pickup' ? { fontSize: 18 } : { fontSize: 14 }, { textAlign: isRTL ? "right" : "left" }]}>{tripdata.pickup && tripdata.pickup.add ? tripdata.pickup.add : t('map_screen_where_input_text')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => tapAddress('drop')} style={styles.addressStyle2}>
                                <Text numberOfLines={1} style={[styles.textStyle, tripdata.selected == 'drop' ? { fontSize: 18 } : { fontSize: 14 }, { textAlign: isRTL ? "right" : "left" }]}>{tripdata.drop && tripdata.drop.add ? tripdata.drop.add : t('map_screen_drop_input_text')}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            }

            {(tripdata.pickup && tripdata.pickup.source =='mapSelect') || (tripdata.drop && tripdata.drop.source =='mapSelect') ? null: 
            <>
            {settings && settings.horizontal_view ?

                <View style={styles.fullCarView}>
                    <ScrollView horizontal={true} style={styles.fullCarScroller} showsHorizontalScrollIndicator={false}>
                        {allCarTypes.map((prop, key) => {
                            return (
                                <View key={key} style={[styles.cabDivStyle, {borderWidth: 1, borderColor: prop.active == true ? MAIN_COLOR : colors.WHITE}]}>
                                    <CarHorizontal
                                        onPress={() => { selectCarType(prop, key) }}
                                        carData={prop}
                                        settings={settings}
                                        styles={styles}
                                    />
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
                :
                <View style={[styles.carShow, { height: 25 }]}
                    onTouchStart={e => setTouchY(e.nativeEvent.pageY)}
                    onTouchEnd={e => {
                        if ((touchY - e.nativeEvent.pageY > 10) && !isEditing)
                            setIsEditing(!isEditing);
                        if ((e.nativeEvent.pageY - touchY > 10) && isEditing)
                            setIsEditing(!isEditing);
                    }}
                >
                    <View style={[styles.bar, { backgroundColor: MAIN_COLOR }]} ></View>
                </View>
            }

            {isEditing == true && settings && !settings.horizontal_view ?
                <View style={[styles.carShow, { paddingTop: 10, height: 250, minHeight: 80, alignItems: 'center', flexDirection: 'column', backgroundColor: isEditing == true ? colors.BACKGROUND_PRIMARY : colors.WHITE }]}
                    onTouchStart={e => setTouchY(e.nativeEvent.pageY)}
                    onTouchEnd={e => {
                        if ((touchY - e.nativeEvent.pageY > 10) && !isEditing)
                            setIsEditing(!isEditing);
                        if ((e.nativeEvent.pageY - touchY > 10) && isEditing)
                            setIsEditing(!isEditing);
                    }}
                >
                    <View style={[styles.bar, { backgroundColor: MAIN_COLOR }]} ></View>

                    <Animated.View style={{ alignItems: 'center', backgroundColor: colors.BACKGROUND_PRIMARY, flex: animation, paddingTop: 6 }}>
                        {allCarTypes && allCarTypes.length > 0 ?
                            <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                                {allCarTypes.map((prop, index) => {
                                    return (
                                        <CarVertical
                                            onPress={() => { selectCarType(prop, index) }}
                                            carData={prop}
                                            settings={settings}
                                            styles={styles}
                                            key={index}
                                        />
                                    );
                                })}
                            </ScrollView>
                            :
                            <Text style={{ color: colors.HEADER,fontFamily:fonts.Bold, fontSize: 20, justifyContent: 'center' }}>{t("service_start_soon")}</Text>
                        }
                    </Animated.View>
                </View>
                : null}
            </>
            }

            <OptionModal
                settings={settings}
                tripdata={tripdata}
                instructionData={instructionData}
                optionModalStatus={optionModalStatus}
                onPressCancel={onModalCancel}
                handleGetEstimate={handleGetEstimate}
                handleParcelTypeSelection={handleParcelTypeSelection}
                handleOptionSelection={handleOptionSelection}
            />
            <BookingModal
                settings={settings}
                tripdata={tripdata}
                estimate={estimatedata.estimate}
                instructionData={instructionData}
                setInstructionData={setInstructionData}
                tripInstructions={tripInstructions}
                setTripInstructions={setTripInstructions}
                roundTrip={roundTrip}
                setRoundTrip={setRoundTrip}
                bookingModalStatus={bookingModalStatus}
                bookNow={bookNow}
                onPressCancel={onModalCancel}
                payment_mode={payment_mode}
                setPaymentMode={setPaymentMode}
                radioProps={radioProps}
                profileData={profileData}
                setProfileData={setProfileData}
                auth={auth}
                bookModelLoading={bookModelLoading}
                deliveryWithBid={deliveryWithBid}
                setDeliveryWithBid={setDeliveryWithBid}
                otherPerson={otherPerson}
                setOtherPerson={setOtherPerson}
            />
            <DatePicker
                modal
                title={t("select_date")}
                confirmText={t('confirm')}
                cancelText={t('cancel')}
                open={datePickerOpen}
                date={initDate}
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                hideText={true}
                minimumDate={new Date()}
                theme='light'
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    menuIcon: {
        height: 100,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
    },
    menuIconButton: {
        flex: 1,
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topTitle: {
        height: 50,
        width: 165,
        backgroundColor: colors.WHITE,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        bottom: 180
    },
    topTitle1: {
        height: 50,
        width: 165,
        backgroundColor: colors.WHITE,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        bottom: 180
    },
    mapcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapViewStyle: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    mapFloatingPinView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    mapFloatingPin: {
        height: 40
    },
    buttonBar: {
        height: 70,
        width: width,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center'
    },
    buttonContainer: {
        height: 50,
        borderRadius: 10
    },
    buttonStyle: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTitleStyle: {
        fontFamily: fonts.Bold,
        fontSize: 14,
    },
    locationButtonView: {
        position: 'absolute',
        height: Platform.OS == 'ios' ? 55 : 42,
        width: Platform.OS == 'ios' ? 55 : 42,
        bottom: 180,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: Platform.OS == 'ios' ? 30 : 3,
        elevation: 2,
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: {
            height: 0,
            width: 0
        },
    },
    locateButtonStyle: {
        height: Platform.OS == 'ios' ? 55 : 42,
        width: Platform.OS == 'ios' ? 55 : 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addressBar: {
        position: 'absolute',
        marginHorizontal: 20,
        top: Platform.OS == 'android' ? (__DEV__ ? 65 : 70) : (hasNotch ? 85 : 80),
        width: width - 40,
        flexDirection: 'row',
        backgroundColor: colors.WHITE,
        paddingLeft: 10,
        paddingRight: 10,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderRadius: 8,
        elevation: 3
    },
    ballandsquare: {
        width: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    hbox1: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: colors.GREEN_DOT
    },
    hbox2: {
        height: 36,
        width: 1,
        backgroundColor: colors.MAP_TEXT
    },
    hbox3: {
        height: 12,
        width: 12,
        backgroundColor: colors.DULL_RED
    },
    contentStyle: {
        justifyContent: 'center',
        width: width - 74
    },
    addressStyle1: {
        borderBottomColor: colors.BLACK,
        borderBottomWidth: 1,
        height: 48,
        width: width - 84,
        justifyContent: 'center',
        paddingTop: 2
    },
    addressStyle2: {
        height: 48,
        width: width - 84,
        justifyContent: 'center',
    },
    textStyle: {
        fontFamily: fonts.Regular,
        fontSize: 14,
        color: '#000'
    },
    fullCarView: {
        position: 'absolute',
        bottom: 60,
        width: width - 10,
        height: 170,
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
        marginBottom:10
    },
    fullCarScroller: {
        width: width - 10,
        height: 160,
        flexDirection: 'row'
    },
    cabDivStyle: {
        backgroundColor: colors.WHITE,
        width: (width - 40) / 3,
        height: '95%',
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        borderRadius: 8,
        elevation: 3
    },
    imageStyle: {
        height: 50,
        width: '100%',
        marginVertical: 15,
        padding: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5
    },
    imageStyle1: {
        height: 40,
        width: 50 * 1.8
    },
    textViewStyle: {
        height: 50,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    text1: {
        fontFamily:fonts.Bold,
        fontSize: 14,
        color: colors.BLACK
    },
    text2: {
        fontFamily:fonts.Bold,
        fontSize: 11,
        color: colors.BORDER_TEXT
    },
    carShow: {
        width: '100%',
        justifyContent: 'center',
        backgroundColor: colors.BACKGROUND_PRIMARY,
        position: 'absolute',
        bottom: 60,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center'
    },
    bar: {
        width: 100,
        height: 6
    },
    carContainer: {
        justifyContent: "space-between",
        width: width - 30,
        minHeight: 70,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: colors.WHITE,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.BORDER_BACKGROUND,
        alignItems: 'center',
        shadowColor:  colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    bodyContent: {
        flex: 1
    },
    titleStyles: {
        fontSize: 14,
        color: colors.HEADER,
        paddingBottom: 2,
        fontFamily:fonts.Bold
    },
    subtitleStyle: {
        fontSize: 12,
        color: colors.BALANCE_ADD,
        lineHeight: 16,
        paddingBottom: 2
    },
    priceStyle: {
        color: colors.BALANCE_ADD,
       fontFamily:fonts.Bold,
        fontSize: 12,
        lineHeight: 14,
    },
    cardItemImagePlace: {
        width: 70,
        height: 45,
        margin: 5,
        resizeMode: 'contain'
    },
    cardItemImageBox: {
        width: 80,
        height: 50,
        margin: 10,
        resizeMode: 'center'
    },
    alrt1:{
        justifyContent: 'center', 
        alignItems: 'center',
        height:'100%',
        width:"70%",
    },
    alrt:{
        width: width - 40, 
        height: 60,
        padding: 10, 
        borderWidth: 1, 
        borderColor: colors.BORDER_BACKGROUND, 
        borderRadius: 5, 
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    checkButtonStyle: {
        backgroundColor: colors.GREEN,
        width: 85,
        height: 40,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        borderRadius: 5,
        justifyContent:'center',
        alignItems:'center'
    },
    checkButtonTitle: {
        fontSize: 12,
        fontFamily:fonts.Medium,
        color: colors.WHITE
    }
});