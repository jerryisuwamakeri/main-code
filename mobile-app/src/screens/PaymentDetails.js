import React, { useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';
var { width, height } = Dimensions.get('window');
import { PromoComp } from "../components";
import i18n from 'i18n-js';
import { useSelector,useDispatch } from 'react-redux';
import { api } from 'common';
import { MAIN_COLOR, appConsts } from '../common/sharedFunctions';
import { CommonActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { fonts } from '../common/font';

const hasNotch = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && ((height === 780 || width === 780) || (height === 812 || width === 812) || (height === 844 || width === 844) || (height === 852 || width === 852) || (height === 896 || width === 896) || (height === 926 || width === 926) || (height === 932 || width === 932))

export default function PaymentDetails(props) {
  const {
    updateBooking,
    cancelBooking,
    editPromo,
  } = api;
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settingsdata.settings);
  const providers = useSelector(state => state.paymentmethods.providers);
  const { booking } = props.route.params;
  const [promodalVisible, setPromodalVisible] = useState(false);
  const { t } = i18n;
  const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;

  const [profile,setProfile] = useState();
  const [isLoading,setIsLoading] = useState();

  useEffect(() => {
    if (auth.profile && auth.profile.uid) {
        setProfile(auth.profile);
    } else {
        setProfile(null);
    }
  }, [auth.profile]);

  const [payDetails, setPayDetails] = useState({
    amount: booking.trip_cost,
    discount: booking.discount? booking.discount:0,
    usedWalletMoney: booking.payment_mode === 'wallet'? booking.trip_cost:0,
    promo_applied: booking.promo_applied?booking.promo_applied:false,
    promo_details: booking.promo_details?booking.promo_details:null,
    payableAmount: booking.payableAmount?booking.payableAmount:booking.trip_cost
  });

  const promoModal = () => {
    return (
      <Modal
        animationType="none"
        visible={promodalVisible}
        onRequestClose={() => {
          setPromodalVisible(false);
        }}
      >
        <Header
          backgroundColor={MAIN_COLOR}
          centerComponent={
            <Text style={styles.headerTitleStyle}>{t("your_promo")}</Text>
          }
          containerStyle={[
            styles.headerStyle,
            { height: hasNotch ? 85 : null, backgroundColor: MAIN_COLOR },
          ]}
          innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
        />
        <PromoComp
          onPressButton={(item, index) => {
            selectCoupon(item, index);
          }}
        ></PromoComp>
        <TouchableOpacity
          onPress={() => {
            setPromodalVisible(false);
          }}
          style={styles.vew3}
        >
          <Text style={[styles.emailStyle, { color: colors.WHITE }]}>
            {t("cancel")}
          </Text>
        </TouchableOpacity>
      </Modal>
    );
  };

  const openPromoModal = () => {
    setPromodalVisible(!promodalVisible);
    let data = { ...payDetails };
    data.payableAmount = data.amount;
    data.discount = 0;
    data.promo_applied = false;
    data.promo_details = null;
    data.usedWalletMoney = 0;
    setPayDetails(data);
  }

  const removePromo = () => {
    let data = { ...payDetails };
    data.promo_details.user_avail = parseInt(data.promo_details.user_avail) - 1;
    delete data.promo_details.usersUsed[auth.profile.uid];
    dispatch(editPromo(data.promo_details));
    data.payableAmount = data.amount;
    data.discount = 0;
    data.promo_applied = false;
    data.promo_details = null;
    data.usedWalletMoney = 0;
    setPayDetails(data);
  }

  const doPayment = (payment_mode) => {

    if (payment_mode == 'cash'){
      let curBooking = { ...booking };
      if(booking.status == "PAYMENT_PENDING"){
        curBooking.status = 'NEW';

      } else if(booking.status == "REACHED"){
        if(booking.prepaid || curBooking.booking_from_web){
          curBooking.status = 'PAID';
        } else{
          curBooking.status = 'PENDING';
        }
      } else if(booking.status == "PENDING"){
        curBooking.status = 'PAID';
      }else if(booking.status == "NEW"){
        curBooking.status = 'ACCEPTED';
      }
      curBooking.payment_mode = payment_mode;
      curBooking.customer_paid = curBooking.status == 'NEW'? 0:((parseFloat(payDetails.amount) - parseFloat(payDetails.discount)).toFixed(settings.decimal));
      curBooking.discount = parseFloat(payDetails.discount).toFixed(settings.decimal);
      curBooking.usedWalletMoney = 0;
      curBooking.cardPaymentAmount = 0;
      curBooking.cashPaymentAmount = curBooking.status == 'NEW'? 0 :parseFloat(payDetails.amount- parseFloat(payDetails.discount)).toFixed(settings.decimal);
      curBooking.payableAmount = parseFloat(payDetails.payableAmount).toFixed(settings.decimal);
      curBooking.promo_applied = payDetails.promo_applied;
      curBooking.promo_details = payDetails.promo_details;

      if(curBooking.status === 'ACCEPTED'){
        curBooking.driver = curBooking.selectedBid.driver;
        curBooking.driver_image =  curBooking.selectedBid.driver_image; 
        curBooking.driver_name = curBooking.selectedBid.driver_name;
        curBooking.driver_contact = curBooking.selectedBid.driver_contact;
        curBooking.driver_token = curBooking.selectedBid.driver_token;
        curBooking.vehicle_number = curBooking.selectedBid.vehicle_number;
        curBooking.driverRating = curBooking.selectedBid.driverRating;
        curBooking.trip_cost =  curBooking.selectedBid.trip_cost;
        curBooking.convenience_fees =  curBooking.selectedBid.convenience_fees;
        curBooking.driver_share =  curBooking.selectedBid.driver_share;
        curBooking.driverOffers = {};
        curBooking.requestedDrivers = {};
        curBooking.driverEstimates = {};
        curBooking.selectedBid = {};
      }
      setIsLoading(true);
      if(curBooking.preRequestedDrivers){
        curBooking.requestedDrivers = curBooking.preRequestedDrivers;
        curBooking.preRequestedDrivers = {};
      }
      dispatch(updateBooking(curBooking));
      setTimeout(()=>{
        if(profile.usertype == 'customer') {
          if(curBooking.status == 'NEW' || curBooking.status == 'ACCEPTED'){
            props.navigation.navigate('BookedCab',{bookingId:booking.id});
          }else{
            props.navigation.navigate('DriverRating',{bookingId:booking});
          }
        }else{
          props.navigation.dispatch(CommonActions.reset({index: 0,routes: [{ name: 'TabRoot'}]}));
        }
        setIsLoading(false);
      }, 2000);


    } else if(payment_mode == 'wallet') {
      let curBooking = { ...booking };
      if(booking.status == "PAYMENT_PENDING"){
        curBooking.prepaid = true;
        curBooking.status = 'NEW';
      } else if(booking.status == "REACHED"){
        if(booking.prepaid || curBooking.booking_from_web ){
          curBooking.status = 'PAID';
        } else{
          curBooking.status = 'PENDING';
        }
      } else if(booking.status == "PENDING"){
        curBooking.status = 'PAID';
      }else if(booking.status == "NEW"){
        curBooking.prepaid = true;
        curBooking.status = 'ACCEPTED';
      }
      curBooking.payment_mode = payment_mode;
      curBooking.customer_paid = (parseFloat(payDetails.amount) - parseFloat(payDetails.discount)).toFixed(settings.decimal);
      curBooking.discount = parseFloat(payDetails.discount).toFixed(settings.decimal);
      curBooking.usedWalletMoney = (parseFloat(payDetails.amount) - parseFloat(payDetails.discount)).toFixed(settings.decimal);
      curBooking.cardPaymentAmount = 0;
      curBooking.cashPaymentAmount = 0;
      curBooking.payableAmount = parseFloat(payDetails.payableAmount).toFixed(settings.decimal);
      curBooking.promo_applied = payDetails.promo_applied;
      curBooking.promo_details = payDetails.promo_details;

      if(curBooking.status === 'ACCEPTED'){
        curBooking.driver = curBooking.selectedBid.driver;
        curBooking.driver_image =  curBooking.selectedBid.driver_image; 
        curBooking.driver_name = curBooking.selectedBid.driver_name;
        curBooking.driver_contact = curBooking.selectedBid.driver_contact;
        curBooking.driver_token = curBooking.selectedBid.driver_token;
        curBooking.vehicle_number = curBooking.selectedBid.vehicle_number;
        curBooking.driverRating = curBooking.selectedBid.driverRating;
        curBooking.trip_cost =  curBooking.selectedBid.trip_cost;
        curBooking.convenience_fees =  curBooking.selectedBid.convenience_fees;
        curBooking.driver_share =  curBooking.selectedBid.driver_share;
        curBooking.driverOffers = {};
        curBooking.requestedDrivers = {};
        curBooking.driverEstimates = {};
        curBooking.selectedBid = {};
      }
      setIsLoading(true);
      if(curBooking.preRequestedDrivers){
        curBooking.requestedDrivers = curBooking.preRequestedDrivers;
        curBooking.preRequestedDrivers = {};
      }
      dispatch(updateBooking(curBooking));
      setTimeout(()=>{
        if(profile.usertype == 'customer') {
          if(curBooking.status == 'NEW' || curBooking.status == 'ACCEPTED'){
            props.navigation.navigate('BookedCab',{bookingId:booking.id});
          }else{
            props.navigation.navigate('DriverRating',{bookingId:booking});
          }
        }else{
          props.navigation.dispatch(CommonActions.reset({index: 0,routes: [{ name: 'TabRoot'}]}));
        }
        setIsLoading(false);
      }, 2000);
    }else{
      let curBooking = { ...booking };
      if(profile.usertype == 'customer') {
  
        let payData = {
          first_name: profile.firstName,
          last_name: profile.lastName,
          email: profile.email,
          email: profile.email,
          amount: payDetails.payableAmount,
          order_id: booking.id,
          name: t('bookingPayment'),
          description: t('order_id') + booking.id,
          currency: settings.code,
          quantity: 1
        }

        const paymentPacket = { 
          payment_mode: payment_mode,
          customer_paid: (parseFloat(payDetails.amount) - parseFloat(payDetails.discount)).toFixed(settings.decimal),
          discount: parseFloat(payDetails.discount).toFixed(settings.decimal),
          usedWalletMoney: parseFloat(payDetails.usedWalletMoney).toFixed(settings.decimal),
          cardPaymentAmount: parseFloat(payDetails.payableAmount).toFixed(settings.decimal),
          cashPaymentAmount: 0,
          payableAmount: parseFloat(payDetails.payableAmount).toFixed(settings.decimal),
          promo_applied: payDetails.promo_applied,
          promo_details: payDetails.promo_details 
        };

        curBooking.paymentPacket = paymentPacket;
        
        setIsLoading(true);
        if(curBooking.preRequestedDrivers){
          curBooking.requestedDrivers = curBooking.preRequestedDrivers;
          curBooking.preRequestedDrivers = {};
        }  
        dispatch(updateBooking(curBooking));
      
        setTimeout(()=>{
          props.navigation.navigate("paymentMethod", {
            payData: payData,
            profile: profile,
            settings: settings,
            providers: providers,
            booking: curBooking
          });
          setIsLoading(false);
        },3000);
      }else{
       if(booking.status == "REACHED"){
          if((booking.prepaid || curBooking.booking_from_web) && settings.prepaid ){
            curBooking.status = 'PAID';
          } else{
            curBooking.status = 'PENDING';
          }
          dispatch(updateBooking(curBooking));
        } 
        props.navigation.dispatch(CommonActions.reset({index: 0,routes: [{ name: 'TabRoot'}]}));
      }
    
    }
  }

  const selectCoupon = (item, index) => {
    var toDay = new Date().getTime();
    var expDate = item.promo_validity
    item.usersUsed = item.usersUsed? item.usersUsed :{};
    if (payDetails.amount < item.min_order) {
      Alert.alert(t('alert'),t('promo_eligiblity'))
    } else if (item.user_avail && item.user_avail >= item.promo_usage_limit) {
      Alert.alert(t('alert'),t('promo_exp_limit'))
    } else if (item.usersUsed[auth.profile.uid]) {
      Alert.alert(t('alert'),t('promo_used'))
    } else if (toDay > expDate) {
      Alert.alert(t('alert'),t('promo_exp'))
    } else {
      let discounttype = item.promo_discount_type.toUpperCase();
      if (discounttype == 'PERCENTAGE') {
        let discount = parseFloat(payDetails.amount * item.promo_discount_value / 100).toFixed(settings.decimal);
        if (discount > item.max_promo_discount_value) {
          let discount = item.max_promo_discount_value;
          let data = { ...payDetails };
          data.discount = discount
          data.promo_applied = true
          item.user_avail = item.user_avail? parseInt(item.user_avail) + 1 : 1;
          item.usersUsed[auth.profile.uid]=true;
          dispatch(editPromo(item));
          data.promo_details = item
          data.payableAmount = parseFloat(data.payableAmount - discount).toFixed(settings.decimal);
          setPayDetails(data);
          setPromodalVisible(false);
        } else {
          let data = { ...payDetails };
          data.discount = discount
          data.promo_applied = true
          item.user_avail = item.user_avail? parseInt(item.user_avail) + 1 : 1;
          item.usersUsed[auth.profile.uid]=true;
          dispatch(editPromo(item));
          data.promo_details = item,
          data.payableAmount = parseFloat(data.payableAmount - discount).toFixed(settings.decimal);
          setPayDetails(data);
          setPromodalVisible(false);
        }
      } else {
        let discount = item.max_promo_discount_value;
        let data = { ...payDetails };
        data.discount = discount
        data.promo_applied = true
        item.user_avail = item.user_avail? parseInt(item.user_avail) + 1 : 1;
        item.usersUsed[auth.profile.uid]=true;
        dispatch(editPromo(item));
        data.promo_details = item,
        data.payableAmount = parseFloat(data.payableAmount - discount).toFixed(settings.decimal);
        setPayDetails(data);
        setPromodalVisible(false);
      }
    }

  }

  const cancelCurBooking = () => {
    Alert.alert(
      t('alert'),
      t('cancel_confirm'),
      [
          { text: t('cancel'), onPress: () => {}, style: 'cancel' },
          { text: t('ok'), onPress: () => {
              payDetails.promo_applied? removePromo(): null;
              dispatch(
                cancelBooking(
                  { 
                    booking: booking, 
                    reason: t('cancelled_incomplete_booking'),
                    cancelledBy: profile.usertype 
                  }
                )
              );
              props.navigation.navigate('TabRoot', { screen: 'Map' });
            }
          },
      ]
    );
  };

  return (
    <View style={styles.mainView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollStyle}
      >
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View
            style={{
              flex: 1,
              flexDirection: isRTL ? "row-reverse" : "row",
              justifyContent: "space-between",
              paddingLeft: 20,
              paddingRight: 20,
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                color: colors.BLACK,
                textAlign: isRTL ? "right" : "left",
                lineHeight: 45,
                fontSize: 22,
                fontFamily:fonts.Medium,
              }}
            >
              {t("bill_details")}
            </Text>
            {profile &&
            profile.usertype == "customer" &&
            (booking.status == "PAYMENT_PENDING" ||
              booking.status == "PENDING" ||
              booking.status == "NEW") ? (
              payDetails.promo_applied ? (
                <TouchableOpacity
                  onPress={() => {
                    removePromo();
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      textAlign: isRTL ? "right" : "left",
                      lineHeight: 45,
                      fontSize: 14,
                      fontFamily:fonts.Medium,
                    }}
                  >
                    {t("remove_promo")}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    openPromoModal();
                  }}
                >
                  <Text
                    style={{
                      color: colors.START_TRIP,
                      textAlign: isRTL ? "right" : "left",
                      lineHeight: 45,
                      fontSize: 14,
                      fontFamily:fonts.Medium,
                    }}
                  >
                    {t("apply_promo")}
                  </Text>
                </TouchableOpacity>
              )
            ) : null}
          </View>
          {profile && profile.usertype == "driver" ? (
            <View style={{ flex: 1, paddingLeft: 25, paddingRight: 25 }}>
              <View
                style={[
                  styles.location,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                {booking && booking.trip_start_time ? (
                  <View>
                    <Text
                      style={[
                        styles.timeStyle,
                        { textAlign: isRTL ? "right" : "left" },
                      ]}
                    >
                      {booking.trip_start_time}
                    </Text>
                  </View>
                ) : null}
                {booking && booking.pickup ? (
                  <View
                    style={[
                      styles.address,
                      isRTL
                        ? { flexDirection: "row-reverse", marginRight: 6 }
                        : { flexDirection: "row", marginLeft: 6 },
                    ]}
                  >
                    <View style={styles.greenDot} />
                    <Text
                      style={[
                        styles.adressStyle,
                        isRTL
                          ? { marginRight: 6, textAlign: "right" }
                          : { marginLeft: 6, textAlign: "left" },
                      ]}
                    >
                      {booking.pickup.add}
                    </Text>
                  </View>
                ) : null}
              </View>
              {booking && booking.waypoints && booking.waypoints.length > 0 ? 
                booking.waypoints.map((point, index) => {
                  return (
                    <View key={"key" + index} style={[styles.location, isRTL?{flexDirection:'row-reverse'}:{flexDirection:'row'}, {justifyContent: 'center', alignItems:'center'}]}>
                        <View>
                            <MaterialIcons name="multiple-stop" size={32} color={colors.SECONDARY}/> 
                        </View>
                        <View  style={[styles.address, isRTL?{flexDirection:'row-reverse', marginRight:65}:{flexDirection:'row', marginLeft:6}]}>
                            <Text numberOfLines={2} style={[styles.adressStyle, isRTL?{marginRight:6, textAlign:'right'}:{marginLeft:6, textAlign:'left'}]}>{point.add}</Text>
                        </View>
                    </View>
                  ) 
                })
              : null}
              <View
                style={[
                  styles.location,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                {booking && booking.trip_end_time ? (
                  <View>
                    <Text
                      style={[
                        styles.timeStyle,
                        { textAlign: isRTL ? "right" : "left" },
                      ]}
                    >
                      {booking.trip_end_time}
                    </Text>
                  </View>
                ) : null}
                {booking && booking.drop ? (
                  <View
                    style={[
                      styles.address,
                      isRTL
                        ? { flexDirection: "row-reverse", marginRight: 6 }
                        : { flexDirection: "row", marginLeft: 6 },
                    ]}
                  >
                    <View style={styles.redDot} />
                    <Text
                      style={[
                        styles.adressStyle,
                        isRTL
                          ? { marginRight: 6, textAlign: "right" }
                          : { marginLeft: 6, textAlign: "left" },
                      ]}
                    >
                      {booking.drop.add}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}

          {profile && profile.usertype == "driver" ? (
            <View
              style={{
                flex: 1,
                flexDirection: isRTL ? "row-reverse" : "row",
                justifyContent: "space-between",
                paddingLeft: 25,
                paddingRight: 25,
              }}
            >
              <Text
                style={{
                  color: colors.BLACK,
                  textAlign: isRTL ? "right" : "left",
                  lineHeight: 45,
                  fontSize: 16,
                  fontFamily: fonts.Regular,
                }}
              >
                {t("distance")}
              </Text>
              <Text
                style={{
                  color: colors.BLACK,
                  textAlign: isRTL ? "right" : "left",
                  lineHeight: 45,
                  fontSize: 16,
                  fontFamily: fonts.Regular,
                }}
              >
                {(booking && booking.distance ? booking.distance : "0") +
                  " " +
                  (settings && settings.convert_to_mile ? t("mile") : t("km"))}
              </Text>
            </View>
          ) : null}
          {profile && profile.usertype == "driver" ? (
            <View
              style={{
                flex: 1,
                flexDirection: isRTL ? "row-reverse" : "row",
                justifyContent: "space-between",
                paddingLeft: 25,
                paddingRight: 25,
              }}
            >
              <Text
                style={{
                  color: colors.BLACK,
                  textAlign: isRTL ? "right" : "left",
                  lineHeight: 45,
                  fontSize: 16,
                  fontFamily: fonts.Regular,
                }}
              >
                {t("total_time")}
              </Text>
              <Text
                style={{
                  color: colors.BLACK,
                  textAlign: isRTL ? "right" : "left",
                  lineHeight: 45,
                  fontSize: 16,
                  fontFamily: fonts.Regular,
                }}
              >
                {(booking && booking.total_trip_time
                  ? parseFloat(booking.total_trip_time / 60).toFixed(1)
                  : "0") +
                  " " +
                  t("mins")}
              </Text>
            </View>
          ) : null}
          {profile && profile.usertype == "driver" ? (
            <View
              style={{
                borderStyle: "dotted",
                borderWidth: 0.5,
                borderRadius: 1,
                marginBottom: 20,
              }}
            ></View>
          ) : null}

          {profile ? (
            <View
              style={{
                flex: 1,
                flexDirection: isRTL ? "row-reverse" : "row",
                justifyContent: "space-between",
                paddingLeft: 25,
                paddingRight: 25,
              }}
            >
              <Text
                style={{
                  color: colors.BLACK,
                  textAlign: isRTL ? "right" : "left",
                  lineHeight: 45,
                  fontSize: 16,
                  fontFamily: fonts.Regular,
                }}
              >
                {profile.usertype == "customer"
                  ? t("your_fare")
                  : t("total_fare")}
              </Text>
              {settings.swipe_symbol === false ? (
                <Text
                  style={{
                    color: colors.BLACK,
                    textAlign: isRTL ? "right" : "left",
                    lineHeight: 45,
                    fontSize: 16,
                    fontFamily: fonts.Regular,
                  }}
                >
                  {settings.symbol}{" "}
                  {parseFloat(payDetails.amount).toFixed(settings.decimal)}
                </Text>
              ) : (
                <Text
                  style={{
                    color: colors.BLACK,
                    textAlign: isRTL ? "right" : "left",
                    lineHeight: 45,
                    fontSize: 16,
                    fontFamily: fonts.Regular,
                  }}
                >
                  {parseFloat(payDetails.amount).toFixed(settings.decimal)}{" "}
                  {settings.symbol}
                </Text>
              )}
            </View>
          ) : null}
          {profile ? (
            <View
              style={{
                flex: 1,
                flexDirection: isRTL ? "row-reverse" : "row",
                justifyContent: "space-between",
                paddingLeft: 25,
                paddingRight: 25,
              }}
            >
              <Text
                style={{
                  color: colors.BLACK,
                  textAlign: isRTL ? "right" : "left",
                  lineHeight: 45,
                  fontSize: 16,
                  fontFamily: fonts.Regular,
                }}
              >
                {t("promo_discount")}
              </Text>
              {settings.swipe_symbol === false ? (
                <Text
                  style={{
                    color: colors.DULL_RED,
                    textAlign: isRTL ? "right" : "left",
                    lineHeight: 45,
                    fontSize: 16,
                    fontFamily: fonts.Regular,
                  }}
                >
                  {isRTL ? null : "-"} {settings.symbol}{" "}
                  {payDetails
                    ? payDetails.discount
                      ? parseFloat(payDetails.discount).toFixed(
                          settings.decimal
                        )
                      : "0.00"
                    : "0.00"}{" "}
                  {isRTL ? "-" : null}
                </Text>
              ) : (
                <Text
                  style={{
                    color: colors.DULL_RED,
                    textAlign: isRTL ? "right" : "left",
                    lineHeight: 45,
                    fontSize: 16,
                    fontFamily: fonts.Regular,
                  }}
                >
                  {isRTL ? null : "-"}{" "}
                  {payDetails
                    ? payDetails.discount
                      ? parseFloat(payDetails.discount).toFixed(
                          settings.decimal
                        )
                      : "0.00"
                    : "0.00"}{" "}
                  {settings.symbol} {isRTL ? "-" : null}
                </Text>
              )}
            </View>
          ) : null}

          {profile ? (
            <View
              style={{
                borderStyle: "dotted",
                borderWidth: 0.5,
                borderRadius: 1,
              }}
            ></View>
          ) : null}
          {profile ? (
            <View
              style={{
                flex: 1,
                flexDirection: isRTL ? "row-reverse" : "row",
                justifyContent: "space-between",
                paddingLeft: 25,
                paddingRight: 25,
              }}
            >
              <Text
                style={{
                  color: colors.START_TRIP,
                  textAlign: isRTL ? "right" : "left",
                  lineHeight: 45,
                  fontSize: 24,
                  fontFamily: fonts.Medium,
                }}
              >
                {t("payable_ammount")}
              </Text>
              {settings.swipe_symbol === false ? (
                <Text
                  style={{
                    color: colors.START_TRIP,
                    textAlign: isRTL ? "right" : "left",
                    lineHeight: 45,
                    fontSize: 24,
                    fontFamily: fonts.Bold,
                  }}
                >
                  {settings.symbol}{" "}
                  {payDetails.payableAmount
                    ? parseFloat(payDetails.payableAmount).toFixed(
                        settings.decimal
                      )
                    : 0.0}
                </Text>
              ) : (
                <Text
                  style={{
                    color: colors.START_TRIP,
                    textAlign: isRTL ? "right" : "left",
                    lineHeight: 45,
                    fontSize: 24,
                    fontFamily: fonts.Bold,
                  }}
                >
                  {payDetails.payableAmount
                    ? parseFloat(payDetails.payableAmount).toFixed(
                        settings.decimal
                      )
                    : 0.0}{" "}
                  {settings.symbol}
                </Text>
              )}
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.buttonContainer,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          {profile &&
          profile.usertype == "customer" &&
          (booking.status == "PAYMENT_PENDING" || booking.status == "NEW") ? (
            <TouchableOpacity
              onPress={cancelCurBooking}
              style={styles.buttonWrapper2}
            >
              <Text style={styles.buttonTitle}>{t("cancel")}</Text>
            </TouchableOpacity>
          ) : null}
          {booking.payment_mode == "wallet" ? (
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={() => {
                doPayment("wallet");
              }}
            >
               <View style={styles.cardPayBtnInnner}>
                {isLoading ? <ActivityIndicator size="small" color="white" /> :
                <Text style={[styles.buttonTitle,{fontSize:16}]}>
                  {t("complete_payment")}
                </Text>
                }
              </View>
            </TouchableOpacity>
          ) : null}
          {booking.payment_mode == "cash" ? (
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={() => {
                doPayment("cash");
              }}
            >
              <View style={styles.cardPayBtnInnner}>
                {isLoading ? <ActivityIndicator size="small" color="white" /> :
                <Text style={styles.buttonTitle}>
                  {booking.status == "PAYMENT_PENDING"
                    ? t("cash_on_delivery")
                    : booking.payment_mode == "cash"? t("pay_cash") : t("complete_payment")}
                </Text>
                }
              </View>
            </TouchableOpacity>
          ) : null}

          {providers &&
          providers.length > 0 &&
          booking.payment_mode == "card" ? (
            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={() => {
                doPayment("card");
              }}
            >
              <View style={styles.cardPayBtnInnner}>
                {isLoading ? <ActivityIndicator size="small" color="white" /> :
                <Text style={styles.buttonTitle}>
                  {profile && profile.usertype == "customer"
                    ? t("payWithCard")
                    : t("complete_payment")}
                </Text>
                }
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
      {promoModal()}
    </View>
  );

}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE
  },
  headerStyle: {
    borderBottomWidth: 0
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily:fonts.Bold,
    fontSize: 20,
    marginTop: 15
  }, scrollStyle: {
    flex: 1,
    height: height,
    backgroundColor: colors.WHITE
  },
  container: {
    flex: 1,
    marginTop: 5,
    backgroundColor: 'white',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:20
  },

  buttonWrapper: {
    marginLeft: 8,
    marginRight: 8,
    marginTop: 20,
    marginBottom: 10,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.BUTTON_BACKGROUND,
    borderRadius: 8,
    flex:1,
  },
  buttonWrapper2: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 10,
    marginTop: 20,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.LIGHT_RED,
    borderRadius: 8,
    minWidth:"45%",
    paddingHorizontal:3
  },
  cardPayBtn: {
    marginHorizontal: 6,
    height: 55,
    borderRadius: 8,
    marginTop: 10
  },
  cardPayBtnInnner: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width:"100%",
  },
  buttonTitle: {
    color: colors.WHITE,
    fontSize: 18,
    fontFamily: fonts.Regular,
  },
  newname: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailInputContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingLeft: 10,
    backgroundColor: colors.WHITE,
    paddingRight: 10,
    paddingTop: 10,
    width: width - 80
  },
  errorMessageStyle: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  inputTextStyle: {
    color: colors.BLACK,
    fontSize: 16
  },
  pinbuttonStyle: { elevation: 0, bottom: 15, width: '80%', alignSelf: "center", borderRadius: 20, borderColor: "transparent", backgroundColor: colors.BUTTON_RIGHT, },
  pinbuttonContainer: { flex: 1, justifyContent: 'center' },
  inputContainer: { flex: 3, justifyContent: "center", marginTop: 40 },
  pinheaderContainer: { height: 250, backgroundColor: colors.WHITE, width: '80%', justifyContent: 'space-evenly' },
  pinheaderStyle: { flex: 1, flexDirection: 'column', backgroundColor: colors.HEADER, justifyContent: "center" },
  forgotPassText: { textAlign: "center", color: colors.WHITE, fontSize: 20, width: "100%" },
  pinContainer: { flexDirection: "row", justifyContent: "space-between" },
  forgotStyle: { flex: 3, justifyContent: "center", alignItems: 'center' },
  crossIconContainer: { flex: 1, left: '40%' },
  forgot: { flex: 1 },
  pinbuttonTitle: {
    fontFamily:fonts.Bold,
    fontSize: 18,
    width: '100%',
    textAlign: 'center'
  },
  newname2: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  emailInputContainer2: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingLeft: 10,
    backgroundColor: colors.WHITE,
    paddingRight: 10,
    paddingTop: 10,
    width: width - 80,

  },

  inputTextStyle2: {
    color: colors.BLACK,
    fontSize: 14
  },
  buttonStyle2: { elevation: 0, bottom: 15, width: '80%', alignSelf: "center", borderRadius: 20, borderColor: "transparent", backgroundColor: colors.BUTTON_RIGHT, },
  buttonContainer2: { flex: 1, justifyContent: 'center', marginTop: 5 },
  inputContainer2: { flex: 4, paddingBottom: 25 },
  headerContainer2: { height: 380, backgroundColor: colors.WHITE, width: '80%', justifyContent: 'center' },
  headerStyle2: { flex: 1, flexDirection: 'column', backgroundColor: colors.HEADER, justifyContent: "center" },
  forgotPassText2: { textAlign: "center", color: colors.WHITE, fontSize: 16, width: "100%" },
  forgotContainer2: { flexDirection: "row", justifyContent: "space-between" },
  forgotStyle2: { flex: 3, justifyContent: "center" },
  crossIconContainer2: { flex: 1, left: '40%' },
  forgot2: { flex: 1 },
  buttonTitle2: {
    fontFamily: fonts.Bold,
    fontSize: 16,
    width: '100%',
    textAlign: 'center'
  },

  containercvv: {
    flex: 1,
    width: "100%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingTop: 120
  },
  modalContainercvv: {
    height: 200,
    backgroundColor: colors.WHITE,
    width: "80%",
    borderRadius: 10,
    elevation: 15
  },
  crossIconContainercvv: {
    flex: 1,
    left: "40%"
  },
  blankViewStylecvv: {
    flex: 1,
    flexDirection: "row",
    alignSelf: 'flex-end',
    marginTop: 15,
    marginRight: 15
  },
  blankViewStyleOTP: {
    flex: 1,
    flexDirection: "row",
    alignSelf: 'flex-end',

  },
  modalHeaderStylecvv: {
    textAlign: "center",
    fontSize: 20,
    paddingTop: 10
  },
  modalContainerViewStylecvv: {
    flex: 9,
    alignItems: "center",
    justifyContent: "center"
  },
  itemsViewStylecvv: {
    flexDirection: "column"
  },
  textStylecvv: {
    fontSize: 20
  },
  location: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6
  },
  timeStyle: {
    fontFamily: fonts.Regular,
    fontSize: 16,
    marginTop: 1
  },
  greenDot: {
    backgroundColor: colors.GREEN_DOT,
    width: 10,
    height: 10,
    borderRadius: 50,
    alignSelf: 'flex-start',
    marginTop: 5
  },
  redDot: {
    backgroundColor: colors.RED,
    width: 10,
    height: 10,
    borderRadius: 50,
    alignSelf: 'flex-start',
    marginTop: 5
  },
  address: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 0,
    marginLeft: 6
  },
  adressStyle: {
    marginLeft: 6,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.Regular,
  },
  emailStyle: {
    fontSize: 17,
    color: colors.BLACK,
    fontFamily:fonts.Bold,
    textAlign: 'center'
  },
  vew3: {
    flexDirection: 'row',
    height: 40,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.LIGHT_RED,
    borderRadius: 10,
    marginVertical:15
  },
});