import React, { useState, useEffect } from 'react';
import { colors } from '../common/theme';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Dimensions,
    TextInput,
    Alert,
    FlatList
} from 'react-native';
import i18n from 'i18n-js';
import { Button } from 'react-native-elements'
import { useSelector, useDispatch } from "react-redux";
var { width } = Dimensions.get('window');
import moment from 'moment/min/moment-with-locales';
import { api } from 'common';
import { MAIN_COLOR } from "../common/sharedFunctions";
import {SECONDORY_COLOR } from "../common/sharedFunctions";
import { fonts } from '../common/font';

export default function Complain() {

    const {
        editComplain
    } = api;

    const dispatch = useDispatch();
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const auth = useSelector((state) => state.auth);
    const complaindata = useSelector(state => state.complaindata.list);
    const [scaleAnim] = useState(new Animated.Value(0))
    const [fadeAnim] = useState(new Animated.Value(0))
    const [data, setData] = useState();

    useEffect(() => {
        Animated.spring(
            scaleAnim,
            {
                toValue: 1,
                friction: 3,
                useNativeDriver: true
            }
        ).start();
        setTimeout(() => {
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true
                }
            ).start();
        }, 500)
    }, []);

    useEffect(() => {
        if (complaindata && auth) {
            let arr = [];
            let uid = auth.profile.uid;
            for (let i = 0; i < complaindata.length; i++) {
                if (complaindata[i].uid == uid) {
                    arr.push(complaindata[i])
                }
            }
            setData(arr);
        } else {
            setData([]);
        }
    }, [complaindata]);

    const [state, setState] = useState({
        subject: '',
        body: '',
        check: false
    });

    const submitComplain = () => {
        if (auth.profile.mobile || auth.profile.email) {
            if (state.subject && state.body) {
                let obj = { ...state };
                obj.uid = auth.profile.uid;
                obj.complainDate = new Date().getTime();
                obj.firstName = auth.profile.firstName ? auth.profile.firstName : '';
                obj.lastName = auth.profile.lastName ? auth.profile.lastName : '';
                obj.email = auth.profile.email ? auth.profile.email : '';
                obj.mobile = auth.profile.mobile ? auth.profile.mobile : '';
                obj.role = auth.profile.usertype;
                dispatch(editComplain(obj, "Add"));
                setState({
                    subject: '',
                    body: '',
                    check: false
                });
            } else {
                Alert.alert(t('alert'), t('no_details_error'));
            }
        } else {
            Alert.alert(t('alert'), t('email_phone'));
        }
    }

    const allData = ({ item }) => {
        return (
            <View style={[styles.vew1]}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <View style={{ width: width - 120 }}>
                        <Text style={[styles.textStyle1, { textAlign: isRTL ? "right" : "left" }]}>{t('subject')}</Text>
                        <Text style={[styles.textStyle, { textAlign: isRTL ? "right" : "left" }]}>{item.subject}</Text>
                    </View>
                    <View style={{ width: 80, }}>
                        <Text style={[styles.textStyle, { textAlign: isRTL ? "right" : "left", color: item.check == false ? colors.RED : colors.GREEN }]}>{moment(item.complainDate).format('ll')}</Text>
                        <Text style={[styles.textStyle, { textAlign: isRTL ? "right" : "left", color: item.check == false ? colors.RED : colors.GREEN }]}>{item.check == false ? t('pending') : t('solved')}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                    <View style={{ width: width - 40 }}>
                        <Text style={[styles.textStyle1, { textAlign: isRTL ? "right" : "left" }]}>{t('message_text')}</Text>
                        <Text style={[styles.textStyle, { textAlign: isRTL ? "right" : "left" }]}>{item.body}</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.mainView}>
            <View style={[styles.mainView, { borderTopRightRadius: 10, borderTopLeftRadius: 10, backgroundColor: colors.WHITE }]}>
                <View style={[styles.textInputContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row', margin: 10 }]}>
                    <View style={{ width: '100%', flex: 1, marginHorizontal: 10 }}>
                        <TextInput
                            editable
                            placeholder={t('subject')}
                            value={state.subject}
                            keyboardType={'email-address'}
                            onChangeText={(text) => { setState({ ...state, subject: text }) }}
                            style={{ height: '100%', textAlign: isRTL ? 'right' : null,fontFamily:fonts.Regular }}
                        />
                    </View>
                </View>
                <View style={[styles.textInputContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row', height: 100, margin: 10 }]}>
                    <View style={{ width: '100%', marginHorizontal: 10, flex: 1 }}>
                        <TextInput
                            editable
                            multiline
                            placeholder={t('chat_blank')}
                            onChangeText={(text) => { setState({ ...state, body: text }) }}
                            value={state.body}
                            style={{ textAlign: isRTL ? 'right' : null, flex: 1,fontFamily:fonts.Regular }}
                            keyboardType={'email-address'}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Button
                        onPress={submitComplain}
                        title={t('submit')}
                        titleStyle={styles.buttonTitle}
                        buttonStyle={styles.goHomeButton}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={data}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={true}
                        renderItem={allData}
                    />
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: MAIN_COLOR,
        alignItems: 'center',
        width: width
    },
    textInputContainerStyle: {
        width: width - 20,
        height: 65,
        borderRadius: 10,
        marginVertical: 5,
        shadowColor: colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        backgroundColor: colors.WHITE,
    },
    buttonTitle: {
        fontFamily:fonts.Bold,
        fontSize: 18
    },
    goHomeButton: {
        backgroundColor: MAIN_COLOR,
        width: 150,
        minHeight: 50,
        marginBottom: 10,
        borderRadius: 10,
    },
    textStyle: {
        fontSize: 14,
        color: colors.BLACK,
        fontFamily:fonts.Bold,
    },
    textStyle1: {
        fontSize: 16,
        fontFamily:fonts.Bold,
        marginBottom: 3,
        color:MAIN_COLOR
    },
    vew1: {
        width: width - 20,
        backgroundColor: colors.WHITE,
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 4,
        marginVertical: 2,
        shadowColor: colors.BLACK,
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2
    }
})