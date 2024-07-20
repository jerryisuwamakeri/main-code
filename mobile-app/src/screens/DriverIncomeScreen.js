import React, { useState, useEffect } from 'react';
import { colors } from '../common/theme';
import {
    StyleSheet,
    View,
    Text,
    Dimensions
} from 'react-native';
import i18n from 'i18n-js';
import { useSelector } from 'react-redux';
import { MAIN_COLOR } from '../common/sharedFunctions';
var { width, height } = Dimensions.get('window');
import { DriverEarningRidelist } from '../components';
import { fonts } from '../common/font';

export default function DriverIncomeScreen(props) {

    const bookings = useSelector(state => state.bookinglistdata.bookings);
    const settings = useSelector(state => state.settingsdata.settings);
    const [totalEarning, setTotalEarning] = useState(0);
    const [today, setToday] = useState(0);
    const [thisMonth, setThisMonth] = useState(0);
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;

    const [bookingData,setBookingData] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(()=>{
        if(bookings){
            setBookingData(bookings);
            setTabIndex(0);
        }else{
            setBookingData([]);
            setTabIndex(0);
        }
    },[bookings]);

    const [bookingCount, setBookingCount] = useState();

    useEffect(() => {
        if (bookings) {
            let today = new Date();
            let tdTrans = 0;
            let mnTrans = 0;
            let totTrans = 0;
            let count = 0;
            for (let i = 0; i < bookings.length; i++) {
                if (bookings[i].status === 'PAID' || bookings[i].status === 'COMPLETE') {
                    const { tripdate, driver_share } = bookings[i];
                    let tDate = new Date(tripdate);
                    if (driver_share != undefined) {
                        if (tDate.getDate() === today.getDate() && tDate.getMonth() === today.getMonth()) {
                            tdTrans = tdTrans + parseFloat(driver_share);
                        }
                        if (tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear()) {
                            mnTrans = mnTrans + parseFloat(driver_share);
                        }
                        totTrans = totTrans + parseFloat(driver_share);
                        count = count + 1;
                    }
                }
            }
            setTotalEarning(totTrans.toFixed(settings.decimal));
            setToday(tdTrans.toFixed(settings.decimal));
            setThisMonth(mnTrans.toFixed(settings.decimal));
            setBookingCount(count);
        } else {
            setTotalEarning(0);
            setToday(0);
            setThisMonth(0);
            setBookingCount(0);
        }
    }, [bookings]);

    return (
        <View style={styles.mainView}>
            <View style={[styles.vew1,{marginBottom: 5, alignSelf:'center', alignContent:'center', alignItems:'center'}]}>     
               
                <View style={{flexDirection:isRTL? 'row-reverse':'row', width:'100%', justifyContent:'space-around', padding: 10, borderBottomWidth: 1, borderBlockColor: colors.FOOTERTOP}}>
                    <View style={{ justifyContent:'center', alignItems:'center'}}>
                        <Text style={styles.textStyle}>{t('booking_count')}</Text>
                        <View>
                            <Text style={[styles.textStyleBold]}>{bookingCount}</Text>
                        </View>
                    </View>

                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={styles.textStyle}>{t('today_text')}</Text>
                        <View >
                            {settings.swipe_symbol === false ?
                                <Text style={styles.textStyleBold}>{settings.symbol}{today ? parseFloat(today).toFixed(settings.decimal) : '0'}</Text>
                            :
                                <Text style={styles.textStyleBold}>{today ? parseFloat(today).toFixed(settings.decimal) : '0'}{settings.symbol}</Text>
                            }
                        </View>
                    </View>

                    <View style={{justifyContent:'center', alignItems:'center' }}>
                        <Text style={styles.textStyle}>{t('thismonth')}</Text>
                        <View>
                            {settings.swipe_symbol === false ?
                                <Text style={styles.textStyleBold}>{settings.symbol}{thisMonth?parseFloat(thisMonth).toFixed(settings.decimal):'0'}</Text>
                            :
                                <Text style={styles.textStyleBold}>{thisMonth?parseFloat(thisMonth).toFixed(settings.decimal):'0'}{settings.symbol}</Text>
                            }
                        </View>
                    </View>
                </View> 

                <View style={{ flexDirection: isRTL ? 'row-reverse' :'row', alignItems:'center', justifyContent: 'space-around', alignItems:'center',minWidth: 250, paddingVertical: 15}}>
                    <View>
                        <Text style={styles.textStyleBold}>{t('totalearning')}</Text>
                    </View>
                    <View>
                        {settings.swipe_symbol === false ?
                            <Text style={styles.textStyleBoldColor}>{settings.symbol}{totalEarning?parseFloat(totalEarning).toFixed(settings.decimal):'0'}</Text>
                        :
                            <Text style={styles.textStyleBoldColor}>{totalEarning?parseFloat(totalEarning).toFixed(settings.decimal):'0'}{settings.symbol}</Text>
                        }
                    </View>
                </View>
            </View>
            <View style={{flex: 1}}>
                {tabIndex>=0?
                    <DriverEarningRidelist data={bookingData} tabIndex={tabIndex} ></DriverEarningRidelist>
                :null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        margin: 5,
        // borderWidth: 1, 
        // borderColor: 'red'
    },
    vew: {
        height: '65%',
        width: '95%',
        alignSelf: 'center',
        alignItems:'center',
        marginTop:-25

    },
    vew4:{
        height:'15%',
        width:'100%',
        alignItems:'center',
        backgroundColor: MAIN_COLOR,
        shadowColor: colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10
    },
    vew1: {
        width: '100%',
        borderRadius: 10,
        shadowColor: colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        backgroundColor: colors.WHITE,
        padding: 5
    },
    vew2: {
        height: '100%',
        width: '40%',
        justifyContent:'center',
    },
    vew3: {
        height: '100%',
        width: '60%',
        justifyContent:'center'
    },
    todayEarningHeaderText: {
        fontSize: 20,
        color: colors.BLACK,
        // margin:15
    },
    todayEarningMoneyText: {
        fontSize: 30,
        color: colors.BALANCE_GREEN,
        fontFamily:fonts.Bold
        // margin:15
    },
    todayEarningHeaderText2: {
        fontSize: 24,
        color: colors.WHITE
    },
    todayEarningMoneyText2: {
        fontSize: 30,
        color: colors.WHITE,
        fontFamily:fonts.Bold
    },
    textStyle: {
        fontSize: 15,
        fontFamily: fonts.Regular
    },
    textStyleBold: {
        fontSize: 15,
        fontFamily: fonts.Bold
    },
    textStyleBoldColor: {
        fontSize: 22,
        fontFamily: fonts.Bold,
        color: colors.BALANCE_GREEN
    }
})