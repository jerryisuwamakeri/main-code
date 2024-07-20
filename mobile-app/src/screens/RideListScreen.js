import React, { useEffect,useState } from 'react';
import { RideList } from '../components';
import {
    StyleSheet,
    View,
    Alert
} from 'react-native';
import { colors } from '../common/theme';
import i18n from 'i18n-js';
import { useSelector } from 'react-redux';
export default function RideListPage(props) {
    const bookings = useSelector(state => state.bookinglistdata.bookings);
    const settings = useSelector(state => state.settingsdata.settings);
    const fromBooking  = props.route.params?props.route.params: null;
    const [bookingData,setBookingData] = useState([]);
    const [tabIndex, setTabIndex] = useState(-1);
    const { t } = i18n;
    useEffect(()=>{
        if(bookings){
            setBookingData(bookings);
            if(fromBooking){
                const lastStatus = bookings[0].status;
                if(!(lastStatus == 'COMPLETE' && lastStatus == 'CANCELLED')) setTabIndex(0);
                if(lastStatus == 'COMPLETE') setTabIndex(1);
                if(lastStatus == 'CANCELLED') setTabIndex(2);
            }else{
                setTabIndex(0);
            }
        }else{
            setBookingData([]);
            setTabIndex(0);
        }
    },[bookings]);

    const goDetails = (item, index) => {
        if (item && item.trip_cost > 0) {
            item.roundoffCost = Math.round(item.trip_cost).toFixed(settings.decimal);
            item.roundoff = (Math.round(item.roundoffCost) - item.trip_cost).toFixed(settings.decimal);
            props.navigation.push('RideDetails', { data: item });
        }else {

            item.roundoffCost = Math.round(item.estimate).toFixed(settings.decimal);
            item.roundoff = (Math.round(item.roundoffCost) - item.estimate).toFixed(settings.decimal);
            props.navigation.push('RideDetails', { data: item });
        }
    }

    const goAction = (item, index) => {
        if(item.status == 'PAYMENT_PENDING'){
            props.navigation.navigate('PaymentDetails', { booking: item });
        }else {
            props.navigation.push('BookedCab',{bookingId:item.id});
        }
    }


    const chatAction = (item) => {
        if(['PAYMENT_PENDING','NEW', 'ACCEPTED', 'ARRIVED', 'STARTED', 'REACHED', 'PENDING'].indexOf(item.status) != -1){
            props.navigation.navigate("onlineChat", { bookingId: item.id })
        } else {
            Alert.alert(t('alert'), t('booking_is') + item.status + "." + t('not_chat'));
        }
    }

    const goHome = () => {
        props.navigation.push('TabRoot');
    }

    return (
        <View style={styles.mainView}>
            {tabIndex>=0?
                <RideList onPressButton={(item, index) => { goDetails(item, index) }} goHome={goHome} data={bookingData} tabIndex={tabIndex} onPressAction={(item, index) => { goAction(item, index) }} onChatAction={(item, index) => { chatAction(item, index) }}></RideList>
            :null}
        </View>
    );

}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colors.WHITE,
    }
});
