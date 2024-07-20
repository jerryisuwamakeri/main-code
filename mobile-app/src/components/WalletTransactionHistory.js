import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'
import { colors } from '../common/theme';
import i18n from 'i18n-js';
import { useSelector } from 'react-redux';
import moment from 'moment/min/moment-with-locales';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { MAIN_COLOR,SECONDORY_COLOR } from '../common/sharedFunctions';
import { fonts } from '../common/font';
var { height, width } = Dimensions.get('window');

export default function  WTransactionHistory(props) {
    const [data,setData] = useState(null);
    const settings = useSelector(state => state.settingsdata.settings);
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(()=>{
        if(props.walletHistory && props.walletHistory.length>0){
            setData(props.walletHistory);
        } else{
            setData([]);
        }
    },[props.walletHistory]);

    useEffect(()=>{
        if(data && data.length > 0){
            const lastStatus = data[0].type;
            if(lastStatus == 'Debit') setTabIndex(1);
            if(lastStatus == 'Withdraw' && settings.RiderWithDraw) setTabIndex(2);
        }else{
            setTabIndex(0);
        }
    },[data]);

    const newData = ({ item }) => {
        return (
            <View style={styles.container}>

                <View style={[styles.divCompView, { flexDirection: isRTL ? 'row-reverse' : 'row',backgroundColor:colors.WHITE}]}>
                    <View style={styles.containsView}>
                        <View style={[styles.statusStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                            {item.type == 'Credit' ?
                                <View style={[styles.icon, isRTL ? { marginRight: 10 } : { marginLeft: 10 },{backgroundColor:colors.GREEN}]}>
                                    <Icon
                                        iconStyle={styles.debiticonPositionStyle}
                                        name={isRTL ? 'keyboard-arrow-right' : 'keyboard-arrow-left'}
                                        type='MaterialIcons'
                                        size={32}
                                        color={colors.WHITE}
                                    />

                                </View>
                                : null}
                            {item.type == 'Debit' ?
                                <View style={[styles.icon, isRTL ? { marginRight: 10 } : { marginLeft: 10 },{backgroundColor:colors.RED}]}>
                                    <Icon
                                        iconStyle={styles.crediticonPositionStyle}
                                        name={isRTL ? 'keyboard-arrow-left' : 'keyboard-arrow-right'}
                                        type='MaterialIcons'
                                        size={32}
                                        color={colors.WHITE}
                                    />
                                </View>
                                : null}
                            {item.type == 'Withdraw' ?
                                <View style={[styles.icon, isRTL ? { marginRight: 10 } : { marginLeft: 10 },{backgroundColor:MAIN_COLOR}]}>
                                    <Icon
                                        iconStyle={styles.crediticonPositionStyle}
                                        name='keyboard-arrow-down'
                                        type='MaterialIcons'
                                        size={32}
                                        color={colors.WHITE}
                                    />
                                </View>
                                : null}
                            <View style={[styles.statusView, isRTL ? { marginRight: 10 } : { marginLeft: 10 }]}>
                                {item.type && item.type == 'Credit' ?
                                    settings.swipe_symbol === false ?
                                        <Text style={[styles.historyamounttextStyle, { textAlign: isRTL ? "right" : "left" }]}>{t('credited') + ' ' + settings.symbol + parseFloat(item.amount).toFixed(settings.decimal)}</Text>
                                        :
                                        <Text style={[styles.historyamounttextStyle, { textAlign: isRTL ? "right" : "left" }]}>{t('credited') + ' ' + parseFloat(item.amount).toFixed(settings.decimal) + settings.symbol}</Text>
                                    : null}
                                {item.type && item.type == 'Debit' ?
                                    settings.swipe_symbol === false ?
                                        <Text style={[styles.historyamounttextStyle, { textAlign: isRTL ? "right" : "left" }]}>{t('debited') + ' ' + settings.symbol + parseFloat(item.amount).toFixed(settings.decimal)}</Text>
                                        :
                                        <Text style={[styles.historyamounttextStyle, { textAlign: isRTL ? "right" : "left" }]}>{t('debited') + ' ' + parseFloat(item.amount).toFixed(settings.decimal) + settings.symbol}</Text>
                                    : null}
                                {item.type && item.type == 'Withdraw' ?
                                    settings.swipe_symbol === false ?
                                        <Text style={[styles.historyamounttextStyle, { textAlign: isRTL ? "right" : "left" }]}>{t('withdrawn') + ' ' + settings.symbol + parseFloat(item.amount).toFixed(settings.decimal)}</Text>
                                        :
                                        <Text style={[styles.historyamounttextStyle, { textAlign: isRTL ? "right" : "left" }]}>{t('withdrawn') + ' ' + parseFloat(item.amount).toFixed(settings.decimal) + settings.symbol}</Text>
                                    : null}
                                    <View style={{width: width-100}}>
                                    <Text style={[styles.textStyle2, { textAlign: isRTL ? "right" : "left",  fontWeight: '500', }]}>{t('transaction_id')} {item.txRef.startsWith('wallet') ? item.transaction_id : item.txRef}</Text>
                                    </View>
                                <Text style={[styles.textStyle2, { textAlign: isRTL ? "right" : "left" }]}>{moment(item.date).format('lll')}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
    return (
        <View  style={{marginTop:15,flex:1}}>
             <SegmentedControlTab
                    values={props.role && props.role == 'driver' || settings.RiderWithDraw ? [t('credited'), t('debited'), t('withdrawn')] 
                        : [t('credited'),  t('debited')] }
                    selectedIndex={tabIndex}
                    onTabPress={(index) => setTabIndex(index)}
                    borderRadius={0}
                    tabsContainerStyle={[styles.segmentcontrol,{flexDirection:isRTL?'row-reverse':'row'}]}
                    tabStyle={{
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                        borderColor:MAIN_COLOR
                    }}
                    activeTabStyle={{ borderBottomColor: colors.HEADER, backgroundColor: 'transparent', borderBottomWidth: 1.5 }}
                    tabTextStyle={{ color: colors.FOOTERTOP,fontFamily: fonts.Bold}}
                    activeTabTextStyle={{ color: MAIN_COLOR }}
                />
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={data && data.length> 0? (tabIndex === 0 ? data.filter(item => !(item.type === 'Debit' || item.type === 'Withdraw')) : (tabIndex === 1 ? data.filter(item => item.type === 'Debit') : data.filter(item => item.type === 'Withdraw'))): []}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                renderItem={newData}
                ListEmptyComponent={
                    <View style={{marginTop: height/3.5, justifyContent:'center', alignItems:'center', }}>
                        <View style={{height: 50, minWidth: 150, borderRadius: 10, backgroundColor: MAIN_COLOR, justifyContent:'center', alignItems:'center',paddingHorizontal:5 }}>
                            <Text style={[{color: colors.WHITE, fontFamily:fonts.Regular}]}>{t('no_data_available')}</Text>
                        </View>
                    </View>
                }
            />
        </View>
    );

};
const styles = StyleSheet.create({  
    container: {
        flex: 1
    },
    divCompView: {
        minHeight: 80,
        marginHorizontal: 10,
        marginVertical: 8,
        flexDirection: 'row',
        flex: 1,
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    icon: {
        height: 40,
        width: 40,
        borderRadius: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: colors.new,
        padding: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    containsView: {
        justifyContent: 'center',
    },

    statusStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusView: {
        marginLeft: 10,
    },
    historyamounttextStyle: {
        fontSize: 16,
        fontFamily: fonts.Bold,
    },
    textStyle2: {
        fontSize: 14,
        fontFamily: fonts.Regular,
        color: colors.HEADER
    },
    textColor: {
        color: colors.WALLET_PRIMARY,
        alignSelf: 'center',
        fontSize: 12,
        fontFamily: fonts.Regular,
        paddingLeft: 5
    },
    textFormat: {
        flex: 1,
        width: Dimensions.get("window").width - 100
    },
    cabLogoStyle: {
        width: 25,
        height: 28,
        flex: 1,
    },
    clockIconStyle: {
        flexDirection: 'row',
        marginTop: 8
    },
    debiticonPositionStyle: {
        alignSelf: 'flex-start',
    },
    crediticonPositionStyle: {
        alignSelf: 'flex-start',
    },
    segmentcontrol: {
        color: colors.WHITE,
        fontSize: 18,
        fontFamily: fonts.Regular,
        marginTop: 0,
        alignSelf: "center",
        height: 50
    }

});