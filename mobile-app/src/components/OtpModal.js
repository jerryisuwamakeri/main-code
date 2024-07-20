import React from "react";
import { Modal, View, StyleSheet, TextInput } from "react-native";
import { Icon } from "react-native-elements";
import { colors } from "../common/theme";
import { fonts } from '../common/font';

import i18n from 'i18n-js';
export default function OtpModal(props) {

    const { requestmodalclose, modalvisable, otp, onMatch } = props;
    const { t } = i18n;
    return (
        <Modal
            visible={modalvisable}
            animationType={"slide"}
            transparent={true}
            onRequestClose={requestmodalclose}
        >
            <View style={styles.container}>
                <View style={styles.modalContainer}>
                    <View style={styles.blankViewStyle}>
                        <Icon
                            name="close"
                            type="fontawesome"
                            color={colors.BLACK}
                            onPress={requestmodalclose}
                            size={30}
                        />
                    </View>
                    <View style={styles.modalContainerViewStyle}>
                        <TextInput
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder={t('enter_code')}
                            keyboardType="numeric"
                            onChangeText={text => {
                                if(text == otp){
                                    onMatch(true);
                                }
                            }}
                            maxLength={5}
                            placeholderTextColor={colors.RIDELIST_TEXT}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "80%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        paddingTop: 120
    },
    modalContainer: {
        height: 200,
        backgroundColor: colors.WHITE,
        width: "80%",
        borderRadius: 10,
        elevation: 15
    },
    crossIconContainer: {
        flex: 1,
        left: "40%"
    },
    blankViewStyle: {
        flex: 1,
        flexDirection: "row",
        alignSelf: 'flex-end',
        marginTop: 15,
        marginRight: 15
    },
    modalHeaderStyle: {
        textAlign: "center",
        fontSize: 20,
        paddingTop: 10
    },
    modalContainerViewStyle: {
        flex: 7,
        alignItems: "center",
        justifyContent: "center"
    },
    itemsViewStyle: {
        flexDirection: "column"
    },
    textStyle: {
        fontSize: 20,
        fontFamily:fonts.Regular
    },
    input: {
        fontSize: 20,
        marginBottom: 20,
        borderColor: colors.BORDER_BACKGROUND,
        borderWidth: 1,
        borderRadius: 8,
        width: "80%",
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 10,
        paddingLeft: 10,
        textAlign: 'center',
        fontFamily:fonts.Regular
    },
});