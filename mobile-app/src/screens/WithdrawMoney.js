import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert
} from 'react-native';
import { Header, Button } from 'react-native-elements';
import { colors } from '../common/theme';
import i18n from 'i18n-js';
import { useSelector,useDispatch } from 'react-redux';
import { api } from 'common';
import { MAIN_COLOR } from '../common/sharedFunctions';
import { fonts } from '../common/font';

export default function WithdrawMoneyScreen(props) {
  const {
    withdrawBalance,
  } = api;
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settingsdata.settings);
  const {userdata} = props.route.params;
  const [state, setState] = useState({
    userdata: userdata,
    amount: null
  });
  const [loading,setLoading] = useState(false);

  const { t } = i18n;
  const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;

  const withdrawNow = () => {
    if(parseFloat(state.userdata.walletBalance)>0 && parseFloat(state.amount)> 0 && parseFloat(state.amount)<=parseFloat(state.userdata.walletBalance)){
      dispatch(withdrawBalance(state.userdata,state.amount));
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        props.navigation.navigate('TabRoot', { screen: 'Wallet' });
      }, 2000);
    }else{
      if(parseFloat(state.amount)> parseFloat(state.userdata.walletBalance)){
        Alert.alert(t('alert'),t('withdraw_more'));
      }
      else if(parseFloat(state.amount)<=0){
        Alert.alert(t('alert'),t('withdraw_below_zero'));
      }else{
        Alert.alert(t('alert'),t('valid_amount'));
      }
    }
  }

  return (
    <View style={styles.mainView}>
      
      <View style={styles.bodyContainer}>
      {settings.swipe_symbol===false?
        <Text style={[styles.walletbalText,{textAlign: isRTL ? 'right': 'left'}]}>{t('Balance')} - <Text style={styles.ballance}>{settings.symbol}{state.userdata ? parseFloat(state.userdata.walletBalance).toFixed(settings.decimal) : ''}</Text></Text>
        :
        <Text style={[styles.walletbalText,{textAlign: isRTL ? 'right': 'left'}]}>{t('Balance')} - <Text style={styles.ballance}>{state.userdata ? parseFloat(state.userdata.walletBalance).toFixed(settings.decimal) : ''}{settings.symbol}</Text></Text>
      }

        <TextInput
          style={[styles.inputTextStyle,{textAlign: isRTL ? 'right': 'left'}]}
          placeholder={t('amount') + " (" + settings.symbol + ")"}
          keyboardType={'number-pad'}
          onChangeText={(text) => setState({ ...state,amount: text })}
          value={state.amount}
        />
        <Button
            title={t('withdraw')}
            loading={loading}
            titleStyle={styles.buttonTitle}
            onPress={withdrawNow}
            buttonStyle={styles.buttonWrapper2}
            containerStyle={{ height: '100%' }}
        />
      </View>
    </View>
  );

}

const styles = StyleSheet.create({

  headerStyle: {
    backgroundColor: colors.HEADER,
    borderBottomWidth: 0
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily:fonts.Bold,
    fontSize: 20
  },

  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    paddingHorizontal: 12
  },
  walletbalText: {
    fontSize: 17,
    fontFamily:fonts.Regular
  },
  ballance: {
    fontFamily:fonts.Bold
  },
  inputTextStyle: {
    marginTop: 10,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    fontSize: 30,
    fontFamily:fonts.Regular
  },
  buttonWrapper2: {
    marginBottom: 10,
    marginTop: 18,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MAIN_COLOR,
    borderRadius: 8,
  },
  buttonTitle: {
    color: colors.WHITE,
    fontSize: 18,
    fontFamily:fonts.Bold
  },
  quickMoneyContainer: {
    marginTop: 18,
    flexDirection: 'row',
    paddingVertical: 4,
    paddingLeft: 4,
  },
  boxView: {
    height: 40,
    width: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  quckMoneyText: {
    fontSize: 16,
    fontFamily:fonts.Regular
  }

});
