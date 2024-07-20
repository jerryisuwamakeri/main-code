import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions, Modal, Linking, Alert, Animated, TouchableWithoutFeedback,Platform } from 'react-native';
import { colors } from '../common/theme';
import i18n from 'i18n-js';
import { useSelector } from 'react-redux';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import moment from 'moment/min/moment-with-locales';
import { MAIN_COLOR } from '../common/sharedFunctions';
var { width, height } = Dimensions.get('window');
import { Ionicons, Entypo, Fontisto, AntDesign, Octicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import StarRating from 'react-native-star-rating-widget';
import Button from '../components/Button';
import { appConsts } from '../common/sharedFunctions';
import RNPickerSelect from '../components/RNPickerSelect';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Emptylist from './Emptylist';
import { fonts } from '../common/font';

export default function RideList(props) {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    //const isRTL = true;
    const settings = useSelector(state => state.settingsdata.settings);
    const [tabIndex, setTabIndex] = useState(props.tabIndex);
    const auth = useSelector(state => state.auth);


    const [scaleAnim] = useState(new Animated.Value(0))
    useEffect(() => {
        Animated.spring(
            scaleAnim,
            {
                toValue: 1,
                friction: 3,
                useNativeDriver: true
            }
        ).start();
    }, [])

    const onPressButton = (item, index) => {
        props.onPressButton(item, index)
    }

    const onPressAction = (item, index) => {
        props.onPressAction(item, index)
    }

    const onChatAction = (item, index) => {
        props.onChatAction(item, index)
    }

    const [role, setRole] = useState();
    const [userInfoModalStatus, setUserInfoModalStatus] = useState(false);

    useEffect(() => {
        if (auth.profile && auth.profile.usertype) {
            setRole(auth.profile.usertype);
        } else {
            setRole(null);
        }
    }, [auth.profile]);

    const onPressCall = (phoneNumber) => {
        let call_link = Platform.OS == 'android' ? 'tel:' + phoneNumber : 'telprompt:' + phoneNumber;
        Linking.openURL(call_link);
    }

    const onAlert = (item) => {
        Alert.alert(t('alert'), t('booking_is') + item.status + "." + t('not_call'));
    }
    
    const onChatAlert = (item) => {
        Alert.alert(t('alert'), t('booking_is') + item.status + "." + t('not_chat'));
    }

    const goHome = () => {
        props.goHome()
    }

    const renderData = ({ item, index }) => {
        return (

            <TouchableOpacity activeOpacity={0.8} onPress={() => onPressButton(item, index)} style={[styles.BookingContainer, styles.elevation]} >
                <View style={[styles.box, { padding: 15 },]}>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flex: 1 }}>
                        <View style={{ flexDirection: 'column', flex: 1 }}>
                            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                <View style={{ width: 30, alignItems: 'center' }}>
                                    <Ionicons name="location-outline" size={24} color={colors.BALANCE_GREEN} />
                                    <View style={[styles.hbox2, { flex: 1, minHeight: 5 }]} />
                                </View>
                                <View style={{ flex: 1, marginBottom: 10 }}>
                                    <Text style={[styles.textStyle, isRTL ? { marginRight: 6, textAlign: 'right' } : { marginLeft: 6, textAlign: 'left' }]}>{item.pickup.add} </Text>
                                </View>
                            </View>

                            {item && item.waypoints && item.waypoints.length > 0 ?
                                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                    <View style={{ width: 30, alignItems: 'center' }}>
                                        <Ionicons name="location-outline" size={24} color={colors.BOX_BG} />

                                        <View style={[styles.hbox2, { flex: 1, minHeight: 5 }]} />
                                    </View>
                                    <View style={{ flex: 1, marginBottom: 10 }}>
                                        <Text style={[styles.textStyle, isRTL ? { marginRight: 6, textAlign: 'right' } : { marginLeft: 6, textAlign: 'left' }]}>{item.waypoints.length} {t('stops')}</Text>
                                    </View>
                                </View>
                                : null}

                            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                <View style={{ width: 30, alignItems: 'center' }}>
                                    <Ionicons name="location-outline" size={24} color={colors.BUTTON_ORANGE} />
                                </View>
                                <View style={{ flex: 1, marginBottom: 10 }}>
                                    <Text style={[styles.textStyle, isRTL ? { marginRight: 6, textAlign: 'right' } : { marginLeft: 6, textAlign: 'left' }]}>{item.drop.add}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', flex: 1, minHeight: 60 }}>
                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flex: 1, minHeight: 60 }}>
                            <View style={[styles.details, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Text style={{ fontFamily:fonts.Bold, fontSize: 24, color: MAIN_COLOR, opacity: 0.8 }}>{settings.symbol}</Text>
                                <Text style={styles.textStyleBold}>{item && item.trip_cost > 0 ? parseFloat(item.trip_cost).toFixed(settings.decimal) : item && item.estimate ? parseFloat(item.estimate).toFixed(settings.decimal) : 0}</Text>
                            </View>
                            <View style={[styles.hbox2, { minHeight: 5, width: 1, margin: 2 }]} />
                            <View style={[styles.details, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                <Fontisto name="map" size={26} color={MAIN_COLOR} style={{ opacity: 0.8 }} />
                                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                    <Text style={styles.textStyleBold}>{item && item.distance > 0 ? parseFloat(item.distance).toFixed(settings.decimal) : 0}</Text>
                                    <Text style={styles.textStyle}> {settings && settings.convert_to_mile ? t("mile") : t("km")} </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flex: 1, minHeight: 60 }}>
                            <View style={[styles.details, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomWidth: 0 }]}>
                                <Octicons name="clock" size={26} color={MAIN_COLOR} style={{ opacity: 0.8 }} />
                                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                    <Text style={styles.textStyleBold}>{(item && item.total_trip_time && item.total_trip_time > 0 ? parseFloat(item.total_trip_time / 60).toFixed(0) == 0 ? "1" : parseFloat(item.total_trip_time / 60).toFixed(0) : parseFloat(item.estimateTime / 60).toFixed(0))}</Text>
                                    <Text style={styles.textStyle}> {t("mins")} </Text>
                                </View>
                            </View>
                            <View style={[styles.hbox2, { minHeight: 5, width: 1, margin: 2 }]} />
                            <View style={[styles.clock, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                {item && item.trip_start_time && item.trip_end_time ?
                                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                        <View style={[styles.section, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <Ionicons name="location-outline" size={28} color={colors.BALANCE_GREEN} />
                                            <View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={styles.textStyleBold}>{item && item.trip_start_time ? (item.trip_start_time).substring(0, ((item.trip_start_time).indexOf(":"))).length == 2 ? (item.trip_start_time).substring(0, ((item.trip_start_time).indexOf(":"))) : "0" + (item.trip_start_time).substring(0, ((item.trip_start_time).indexOf(":"))) : ""}</Text>
                                                    <Text style={styles.textStyleBold}>{item && item.trip_start_time ? (item.trip_start_time).substring(((item.trip_start_time).indexOf(":") + 1), ((item.trip_start_time).lastIndexOf(":"))).length == 2 ? (item.trip_start_time).substring(((item.trip_start_time).indexOf(":")), ((item.trip_start_time).lastIndexOf(":"))) : ":0" + (item.trip_start_time).substring(((item.trip_start_time).indexOf(":") + 1), ((item.trip_start_time).lastIndexOf(":"))) : ""}</Text>
                                                </View>
                                                <Text style={{ textAlign: isRTL ? "right" : "left", fontSize: 8 }}>{item.startTime ? moment(item.startTime).format('ll') : ''}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.section, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <Ionicons name="location-outline" size={28} color={colors.BUTTON_ORANGE} />
                                            <View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={styles.textStyleBold}>{item && item.trip_end_time ? (item.trip_end_time).substring(0, ((item.trip_end_time).indexOf(":"))).length == 2 ? (item.trip_end_time).substring(0, ((item.trip_end_time).indexOf(":"))) : "0" + (item.trip_end_time).substring(0, ((item.trip_end_time).indexOf(":"))) : ""}</Text>
                                                    <Text style={styles.textStyleBold}>{item && item.trip_end_time ? (item.trip_end_time).substring(((item.trip_end_time).indexOf(":") + 1), ((item.trip_end_time).lastIndexOf(":"))).length == 2 ? (item.trip_end_time).substring(((item.trip_end_time).indexOf(":")), ((item.trip_end_time).lastIndexOf(":"))) : ":0" + (item.trip_end_time).substring(((item.trip_end_time).indexOf(":") + 1), ((item.trip_end_time).lastIndexOf(":"))) : ""}</Text>
                                                </View>
                                                <Text style={{ textAlign: isRTL ? "right" : "left", fontSize: 8 }}>{item.endTime ? moment(item.endTime).format('ll') : ''}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    : item && item.trip_start_time ?
                                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                            <View style={[styles.section, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                                <Ionicons name="location-outline" size={28} color={colors.BALANCE_GREEN} />
                                                <View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={styles.textStyleBold}>{item && item.trip_start_time ? (item.trip_start_time).substring(0, ((item.trip_start_time).indexOf(":"))).length == 2 ? (item.trip_start_time).substring(0, ((item.trip_start_time).indexOf(":"))) : "0" + (item.trip_start_time).substring(0, ((item.trip_start_time).indexOf(":"))) : ""}</Text>
                                                        <Text style={styles.textStyleBold}>{item && item.trip_start_time ? (item.trip_start_time).substring(((item.trip_start_time).indexOf(":") + 1), ((item.trip_start_time).lastIndexOf(":"))).length == 2 ? (item.trip_start_time).substring(((item.trip_start_time).indexOf(":")), ((item.trip_start_time).lastIndexOf(":"))) : ":0" + (item.trip_start_time).substring(((item.trip_start_time).indexOf(":") + 1), ((item.trip_start_time).lastIndexOf(":"))) : ""}</Text>
                                                    </View>
                                                    <Text style={{ textAlign: isRTL ? "right" : "left", fontSize: 8 }}>{item.startTime ? moment(item.startTime).format('ll') : ''}</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.section, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                                <Ionicons name="location-outline" size={28} color={colors.BUTTON_ORANGE} />
                                                <Image source={require('../../assets/images/clock.gif')} style={{ width: 25, height: 25, alignSelf: 'center', resizeMode: 'center' }} />
                                            </View>
                                        </View>
                                        :
                                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                            <Text style={styles.textStyleBold}>{item && item.reason ? item.reason : t(item.status).toUpperCase()}</Text>
                                        </View>
                                }
                            </View>
                        </View>
                    </View>

                    {item ?
                        <View style={[styles.driverDetails, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', flex: 1 }}>
                                {item ?
                                    (!(item.driver_image == '' || item.driver_image == null || item.driver_image == 'undefined') && auth.profile.usertype == 'customer') ?
                                        <Avatar
                                            size="medium"
                                            rounded
                                            source={{ uri: item.driver_image }}
                                            activeOpacity={0.7}
                                        />
                                        :
                                        (!(item.customer_image == '' || item.customer_image == null || item.customer_image == 'undefined') && auth.profile.usertype == 'driver') ?
                                            <Avatar
                                                size="medium"
                                                rounded
                                                source={{ uri: item.customer_image }}
                                                activeOpacity={0.7}
                                            />
                                            : item.driver_name != '' ?

                                                <Avatar
                                                    size="medium"
                                                    rounded
                                                    source={require('../../assets/images/profilePic.png')}
                                                    activeOpacity={0.7}
                                                /> : null
                                    : null}
                                <View style={[styles.userView, { flex: 1, marginHorizontal: 5 }]}>
                                    {item && item.driver_name != '' && auth.profile.usertype == 'customer' ? <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left' }]}>{item.driver_name ? item.driver_name : t('no_name')}</Text> : null}

                                    {item && item.customer_name != '' && auth.profile.usertype == 'driver' ? <Text style={[styles.textStyleBold, { textAlign: isRTL ? 'right' : 'left' }]}>{item.customer_name ? item.customer_name : t('no_name')}</Text> : null}

                                    {item && item.rating > 0 && item.driver_name && auth.profile.usertype == 'customer'?
                                        <View>
                                            <StarRating
                                                maxStars={5}
                                                starSize={15}
                                                enableHalfStar={true}
                                                color={MAIN_COLOR}
                                                emptyColor={MAIN_COLOR}
                                                rating={item && item.rating ? parseFloat(item.rating) : 0}
                                                style={[styles.contStyle, isRTL ? { marginRight: 0, transform: [{ scaleX: -1 }] } : { marginLeft: -8 }]}
                                                onChange={() => {
                                                    //console.log('hello')
                                                }}
                                            />
                                        </View>
                                        : null}
                                </View>
                            </View>
                            {item && ((item.driver_contact || item.customer_contact)) ?
                                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => (['ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING'].indexOf(item.status) != -1) ? role == 'customer' ? 
                                            onPressCall(item.driver_contact) : (item.otherPersonPhone && item.otherPersonPhone.length > 0 ? onPressCall(item.otherPersonPhone) : onPressCall(item.customer_contact)) : onAlert(item)} 
                                            style={{ backgroundColor: MAIN_COLOR, height: 40, width: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', margin: 3 }}>
                                        <Ionicons name="call" size={24} color={colors.WHITE} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => (['ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING'].indexOf(item.status) != -1) ? onChatAction(item, index) : onChatAlert(item)} style={{ backgroundColor: MAIN_COLOR, height: 40, width: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', margin: 3 }}>
                                        <Ionicons name="chatbubble-ellipses-sharp" size={24} color={colors.WHITE} />
                                    </TouchableOpacity>
                                </View>
                                : null}
                        </View>
                        : null}

                    {(item && item.status && auth.profile && auth.profile.uid &&
                        (((['PAYMENT_PENDING', 'NEW', 'ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING', 'PAID'].indexOf(item.status) != -1) && auth.profile.usertype == 'customer') ||
                            ((['ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED'].indexOf(item.status) != -1) && auth.profile.usertype == 'driver'))) ?
                            <Button
                                title={item.status == 'PAID' ? t('add_to_review') : item.status == 'PAYMENT_PENDING' ? t('paynow_button') : t('go_to_booking')}
                                loading={false}
                                loadingColor={{ color: colors.GREEN }}
                                buttonStyle={[styles.textStyleBold, { color: colors.WHITE }]}
                                style={{ backgroundColor: MAIN_COLOR, marginVertical: 10 }}
                                btnClick={() => { onPressAction(item, index) }}
                            />
                        : null}

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
                                    {item && item.deliveryPersonPhone ?
                                        <View style={[styles.textContainerStyle, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                                            <Text style={styles.textStyleBold}>{t('senderPersonPhone')}</Text>
                                            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginVertical: 10 }}>
                                                <Ionicons name="call" size={24} color={colors.BLACK} />
                                                <Text style={styles.textContent1} onPress={() => onPressCall(item.deliveryPersonPhone)}> {item.deliveryPersonPhone} </Text>
                                            </View>
                                        </View>
                                        : null}
                                    {item && item.customer_contact ?
                                        <View style={[styles.textContainerStyle, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                                            <Text style={styles.textStyleBold}>{t('senderPersonPhone')}</Text>
                                            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginVertical: 10 }}>
                                                <Ionicons name="call" size={24} color={colors.BLACK} />
                                                <Text style={styles.textContent1} onPress={() => onPressCall(item.customer_contact)}> {item.customer_contact} </Text>
                                            </View>
                                        </View>
                                        : null}
                                </View>
                                <TouchableOpacity
                                    loading={false}
                                    onPress={() => setUserInfoModalStatus(false)}
                                    style={styles.modalBtn}
                                >
                                    <Text style={styles.textStyleBold}>{t('ok')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </TouchableOpacity>


        )
    }
    return (
        <View style={styles.textView3}>
            <View style={{ backgroundColor: MAIN_COLOR }}>
                <SegmentedControlTab
                    values={[t('active_booking'), t('COMPLETE'), t('CANCELLED')]}
                    selectedIndex={tabIndex}
                    onTabPress={(index) => setTabIndex(index)}
                    borderRadius={0}
                    tabsContainerStyle={[styles.segmentcontrol, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                    tabStyle={{
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                        borderColor:colors.WHITE
                    }}
                    activeTabStyle={{ borderBottomColor: colors.WHITE, backgroundColor: 'transparent', borderBottomWidth: 1.5 }}
                    tabTextStyle={{ color: appConsts.canCall ? colors.BORDER_TEXT : colors.PROFILE_PLACEHOLDER_CONTENT, fontFamily:fonts.Bold }}
                    activeTabTextStyle={{ color: colors.WHITE }}
                />
                <View style={{ height: '100%' }}>
                    <View style={{ height: 5 }} />
                    <View style={styles.listView}>
                        <View style={{ marginTop: 5, flex: 1, marginBottom: 100 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={true}
                                keyExtractor={(item, index) => index.toString()}
                                data={tabIndex === 0 ? props.data.filter(item => !(item.status === 'CANCELLED' || item.status === 'COMPLETE')) : (tabIndex === 1 ? props.data.filter(item => item.status === 'COMPLETE') : props.data.filter(item => item.status === 'CANCELLED'))}
                                renderItem={renderData}
                                ListEmptyComponent={
                                    <View style={[styles.emptyListContainer, { marginTop: height / 2.8 }]}>
                                        <View style={styles.emptyBox}  >
                                            <Text style={styles.emptyText} >{t('no_data_available')}</Text>
                                        </View>
                                    </View>

                                }
                            />
                        </View>
                    </View>
                </View>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    BookingContainer: {
        margin: 10,
        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 1,
    },
    box: {
        backgroundColor: colors.WHITE,
        borderRadius: 10,
    },
    elevation: {
        elevation: 5
    },
    dateStyle: {
        fontFamily:fonts.Bold,
        color: colors.HEADER,
        fontSize: 18
    },
    textView3: {
        flex: 1,
        backgroundColor: MAIN_COLOR
    },
    segmentcontrol: {
        color: colors.WHITE,
        fontSize: 18,
        fontFamily:fonts.Regular,
        marginTop: 0,
        alignSelf: "center",
        height: 50
    },
    location: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 6,
        marginHorizontal: 5
    },
    hbox2: {
        width: 1,
        backgroundColor: MAIN_COLOR
    },
    textStyle: {
        fontSize: 16,
        fontFamily:fonts.Regular
    },
    textStyleBold: {
        fontSize: 16,
        fontFamily: fonts.Bold
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
    details: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: .6,
        borderBottomColor: MAIN_COLOR
    },
    clock: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        minHeight: 60
    },
    section: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    driverDetails: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
        paddingVertical: 10
    },
    modalBtn: {
        flexDirection: 'row',
        alignSelf: 'center',
        borderWidth: 1,
        minWidth: 80,
        padding: 5,
        justifyContent: 'center',
        borderRadius: 10
    },
    listView: {
        flex: 1,
        backgroundColor: colors.WHITE,
        width: '100%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    emptyListContainer: {
        width: width,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyBox: {
        backgroundColor: MAIN_COLOR,
        borderRadius: 10
    },
    emptyText: {
        fontFamily: fonts.Bold,
        color: colors.WHITE,
        padding: 15,
        fontSize: 18
    },
    textContent1:{
        fontFamily:fonts.Regular
    }
});