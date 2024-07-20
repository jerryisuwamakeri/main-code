import React, { useState, useEffect } from 'react';
import { Registration } from '../components';
import { StyleSheet, View, Alert } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import i18n from 'i18n-js';
import { api } from 'common';

export default function RegistrationPage(props) {
  const {
    mainSignUp, 
    validateReferer,
    checkUserExists,
    editreferral
  } = api;
  const [loading, setLoading] = useState(false);
  const useduserReferral = useSelector(state => state.usedreferralid.usedreferral);
  const { t } = i18n;

    const dispatch = useDispatch()
    const clickRegister = async (regData) => {
    setLoading(true);
    checkUserExists(regData).then((res)=>{
      if(res.users && res.users.length>0){
        setLoading(false);
        Alert.alert(t('alert'),t('user_exists'));
      }
      else if(res.error){
        setLoading(false);
        Alert.alert(t('alert'),t('email_or_mobile_issue'));
      }
      else{
        if (regData.referralId && regData.referralId.length > 0) {
          
          validateReferer(regData.referralId).then((referralInfo)=>{
            const referrals = useduserReferral ?? [];
            for (let i = 0; i < referrals.length; i++) {
                if(referrals[i].email===regData.email){
                    Alert.alert(t("referral_email_used"))
                    setLoading(false)
                    return
                }else if(referrals[i].phone===regData.mobile){
                    Alert.alert(t("referral_number_used"))
                    setLoading(false)
                    return
                }
               
               
            }
            if (referralInfo.uid) {
                            mainSignUp({...regData, signupViaReferral: referralInfo.uid}).then((res)=>{
                             
                            dispatch(editreferral({email:regData.email,phone:regData.mobile},"Add"))
                setLoading(false);
                if(res.uid){
                  Alert.alert(
                    t('alert'),
                    t('account_create_successfully'),
                    [
                        {
                            text: t('ok'), 
                            onPress: () => {
                             props. navigation.goBack();
                            }
                        },
                    ],
                    { cancelable: false },
                  );
                }else{
                  Alert.alert(t('alert'),t('reg_error'));
                }
              })
            }else{
              setLoading(false);
              Alert.alert(t('alert'),t('referer_not_found'))
            }
          }).catch((error)=>{
            setLoading(false);
            Alert.alert(t('alert'),t('referer_not_found'))
          });
        } else {
          mainSignUp(regData).then((res)=>{
                        setLoading(false);
            if(res.uid){
                            Alert.alert(
                  t('alert'),
                  t('account_create_successfully'),
                  [
                      {
                          text: t('ok'), 
                          onPress: () => {
                            props.navigation.goBack();
                          }
                      },
                  ],
                  { cancelable: false },
              );
            }else{
              Alert.alert(t('alert'),t('reg_error'));
            }
          })
        }
      }
    });
  }

  return (
    <View style={styles.containerView}>
      <Registration
        onPressRegister={(regData) => clickRegister(regData)}
        onPressBack={() => { props.navigation.goBack() }}
        loading={loading}
        >
      </Registration>
    </View>
  );
}
const styles = StyleSheet.create({
  containerView: { flex: 1 },
  textContainer: { textAlign: "center" },
});
