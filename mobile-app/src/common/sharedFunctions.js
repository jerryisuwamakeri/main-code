import { React } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions  } from 'react-native';
import { colors } from './theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from 'i18n-js';
import { api } from 'common';
import TaxiModal from '../components/TaxiModal';
var { height, width } = Dimensions.get('window');
import { fonts } from './font';

export const MAIN_COLOR = colors.TAXIPRIMARY;
export const SECONDORY_COLOR = colors.TAXISECONDORY;

export const appConsts = {
    needEmergemcy: true,
    hasMultiDrop: true,
    makePending: false,
    hasOptions: false,
    checkWallet: true,
    acceptWithAmount: false,
    hasStartOtp: true,
    canCall: true,
    showBookingOptions: false,
    captureBookingImage: false
}

export const checkSearchPhrase = (str) => {
    return ""
}

export const FormIcon = (props)=>{
    return <View style={{width: '15%',alignItems: 'center'}}>
        <MaterialCommunityIcons name="car-info" size={24} color={colors.HEADER} />
    </View>
}

export const CarHorizontal = (props) => {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const {onPress, carData, settings, styles} = props;
    return (
        <TouchableOpacity onPress={onPress} style={{height:'100%'}}>
            <View style={styles.imageStyle}>
                <Image resizeMode="contain" source={carData.image ? { uri: carData.image } : require('../../assets/images/microBlackCar.png')} style={styles.imageStyle1} />
            </View>
            <View style={styles.textViewStyle}>
                <Text style={styles.text1}>{carData.name.toUpperCase()}</Text>
                {carData.extra_info && carData.extra_info != '' ?
                        <View style={{ justifyContent: 'space-around', flexDirection: 'column', alignItems: 'center',marginTop:5 }}>
                            {
                                carData.extra_info.split(',').map((ln) => <Text style={styles.text2} key={ln} >{ln}</Text>)
                            }
                        </View>
                    : null}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop:5 }}>
                        {isRTL ?
                            null :
                            settings.swipe_symbol === false ?
                                <Text style={[styles.text2, { fontFamily:fonts.Bold, color: colors.MAP_TEXT }]}>{settings.symbol}{carData.rate_per_unit_distance} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                :
                                <Text style={[styles.text2, { fontFamily:fonts.Bold, color: colors.MAP_TEXT }]}>{carData.rate_per_unit_distance}{settings.symbol} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>

                        }
                        {isRTL ?
                            settings.swipe_symbol === false ?
                                <Text style={[styles.text2, { fontFamily:fonts.Bold, color: colors.MAP_TEXT }]}>{settings.symbol}{carData.rate_per_unit_distance} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                :
                                <Text style={[styles.text2, { fontFamily:fonts.Bold, color: colors.MAP_TEXT }]}>{carData.rate_per_unit_distance}{settings.symbol} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                            : null}
                    </View>
                <View>
                    <Text style={styles.text2}>({carData.minTime != '' ? carData.minTime : t('not_available')})</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const CarVertical = (props) =>{
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const {onPress, carData, settings, styles} = props;
    return (
        <TouchableOpacity
            style={[styles.carContainer, { borderWidth: 1, borderColor: carData.active == true ? colors.TAXIPRIMARY : colors.WHITE,flexDirection: isRTL?'row-reverse':'row',}]}
            onPress={onPress}
        >
            <Image
                source={carData.image ? { uri: carData.image } : require('../../assets/images/microBlackCar.png')}
                resizeMode="contain"
                style={styles.cardItemImagePlace}
            ></Image>
            <View style={[styles.bodyContent, { alignContent: 'center', flexDirection: 'column', justifyContent: 'center' }]}>
                <Text style={[styles.titleStyles,{textAlign:isRTL?'right':'left'}]}>{carData.name.toUpperCase()}</Text>
                <View style={{ flexDirection: isRTL?'row-reverse':'row', alignItems: 'center' }}>
                    {settings.swipe_symbol === false ?
                        <Text style={[styles.text2, { fontFamily:fonts.Bold, color: colors.MAP_TEXT }]}>{settings.symbol}{carData.rate_per_unit_distance} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                        :
                        <Text style={[styles.text2, { fontFamily:fonts.Bold, color: colors.MAP_TEXT }]}>{carData.rate_per_unit_distance}{settings.symbol} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                    }
                    {carData.extra_info && carData.extra_info != '' ?
                        <View style={{ justifyContent: 'space-around', marginLeft: 3, width: width-170 }}>
                            {
                                carData.extra_info.split().map((ln) => <Text key={ln} style={[styles.text2, { fontFamily:fonts.Bold, color: colors.MAP_TEXT, textAlign: isRTL ? 'right': 'left' }]} >{ln}</Text>)
                            }
                        </View>
                    : null}
                </View>
                <Text style={[styles.text2,{textAlign:isRTL?'right':'left'}]}>({carData.minTime != '' ? carData.minTime : t('not_available')})</Text>
            </View>
        </TouchableOpacity>
    )
}

export const validateBookingObj = async (t, addBookingObj, instructionData, settings, bookingType, roundTrip, tripInstructions, tripdata, drivers, otherPerson) => {
    const {
        getDistanceMatrix,
        GetDistance,
    } = api;
    if (settings.autoDispatch && bookingType == false) {
        if(otherPerson)addBookingObj['instructionData'] = instructionData;
        let preRequestedDrivers = {};
        let requestedDrivers = {};
        let driverEstimates = {};
        let startLoc = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
        let distArr = [];
        let allDrivers = [];
        if(drivers && drivers.length > 0){
            for (let i = 0; i < drivers.length; i++) {
                let driver = { ...drivers[i] };
                let distance = GetDistance(tripdata.pickup.lat, tripdata.pickup.lng, driver.location.lat, driver.location.lng);
                if (settings.convert_to_mile) {
                    distance = distance / 1.609344;
                }
                if (distance < ((settings && settings.driverRadius) ? settings.driverRadius : 10) && driver.carType === tripdata.carType.name) {
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
                    if (distArr[i].found) {
                        let driver = {}
                        driver.id = sortedDrivers[i].id;
                        driver.distance = sortedDrivers[i].distance;
                        driver.timein_text = distArr[i].timein_text;
                        if(!settings.prepaid){
                            requestedDrivers[driver.id] = true;
                        }else{
                            preRequestedDrivers[driver.id] = true;
                        }
                        driverEstimates[driver.id] = {distance: driver.distance, timein_text :  driver.timein_text};
                    }
                }
                addBookingObj['preRequestedDrivers'] = preRequestedDrivers;
                addBookingObj['requestedDrivers'] = requestedDrivers;
                addBookingObj['driverEstimates'] = driverEstimates;
            }
        } else{
            return { error: true, msg : t('no_driver_found_alert_messege')}
        }
    }
    return { addBookingObj };
}

export default function BookingModal(props){
    return <TaxiModal {...props} />
}

export const prepareEstimateObject =  async (tripdata, instructionData) => {
    const { t } = i18n;
    const {
        getDirectionsApi
    } = api;
    try {
        const startLoc = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
        const destLoc = tripdata.drop.lat + ',' + tripdata.drop.lng;
        let routeDetails = null;
        let waypoints = '';
        if (tripdata.drop && tripdata.drop.waypoints && tripdata.drop.waypoints.length > 0) {
            const origin = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
            const arr = tripdata.drop.waypoints;
            for (let i = 0; i < arr.length; i++) {
                waypoints = waypoints + arr[i].lat + ',' + arr[i].lng;
                if (i < arr.length - 1) {
                    waypoints = waypoints + '|';
                }
            }
            const destination = tripdata.drop.lat + ',' + tripdata.drop.lng;
            routeDetails = await getDirectionsApi(origin, destination, waypoints);
        } else {
            routeDetails = await getDirectionsApi(startLoc, destLoc, null);
        }
        const estimateObject = {
            pickup: { coords: { lat: tripdata.pickup.lat, lng: tripdata.pickup.lng }, description: tripdata.pickup.add },
            drop: { coords: { lat: tripdata.drop.lat, lng: tripdata.drop.lng }, description: tripdata.drop.add, waypointsStr: waypoints != '' ? waypoints : null, waypoints: waypoints != '' ? tripdata.drop.waypoints : null },
            carDetails: tripdata.carType,
            routeDetails: routeDetails
        };
        return { estimateObject };
    } catch (err) {
        return { error: true, msg : t('not_available')}
    }
}

export const ExtraInfo = (props) => {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const { item, uid, amount, setAmount, styles} = props;
    return (
        <>
            <View style={[styles.textContainerStyle, {flexDirection: isRTL? 'row-reverse' : 'row'}]}>
                <Text style={styles.textHeading}>{t('payment_mode')} - </Text>
                <Text style={styles.textContent}>
                {t(item.payment_mode)}
                </Text>
            </View>
        </>
    )
}

export const RateView = (props) => {
    const {settings, item, styles} = props;
    return (
        <View style={styles.rateViewStyle}>
            {settings.swipe_symbol === false ?
                <Text style={styles.rateViewTextStyle}>{settings.symbol}{item ? item.estimate > 0 ? parseFloat(item.estimate).toFixed(settings.decimal) : 0 : null}</Text>
                :
                <Text style={styles.rateViewTextStyle}>{item ? item.estimate > 0 ? parseFloat(item.estimate).toFixed(settings.decimal) : 0 : null}{settings.symbol}</Text>
            }
        </View>
    )
}
