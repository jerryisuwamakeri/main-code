import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Animated } from 'react-native';
import { colors } from '../common/theme';
import i18n from 'i18n-js';
import { useSelector } from 'react-redux';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { MAIN_COLOR } from '../common/sharedFunctions';
var { width, height } = Dimensions.get('window');
import moment from 'moment/min/moment-with-locales';
import { fonts } from '../common/font';
import { Ionicons, AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function DriverEarningRidelist(props) {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
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

    const [role, setRole] = useState();

    useEffect(() => {
        if (auth.profile && auth.profile.usertype) {
            setRole(auth.profile.usertype);
        } else {
            setRole(null);
        }
    }, [auth.profile]);

    const renderData = ({ item, index }) => {
        return (
            <View activeOpacity={0.8} style={[styles.BookingContainer,styles.elevation]} >
                <View style={[styles.box,{  padding: 5 },]}>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flex: 1, margin: 10, justifyContent:'space-between'}}>
                        <View style={{justifyContent: 'center'}}>
                            <Text style={styles.textStyleBold}>{item.endTime ? moment(item.endTime).format('lll') : ''}</Text>
                        </View>
                        <View style={{justifyContent: 'center'}}>
                            {item.payment_mode == 'cash' ?
                                <MaterialCommunityIcons name="cash" size={28} color={colors.BLACK} />
                                : item.payment_mode == 'card' ?
                                    <Feather name="credit-card" size={24} color="black" />
                                    :
                                    <AntDesign name="wallet" size={24} color="black" />
                            }
                        </View>
                        <View style={{ justifyContent: 'center'}}>
                            {settings.swipe_symbol === false ?
                                <Text style={styles.textStyleBold}>{settings.symbol}{item.driver_share?parseFloat(item.driver_share).toFixed(settings.decimal):'0'}</Text>
                            :
                                <Text style={styles.textStyleBold}>{item.driver_share?parseFloat(item.driver_share).toFixed(settings.decimal):'0'}{settings.symbol}</Text>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flex: 1, marginTop: 5 }}>
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

                </View>
            </View>
        )
    }

    return (
        <View style={styles.textView3}>
            <SegmentedControlTab
                values={[t('daily'), t('thismonth'), t('thisyear')]}
                selectedIndex={tabIndex}
                onTabPress={(index) => setTabIndex(index)}
                borderRadius={0}
                tabsContainerStyle={[styles.segmentcontrol, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                tabStyle={{
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                    borderColor:MAIN_COLOR
                }}
                activeTabStyle={{ borderBottomColor: colors.RED, backgroundColor: 'transparent', borderBottomWidth: 1.5 }}
                tabTextStyle={{ color: colors.FOOTERTOP, fontFamily:fonts.Bold }}
                activeTabTextStyle={{ color: colors.BLACK }}
            />

            <View style={{flex: 1}}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    keyExtractor={(item, index) => index.toString()}
                    data={tabIndex === 0 ? props.data.filter(item => ((new Date(item.endTime).getDate() == new Date().getDate()) && (item.status === 'PAID' || item.status === 'COMPLETE'))) : (tabIndex === 1 ? props.data.filter(item => ((new Date(item.endTime).getMonth() == new Date().getMonth()) && (item.status === 'PAID' || item.status === 'COMPLETE'))) : props.data.filter(item => ((new Date(item.endTime).getFullYear() == new Date().getFullYear()) && (item.status === 'PAID' || item.status === 'COMPLETE'))))}
                    renderItem={renderData}
                    ListEmptyComponent={
                        <View style={{marginTop: height/3.5, justifyContent:'center', alignItems:'center' }}>
                            <View style={{height: 50, minWidth: 150, borderRadius: 10, backgroundColor: MAIN_COLOR, justifyContent:'center', alignItems:'center' }}>
                                <Text style={[styles.textStyleBold,{color: colors.WHITE}]}>{t('no_data_available')}</Text>
                            </View>
                        </View>
                    }
                />
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    // textStyle: {
    //     fontSize: 18,
    // },
    BookingContainer:{
    margin:10,
    borderRadius:10,
    
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
        
        // shadowOffset: {
        //     width: 0,
        //     height: 0,
        //   },
        //   shadowOpacity: 1,
        //   shadowRadius: 0.5,
        //   shadowColor: 'white',
    },
    elevation:{
        elevation:5

    },
    
    vew: {
        shadowColor: colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2,
        elevation: 2,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        backgroundColor: colors.new,
        height: 60,

    },
    iconClickStyle: {
        //flex: 1,
        alignSelf: 'center',
        shadowColor: colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2,
        elevation: 2,
        borderRadius: 15, backgroundColor: colors.WHITE,
        margin: 10,
    },
    picPlaceStyle: {
        color: colors.HEADER,
        marginHorizontal: 15
    },
    dateStyle: {
        fontFamily: fonts.Bold,
        color: colors.HEADER,
        fontSize: 18
    },
    textView3: {
        flex: 1
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
    
    fare: {
        width: (width - 35) / 4,
        backgroundColor: colors.WHITE,
        borderRadius: 5,
        paddingHorizontal: 3,
        height: 'auto',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 5
    },
    shadow:{
        shadowColor: colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 5,
    },
    hbox2: {
        width: 1,
        backgroundColor: colors.MAP_TEXT
    },
    textStyle: {
        fontSize: 15,
        fontFamily: fonts.Regular
    },
    textStyleBold: {
        fontSize: 15,
        fontFamily: fonts.Bold
    },
    multiAddressChar: {
        height: 10,
        width: 10,
        borderWidth: 1,
        backgroundColor: colors.BLACK,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
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
    }
});