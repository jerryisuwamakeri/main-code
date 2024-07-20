import React, { useEffect, useState, useRef } from 'react';
import { colors } from '../common/theme';
import { useSelector, useDispatch } from 'react-redux';
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    Platform,
    Alert,
    StyleSheet,
    TextInput,
    ActivityIndicator

} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Button from '../components/Button';
import RNPickerSelect from '../components/RNPickerSelect';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { api } from 'common';
import ActionSheet from "react-native-actions-sheet";
import i18n from 'i18n-js';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import { FormIcon, MAIN_COLOR } from '../common/sharedFunctions';
import {fonts}from "../common/font"
var { height, width } = Dimensions.get('window');

export default function CarEditScreen(props) {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const dispatch = useDispatch();
    const {
        updateUserCar,
        updateUserCarWithImage,
        editCar
    } = api;
    const carlistdata = useSelector(state => state.carlistdata);
    const cartypes = useSelector(state => state.cartypes.cars);
    const settings = useSelector(state => state.settingsdata.settings);
    const auth = useSelector(state => state.auth);
    const [carTypes, setCarTypes] = useState(null);
    const [loading, setLoading] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const actionSheetRef = useRef(null);
    const [cars, setCars] = useState({});
    const [updateCalled, setUpdateCalled] = useState(false);

    const car = props.route.params && props.route.params.car ? props.route.params.car : null;

    const [state, setState] = useState({
        car_image: car && car.car_image ? car.car_image : null,
        vehicleNumber: car && car.vehicleNumber ? car.vehicleNumber : null,
        vehicleMake: car && car.vehicleMake ? car.vehicleMake : null,
        vehicleModel: car && car.vehicleModel ? car.vehicleModel : null,
        carType: car && car.carType ? car.carType : null,
        other_info: car && car.other_info ? car.other_info : "",
        approved: car && car.approved ? car.approved : null,
        active: car && car.active ? car.active : null
    });

    const [blob, setBlob] = useState();
    const pickerRef1 = React.createRef();

    useEffect(() => {
        if (cartypes) {
            let arr = [];
            const sorted = cartypes.sort((a, b) => a.pos - b.pos);
            for (let i = 0; i < sorted.length; i++) {
                arr.push({ label: sorted[i].name, value: sorted[i].name });
            }
            if (arr.length > 0) {
                setState({ ...state, carType: arr[0].value })
            }
            setCarTypes(arr);
        }
    }, [cartypes]);

    useEffect(() => {
        if (carlistdata.cars) {
            setCars(carlistdata.cars);
            if (updateCalled) {
                setLoading(false);
                Alert.alert(
                    t('alert'),
                    t('profile_updated'),
                    [
                        { text: t('ok'), onPress: () => { props.navigation.goBack() } }
                    ],
                    { cancelable: true }
                );
                setUpdateCalled(false);
            }
        } else {
            setCars([]);
        }
    }, [carlistdata.cars, updateCalled]);

    const showActionSheet = () => {
        actionSheetRef.current?.setModalVisible(true);
    }

    const uploadImage = () => {
        return (
            <ActionSheet ref={actionSheetRef}>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, borderColor: colors.CONVERTDRIVER_TEXT, borderBottomWidth: 1, height: 60, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { _pickImage('CAMERA', ImagePicker.launchCameraAsync) }}
                >
                    <Text style={{ color: colors.CAMERA_TEXT,fontFamily:fonts.Bold }}>{t('camera')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, borderBottomWidth: 1, borderColor: colors.CONVERTDRIVER_TEXT, height: 60, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { _pickImage('MEDIA', ImagePicker.launchImageLibraryAsync) }}
                >
                    <Text style={{ color: colors.CAMERA_TEXT,fontFamily:fonts.Bold}}>{t('medialibrary')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, height: 50, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { actionSheetRef.current?.setModalVisible(false); }}>
                    <Text style={{ color: 'red',fontFamily:fonts.Bold }}>{t('cancel')}</Text>
                </TouchableOpacity>
            </ActionSheet>
        )
    }

    const _pickImage = async (permissionType, res) => {
        var pickFrom = res;
        let permisions;
        if (permissionType == 'CAMERA') {
            permisions = await ImagePicker.requestCameraPermissionsAsync();
        } else {
            permisions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
        const { status } = permisions;

        if (status == 'granted') {

            let result = await pickFrom({
                allowsEditing: true,
                aspect: [4, 3]
            });

            actionSheetRef.current?.setModalVisible(false);

            if (!result.canceled) {
                setCapturedImage(result.assets[0].uri);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        resolve(xhr.response);
                    };
                    xhr.onerror = function () {
                        Alert.alert(t('alert'), t('image_upload_error'));
                    };
                    xhr.responseType = 'blob';
                    xhr.open('GET', result.assets[0].uri, true);
                    xhr.send(null);
                });
                setBlob(blob);
            }
        } else {
            Alert.alert(t('alert'), t('camera_permission_error'))
        }
    }

    const cancelPhoto = () => {
        setCapturedImage(null);
    }

    const onSave = () => {
        if (state.carType && state.carType.length > 1 && state.vehicleNumber && state.vehicleNumber.length > 1 && state.vehicleMake && state.vehicleMake.length > 1 && state.vehicleModel && state.vehicleModel.length > 1) {
            if (blob) {
                setLoading(true);
                setUpdateCalled(true);
                let activeCar = null;
                let newData = { ...state };
                for (let i = 0; i < cars.length; i++) {
                    if (cars[i].active) {
                        activeCar = cars[i];
                        break;
                    }
                }
                if (activeCar && state.active) {
                    activeCar.active = false;
                    dispatch(editCar(activeCar, "Update"));
                } else if (activeCar && !newData.active) {
                    newData.active = false;
                } else {
                    newData.active = true;
                }
                newData['createdAt'] = new Date().getTime();
                newData['driver'] = auth.profile.uid;
                newData['fleetadmin'] = auth.profile && auth.profile.fleetadmin ? auth.profile.fleetadmin : null;
                if (!settings.carApproval) {
                    newData['approved'] = true;
                } else {
                    newData['approved'] = false;
                }
                dispatch(updateUserCarWithImage(newData, blob));
            }
            else {
                Alert.alert(t('alert'), t('proper_input_image'));
            }
        } else {
            Alert.alert(t('alert'), t('no_details_error'));
        }
        // console.log(capturedImage)

    }

    const makeActive = () => {
        setLoading(true);
        let activeCar = null;
        for (let i = 0; i < cars.length; i++) {
            if (cars[i].active && cars[i].id != car.id) {
                activeCar = cars[i];
                break;
            }
        }
        if (activeCar) {
            activeCar.active = false;
            dispatch(editCar(activeCar, "Update"));
        }
        car.active = true;
        dispatch(editCar(car, "Update"));
        let updateData = {
            carType: car.carType,
            vehicleNumber: car.vehicleNumber,
            vehicleMake: car.vehicleMake,
            vehicleModel: car.vehicleModel,
            other_info: car.other_info ? car.other_info : "",
            car_image: car.car_image,
            carApproved: car.approved,
            updateAt: new Date().getTime()
        };
        dispatch(updateUserCar(auth.profile.uid, updateData));
        props.navigation.goBack()
    }

    const RemoteImage = ({ uri, desiredWidth }) => {
        const [desiredHeight, setDesiredHeight] = useState(0);
        Image.getSize(uri, (width, height) => setDesiredHeight(desiredWidth / width * height));
        return <Image source={{ uri }} style={{ width: desiredWidth, height: desiredHeight }} />
    }
    const [vehicleTypeFocus, setvehicleTypeFocus] = useState(false)
    const [vehicleNameFocus, setvehicleNameFocus] = useState(false)
    const [vehicleModelFocus, setvehicleModelFocus] = useState(false)
    const [vehicleregistrationFocus, setvehicleregistrationFocus] = useState(false)
    const [vehicleInfoFocus, setvehicleInfoFocus] = useState(false)

    return (
        <View style={{ flex: 1 }}>
            {/* <Footer/> */}
            <View style={{ flex: 1, position: 'absolute', backgroundColor: colors.WHITE, height: '100%', width: '100%' }}>
                <KeyboardAvoidingView style={styles.form} behavior={Platform.OS == "ios" ? "padding" : (__DEV__ ? null : "padding")} keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}>
                    <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                        {
                            uploadImage()
                        }
                        <View style={styles.containerStyle}>
                            <View style={styles.containerStyle}>
                                {state.car_image ?
                                    <View style={{ alignSelf: 'center', marginVertical: 10,  }}>
                                        <RemoteImage
                                            uri={state.car_image}
                                            desiredWidth={width * 0.8}
                                        />
                                    </View>
                                    :
                                    capturedImage ?
                                        <View style={styles.imagePosition}>
                                            <TouchableOpacity style={styles.photoClick} onPress={cancelPhoto}>
                                                <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                            </TouchableOpacity>
                                            <Image source={{ uri: capturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </View>
                                        :
                                        <View style={styles.capturePhoto}>
                                            <View>
                                                <Text style={[styles.capturePhotoTitle, styles.fontStyle]}>{t('upload_car_image')}</Text>
                                            </View>
                                            <View style={[styles.capturePicClick, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                                <TouchableOpacity style={styles.flexView1} onPress={showActionSheet}>
                                                    <View>
                                                        <View style={styles.imageFixStyle}>
                                                            <AntDesign name="clouduploado" size={100} color={MAIN_COLOR} style={styles.imageStyle2} />
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                }

                                { car && car.id ? 
                                <View style={[styles.textInputContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <TextInput
                                        editable={car && car.id ? false : true}
                                        value={car.carType}
                                        textAlign={isRTL ? 'right' : 'left'}
                                        style={[styles.inPutFieldStyle, styles.fontBoldStyle, { paddingRight: isRTL ? 15 : 0 }]}
                                    />
                                </View>
                                :
                                <View style={[styles.textInputContainerStyle, { borderColor: colors.FOOTERTOP, borderWidth: 1, borderRadius: 10, }, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>

                                    {carTypes ?
                                        <View style={[{ width: "100%", height: "100%", paddingLeft: isRTL ? 0 : 10, paddingRight: isRTL ? 10 : 0, alignItems: 'center', position: 'relative' }, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <RNPickerSelect
                                                pickerRef={pickerRef1}
                                                placeholder={{}} 
                                                value={car && car.carType ? car.carType : state.carType}
                                                useNativeAndroidPickerStyle={false}
                                                style={{
                                                    inputIOS: [styles.pickerStyle, styles.fontBoldStyle, { alignSelf: isRTL ? 'flex-end' : 'flex-start', textAlign: isRTL ? 'right' : 'left' }],
                                                    placeholder: {
                                                        color: '#2a383b'
                                                    },
                                                    inputAndroid: [styles.pickerStyle, styles.fontBoldStyle, { alignSelf: isRTL ? 'flex-end' : 'flex-start', textAlign: isRTL ? 'right' : 'left' }]
                                                }}
                                                onTap={() => { pickerRef1.current.focus() }}
                                                onValueChange={(value) => setState({ ...state, carType: value })}
                                                items={carTypes}
                                            />
                                            <TouchableOpacity style={{ width: "10%", alignItems: 'center', justifyContent: "center", height: "100%" }} onPress={() => { pickerRef1.current.focus() }} >
                                                <Ionicons style={{}} name="arrow-down-outline" size={26} color="gray" />
                                            </TouchableOpacity>
                                        </View>
                                : null}
                                </View>
                                }
                                
                                <View style={[styles.textInputContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <TextInput
                                        editable={car && car.id ? false : true}
                                        onFocus={() => setvehicleNameFocus(!vehicleNameFocus)}
                                        onBlur={() => setvehicleNameFocus(!vehicleNameFocus)}
                                        placeholder={t('vehicle_model_name')}
                                        value={state.vehicleMake}
                                        textAlign={isRTL ? 'right' : 'left'}
                                        style={[styles.inPutFieldStyle, styles.fontBoldStyle, { paddingRight: isRTL ? 15 : 0 }]}
                                        placeholderTextColor={colors.PLACEHOLDER_COLOR}
                                        onChangeText={(text) => { setState({ ...state, vehicleMake: text }) }}
                                    />
                                </View>
                                <View style={[styles.textInputContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <TextInput
                                        editable={car && car.id ? false : true}
                                        placeholder={t('vehicle_model_no')}
                                        value={state.vehicleModel}
                                        textAlign={isRTL ? 'right' : 'left'}
                                        style={[styles.inPutFieldStyle, styles.fontBoldStyle, { paddingRight: isRTL ? 15 : 0 }]}
                                        placeholderTextColor={colors.PLACEHOLDER_COLOR}
                                        onChangeText={(text) => { setState({ ...state, vehicleModel: text }) }}
                                    />
                                </View>
                                <View style={[styles.textInputContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <TextInput
                                        editable={car && car.id ? false : true}
                                        placeholder={t('vehicle_reg_no')}
                                        value={state.vehicleNumber}
                                        textAlign={isRTL ? 'right' : 'left'}
                                        style={[styles.inPutFieldStyle, styles.fontBoldStyle, { paddingRight: isRTL ? 15 : 10 }]}
                                        placeholderTextColor={colors.PLACEHOLDER_COLOR}
                                        onChangeText={(text) => { setState({ ...state, vehicleNumber: text }) }}
                                    />
                                </View>
                                <View style={[styles.textInputContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <TextInput
                                        editable={car && car.id ? false : true}
                                        placeholder={t('other_info')}
                                        value={state.other_info}
                                        textAlign={isRTL ? 'right' : 'left'}
                                        style={[styles.inPutFieldStyle, styles.fontBoldStyle, { paddingRight: isRTL ? 15 : 0 }]}
                                        placeholderTextColor={colors.PLACEHOLDER_COLOR}
                                        onChangeText={(text) => { setState({ ...state, other_info: text }) }}
                                    />
                                </View>
                                <View style={styles.buttonContainer}>
                                    {!car ?

                                        <Button
                                            btnClick={onSave}
                                            title={t('save')}
                                            loading={false}
                                            loadingColor={{ color: colors.WHITE }}
                                            style={[styles.registerButton, loading === true ? styles.registerButtonClicked : styles.registerButton]}
                                            buttonStyle={[styles.buttonTitle, styles.fontBoldStyle]}
                                        />

                                        : null}
                                    {car && car.id && !car.active ?

                                        <Button
                                            btnClick={makeActive}
                                            title={t('make_active')}
                                            loading={false}
                                            loadingColor={{ color: colors.WHITE }}
                                            style={ [styles.registerButton, loading === true ? styles.registerButtonClicked : styles.registerButton]}
                                            buttonStyle={[styles.buttonTitle, styles.fontBoldStyle]}
                                        />
                                        :
                                        null}
                                    {loading === true ?
                                        <ActivityIndicator size="large" color={MAIN_COLOR} style={styles.loader} />
                                        : null
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colors.BLACK
    },
    inputContainerStyle: {
        width: "100%",
    },
    vew1: {
        height: '100%',
        borderBottomRightRadius: 120,
        overflow: 'hidden',
        backgroundColor: colors.WHITE,
    },
    iconContainer: {
        width: '15%',
        alignItems: 'center'
    },
    vew: {
        borderTopLeftRadius: 130,
        height: '100%',
        alignItems: 'flex-end'
    },
    gapView: {
        height: 40,
        width: '100%'
    },

    registerButton: {
        backgroundColor: MAIN_COLOR,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: 'center',
        width: '95%'
    },
    registerButtonClicked: {
        backgroundColor: colors.WHITE,
        borderWidth: 1,
        borderColor: MAIN_COLOR,
        width: '95%'
    },

    buttonTitle: {
        fontSize: 18,
        color: colors.WHITE,
        paddingVertical: 5,
    },
    buttonClickedTitle: {

    },
    pickerStyle: {
        color: colors.HEADER,
        fontSize: 15,
        height: "100%",
        minWidth: "90%",


    },
    inputTextStyle: {
        color: colors.BLACK,
        fontSize: 13,
        marginLeft: 0,
        height: 32,
    },
    errorMessageStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 0
    },
    containerStyle: {
        flexDirection: 'column',
        width: '100%',
        backgroundColor: colors.WHITE,
        gap: 5,
        alignItems: 'center'
    },
    form: {
        flex: 1,
    },
    logo: {
        width: '100%',
        justifyContent: "center",
        height: '10%',
        borderBottomRightRadius: 150,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 2,
    },
    scrollViewStyle: {
        height: height
    },
    fontStyle: {
        fontFamily:fonts.Regular
    },
    fontBoldStyle: {
        fontFamily: fonts.Bold
    },
    textInputContainerStyle: {
        width: '95%',
        height: 60,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: "center"
    },
    inPutFieldStyle: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.FOOTERTOP,
        fontSize: 14,
        paddingLeft:15
    },
    inputFocused: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        borderWidth: 0.2,
        borderBlockColor: MAIN_COLOR,
        fontSize: 15,
        paddingLeft: 15,
    },
    headerStyle: {
        fontSize: 25,
        color: colors.WHITE,
        flexDirection: 'row',
    },
    capturePhoto: {
        width: '95%',
        height: 180,
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 15,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 5,
        // },
        // shadowOpacity: 0.2,
        // shadowRadius: 3,
        // elevation: 3,
        // backgroundColor: colors.RED,
        borderWidth: 0.8,
        borderStyle: "dashed",
    },
    // capturePhoto: {
    //     width: '60%',
    //     height: 110,
    //     alignSelf: 'center',
    //     flexDirection: 'column',
    //     justifyContent: 'center',
    //     borderRadius: 10,
    //     marginTop: 15,
    //     shadowColor: "#000",
    //     shadowOffset: {
    //         width: 0,
    //         height: 5,
    //     },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 3,
    //     elevation: 3,
    //     backgroundColor: colors.WHITE
    // },
    capturePhotoTitle: {
        color: colors.BLACK,
        fontSize: 16,
        textAlign: 'center',
        paddingBottom: 15,

    },
    errorPhotoTitle: {
        color: colors.RED,
        fontSize: 13,
        textAlign: 'center',
        paddingBottom: 15,
    },
    photoResult: {
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 20,
        paddingTop: 15,
        marginRight: 20,
        paddingBottom: 10,
        marginTop: 15,
        width: '95%',
        height: height / 4,
    },
    imagePosition: {
        position: 'relative',
        width: "100%",
    },
    photoClick: {
        paddingRight: 35,
        position: 'absolute',
        zIndex: 1,
        marginTop: 18,
        alignSelf: 'flex-end'
    },
    capturePicClick: {
        backgroundColor: colors.WHITE,
        justifyContent: "center",
        flexDirection: 'row',
        position: 'relative',
        zIndex: 1
    },
    imageStyle: {
        width: 25,
        height: 25,
    },
    flexView1: {

        width: "100%",
        height: "100%"
    },
    imageFixStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle2: {
        opacity: 0.6
    },
    // imageStyle2: {
    //     width: 150,
    //     height: height / 15
    // },
    myView: {
        flex: 2,
        height: 50,
        width: 1,
        alignItems: 'center'
    },
    myView1: {
        height: height / 18,
        width: 1.5,
        backgroundColor: colors.CONVERTDRIVER_TEXT,
        alignItems: 'center',
        marginTop: 10
    },
    myView2: {
        flex: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    myView3: {
        flex: 2.2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loader: {
        position: 'absolute'
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: 'center',
        marginBottom: 12,
        position: "relative",
    },

});