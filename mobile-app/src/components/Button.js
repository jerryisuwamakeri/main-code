import React from 'react';
import { 
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { colors } from '../common/theme';

export const MAIN_COLOR = colors.BLACK;

export default function Button(props){
    const { style, title, btnClick, buttonStyle,activeOpacity,loading, loadingColor } = props;
    return (
        <TouchableOpacity
            style={[styles.button,style]}
            onPress={btnClick}
            activeOpacity={activeOpacity}
        >
           {loading === true?
                <ActivityIndicator size='large' color={!!loadingColor ? loadingColor.color : MAIN_COLOR} />
           :
                <Text style={[styles.textStyle, buttonStyle]}>{title}</Text>
           }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button:{
        alignItems: 'center',
        justifyContent:'center',
        padding: 10,
        borderRadius:10
    },
    textStyle:{
        width:"100%",
        textAlign: "center",
    }
});