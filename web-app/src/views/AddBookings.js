import React, { useState, useEffect, useRef } from 'react';
import {
  Select,
  MenuItem,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Modal,
} from '@mui/material';
import GoogleMapsAutoComplete from '../components/GoogleMapsAutoComplete';
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from '../components/AlertDialog';
import { makeStyles } from '@mui/styles';
import UsersCombo from '../components/UsersCombo';
import { api } from 'common';
import Button from "components/CustomButtons/Button.js";
import { useTranslation } from "react-i18next";
import {colors} from '../components/Theme/WebTheme';
import { BookingModalBody, validateBookingObj } from 'common/sharedFunctions';
import { useLocation, useNavigate } from 'react-router-dom';
import { calcEst, showEst, optionsRequired} from '../common/sharedFunctions';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import {MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY} from "../common/sharedFunctions"

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
    fontFamily:FONT_FAMILY
  },
  typography:{
    fontFamily:FONT_FAMILY,
  },
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width:480,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${colors.BLACK}`,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  container: {
    marginTop: theme.spacing(1),
    backgroundColor: MAIN_COLOR,
    alignContent: 'center',
    borderRadius: "8px",
    width: '70%',
   
  },
  container1: {
    backgroundColor: colors.LandingPage_Background,
    borderTopLeftRadius:"0px",
    borderTopRightRadius:"0px",
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
    padding:'30px',
    width: '100%',
    top: "19px",
    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
  },
  title: {
    color: colors.WHITE,
    padding: '10px',
    backgroundColor:MAIN_COLOR,
    fontFamily:FONT_FAMILY,
    borderRadius:"10px",
    fontSize:18,

  },
  gridcontainer: {
    alignContent: 'center'
  },
  items: {
    margin: 0,
    width: '100%'
  },
  input: {
    fontSize: 18,
    color: colors.BLACK,
    fontFamily:FONT_FAMILY,
  },
  inputdimmed: {
    fontSize: 18,
    color: colors.CARD_LABEL,
    fontFamily:FONT_FAMILY,
  },
  carphoto: {
    height: '18px',
    marginRight: '10px'
  },
  carphotoRtl:{
    height: '16px',
    marginLeft:'10px'
  },
  buttonStyle: {
    margin: 0,
    width: '100%',
    height: 40,
    borderRadius: "30px",
    backgroundColor: MAIN_COLOR,
    color:colors.WHITE,
    fontFamily:FONT_FAMILY,
  },
  buttonStyle1:{
    backgroundColor: MAIN_COLOR,
    fontFamily:FONT_FAMILY
  },
  buttonStyle2:{
    backgroundColor: SECONDORY_COLOR,
    fontFamily:FONT_FAMILY
  },
  inputRtl: {
    "& label": {
      right: 25,
      left: "auto",
      fontFamily:FONT_FAMILY,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 18,
      fontFamily:FONT_FAMILY,
    },
    "& label.Mui-focused": {
      color: MAIN_COLOR,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: MAIN_COLOR,
      },
    },
    "& input": {
      fontFamily: FONT_FAMILY,
    },
  },
  rightRty:{
    "& legend": {
      marginRight: 30,
      fontFamily:FONT_FAMILY,
    },
    "& input": {
      fontFamily: FONT_FAMILY,
    },
  },
  textField: {
    "& label.Mui-focused": {
      color: MAIN_COLOR,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: MAIN_COLOR,
      },
    },
    "& input": {
      fontFamily: FONT_FAMILY,
    },
  },
}));

const icons = {
  'paypal':require('../assets/payment-icons/paypal-logo.png').default,
  'braintree':require('../assets/payment-icons/braintree-logo.png').default,
  'stripe':require('../assets/payment-icons/stripe-logo.png').default,
  'paytm':require('../assets/payment-icons/paytm-logo.png').default,
  'payulatam':require('../assets/payment-icons/payulatam-logo.png').default,
  'flutterwave':require('../assets/payment-icons/flutterwave-logo.png').default,
  'paystack':require('../assets/payment-icons/paystack-logo.png').default,
  'securepay':require('../assets/payment-icons/securepay-logo.png').default,
  'payfast':require('../assets/payment-icons/payfast-logo.png').default,
  'liqpay':require('../assets/payment-icons/liqpay-logo.png').default,
  'culqi':require('../assets/payment-icons/culqi-logo.png').default,
  'mercadopago':require('../assets/payment-icons/mercadopago-logo.png').default,
  'squareup':require('../assets/payment-icons/squareup-logo.png').default,
  'wipay':require('../assets/payment-icons/wipay-logo.png').default,
  'test':require('../assets/payment-icons/test-logo.png').default,
  'razorpay':require('../assets/payment-icons/razorpay-logo.png').default,
  'paymongo':require('../assets/payment-icons/paymongo-logo.png').default,
  'iyzico':require('../assets/payment-icons/iyzico-logo.png').default,
  'slickpay':require('../assets/payment-icons/slickpay-logo.png').default
}

export default function AddBookings(props) {
  const { t, i18n  } = useTranslation();
  const isRTL = i18n.dir();
  const {
    getEstimate,
    clearEstimate,
    addBooking,
    clearBooking,
    MinutesPassed,
    GetDateString,
    GetDistance,
    updateBooking,
    updateProfileWithEmail,
    checkUserExists
  } = api;
  const dispatch = useDispatch();
  const classes = useStyles();
  const cartypes = useSelector(state => state.cartypes.cars);
  const estimatedata = useSelector(state => state.estimatedata);
  const bookingdata = useSelector(state => state.bookingdata);
  const userdata = useSelector(state => state.usersdata);
  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settingsdata.settings);
  const providers = useSelector(state => state.paymentmethods.providers);
  const activeBookings = useSelector(state => state.bookinglistdata.active);
  const [carType, setCarType] = useState(t('select_car'));
  const [pickupAddress, setPickupAddress] = useState(null);
  const [dropAddress, setDropAddress] = useState(null);
  const [optionModalStatus, setOptionModalStatus] = useState(false);
  const [estimateModalStatus, setEstimateModalStatus] = useState(false);
  const [selectedCarDetails, setSelectedCarDetails] = useState(null);
  const [users, setUsers] = useState(null);
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });
  const [userCombo, setUserCombo] = useState(null);
  const [estimateRequested, setEstimateRequested] = useState(false);
  const [bookingType, setBookingType] = useState('Book Now');
  const rootRef = useRef(null);
  const [tempRoute, setTempRoute] = useState();
  const [drivers,setDrivers] = useState([]);
  const [paymentModalStatus, setPaymentModalStatus] = useState(false);
  const [walletModalStatus, setWalletModalStatus] = useState(false);
  const {state} = useLocation();
  const [selectedProvider, setSelectedProvider] = useState();
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(0);
  const [roundTrip, setRoundTrip] = useState(0);
  const [tripInstructions, setTripInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingOnWait,setBookingOnWait] = useState();
  const [deliveryWithBid, setDeliveryWithBid] = useState(0);
  const [otherPerson, setOtherPerson] = useState(false);

  useEffect(() => {
    if (settings && settings.bookingFlow) {
        setDeliveryWithBid(settings.bookingFlow === "2" ? 1 : 0)
    }
  }, [settings, settings.bookingFlow])



  const [instructionData,setInstructionData] = useState({
    otherPerson : "",
    otherPersonPhone: "",
    pickUpInstructions: "",
    deliveryInstructions: "",
    parcelTypeIndex: 0,
    optionIndex: 0,
    parcelTypeSelected: null,
    optionSelected: null
  });

  const [profileData,setProfileData] = useState({
    firstName : '',
    lastName : '',
    email: ''
  });

  const [payment_mode, setPaymentMode] = useState(0);
  const [radioProps,setRadioProps] =  useState([]);

  const navigate = useNavigate();

  useEffect(()=>{
      if(settings && providers){
        setSelectedProvider(providers[0]);
        let arr = [{ label: t('wallet'), value: 0, cat: 'wallet' }];
        let val = 0;
        if(!settings.disable_online && providers && providers.length > 0){
            val++;
            arr.push({ label: t('card'), value: val , cat: 'card' });
        }
        if(!settings.disable_cash){
            val++;
            arr.push({ label: t('cash'), value: val, cat: 'cash' });
        }
        setRadioProps(arr);
      }
  },[settings, providers, t]);;

  useEffect(() => {
    if(state && state !== null){
      let carDetails = state.carData;
      setCarType(carDetails.name)
      setInstructionData({
        deliveryPerson : "",
        deliveryPersonPhone: "",
        pickUpInstructions: "",
        deliveryInstructions: "",
        parcelTypeIndex: 0,
        optionIndex: 0,
        parcelTypeSelected: Array.isArray(carDetails.parcelTypes) ? carDetails.parcelTypes[0] : null,
        optionSelected: Array.isArray(carDetails.options) ? carDetails.options[0] : null
      })
      setSelectedCarDetails(carDetails);
    }
  }, [state]);

  const handleChange = (e) => {
    if(e.target.name === 'parcelTypeIndex'){
      setInstructionData({ 
        ...instructionData,
        parcelTypeIndex: parseInt(e.target.value),
        parcelTypeSelected: selectedCarDetails.parcelTypes[e.target.value]
      });
    }else if(e.target.name === 'optionIndex'){
      setInstructionData({ 
        ...instructionData,
        optionIndex: parseInt(e.target.value),
        optionSelected: selectedCarDetails.options[e.target.value]
      });
    }else if(e.target.name === 'payment_mode'){
      setPaymentMode(e.target.value);
    }else if(e.target.name === 'selectedProviderIndex'){
      setSelectedProviderIndex(parseInt(e.target.value));
      setSelectedProvider(providers[parseInt(e.target.value)]);
    }else if(e.target.name === 'tripInstructions'){
      setTripInstructions(e.target.value);
    }else if(e.target.name === 'roundTrip'){
      setRoundTrip(e.target.value);
    }else if(e.target.name === 'bookingFlow'){
      setDeliveryWithBid(e.target.value);
    }else if(e.target.name === 'firstName'){
      setProfileData({ ...profileData, [e.target.name]: e.target.value });
    }else if(e.target.name === 'lastName'){
      setProfileData({ ...profileData, [e.target.name]: e.target.value });
    }else if(e.target.name === 'email'){
      setProfileData({ ...profileData, [e.target.name]: e.target.value });
    }else{
      setInstructionData({ ...instructionData, [e.target.name]: e.target.value });
    }
  };

  const [selectedDate, setSelectedDate] = useState(GetDateString());

  const clearForm = () => {
    setUserCombo(null);
    setPickupAddress(null);
    setDropAddress(null);
    setSelectedCarDetails(null);
    setCarType(t('select_car'));
    setBookingType('Book Now');
    setEstimateRequested(false);
  }

  useEffect(() => {
    if (auth.profile && bookingOnWait) {
      setEstimateModalStatus(false); 
      dispatch(addBooking(bookingOnWait));
      setBookingOnWait(null);
      setLoading(false);
    }
  }, [auth.profile,bookingOnWait,dispatch,addBooking])

  useEffect(() => {
    if (bookingdata.booking && bookingdata.booking.mainData.status === 'PAYMENT_PENDING') {
      if(bookingdata.booking.mainData.payment_mode === 'cash'){
        dispatch(clearBooking());
        setTempRoute(null);
        navigate('/bookings')
      } else{
        if(bookingdata.booking.mainData.payment_mode === 'card'){
          setPaymentModalStatus(true);
        }else{
          setWalletModalStatus(true);
        }
      }
    }
    if (bookingdata.booking && bookingdata.booking.mainData.status === 'NEW') {
      dispatch(clearBooking());
      setTempRoute(null);
      navigate('/bookings')
    }
  }, [bookingdata.booking,clearBooking,dispatch,navigate]);

  const handleCarSelect = (event) => {
    setCarType(event.target.value);
    let carDetails = null;
    for (let i = 0; i < cartypes.length; i++) {
      if (cartypes[i].name === event.target.value) {
        carDetails = cartypes[i];
        let instObj = {...instructionData};
        if(Array.isArray(cartypes[i].parcelTypes)){
          instObj.parcelTypeSelected = cartypes[i].parcelTypes[0];
          instObj.parcelTypeIndex = 0;
        }
        if(Array.isArray(cartypes[i].options)){
          instObj.optionSelected = cartypes[i].options[0];
          instObj.optionIndex = 0;
        }
        setInstructionData(instObj);
      }
    }
    setSelectedCarDetails(carDetails);
  };

  const handleBookTypeSelect = (event) => {
    setBookingType(event.target.value);
    if (bookingType === 'Book Later') {
      setSelectedDate(GetDateString());
    }
  };

  const onDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  useEffect(() => {
    if (estimatedata.estimate && estimateRequested) {
      setEstimateRequested(false);
      setEstimateModalStatus(true);
    }
    if (userdata.users) {
      let arr = [];
      for (let i = 0; i < userdata.users.length; i++) {
        let user = userdata.users[i];
        if (user.usertype === 'customer' && ((auth.profile.usertype === 'fleetadmin' && user.fleetadmin === auth.profile.uid) || auth.profile.usertype === 'admin')) {
          arr.push({
            'firstName': user.firstName,
            'lastName': user.lastName,
            'mobile': user.mobile,
            'email': user.email,
            'uid': user.id,
            'desc': user.firstName + ' ' + user.lastName + ' (' + (settings.AllowCriticalEditsAdmin? user.mobile : t("hidden_demo")) + ') ' + (settings.AllowCriticalEditsAdmin? user.email : t("hidden_demo")),
            'pushToken': user.pushToken ? user.pushToken : ''
          });
        }
      }
      setUsers(arr);
      let arrDrivers = [];
      for (let i = 0; i < userdata.users.length; i++) {
        let user = userdata.users[i];
        if ((user.usertype) && (user.usertype === 'driver') && (user.approved === true) && (user.queue === false) && (user.driverActiveStatus === true) && (user.location) && ((user.licenseImage && settings.license_image_required) || !settings.license_image_required) && ((user.carApproved && settings.carType_required) || !settings.carType_required) && ((user.term && settings.term_required) || !settings.term_required)) {
          if((auth.profile.usertype === 'fleetadmin' && user.fleetadmin === auth.profile.uid) || auth.profile.usertype === 'admin' || auth.profile.usertype === 'customer'){
            arrDrivers.push({
              'uid': user.id,
              'location': user.location,
              'carType': user.carType,
              'fleetadmin': user.fleetadmin ? user.fleetadmin : null
            });
          }
        }
      }
      setDrivers(arrDrivers);
    }
  }, [estimatedata.estimate, userdata.users, estimateRequested, settings, auth.profile.usertype, auth.profile.uid,t]);
 
 
  useEffect(() => {
    if(auth.profile.usertype && auth.profile.usertype==='customer'){
      setUserCombo({
        'firstName': auth.profile.firstName,
        'lastName': auth.profile.lastName,
        'mobile': auth.profile.mobile,
        'email': auth.profile.email,
        'uid': auth.profile.uid,
        'pushToken': auth.profile.pushToken ? auth.profile.pushToken : ''
      })
    }
  }, [auth.profile]);


  const mobile = (userCombo && userCombo.mobile ? true : false);

  const handleGetOptions = (e) => {
    e.preventDefault();
    if((settings && settings.imageIdApproval && auth.profile.usertype ==='customer' && auth.profile.verifyId) || auth.profile.usertype==='admin' || (settings && !settings.imageIdApproval && auth.profile.usertype ==='customer') || auth.profile.usertype === 'fleetadmin'){
      if(!(settings && settings.disable_cash && (auth.profile.usertype==='admin'|| auth.profile.usertype === 'fleetadmin')) || auth.profile.usertype==='customer'){
        if((auth.profile.usertype==='customer' && parseFloat(auth.profile.walletBalance)>=0) || auth.profile.usertype==='admin' || auth.profile.usertype === 'fleetadmin'){
          setEstimateRequested(true);
          if (userCombo && pickupAddress && dropAddress && selectedCarDetails) {
            const directionService = new window.google.maps.DirectionsService();
            directionService.route(
              {
                origin: new window.google.maps.LatLng(pickupAddress.coords.lat, pickupAddress.coords.lng),
                destination: new window.google.maps.LatLng(dropAddress.coords.lat, dropAddress.coords.lng),
                travelMode: window.google.maps.TravelMode.DRIVING
              },
              (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  const route = {
                    distance_in_km:(result.routes[0].legs[0].distance.value / 1000),
                    time_in_secs:result.routes[0].legs[0].duration.value,
                    polylinePoints:result.routes[0].overview_polyline
                  };
                  setTempRoute(route);
                  if(pickupAddress && dropAddress){
                    if (bookingType === 'Book Now') {
                      if(mobile === true){
                        if(Array.isArray(selectedCarDetails.options) || Array.isArray(selectedCarDetails.parcelTypes)){
                          setOptionModalStatus(true);
                        }else{
                          let estimateRequest = {
                            pickup: pickupAddress,
                            drop: dropAddress,
                            carDetails: selectedCarDetails,
                            instructionData: instructionData,
                            routeDetails: route
                          };
                          dispatch(getEstimate(estimateRequest));
                        }
                      }else{
                        setCommonAlert({ open: true, msg: t('incomplete_user')});
                      }
                    } else {
                        if (bookingType === 'Book Later' && selectedDate) {
                          if (MinutesPassed(selectedDate) >= 15) {
                            if(mobile === true){
                              if(Array.isArray(selectedCarDetails.options) || Array.isArray(selectedCarDetails.parcelTypes)){
                                setOptionModalStatus(true);
                              }else{
                                let estimateRequest = {
                                  pickup: pickupAddress,
                                  drop: dropAddress,
                                  carDetails: selectedCarDetails,
                                  instructionData: instructionData,
                                  routeDetails: route
                                };
                                dispatch(getEstimate(estimateRequest));
                              }
                            }else{
                              setCommonAlert({ open: true, msg: t('incomplete_user')});
                            }
                          } else {
                            setCommonAlert({ open: true, msg: t('past_booking_error') });
                          }
                        } else {
                          setCommonAlert({ open: true, msg: t('select_proper') });
                        }
                      }
                  } else {
                    setCommonAlert({ open: true, msg: t('place_to_coords_error') })
                  }
                }
              }
            )
          } else {
            setCommonAlert({ open: true, msg: t('select_proper') })
          }
        }else{
          setCommonAlert({ open: true, msg: t('wallet_balance_low') })
        }
      } else {
        setCommonAlert({ open: true, msg: t('cash_booking_false') })
      }
    } else {
      setCommonAlert({ open: true, msg: t('verifyid_error') })
    }    
  }

  const handleWalletPayment = (e) => {
    e.preventDefault();
    let curBooking = { ...bookingdata.booking.mainData };
    if(parseFloat(curBooking.trip_cost)>parseFloat(auth.profile.walletBalance) && radioProps[payment_mode].cat === 'wallet'){
      setCommonAlert({open:true, msg: t('wallet_balance_low')});
    }else{
      let requestedDrivers = {};
      if (settings.autoDispatch && bookingType === 'Book Now') {
        for (let i = 0; i < drivers.length; i++) {
          const driver = drivers[i];
          let distance = GetDistance(pickupAddress.coords.lat, pickupAddress.coords.lng, driver.location.lat, driver.location.lng);
          if (settings.convert_to_mile) {
            distance = distance / 1.609344;
          }
          if (distance < ((settings && settings.driverRadius) ? settings.driverRadius : 10) && selectedCarDetails.name === driver.carType) {
            requestedDrivers[driver['uid']] = true;
          }
        }
      }
      curBooking.prepaid = true;
      curBooking.status = 'NEW';
      curBooking.payment_mode = "wallet";
      curBooking.customer_paid = parseFloat(curBooking.trip_cost).toFixed(settings.decimal);
      curBooking.discount = 0;
      curBooking.usedWalletMoney = parseFloat(curBooking.trip_cost).toFixed(settings.decimal);
      curBooking.cardPaymentAmount = 0;
      curBooking.cashPaymentAmount = 0;
      curBooking.payableAmount = 0;
      curBooking.requestedDrivers = requestedDrivers;

      dispatch(updateBooking(curBooking));

      setTimeout(()=>{
        dispatch(clearEstimate());
        setPaymentModalStatus(false);
        setWalletModalStatus(false);
        clearForm();
        dispatch(clearBooking());
        setTempRoute(null);
        navigate('/bookings')
      },1500);
    }
  }

  const handleGetEstimate = (e) => {
    e.preventDefault();
    setOptionModalStatus(false);
    let estimateRequest = {
      pickup: pickupAddress,
      drop: dropAddress,
      carDetails: selectedCarDetails,
      instructionData: instructionData,
      routeDetails: tempRoute
    };
    dispatch(getEstimate(estimateRequest));
  };

  const confirmBooking = (e) => {
    e.preventDefault();
    let requestedDrivers = {};
    let driverEstimates = {};

    let notfound = true;
    if(activeBookings){
        for(let i=0; i<activeBookings.length; i++){
            if(activeBookings[i].payment_mode==='wallet' && activeBookings[i].status!=='PAID'){
                notfound = false;
                break;
            }
        }
    }

    if((radioProps[payment_mode].cat === 'wallet' && notfound && auth.profile.usertype === 'customer') || radioProps[payment_mode].cat !== 'wallet' || auth.profile.usertype === 'admin' || auth.profile.usertype === 'fleetadmin'){
      const regx1 = /([0-9\s-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
      if ((otherPerson && /\S/.test(instructionData.otherPerson) && regx1.test(instructionData.otherPersonPhone) && instructionData.otherPersonPhone && instructionData.otherPersonPhone.length > 6) || !otherPerson){
        if ((radioProps[payment_mode].cat === 'wallet' && (parseFloat(auth.profile.walletBalance) >= parseFloat(estimatedata.estimate.estimateFare)) && !calcEst && auth.profile.usertype === 'customer') || radioProps[payment_mode].cat !== 'wallet' || (radioProps[payment_mode].cat === 'wallet' && calcEst && auth.profile.usertype === 'customer')|| auth.profile.usertype === 'admin' || auth.profile.usertype === 'fleetadmin') {
          if (settings.autoDispatch && bookingType === 'Book Now') {
            for (let i = 0; i < drivers.length; i++) {
              const driver = drivers[i];
              let distance = GetDistance(pickupAddress.coords.lat, pickupAddress.coords.lng, driver.location.lat, driver.location.lng);
              if (settings.convert_to_mile) {
                distance = distance / 1.609344;
              }
              if (distance < ((settings && settings.driverRadius) ? settings.driverRadius : 10) && ((settings.carType_required && selectedCarDetails.name === driver.carType) || !settings.carType_required) && ((auth.profile.usertype === 'fleetadmin' && driver.fleetadmin === auth.profile.uid) || auth.profile.usertype !== 'fleetadmin')) {
                requestedDrivers[driver['uid']] = true;
                driverEstimates[driver['uid']] = {distance: distance, timein_text: ((distance * 2) + 1).toFixed(0) + ' min'};
              }
            }
            if(Object.keys(requestedDrivers).length=== 0){
              setCommonAlert({open:true, msg: t('no_driver_found_alert_messege')});
              return;
            }
          }

          let bookingObject = {
            pickup: pickupAddress,
            drop: dropAddress,
            carDetails: selectedCarDetails,
            userDetails: {
              uid: userCombo.uid,
              firstName: userCombo.firstName,
              lastName: userCombo.lastName,
              mobile: userCombo.mobile,
              pushToken: userCombo.pushToken,
              email: userCombo.email
            },
            estimate: estimatedata.estimate,
            instructionData: instructionData,
            tripInstructions: tripInstructions,
            roundTrip: roundTrip === 0? false: true,
            tripdate: bookingType === 'Book Later' ? new Date(selectedDate).getTime() : new Date().getTime(),
            bookLater: bookingType === 'Book Later' ? true : false,
            settings: settings,
            booking_type_admin: auth.profile.usertype === 'admin'? true: false,
            fleetadmin: auth.profile.usertype === 'fleetadmin'? auth.profile.uid: null,
            requestedDrivers: calcEst ? requestedDrivers : (optionsRequired && radioProps[payment_mode].cat === 'cash') ? requestedDrivers : (settings.prepaid && radioProps[payment_mode].cat === 'cash') ? requestedDrivers : !settings.prepaid ? requestedDrivers : requestedDrivers ,
            driverEstimates: driverEstimates,
            payment_mode: (auth.profile.usertype === 'admin' || auth.profile.usertype === 'fleetadmin' )?'cash':radioProps[payment_mode].cat,
            booking_from_web: true,
            deliveryWithBid : auth.profile.usertype === 'customer'?  deliveryWithBid === 0 ? false : true :false
          };

          if(auth.profile.usertype === 'customer' && !(auth.profile.firstName && auth.profile.lastName && auth.profile.email && auth.profile.firstName.length>0 && auth.profile.lastName.length>0 && auth.profile.email.length>0)){
            // const regx1 = /([0-9\s-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
            // if ((optionsRequired && /\S/.test(instructionData.deliveryPerson) && regx1.test(instructionData.deliveryPersonPhone) && instructionData.deliveryPersonPhone && instructionData.deliveryPersonPhone.length > 6) || !optionsRequired){
              if((profileData.firstName && profileData.firstName.length > 0 && profileData.lastName && profileData.lastName.length > 0) || (auth.profile.firstName && auth.profile.firstName.length > 0 && auth.profile.lastName && auth.profile.lastName.length > 0)){
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if((re.test(profileData.email) && !auth.profile.email) || (auth.profile.email && auth.profile.email.length > 0)){
                  setLoading(true);
                  checkUserExists({email: profileData.email}).then(async(res) => {
                    if (res.users && res.users.length > 0) {
                      setLoading(false);
                      alert(t('user_exists'));
                    }
                    else if(res.error){
                      setLoading(false);
                      alert(t('email_or_mobile_issue'));
                    } else{
                      setLoading(false);
                      if(radioProps[payment_mode].cat === 'card'){
                        const paymentPacket = { 
                          payment_mode: 'card',
                          customer_paid: parseFloat(estimatedata.estimate.estimateFare).toFixed(settings.decimal),
                          cardPaymentAmount: parseFloat(estimatedata.estimate.estimateFare).toFixed(settings.decimal),
                          discount: 0,
                          usedWalletMoney:0,
                          cashPaymentAmount: 0,
                          promo_applied: false,
                          promo_details: null,
                          payableAmount: parseFloat(estimatedata.estimate.estimateFare).toFixed(settings.decimal),
                        };
                        bookingObject['paymentPacket'] = paymentPacket;
                      }
              
                      const result = validateBookingObj(t, bookingObject, instructionData, otherPerson);
                      if(result.error){
                        setCommonAlert({ open: true, msg: result.msg });
                      } else{
                        profileData['uid'] = auth.profile.uid;
                        let bookingData = result.bookingObject;
                        bookingData.userDetails.firstName = profileData.firstName;
                        bookingData.userDetails.lastName = profileData.lastName;
                        bookingData.userDetails.email = profileData.email;
                        setBookingOnWait(bookingData);
                      }
                      setTimeout(()=>{
                        dispatch(updateProfileWithEmail(profileData));
                      },200) 
                    }
                });
                } else {
                  setCommonAlert({ open: true, msg: t('proper_email') })
                }
              } else {
                setCommonAlert({ open: true, msg: t('proper_input_name') })
              }
            // } else {
            //   setCommonAlert({ open: true, msg: t('deliveryDetailMissing') })
            // }
          } else{
            if(radioProps[payment_mode].cat === 'card'){
              const paymentPacket = { 
                payment_mode: 'card',
                customer_paid: parseFloat(estimatedata.estimate.estimateFare).toFixed(settings.decimal),
                cardPaymentAmount: parseFloat(estimatedata.estimate.estimateFare).toFixed(settings.decimal),
                discount: 0,
                usedWalletMoney:0,
                cashPaymentAmount: 0,
                promo_applied: false,
                promo_details: null,
                payableAmount: parseFloat(estimatedata.estimate.estimateFare).toFixed(settings.decimal),
              };
              bookingObject['paymentPacket'] = paymentPacket;
            }
            const result = validateBookingObj(t, bookingObject, instructionData, otherPerson);
            if(result.error){
              setCommonAlert({ open: true, msg: result.msg });
            } else{
              setEstimateModalStatus(false); 
              dispatch(addBooking(result.bookingObject));
            }
          }
        }else{
          setCommonAlert({ open: true, msg: t('wallet_balance_low') });
        } 
      } else {
        setCommonAlert({ open: true, msg: t('otherPersonDetailMissing') })
      }
    } else {
      setCommonAlert({ open: true, msg: t('wallet_booking_alert') });
    }
  };

  const handleOptionModalClose = (e) => {
    e.preventDefault();
    setOptionModalStatus(false);
  };

  const handleEstimateModalClose = (e) => {
    e.preventDefault();
    setEstimateModalStatus(false);
    dispatch(clearEstimate());
    setEstimateRequested(false);
  };

  const handleEstimateErrorClose = (e) => {
    e.preventDefault();
    dispatch(clearEstimate());
    setEstimateRequested(false);
  };

  const handleBookingErrorClose = (e) => {
    e.preventDefault();
    dispatch(clearBooking());
    setEstimateRequested(false);
  };

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: '' })
  };

  const handleWalletModalClose = (e) => {
    setTimeout(()=>{
      setWalletModalStatus(false);
      dispatch(clearBooking());
      dispatch(clearEstimate());
    },1500);
  }

  const handlePaymentModalClose = (e) => {
    setTimeout(()=>{
      setPaymentModalStatus(false);
      dispatch(clearBooking());
      dispatch(clearEstimate());
    },1500);
  }

  return (
    <div className={classes.container} ref={rootRef}>
      <Grid item xs={12} sm={12} md={8} lg={8}>
        <Grid item xs={12}>
            <Typography className={classes.title} style={{textAlign:isRTL==='rtl'?'right':'left',fontFamily:FONT_FAMILY}}>
              {t('add_booking_title')}
            </Typography>
          </Grid>
        <div className={classes.container1}>
          <Grid container spacing={2} >
            <Grid item xs={12} >
              {users && auth.profile.usertype && auth.profile.usertype!=='customer' ?
                <UsersCombo
                  className={classes.items}
                  placeholder={t('select_user')}
                  users={users}
                  value={userCombo}
                  onChange={(event, newValue) => {
                    setUserCombo(newValue);
                  }}
                />
                : null}
            </Grid>
            <Grid item xs={12} >
              <GoogleMapsAutoComplete
                variant={"outlined"}
                placeholder={t('pickup_location')}
                value={pickupAddress}
                className={classes.items}
                onChange={
                  (value) => {
                    setPickupAddress(value);
                  }
                }
              />
            </Grid>
            <Grid item xs={12} >
              <GoogleMapsAutoComplete placeholder={t('drop_location')}
                variant={"outlined"}
                value={dropAddress}
                className={classes.items}
                onChange={
                  (value) => {
                    setDropAddress(value);
                  }
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} >
              {cartypes ?
                  <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                      value={carType}
                      onChange={handleCarSelect}
                      variant="outlined"
                      fullWidth
                      style={{textAlign:isRTL==='rtl'? 'right':'left',}}
                      className={carType === t('select_car') ? classes.inputdimmed : classes.input}
                      sx={{color: colors.BLACK,
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: MAIN_COLOR,
                      },}}
                     
                  >
                    <MenuItem dense={true} value={t('select_car')} key={t('select_car')} style={{direction:isRTL==='rtl'?'rtl':'ltr', width:'100%', justifyContent:'flex-start', paddingLeft:10,fontFamily:FONT_FAMILY}}>
                      {t('select_car')}
                    </MenuItem>
                    {
                      cartypes.sort((a, b) => a.pos - b.pos).map((car) =>
                        <MenuItem dense={true}  key={car.name} value={car.name} style={{direction:isRTL==='rtl'?'rtl':'ltr', width:'100%', justifyContent:'flex-start', paddingLeft:10,fontFamily:FONT_FAMILY}}>
                          <img src={car.image} className={isRTL==='rtl'? classes.carphotoRtl : classes.carphoto} alt="car types"/>{car.name}
                        </MenuItem>
                      )
                    }
                  </Select>
                : null}
            </Grid>
            <Grid item xs={12} sm={6}>
                <Select
                  id="booking-type-native"
                  value={bookingType}
                  onChange={handleBookTypeSelect}
                  className={classes.input}
                  style={{textAlign:isRTL==='rtl'? 'right':'left'}}
                  sx={{color: colors.BLACK,
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: MAIN_COLOR,
                      },}}
                  variant="outlined"
                  fullWidth
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem dense key={"Book Now"} value={"Book Now"} style={{direction:isRTL==='rtl'?'rtl':'ltr', width:'100%', justifyContent:'flex-start', paddingLeft:10,fontFamily:FONT_FAMILY}}>
                    {t('book_now')}
                  </MenuItem>
                  <MenuItem dense key={"Book Later"} value={"Book Later"} style={{direction:isRTL==='rtl'?'rtl':'ltr', width:'100%', justifyContent:'flex-start', paddingLeft:10,fontFamily:FONT_FAMILY}}>
                    {t('book_later')}
                  </MenuItem>
                </Select>
              </Grid>
              {bookingType === 'Book Later' ?
                <Grid item xs={12} sm={6} >
                  <TextField
                    InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                    id="datetime-local"
                    label={t('booking_date_time')}
                    type="datetime-local"
                    variant="outlined"
                    fullWidth
                    className={[isRTL==='rtl'?classes.inputRtl:classes.commonInputStyle, classes.textField].join(" ")}
                    InputProps={{
                      className: classes.input,
                      style:{textAlignLast:isRTL==='rtl'?'end':'start'}
                    }}
                    value={selectedDate}
                    onChange={onDateChange}
                  />
                </Grid>
              : null}
              {bookingType === 'Book Later' ?
                <Grid item xs={12} sm={6} >
                  <Button
                    size="lg"
                    onClick={handleGetOptions}
                    variant="contained" 
                    color="secondaryButton"
                    className={classes.buttonStyle}
                  >
                    <i className="fas fa-car" style={isRTL ==='rtl' ? {marginLeft:5}:{marginRight:5}}/>
                    {t('book')}
                  </Button>
                </Grid>
              :
                <Grid item xs={12} >
                  <Button
                    size="lg"
                    onClick={handleGetOptions}
                    variant="contained" 
                    color="secondaryButton"
                    className={classes.buttonStyle}
                  >
                    <i className="fas fa-car" style={isRTL ==='rtl' ? {marginLeft:5}:{marginRight:5}}/>
                    {t('book')}
                  </Button>
                </Grid>
              }
          </Grid>
        </div>
      </Grid>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={optionModalStatus}
        onClose={handleOptionModalClose}
        className={classes.modal}
        container={() => rootRef.current}
      >
        <Grid container spacing={2} className={classes.paper}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{textAlign:isRTL==='rtl'?'right':'left'}}>
          {selectedCarDetails && selectedCarDetails.parcelTypes?
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{fontFamily:FONT_FAMILY,}}>{t('parcel_types')}</FormLabel>
              <RadioGroup name="parcelTypeIndex" value={instructionData.parcelTypeIndex} onChange={handleChange}>
                {selectedCarDetails.parcelTypes.map((element,index) =>
                  <FormControlLabel key={element.description} value={index} control={<Radio />} label={ <Typography className={classes.typography}>{ settings.swipe_symbol===false? settings.symbol + ' ' + element.amount + ' - ' + element.description: element.amount + ' ' + settings.symbol + ' - ' + element.description}</Typography>}/>
                )}
              </RadioGroup>
            </FormControl>
          :null}
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{textAlign:isRTL==='rtl'?'right':'left'}}>
          {selectedCarDetails && selectedCarDetails.options?
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{fontFamily:FONT_FAMILY,}}>{t('options')}</FormLabel>
              <RadioGroup name="optionIndex" value={instructionData.optionIndex} onChange={handleChange}>
                {selectedCarDetails.options.map((element,index) =>
                  <FormControlLabel key={element.description} value={index} control={<Radio />} label={ <Typography className={classes.typography}>{ settings.swipe_symbol===false? settings.symbol + ' ' + element.amount + ' - ' + element.description: element.amount + ' ' + settings.symbol + ' - ' + element.description}</Typography>} />
                )}
              </RadioGroup>
            </FormControl>
          :null}
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}  style={{textAlign:isRTL==='rtl'?'right':'left'}}>
          <Button onClick={handleOptionModalClose} variant="contained" color="primary" className={classes.buttonStyle2}>
            {t('cancel')}
          </Button>
          <Button onClick={handleGetEstimate} variant="contained" color="primary" style={isRTL==='rtl'?{marginRight:10}:{marginLeft:10}} className={classes.buttonStyle1}>
            {t('get_estimate')}
          </Button>
          </Grid>
        </Grid>
      </Modal>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={estimateModalStatus}
        onClose={handleEstimateModalClose}
        className={classes.modal}
        container={() => rootRef.current}
      >
        <Grid container spacing={1} className={classes.paper}>
          <BookingModalBody 
              classes={classes}  
              instructionData={instructionData} 
              handleChange={handleChange}
              tripInstructions={tripInstructions}
              roundTrip={roundTrip}
              auth={auth}
              profileData={profileData}
              settings={settings}
              deliveryWithBid={deliveryWithBid}
              otherPerson={otherPerson}
              setOtherPerson={setOtherPerson}
          />
          {showEst?
          <Grid item xs={12} sm={12} md={12} lg={12} style={{textAlign:isRTL==='rtl'?'right':'left'}}>
            {settings.swipe_symbol===false?
              <Typography color={'primary'} style={{fontSize:30, fontFamily:FONT_FAMILY,}}>
                {t('total')} - {settings?settings.symbol:null} {estimatedata.estimate ? estimatedata.estimate.estimateFare : null}
              </Typography>
              :
              <Typography color={'primary'} style={{fontSize:30, fontFamily:FONT_FAMILY,}}>
                {t('total')} - {estimatedata.estimate ? estimatedata.estimate.estimateFare : null} {settings?settings.symbol:null}
              </Typography>
            }
          </Grid>
          :null}
          {auth.profile.usertype === 'customer'?
          <Grid item xs={12} sm={12} md={12} lg={12} style={{textAlign:isRTL==='rtl'?'right':'left'}}>
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{fontFamily:FONT_FAMILY,}}>{t('payment_mode')}</FormLabel>
              <RadioGroup name="payment_mode" value={payment_mode} onChange={handleChange}>
                {radioProps.map((element,index) =>
                  <FormControlLabel key={element.cat} value={index} control={<Radio />} label={ <Typography className={classes.typography}>{element.label}</Typography>} />
                )}
              </RadioGroup>
            </FormControl>
          </Grid>
          :null}
          <Grid item xs={12} sm={12} md={12} lg={12} style={{textAlign:isRTL==='rtl'?'right':'left'}}>
          {loading?
            <DialogActions style={{justifyContent:'center', alignContent:'center'}}>
              <CircularProgress/>
            </DialogActions>
          :
            <Grid item xs={12} >
              <Button onClick={handleEstimateModalClose} variant="contained" style={{ backgroundColor:colors.RED, fontFamily:FONT_FAMILY }}>
                {t('cancel')}
              </Button>
              <Button onClick={confirmBooking} variant="contained"  style={isRTL==='rtl'?{marginRight:10, backgroundColor:colors.GREEN}:{marginLeft:10, backgroundColor:colors.GREEN, fontFamily:FONT_FAMILY}}>
                {t('book_now')}
              </Button>
            </Grid>
          }
          </Grid>
        </Grid>
      </Modal>

      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={walletModalStatus}
        onClose={handleWalletModalClose}
        className={classes.modal}
        container={() => rootRef.current}
      >
        <Grid container spacing={2} className={classes.paper}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{marginBottom: '20px'}}>
            <Typography  style={{fontWeight:'bolder', marginBottom:10}}>
              {t('payment')}
            </Typography>
            {bookingdata && bookingdata.booking?
            <Typography color={"primary"} style={{fontSize:30}}>
              { (settings.swipe_symbol===false? settings.symbol + bookingdata.booking.mainData.trip_cost :  bookingdata.booking.mainData.trip_cost + settings.symbol) }
            </Typography>
            :null}
            <Typography >
              {t('use_wallet_balance') + " " + (settings.swipe_symbol===false? settings.symbol + auth.profile.walletBalance :  auth.profile.walletBalance + settings.symbol) + ")"}
            </Typography>
          </Grid>            
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Button onClick={handleWalletModalClose} variant="contained" style={{backgroundColor:colors.RED }}>
              {t('cancel')}
            </Button>
            <Button variant="contained" color="primary" style={{marginLeft:10,backgroundColor:colors.GREEN}} onClick={handleWalletPayment}>
              {t('paynow_button')}
            </Button>
          </Grid>
        </Grid>
      </Modal>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={paymentModalStatus}
        onClose={handlePaymentModalClose}
        className={classes.modal}
        container={() => rootRef.current}
      >
        <Grid container spacing={2} className={classes.paper}>
          {providers && selectedProvider && bookingdata && bookingdata.booking?
          <form action={selectedProvider.link} method="POST">
            <input type='hidden' name='order_id' value={bookingdata.booking.booking_id}/>
            <input type='hidden' name='amount' value={bookingdata.booking.mainData.trip_cost}/>
            <input type='hidden' name='currency' value={settings.code}/>
            <input type='hidden' name='product_name' value={t('bookingPayment')}/>
            <input type='hidden' name='first_name' value={auth.profile.firstName}/>
            <input type='hidden' name='last_name' value={auth.profile.lastName}/>
            <input type='hidden' name='quantity' value={1}/>
            <input type='hidden' name='cust_id' value={bookingdata.booking.mainData.customer}/>
            <input type='hidden' name='mobile_no' value={bookingdata.booking.mainData.customer_contact}/>
            <input type='hidden' name='email' value={bookingdata.booking.mainData.customer_email}/>
            <Grid item xs={12} sm={12} md={12} lg={12} style={{marginBottom: '20px'}}>
              <FormControl fullWidth>
              <FormLabel component="legend">{t('payment')}</FormLabel>
              <Select
                  id="selectedProviderIndex"
                  name= "selectedProviderIndex"
                  value={selectedProviderIndex}
                  label={t('payment')}
                  onChange={handleChange}
                  style={{textAlign:isRTL==='rtl'? 'right':'left'}}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  {providers.map((provider,index) =>
                    <MenuItem key={provider.name} value={index}><img style={{height:24,margin:7}} src={icons[provider.name]} alt={provider.name}/> </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
            <Button onClick={handlePaymentModalClose} variant="contained" color="primary">
              {t('cancel')}
            </Button>
            <Button variant="contained" color="primary" type="submit" style={{marginLeft:10}} onClick={handlePaymentModalClose}>
              {t('paynow_button')}
            </Button>
            </Grid>
          </form>
          :null}
        </Grid>
      </Modal>
      <AlertDialog open={bookingdata.error.flag} onClose={handleBookingErrorClose}>{bookingdata.error.msg}</AlertDialog>
      <AlertDialog open={estimatedata.error.flag} onClose={handleEstimateErrorClose}>{estimatedata.error.msg}</AlertDialog>
      <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>{commonAlert.msg}</AlertDialog>
    </div>
  );
}
