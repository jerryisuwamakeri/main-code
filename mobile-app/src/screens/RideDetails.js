import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    ScrollView,
    Dimensions,
    Platform,
    Image,
    TouchableOpacity,
    Modal,
    Linking,
    Alert
} from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Avatar } from 'react-native-elements';
import * as DecodePolyLine from '@mapbox/polyline';
import { colors } from '../common/theme';
import i18n from 'i18n-js';
import StarRating from 'react-native-star-rating-widget';
import { useSelector } from 'react-redux';
import { Ionicons, Entypo, Fontisto, AntDesign, Octicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { appConsts } from '../common/sharedFunctions';
import moment from 'moment/min/moment-with-locales';
var { width, height } = Dimensions.get('window');
import Button from '../components/Button';
import { MAIN_COLOR } from '../common/sharedFunctions';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { fonts } from '../common/font';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
export default function RideDetails(props) {

    const { data } = props.route.params;
    const paramData = data;
    const settings = useSelector(state => state.settingsdata.settings);
    const auth = useSelector(state => state.auth);
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    //const isRTL = true;
    const [coords, setCoords] = useState([]);
    const [role, setRole] = useState();
    const [userInfoModalStatus, setUserInfoModalStatus] = useState(false);

    const goToBooking = (id) => {
        if (paramData.status == 'PAYMENT_PENDING') {
            props.navigation.navigate('PaymentDetails', { booking: paramData });
        } else {
            props.navigation.replace('BookedCab', { bookingId: id });
        }
    };

    useEffect(() => {
        if (auth.profile && auth.profile.usertype) {
            setRole(auth.profile.usertype);
        } else {
            setRole(null);
        }
    }, [auth.profile]);

    const onPressCall = (phoneNumber) => {
        if (['PAYMENT_PENDING', 'NEW', 'ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING'].indexOf(paramData.status) != -1) {
            let call_link = Platform.OS == 'android' ? 'tel:' + phoneNumber : 'telprompt:' + phoneNumber;
            Linking.openURL(call_link);
        } else {
            Alert.alert(t('alert'), t('booking_is') + paramData.status + "." + t('not_call'));
        }
    }

    const onChatAction = () => {
        if (['PAYMENT_PENDING', 'NEW', 'ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING'].indexOf(paramData.status) != -1) {
            props.navigation.navigate("onlineChat", { bookingId: paramData.id })
        } else {
            Alert.alert(t('alert'), t('booking_is') + paramData.status + "." + t('not_chat'));
        }
    }

    const onAlert = (item) => {
        Alert.alert(t('alert'), t('booking_is') + item.status + "." + t('not_call'));
    }

    const onChatAlert = (item) => {
        Alert.alert(t('alert'), t('booking_is') + item.status + "." + t('not_chat'));
    }

    const UserInfoModal = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={userInfoModalStatus}
                onRequestClose={() => {
                    setUserInfoModalStatus(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ width: '100%' }}>
                            {paramData && paramData.deliveryPersonPhone ?
                                <View style={[styles.textContainerStyle, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                                    <Text style={styles.textStyleBold}>{t('senderPersonPhone')}</Text>
                                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginVertical: 10 }}>
                                        <Ionicons name="call" size={24} color={colors.BLACK} />
                                        <Text style={styles.textStyle} onPress={() => onPressCall(paramData.deliveryPersonPhone)}> {paramData.deliveryPersonPhone} </Text>
                                    </View>
                                </View>
                                : null}
                            {paramData && paramData.customer_contact ?
                                <View style={[styles.textContainerStyle, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                                    <Text style={styles.textStyleBold}>{t('senderPersonPhone')}</Text>
                                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginVertical: 10 }}>
                                        <Ionicons name="call" size={24} color={colors.BLACK} />
                                        <Text style={styles.textStyle} onPress={() => onPressCall(paramData.customer_contact)}> {paramData.customer_contact} </Text>
                                    </View>
                                </View>
                                : null}
                        </View>
                        <TouchableOpacity
                            loading={false}
                            onPress={() => setUserInfoModalStatus(false)}
                            style={styles.modalBtn}
                        >
                            <Text style={styles.textStyle}>{t('ok')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        )
    }


    useEffect(() => {
        let arr = [];
        arr.push(paramData.coords[0]);
        if (paramData && paramData.waypoints) {
            for (let i = 0; i < paramData.waypoints.length; i++) {
                arr.push({ latitude: paramData.waypoints[i].lat, longitude: paramData.waypoints[i].lng })
            }
        }
        arr.push(paramData.coords[1]);
        setCoords(arr);
    }, []);

    return (
        <View style={[styles.mainView]}>
            <ScrollView>
                <View style={styles.vew}>
            
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flex: 1 }}>
                        <View style={{ flexDirection: 'column', width: width - 20 }}>
                            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                <View style={{ width: 30, alignItems: 'center' }}>
                                    <Ionicons name="location-outline" size={24} color={colors.GREEN} />
                                    <View style={[styles.hbox2, { flex: 1, minHeight: 5 }]} />
                                </View>
                                <View style={{ width: width - 70, marginBottom: 10 }}>
                                    <Text style={[styles.textStyle, isRTL ? { marginRight: 6, textAlign: 'right' } : { marginLeft: 6, textAlign: 'left' }]}>{paramData.pickup.add} </Text>
                                </View>
                            </View>
                            {paramData && paramData.waypoints && paramData.waypoints.length > 0 ? paramData.waypoints.map((point, index) => {
                                return (
                                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                        <View style={{ width: 30, alignItems: 'center' }}>
                                            {/* <Ionicons name="location-outline" size={24} color={colors.BOX_BG} /> */}

                                            <View style={styles.multiAddressChar}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 10, color: colors.BLACK }}>{String.fromCharCode(65 + index)}</Text>
                                            </View>

                                            <View style={[styles.hbox2, { flex: 1 }]} />
                                        </View>
                                        <View style={{ width: width - 70, marginBottom: 10 }}>
                                            <Text style={[styles.textStyle, isRTL ? { marginRight: 6, textAlign: 'right' } : { marginLeft: 6, textAlign: 'left' }]}>{point.add}</Text>
                                        </View>
                                    </View>
                                )
                            })
                                : null}

                            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                <View style={{ width: 30, alignItems: 'center' }}>
                                    <Ionicons name="location-outline" size={24} color={colors.RED} />
                                </View>
                                <View style={{ width: width - 70 }}>
                                    <Text style={[styles.textStyle, isRTL ? { marginRight: 6, textAlign: 'right' } : { marginLeft: 6, textAlign: 'left' }]}>{paramData.drop.add}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', flex: 1, minHeight: 60 }}>
                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flex: 1, minHeight: 60 }}>
                            <View style={[styles.details, { flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
                                <Text style={{ fontFamily:fonts.Bold, fontSize: 24, color: MAIN_COLOR, opacity: 0.7 }}>{settings.symbol}</Text>
                                <Text style={styles.textStyleBold}>{paramData && paramData.trip_cost > 0 ? parseFloat(paramData.trip_cost).toFixed(settings.decimal) : paramData && paramData.estimate ? parseFloat(paramData.estimate).toFixed(settings.decimal) : 0}</Text>
                            </View>
                            <View style={[styles.hbox2, { minHeight: 5, width: 1, margin: 2 }]} />
                            <View style={[styles.details, { flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
                                <Fontisto name="map" size={26} color={MAIN_COLOR} style={{ opacity: 0.8 }} />
                                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                    <Text style={styles.textStyleBold}>{paramData && paramData.distance > 0 ? parseFloat(paramData.distance).toFixed(settings.decimal) : 0}</Text>
                                    <Text style={styles.textStyle}> {settings && settings.convert_to_mile ? t("mile") : t("km")} </Text>
                                </View>

                            </View>
                        </View>
                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flex: 1, minHeight: 60 }}>
                            <View style={[styles.details, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomWidth: 0 }]}>
                                <Octicons name="clock" size={26} color={MAIN_COLOR} style={{ opacity: 0.8 }} />
                                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                    <Text style={styles.textStyleBold}>{(paramData && paramData.total_trip_time && paramData.total_trip_time > 0 ? parseFloat(paramData.total_trip_time / 60).toFixed(0) == 0 ? "1" : parseFloat(paramData.total_trip_time / 60).toFixed(0) : parseFloat(paramData.estimateTime / 60).toFixed(0))}</Text>
                                    <Text style={styles.textStyle}> {t("mins")} </Text>
                                </View>
                            </View>
                            <View style={[styles.hbox2, { minHeight: 5, width: 1, margin: 2 }]} />
                            <View style={[styles.clock,{flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
                                {paramData && paramData.trip_start_time && paramData.trip_end_time ?
                                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                        <View style={[styles.section,{flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
                                            <Ionicons name="location-outline" size={28} color={colors.GREEN} />
                                            <View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={styles.textStyleBold}>{paramData && paramData.trip_start_time ? (paramData.trip_start_time).substring(0, ((paramData.trip_start_time).indexOf(":"))).length == 2 ? (paramData.trip_start_time).substring(0, ((paramData.trip_start_time).indexOf(":"))) : "0" + (paramData.trip_start_time).substring(0, ((paramData.trip_start_time).indexOf(":"))) : ""}</Text>
                                                    <Text style={styles.textStyleBold}>{paramData && paramData.trip_start_time ? (paramData.trip_start_time).substring(((paramData.trip_start_time).indexOf(":") + 1), ((paramData.trip_start_time).lastIndexOf(":"))).length == 2 ? (paramData.trip_start_time).substring(((paramData.trip_start_time).indexOf(":")), ((paramData.trip_start_time).lastIndexOf(":"))) : ":0" + (paramData.trip_start_time).substring(((paramData.trip_start_time).indexOf(":") + 1), ((paramData.trip_start_time).lastIndexOf(":"))) : ""}</Text>
                                                </View>
                                                <Text style={{ textAlign: isRTL ? "right" : "left", fontSize: 8,fontFamily:fonts.Regular }}>{paramData.startTime ? moment(paramData.startTime).format('ll') : ''}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.section,{flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
                                            <Ionicons name="location-outline" size={28} color={colors.RED} />
                                            <View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={styles.textStyleBold}>{paramData && paramData.trip_end_time ? (paramData.trip_end_time).substring(0, ((paramData.trip_end_time).indexOf(":"))).length == 2 ? (paramData.trip_end_time).substring(0, ((paramData.trip_end_time).indexOf(":"))) : "0" + (paramData.trip_end_time).substring(0, ((paramData.trip_end_time).indexOf(":"))) : ""}</Text>
                                                    <Text style={styles.textStyleBold}>{paramData && paramData.trip_end_time ? (paramData.trip_end_time).substring(((paramData.trip_end_time).indexOf(":") + 1), ((paramData.trip_end_time).lastIndexOf(":"))).length == 2 ? (paramData.trip_end_time).substring(((paramData.trip_end_time).indexOf(":")), ((paramData.trip_end_time).lastIndexOf(":"))) : ":0" + (paramData.trip_end_time).substring(((paramData.trip_end_time).indexOf(":") + 1), ((paramData.trip_end_time).lastIndexOf(":"))) : ""}</Text>
                                                </View>
                                                <Text style={{ textAlign: isRTL ? "right" : "left", fontSize: 8,fontFamily:fonts.Regular }}>{paramData.endTime ? moment(paramData.endTime).format('ll') : ''}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    : paramData && paramData.trip_start_time ?
                                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                            <View style={[styles.section,{flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
                                                <Ionicons name="location-outline" size={28} color={colors.GREEN} />
                                                <View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={styles.textStyleBold}>{paramData && paramData.trip_start_time ? (paramData.trip_start_time).substring(0, ((paramData.trip_start_time).indexOf(":"))).length == 2 ? (paramData.trip_start_time).substring(0, ((paramData.trip_start_time).indexOf(":"))) : "0" + (paramData.trip_start_time).substring(0, ((paramData.trip_start_time).indexOf(":"))) : ""}</Text>
                                                        <Text style={styles.textStyleBold}>{paramData && paramData.trip_start_time ? (paramData.trip_start_time).substring(((paramData.trip_start_time).indexOf(":") + 1), ((paramData.trip_start_time).lastIndexOf(":"))).length == 2 ? (paramData.trip_start_time).substring(((paramData.trip_start_time).indexOf(":")), ((paramData.trip_start_time).lastIndexOf(":"))) : ":0" + (paramData.trip_start_time).substring(((paramData.trip_start_time).indexOf(":") + 1), ((paramData.trip_start_time).lastIndexOf(":"))) : ""}</Text>
                                                    </View>
                                                    <Text style={{ textAlign: isRTL ? "right" : "left", fontSize: 8 }}>{paramData.startTime ? moment(paramData.startTime).format('ll') : ''}</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.section,{flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
                                                <Ionicons name="location-outline" size={28} color={colors.RED} />
                                                <Image source={require('../../assets/images/clock.gif')} style={{ width: 25, height: 25, alignSelf: 'center', resizeMode: 'center' }} />
                                            </View>
                                        </View>
                                        :
                                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                            <Text style={styles.textStyleBold}>{paramData && paramData.reason ? paramData.reason : t(paramData.status).toUpperCase()}</Text>
                                        </View>
                                }
                            </View>
                        </View>
                    </View>

                    {paramData ?
                        <View style={[styles.driverDetails,{flexDirection: isRTL ? 'row-reverse' : 'row'}]}>
                            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', flex: 1 }}>
                                {paramData ?
                                    (!(paramData.driver_image == '' || paramData.driver_image == null || paramData.driver_image == 'undefined') && auth.profile.usertype == 'customer') ?
                                        <Avatar
                                            size="medium"
                                            rounded
                                            source={{ uri: paramData.driver_image }}
                                            activeOpacity={0.7}
                                        />
                                        : 
                                        (!(paramData.customer_image == '' || paramData.customer_image == null || paramData.customer_image == 'undefined') && auth.profile.usertype == 'driver') ?
                                        <Avatar
                                            size="medium"
                                            rounded
                                            source={{ uri: paramData.customer_image }}
                                            activeOpacity={0.7}
                                        />
                                        : paramData.driver_name != '' ?

                                            <Avatar
                                                size="medium"
                                                rounded
                                                source={require('../../assets/images/profilePic.png')}
                                                activeOpacity={0.7}
                                            /> : null
                                    : null}
                                <View style={[styles.userView, { flex: 1, marginHorizontal: 5 }]}>
                                    {paramData && paramData.driver_name != '' && auth.profile.usertype == 'customer' ? <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left' }]}>{paramData.driver_name ? paramData.driver_name : t('no_name')}</Text> : null}

                                    {paramData && paramData.customer_name != '' &&  auth.profile.usertype == 'driver'  ? <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left' }]}>{paramData.customer_name ? paramData.customer_name : t('no_name')}</Text> : null}

                                    {paramData && paramData.rating > 0  && paramData.driver_name &&  auth.profile.usertype == 'customer' ?
                                        <View>
                                            <StarRating
                                                maxStars={5}
                                                starSize={15}
                                                enableHalfStar={true}
                                                color={MAIN_COLOR}
                                                emptyColor={MAIN_COLOR}
                                                rating={paramData && paramData.rating ? parseFloat(paramData.rating) : 0}
                                                style={[isRTL ? { marginRight: 0, transform: [{ scaleX: -1 }] } : { marginLeft: -8 }]}
                                                onChange={() => {
                                                    //console.log('hello')
                                                }}
                                            />
                                        </View>
                                        : null}
                                </View>
                            </View>
                            {paramData && ((paramData.driver_contact || paramData.customer_contact)) ?
                                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                   <TouchableOpacity onPress={() => (['ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING'].indexOf(paramData.status) != -1) ? role == 'customer' ? 
                                            onPressCall(paramData.driver_contact) : (paramData.otherPersonPhone && paramData.otherPersonPhone.length > 0 ? onPressCall(paramData.otherPersonPhone) : onPressCall(paramData.customer_contact)) : onAlert(paramData)} 
                                            style={{ backgroundColor: MAIN_COLOR, height: 40, width: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', margin: 3 }}>
                                        <Ionicons name="call" size={24} color={colors.WHITE} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (['ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING'].indexOf(paramData.status) != -1) ? onChatAction(paramData, paramData.id) : onChatAlert(paramData)} style={{ backgroundColor: MAIN_COLOR, height: 40, width: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', margin: 3 }}>
                                        <Ionicons name="chatbubble-ellipses-sharp" size={24} color={colors.WHITE} />
                                    </TouchableOpacity>
                                </View>
                                : null}
                        </View>
                    : null}

                    {paramData && paramData.otherPerson && paramData.otherPersonPhone ?
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left',  }]}>{t('otherPerson_title')}</Text>
                            <View style={{ flexDirection: 'column', flex: 1, marginBottom: 10, marginHorizontal: 2 }}>
                                {paramData.vehicleModel ?
                                    <View style={{alignItems:'center', flexDirection: isRTL ? 'row-reverse' : 'row', marginVertical: 0}}>
                                        <Text style={[styles.textStyleBold, { textAlign: isRTL ? "right" : "left" }]}>{t('name')}</Text>
                                        <Text style={[styles.textStyleBold, { textAlign: isRTL ? "right" : "left" }]}> : </Text>
                                        <Text style={[styles.textStyle, { textAlign: isRTL ? "right" : "left" }]}>{paramData.otherPerson}</Text>
                                    </View>
                                : null}
                                {paramData.vehicleModel ?
                                    <View style={{alignItems:'center', flexDirection: isRTL ? 'row-reverse' : 'row', marginVertical: 5}}>
                                        <Text style={[styles.textStyleBold, { textAlign: isRTL ? "right" : "left" }]}>{t('phone')}</Text>
                                        <Text style={[styles.textStyleBold, { textAlign: isRTL ? "right" : "left" }]}> : </Text>
                                        <Text style={[styles.textStyle, { textAlign: isRTL ? "right" : "left" }]}>{paramData.otherPersonPhone}</Text>
                                    </View>
                                : null}
                            </View>
                        </View>
                    : null }

                    {paramData && paramData.carType ?
                    <View style={{ flexDirection: 'column', marginBottom: 10 }}>
                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flex: 1, alignItems: 'center' }}>
                            <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left',  }]}> {isRTL ? ": " : null}{t('car_details_title')} {isRTL ? null : " :"}</Text>
                            <View style={{ alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row', marginHorizontal: 10}}>
                                <Image source={paramData && paramData.carImage ? { uri: paramData.carImage } : require('../../assets/images/microBlackCar.png')} style={{ width: 40, height: 40, alignSelf: 'center', resizeMode: 'center', transform: [isRTL ? { scaleX: -1 } : { scaleX: 1 }] }} />
                                {paramData.carType ?
                                    <View style={{alignItems: 'center', marginHorizontal:10 }}>
                                        <Text style={[styles.textStyleBold, { textAlign: isRTL ? "right" : "left" }]}>{paramData.carType}</Text>
                                    </View>
                                : null}
                            </View>
                        </View>

                        <View style={[styles.vehicleDetails,{ flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            {paramData.vehicleModel ?
                                <View style={{ width: width / 3.2, alignItems:'center'}}>
                                    <Text style={[styles.textStyleBold, { textAlign: isRTL ? "right" : "left" }]}>{t('vehicle_model')}</Text>
                                    <Text style={[styles.textStyle, { textAlign: isRTL ? "right" : "left" }]}>{paramData.vehicleModel}</Text>
                                </View>
                            : null}

                            {paramData.vehicleMake ?
                                <View style={[styles.hbox2, { minHeight: 35 }]} />
                            : null}
                            {paramData.vehicleMake ?
                                <View style={{ width: width / 3.2, marginHorizontal: 3, alignItems:'center'}}>
                                    <Text style={[styles.textStyleBold, { textAlign: isRTL ? "right" : "left" }]}>{t('vehicle_make')}</Text>
                                    <Text style={[styles.textStyle, { textAlign: isRTL ? "right" : "left" }]}>{paramData.vehicleMake}</Text>
                                </View>
                            : null}             
                            {paramData.vehicle_number ?
                                <View style={[styles.hbox2, { minHeight: 35 }]} />
                            : null}
                            {paramData.vehicle_number ?
                                <View style={{ width: width / 3.2, marginHorizontal: 3, alignItems:'center'}}>
                                    <Text style={[styles.textStyleBold, { textAlign: isRTL ? "right" : "left" }]}>{t('vehicle_number')}</Text>
                                    <Text style={[styles.textStyle, { textAlign: isRTL ? "right" : "left" }]}>{paramData.vehicle_number}</Text>
                                </View>
                            :
                                <View style={{ flex: 1}}>
                                    <Text style={[styles.textStyleBold, { textAlign: isRTL ? "right" : "left" , marginBottom: 5}]}> {t('car_no_not_found')}</Text>
                                </View>
                            }
                        </View>
                    </View>
                    : null}

                    {paramData && ['PENDING', 'PAID', 'COMPLETE'].indexOf(paramData.status) != -1 ?
                        <View style={{ height: 'auto', marginTop: 10 }}>
                            <View style={[styles.billDetails,{ flexDirection: isRTL ? "row-reverse" : "row" }]}>
                                <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left' }]}>{t('bill_details_title')}</Text>
                                {paramData && paramData.payment_mode && paramData.status ?
                                    <View style={{ flexDirection: isRTL ? "row-reverse" : "row" }}>
                                        {paramData.payment_mode == 'cash' ?
                                            <MaterialCommunityIcons name="cash" size={28} color={colors.BLACK} />
                                            : paramData.payment_mode == 'card' ?
                                                <Feather name="credit-card" size={24} color="black" />
                                                :
                                                <AntDesign name="wallet" size={24} color="black" />
                                        }
                                        <View style={{ backgroundColor: colors.GREEN, padding: 3, borderRadius: 3, alignSelf: 'center', marginHorizontal: 5 }}>
                                            <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left', color: colors.WHITE, paddingHorizontal: 5 }]}>{t(paramData.status)}</Text>
                                        </View>
                                    </View>
                                    : null}
                            </View>

                            <View style={[styles.payRow,{ flexDirection: isRTL ? "row-reverse" : "row", marginTop: 10, paddingBottom: 5 }]}>
                                <Text style={[styles.textStyle,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >{t("your_trip")}</Text>
                                <Text style={[styles.textStyleBold,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >
                                {settings && settings.swipe_symbol && settings.symbol ?
                                    (parseFloat(paramData.trip_cost).toFixed(settings.decimal)) + " " + (settings.symbol)
                                : 
                                    (settings.symbol) + " " + (parseFloat(paramData.trip_cost).toFixed(settings.decimal))
                                }
                                </Text>
                            </View>

                            <View style={[styles.payRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: 'baseline', alignSelf:'center'}}>
                                    <Text style={[styles.textStyle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('discount')}</Text>
                                    <Text style={[styles.textStyle, { textAlign: isRTL ? 'right' : 'left', fontSize: 10 }]}> {t('promo_apply')}</Text>
                                </View>
                                <Text style={[styles.textStyleBold,{textAlign: isRTL ? "right" : "left", lineHeight: 50, color: colors.RED}]} >
                                    {settings && settings.swipe_symbol && settings.symbol?
                                        (isRTL ? '' : "-") + " " +(paramData && paramData.discount ? parseFloat(paramData.discount).toFixed(settings.decimal) : "0.00") + " " + (settings.symbol) + (isRTL ? "-" :'')
                                    :
                                        (isRTL ? '' : "-") +(settings.symbol) + " " +(paramData ? paramData.discount ? parseFloat(paramData.discount).toFixed(settings.decimal) : "0.00" : "0.00") + " " + (isRTL ? "-" :'')
                                    } 
                                </Text>
                            </View>


                            {paramData && paramData.cardPaymentAmount ? paramData.cardPaymentAmount > 0 ?
                                <View style={[styles.payRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                                    <Text style={[styles.textStyle,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >{t("CardPaymentAmount")}</Text>
                                    <Text style={[styles.textStyleBold,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >
                                    {settings && settings.swipe_symbol && settings.symbol ?
                                        (parseFloat(paramData.cardPaymentAmount).toFixed(settings.decimal)) + " " + (settings.symbol)
                                    : 
                                        (settings.symbol) + " " + (parseFloat(paramData.cardPaymentAmount).toFixed(settings.decimal))
                                    }
                                    </Text>
                                </View>
                            : null : null}

                            {paramData && paramData.cashPaymentAmount ? paramData.cashPaymentAmount > 0 ?
                                <View style={[styles.payRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                                    <Text style={[styles.textStyle,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >{t("CashPaymentAmount")}</Text>
                                    <Text style={[styles.textStyleBold,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >
                                    {settings && settings.swipe_symbol && settings.symbol ?
                                        (parseFloat(paramData.cashPaymentAmount).toFixed(settings.decimal)) + " " + (settings.symbol)
                                    : 
                                        (settings.symbol) + " " + (parseFloat(paramData.cashPaymentAmount).toFixed(settings.decimal))
                                    }
                                    </Text>
                                </View>
                            : null : null}

                            {paramData && paramData.usedWalletMoney ? paramData.usedWalletMoney > 0 ?
                                <View style={[styles.payRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                                    <Text style={[styles.textStyle,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >{t("WalletPayment")}</Text>
                                    <Text style={[styles.textStyleBold,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >
                                    {settings && settings.swipe_symbol && settings.symbol ?
                                        (parseFloat(paramData.usedWalletMoney).toFixed(settings.decimal)) + " " + (settings.symbol)
                                    : 
                                        (settings.symbol) + " " + (parseFloat(paramData.usedWalletMoney).toFixed(settings.decimal))
                                    }
                                    </Text>
                                </View>
                            : null : null} 

                            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", marginHorizontal: 10 }}>
                                <Text style={[styles.textStyleBold,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >{t("Customer_paid")}</Text>
                                <Text style={[styles.textStyleBold,{textAlign: isRTL ? "right" : "left", lineHeight: 50 }]} >
                                {settings && settings.swipe_symbol && settings.symbol ?
                                    <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left' }]}>{paramData && paramData.customer_paid ? parseFloat(paramData.customer_paid).toFixed(settings.decimal) : null} {settings.symbol}</Text>
                                :
                                    <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left' }]}>{settings.symbol} {paramData && paramData.customer_paid ? parseFloat(paramData.customer_paid).toFixed(settings.decimal) : null}</Text>
                                }
                                <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left' }]}>
                                </Text>
                                </Text>
                            </View>
                        </View>
                    : null}

                    {paramData.feedback ?
                        <View style={{flexDirection: isRTL ? 'row-reverse' : 'row'}}>
                            <View>
                                <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left',  }]}> {isRTL ? ": " : null}{t('feedback')} {isRTL ? null : " :"}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={[styles.textStyle, isRTL ? { marginRight: 6, textAlign: 'right' } : { marginLeft: 6, textAlign: 'left' }]}>{paramData.feedback}</Text>
                            </View>
                        </View>
                    :null }

                    <View style={styles.mapView}>
                        <View style={styles.mapcontainer}>
                            {paramData ?
                                <MapView style={styles.map}
                                    provider={PROVIDER_GOOGLE}
                                    region={{
                                        latitude: ((paramData.pickup.lat + paramData.drop.lat) / 2),
                                        longitude: ((paramData.pickup.lng + paramData.drop.lng) / 2),
                                        latitudeDelta: 0.3,
                                        longitudeDelta: 0.3
                                    }}
                                >
                                    <Marker
                                        coordinate={{ latitude: paramData ? (paramData.pickup.lat) : 0.00, longitude: paramData ? (paramData.pickup.lng) : 0.00 }}
                                        title={t('marker_title_1')}
                                        description={paramData ? paramData.pickup.add : null}>
                                        <Image source={require("../../assets/images/green_pin.png")} style={{height: 35, width:35 }} />
                                    </Marker>
                                    {paramData.waypoints && paramData.waypoints.length > 0 ? paramData.waypoints.map((point, index) => {
                                        return (
                                            <Marker
                                                coordinate={{ latitude: point.lat, longitude: point.lng }}
                                                title={t('marker_title_3')}
                                                description={point.add}
                                                key={index}
                                            >
                                                 <Image source={require("../../assets/images/rsz_2red_pin.png")} style={{height: 35, width:35 }} />
                                            </Marker>
                                        )
                                    })
                                        : null}
                                           <Marker
                                        coordinate={{ latitude: (paramData.drop.lat), longitude: (paramData.drop.lng) }}
                                        title={t('marker_title_2')}
                                        description={paramData.drop.add}>
                                        <Image source={require("../../assets/images/rsz_2red_pin.png")} style={{height: 35, width:35 }} />
                                    </Marker>
                                    {paramData.coords ?
                                            <Polyline
                                                coordinates={paramData.coords}
                                                strokeWidth={4}
                                                strokeColor={colors.INDICATOR_BLUE}
                                                geodesic={true}
                                            />
                                        : null}
                                </MapView>
                                : null}
                        </View>
                    </View>
                    {(paramData && paramData.status && auth.profile && auth.profile.uid &&
                        (((['PAYMENT_PENDING', 'NEW', 'ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING', 'PAID'].indexOf(paramData.status) != -1) && auth.profile.usertype == 'customer') ||
                            ((['ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED'].indexOf(paramData.status) != -1) && auth.profile.usertype == 'driver'))) ?
                            <Button
                                title={paramData.status == 'PAID' ? t('add_to_review') : paramData.status == 'PAYMENT_PENDING' ? t('paynow_button') : t('go_to_booking')}
                                loading={false}
                                loadingColor={{ color: colors.GREEN }}
                                buttonStyle={[styles.textStyleBold, { color: colors.WHITE }]}
                                style={{ backgroundColor: MAIN_COLOR, marginTop: 10, height: 50}}
                                btnClick={() => { goToBooking(paramData.id) }}
                            />
                    : null}
                </View>
            </ScrollView>
            {UserInfoModal()}
        </View>
    )

}

const styles = StyleSheet.create({
    vew: {
        borderRadius: 5,
        backgroundColor: colors.WHITE,
        shadowColor: colors.BUTTON_RIGHT,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 3,
        margin: 5,
        padding: 5
    },
    mapView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 180,
        marginTop: 10,
        borderRadius: 5,
        overflow: 'hidden'
    },
    mapcontainer: {
        flex: 1,
        width: width - 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    userView: {
        flexDirection: 'column'
    },
    mainView: {
        flex: 1,
        backgroundColor: colors.WHITE
    },
    hbox2: {
        width: 1,
        backgroundColor: MAIN_COLOR
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.BACKGROUND
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "flex-start",
        shadowColor: colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textContainerStyle: {
        flexDirection: 'column',
        marginBottom: 12,
    },
    multiAddressChar: {
        height: 20,
        width: 20,
        borderWidth: 1,
        backgroundColor: colors.SECONDARY,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 15,
        fontFamily: fonts.Regular
    },
    textStyleBold: {
        fontSize: 15,
        fontFamily: fonts.Bold
    },
    VehicleDetails: {
        width: "100%"
    },
    callView:{
        backgroundColor: MAIN_COLOR,
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3
    },
    modalBtn:{
        flexDirection: 'row',
        alignSelf: 'center',
        borderWidth: 1,
        minWidth: 80,
        padding: 5,
        justifyContent: 'center',
        borderRadius: 10
    },
    details:{
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: .6,
        borderBottomColor: MAIN_COLOR 
    },
    section:{
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    clock:{
        flex: 1, 
        justifyContent: 'space-around',
        alignItems: 'center',
        minHeight: 60
    },
    driverDetails:{
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
        paddingVertical: 10 
    },
    vehicleDetails:{
        flex: 1,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBlockColor: colors.FOOTERTOP,
        paddingBottom: 10
    },
    billDetails:{
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10
    },
    payRow:{
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: colors.FOOTERTOP,
        marginHorizontal: 10
    }
});