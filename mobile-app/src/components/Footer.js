import React from 'react';
import {
    View,
} from 'react-native';
import { colors } from '../common/theme';
import { MAIN_COLOR } from '../common/sharedFunctions';

export default function Footer(props) {
    return (
        <View style={{flex: 1}}>
            <View style={{flex: .9, backgroundColor: MAIN_COLOR}}>
                <View style={{flex: 1, borderBottomRightRadius: 90, backgroundColor: colors.WHITE}}>
                </View>
            </View>
            <View style={{flex: .1, backgroundColor: colors.WHITE}}>
                <View style={{flex: 1, backgroundColor: MAIN_COLOR, borderTopLeftRadius: 80}}>
                </View>
            </View>
        </View>
    );
}