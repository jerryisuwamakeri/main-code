import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native'
import { colors } from '../common/theme'
import { useSelector, useDispatch } from 'react-redux';
import i18n from 'i18n-js';
import { Entypo, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import { MAIN_COLOR, SECONDORY_COLOR } from '../common/sharedFunctions';
import { FontAwesome5 } from '@expo/vector-icons';
import { api } from 'common';
import { fonts } from '../common/font';
const { height, width } = Dimensions.get("window");

export default function CarsScreen(props) {
    const {editCar} = api;
    const dispatch = useDispatch();
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const carlistdata = useSelector(state => state.carlistdata);
    const [data, setData] = useState([]);
    const params = props.route.params;

    const fromPage = params && params.fromPage? params.fromPage: "";


    useEffect(() => {
        if (carlistdata.cars) {
            setData(carlistdata.cars);
        } else {
            setData([]);
        }
    }, [carlistdata.cars]);

    const onPress = (car) => {
        props.navigation.navigate('CarEdit', { car: car })
    }

    const onPressBack = () => {
        if(fromPage == 'DriverTrips'){
            props.navigation.navigate('TabRoot', { screen: fromPage });
        }else{
            props.navigation.goBack() 
        }
    }

    const lCom = () => {
        return (
          <TouchableOpacity style={{ marginLeft: 10}} onPress={onPressBack}>
            <FontAwesome5 name="arrow-left" size={24} color={colors.WHITE} />
          </TouchableOpacity>
        );
      }
    
    React.useEffect(() => {
        props.navigation.setOptions({
            headerLeft: lCom,
        });
    }, [props.navigation]);

    React.useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return (
                    <TouchableOpacity onPress={() => props.navigation.navigate('CarEdit')} style={{ marginEnd: 8, alignItems: 'flex-end', padding: 5 }}><Text style={[styles.headerTitleStyle, { color: colors.WHITE }]}>{t('add')}</Text></TouchableOpacity>
                )
            }
        });
    }, [props.navigation]);


    const deleteCar = async (item) => {
        if(!item.active){
            Alert.alert(
                t('alert'),
                t('delete_your_car'),
                [
                    {
                        text: t('cancel'),
                        onPress: () => {},
                        style: 'cancel',
                        
                    },
                    {
                        text: t('yes'), onPress: () => {
                            dispatch(editCar(item,"Delete"));

                        }
                    },
                ],
                { cancelable: true }
            );
        }else{
            Alert.alert(t('alert'), t('active_car_delete'))
        }
    }

    return (
        <ScrollView styles={styles.container} showsVerticalScrollIndicator={false}>
            {data && data.length > 0 ?
                data.map((c, i) => {
                    return (
                        <TouchableWithoutFeedback key={"index" + i} onPress={() => onPress(c)}>
                            <View style={styles.card}>
                                <View style={[styles.vew1,{backgroundColor: MAIN_COLOR, flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomRightRadius: isRTL ? null : 90, borderBottomLeftRadius:  isRTL ? 90 : null}]}>
                                    <View style={{flexDirection:isRTL? 'row-reverse':'row', justifyContent: 'center',flex: 1}}>
                                        <Text style={[styles.text,{marginHorizontal:3}]}>{c.vehicleMake} {c.vehicleModel}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => deleteCar(c)} style={[isRTL?{marginLeft:20, width: 50}:{marginLeft:20, width: 50}]}>
                                        <MaterialIcons name="delete" size={24} color={colors.WHITE} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '100%', flexDirection: isRTL ? 'row-reverse' : 'row',height:180 }}>
                                    <View style={{width:'60%',alignItems:'center',height:'90%'}}>
                                        <Image source={{ uri:c.car_image }} style={styles.carImage} resizeMode={'center'} />
                                    </View>

                                    <View style={{ flexDirection: 'column', width: '40%', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={styles.vew2}>
                                            <Text style={styles.text3}>{t('approved')}</Text>
                                            <Text style={[styles.text3,{fontFamily:fonts.Bold}]}>{c.approved ? t('yes') : t('no')}</Text>
                                        </View>
                                        <View style={styles.vew2}>
                                            <Text style={styles.text3}>{t('active_status')}</Text>
                                            <Text style={[styles.text3,{fontFamily:fonts.Bold}]}>{c.active ? t('yes') : t('no')}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.vew, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <MaterialCommunityIcons name="car-multiple" size={24} color={MAIN_COLOR} style={styles.icon} />
                                    <View>
                                        <Text style={styles.text1}>{t('car_type')}</Text>
                                        <Text style={[styles.text1,{fontFamily:fonts.Bold}]}>{c.carType}</Text>
                                    </View>

                                </View>
                                <View style={[styles.vew, { flexDirection: isRTL ? 'row-reverse' : 'row',height:70 }]}>
                                    <MaterialCommunityIcons name="numeric" size={24} color={MAIN_COLOR} style={styles.icon} />
                                    <View style={{ height:60, width:"90%",}}>
                                        <Text style={[styles.text1,{fontSize:14}]}>{t('vehicle_reg_no')}</Text>
                                        <Text style={[styles.text1,{fontFamily:fonts.Bold, textAlign: isRTL ? 'right' : 'left'}]}>{c.vehicleNumber}</Text>
                                    </View>

                                </View>

                                <View style={[styles.vew, { flexDirection: isRTL ? 'row-reverse' : 'row',marginBottom:10, height:70 }]}>
                                    <Entypo name="info" size={24} color={MAIN_COLOR} style={styles.icon} />
                                    <View style={{ height:60, width:"90%",}}>
                                        <Text style={[styles.text1,{fontSize:14}]}>{t('other_info')}</Text>
                                        <Text style={[styles.text1,{fontFamily:fonts.Bold, textAlign: isRTL ? 'right' : 'left'},{fontSize:14}]}>{c.other_info}</Text>
                                    </View>

                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    );
                })
            :
            <View style={{flex: 1, justifyContent:'center', alignItems:'center', height: height/2, padding: 10}}>
                <Text style={{fontSize: 23, fontFamily:fonts.Bold}}>{t('car_add')}</Text>
            </View>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily:fonts.Bold,
        fontSize: 20,
        marginEnd: '10%'
    },
    card: {
        backgroundColor: colors.WHITE,
        margin: 10,
        marginVertical: 10,
        borderRadius: 5,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 3
    },
    vew: {
        height: 60,
        width: '95%',
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: colors.WHITE,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        marginVertical: 5,
        padding: 3
    },
    carImage: {
        width: '90%', 
        height: '100%'
    },
    text: {
        color: colors.WHITE,
        fontSize: 18,
        fontFamily:fonts.Regular
    },
    text3:{
        color: colors.HEADER,
        fontSize: 18,
        fontFamily:fonts.Regular
    },
    vew1: {
        minHeight: 55,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        alignItems: 'center'
    },
    vew2: {
        backgroundColor: SECONDORY_COLOR,
        height: 75,
        width: 120,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        borderRadius: 10,
        padding:10
    },
    text1: {
        color: colors.BLACK,
        fontSize: 16, 
        marginHorizontal: 15,
        fontFamily:fonts.Regular
    },
    icon: { marginHorizontal: 10, marginTop: 8 }
})
