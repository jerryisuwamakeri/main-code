import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from "@mui/styles";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "@mui/material/Icon";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import styles from '../styles/loginPage.js';
import image from "assets/img/background.jpg";
import { useSelector, useDispatch } from "react-redux";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AlertDialog from '../components/AlertDialog';
import CountrySelect from '../components/CountrySelect';
import { FirebaseContext, api } from 'common';
import { useTranslation } from "react-i18next";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import DialogActions from '@mui/material/DialogActions';
import { GoogleLogin } from '@react-oauth/google';
import {MAIN_COLOR, FONT_FAMILY} from "../common/sharedFunctions.js"
import { colors } from 'components/Theme/WebTheme.js';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const { authRef, RecaptchaVerifier, signInWithPhoneNumber } = useContext(FirebaseContext);
  const { t, i18n} = useTranslation();
  const {
    googleLogin,
    clearLoginError,
    mobileSignIn,
    countries,
    sendResetMail,
    verifyEmailPassword,
    requestMobileOtp,
    verifyMobileOtp,
    mainSignUp,
    checkUserExists,
    validateReferer
  } = api;
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settingsdata.settings);
  const dispatch = useDispatch();
  const [capatchaReady, setCapatchaReady] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifier, setVerifier] = useState(null);
  const [mobileWithoutCountry, setMobileWithoutCountry] = useState('');
  const[showSignUp, setShowSignUp] = useState(false);
  const [message,setMessage] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const isRTL = i18n.dir();

  const [data, setData] = React.useState({
    email: '',
    confirmpassword: "",
    country: "",
    contact: '',
    mobile:"",
    password: '',
    otp: '',
    verificationId: null,
    firstName: '',
    lastName: '',
    selectedcountry:null,
    usertype:'customer',
    referralId:'',
    entryType: null
  });

  const [otpCalled, setOtpCalled] = useState();

  const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });

  const classes = useStyles();
  const { ...rest } = props;


  useEffect(() => {
    if(settings){
        for (let i = 0; i < countries.length; i++) {
            if(countries[i].label === settings.country){
                setData({
                  country: countries[i].phone,
                  selectedcountry:countries[i],
                });
            }
        }
    }
  }, [settings,countries]);

  useEffect(() => {
    if(!window.recaptchaVerifier){
      setCapatchaReady(true);
    }
    if (auth.profile) {
      if(auth.profile.uid){
        let role = auth.profile.usertype;
        if(role==='admin' || role==='fleetadmin'){
          navigate('/dashboard');
        }
        else if (role==='driver'){
          navigate('/bookings');
        }
        else {
          navigate('/');
        }
      }
    }
    if (auth.error && auth.error.flag && auth.error.msg.message !== t('not_logged_in')) {
      if (auth.error.msg.message === t('require_approval')){
        setCommonAlert({ open: true, msg: t('require_approval') })
      } else if(auth.error.msg.message === "Firebase: Error (auth/invalid-verification-code)."){
        setCommonAlert({ open: true, msg: t('login_error') })
        setIsLoading(false);
      } else{
        if(data.contact && (data.contact === '' ||  !(!data.contact))){
          setCommonAlert({ open: true, msg: t('login_error') })
          setIsLoading(false);
        }
      }
    }
    if(auth.verificationId && otpCalled){
      setOtpCalled(false);
      setData({ ...data, verificationId: auth.verificationId });
    }
  }, [auth.profile, auth.error, auth.verificationId, navigate, data, data.email, data.contact, capatchaReady,RecaptchaVerifier,t, setData, otpCalled, setOtpCalled]);


  const handleGoogleLogin = (credentialResponse) => {
    if(credentialResponse && credentialResponse.credential){
      dispatch(googleLogin(credentialResponse.credential,null))
    } else {
      setCommonAlert({ open: true, msg: t('login_error') })
      setIsLoading(false);
    }
  }

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: '' });
    if (auth.error.flag) {
      setData({...data,email:'',pass:''});
      dispatch(clearLoginError());
    }
  };

  const onInputChange = (event) => {
    setData({ ...data, [event.target.id]: event.target.value })
  }

  const handleGetOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(data.country){
      if(data.contact){
        if (isNaN(data.contact)) {
          setData({...data, entryType: 'email'});
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          if(re.test(data.contact)){
            await dispatch(verifyEmailPassword(
              data.contact,
              data.otp
            ));
          }else{
              setCommonAlert({ open: true, msg: t('proper_email')})
              setIsLoading(false);
          }
        } else{
          setData({...data, entryType: 'mobile'});
          if(settings.AllowCriticalEditsAdmin){
          let formattedNum = data.contact.replace(/ /g, '');
          const phoneNumber = "+" + data.country + formattedNum;
          if (formattedNum.length > 6) {
            if(settings.customMobileOTP){
              dispatch(requestMobileOtp(phoneNumber));
              setData({...data, verificationId: true})
              setIsLoading(false)
            } else {
              if(!window.recaptchaVerifier || verifier===null){
                window.recaptchaVerifier = await new RecaptchaVerifier(authRef(),'sign-in-button', {
                  'size': 'invisible',
                  'callback': function(response) {
                    setCapatchaReady(true);
                  }
                });
              }
              const appVerifier = window.recaptchaVerifier;
              setVerifier(appVerifier);
              await signInWithPhoneNumber(authRef(), phoneNumber, appVerifier)
                .then(res => {
                    setData({...data, verificationId: res.verificationId})
                    setIsLoading(false)
                    window.recaptchaVerifier.clear();
                })
                .catch(error => {
                    setCommonAlert({ open: true, msg: error.code + ": " + error.message});
                    setIsLoading(false);
              });
            }
          } else {
              setCommonAlert({ open: true, msg: t('mobile_no_blank_error')})
              setIsLoading(false);
          }
        } else {
          setCommonAlert({ open: true, msg: t('in_demo_mobile_login')})
          setIsLoading(false);
      }
        }
      }else{
        setCommonAlert({ open: true, msg: t('contact_input_error')})
        setIsLoading(false);
      }
    }else{
      setCommonAlert({ open: true, msg: t('country_blank_error')})
      setIsLoading(false);
    }
  }


  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(data.otp && data.otp.length === 6){
      if(settings.customMobileOTP){
        let formattedNum = data.contact.replace(/ /g, '');
        const phoneNumber = "+" + data.country + formattedNum;
        dispatch(verifyMobileOtp(
          phoneNumber,
          data.otp
        ));
      } else{
        await dispatch(mobileSignIn(
          data.verificationId,
          data.otp
        ));
      }
      setIsLoading(false);
    }else{
      setCommonAlert({ open: true, msg: t('otp_validate_error')})
      setIsLoading(false);
    }
  }

  const handleCancel = (e) => {
    setData({
      ...data,
      contact: null,
      verificationId: null
    });
    setIsLoading(false);
  }

  const onCountryChange = (object, value) => {
    if (value && value.phone) {
      setData({ ...data, country: value.phone, selectedcountry:value });
      setMobileWithoutCountry("")
    }
  };

  const forgotPassword = async (e) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(re.test(data.contact)){
      await dispatch(sendResetMail(data.contact));
      setCommonAlert({ open: true, msg: t('email_send') });
    }else{
      setCommonAlert({ open: true, msg: t('proper_email') });
    }
  };

  const handleShowSignup = ()=>{
    setData({...data, email:"", firstName:"", lastName:"", password:"", confirmpassword:"",usertype:"customer",referralId:""})
    setMobileWithoutCountry("")
    setShowSignUp(!showSignUp)
  }

  const mobileInputChange = (e)=>{
    const val = e.target.value;
    setMobileWithoutCountry(val)
    let formattedNum = val.replace(/ /g, '');
    const phoneNumber = "+" + data.country + formattedNum;
      setData({ ...data, mobile: phoneNumber })
  }

  const handleChangeUser = (event) => {
    setData({ ...data, usertype: event.target.value });
  };
  const checkPasswordValidity = value => {
    if (value !== data.confirmpassword){
        return(t('confirm_password_not_match_err'));
    }
  
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
    return(t('password_must_not_contain_whitespaces'));
    }
  
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(value)) {
    return(t('password_must_have_at_least_one_uppercase_character'));
    }
  
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(value)) {
    return(t('password_must_have_at_least_one_lowercase_character'));
    }
  
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(value)) {
    return(t('password_must_contain_at_least_one_digit'));
    }
  
    const isValidLength = /^.{8,16}$/;
    if (!isValidLength.test(value)) {
    return(t('password_must_be_8-16_characters_long'));
    }
  
    return null;
  }

  const validateMobile = () => {
    let mobileValid = true;
    if (mobileWithoutCountry.length < 6) {
        mobileValid = false;
        setCommonAlert({open:true, msg:t('mobile_no_blank_error')})
    }
    return mobileValid;
}


  const handleSignUp = (e)=>{
    e.preventDefault();
    new Promise((resolve,reject) => {
    setIsLoading(true)
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const validatePassword = checkPasswordValidity(data.password);
    if(re.test(data.email)){
      if (/\S/.test(data.firstName) && data.firstName.length > 0 && /\S/.test(data.lastName) && data.lastName.length > 0){
          if(!validatePassword){
            if (validateMobile()) {
              const userData = { ...data };
              if (userData.usertype === 'customer') delete userData.carType
                delete userData.confirmpassword;
                delete userData.pass;
                checkUserExists(userData).then((res) => {
                  if(res.users && res.users.length > 0){
                    setCommonAlert({open:true, msg:t('user_exists')})
                    setIsLoading(false);
                  }else{
              if (userData.referralId && userData.referralId.length > 0){
                validateReferer(userData.referralId).then((referralInfo)=>{
                  if (referralInfo.uid) {
                    delete userData.country;
                    mainSignUp({...userData, signupViaReferral: referralInfo.uid}).then((res)=>{
                      if(res.uid){
                        setData({...data, email:"", firstName:"", lastName:"", password:"", confirmpassword:"",usertype:"customer",referralId:""})
                        setMobileWithoutCountry("")
                        setMessage(true)
                        setIsLoading(false);
                        resolve();
                      }else{
                        setCommonAlert({open:true, msg:t('reg_error')})
                        setIsLoading(false);
                      }
                    })
                  }else{
                    setCommonAlert({open:true, msg:t('referer_not_found')})
                    setIsLoading(false);
                  }
                }).catch((error)=>{
                  setCommonAlert({open:true, msg:t('referer_not_found')})
                  setIsLoading(false);
                });
              }else{
                delete userData.country;
                mainSignUp(userData).then((res)=>{
                  if(res.uid){
                    setData({...data, email:"", firstName:"", lastName:"", password:"", confirmpassword:"",usertype:"customer",referralId:""})
                    setMobileWithoutCountry("")
                    setMessage(true)
                    setIsLoading(false);
                    resolve();
                  }else{
                    setCommonAlert({open:true, msg:t('reg_error')})
                    setIsLoading(false);
                  }
                })
              }
            }
          })
            }else{
              setCommonAlert({open:true, msg:t('mobile_no_blank_error')})
              reject();
            }
          }else{
            setCommonAlert({open:true, msg:validatePassword})
            reject();
          }
      }else{
        setCommonAlert({open:true, msg:t('proper_input_name')})
        reject();
      }
    }else{
      setCommonAlert({open:true, msg:t('proper_email')})
      reject();
    }
  }).catch(()=>{})
  .finally(()=>{setIsLoading(false)})
  }

  return (
    <div>
      <Header
        absolute
        color="transparent"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          display:'flex'
        }}
      >
      {showSignUp ? 
          <div className={classes.container}>
          <GridContainer justifyContent="center">
            <GridItem xs={12} sm={12} md={8}>
              <Card>
                <form className={classes.form}>
                    <CardHeader
                      style={{
                        backgroundColor: MAIN_COLOR,
                        borderRadius: 10,
                      }}
                      className={classes.cardHeader}
                    >
                      <h4 style={{ color: colors.WHITE, fontSize:20, fontFamily:FONT_FAMILY }}>{t("signup")}</h4>
                    </CardHeader>
                  <CardBody>
                    <GridContainer
                      spacing={2}
                      sx={{
                        display: "flex",
                        gridTemplateColumns: "50%",
                      }}
                    >
                      <GridItem  xs={12} sm={12} md={12} lg={6} xl={6}>
                        <CustomInput
                          labelText={t("first_name")}
                          id="firstName"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            required: true,
                            endAdornment: (
                              <InputAdornment position="start">
                                <AccountBoxIcon
                                  className={classes.inputIconsColor}
                                />
                              </InputAdornment>
                            ),
                          }}
                          onChange={onInputChange}
                          value={data.firstName}
                        />
                      </GridItem>
                      <GridItem  xs={12} sm={12} md={12} lg={6} xl={6}>
                        <CustomInput
                          labelText={t("last_name")}
                          id="lastName"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            required: true,
                            endAdornment: (
                              <InputAdornment position="start">
                                <AccountBoxIcon
                                  className={classes.inputIconsColor}
                                />
                              </InputAdornment>
                            ),
                          }}
                          onChange={onInputChange}
                          value={data.lastName}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={6} xl={6}>
                      {data.selectedcountry && countries && countries.length>0? 
                      <CountrySelect
                        countries={countries}
                        label={t('select_country')}
                        value={data.selectedcountry}
                        onChange={onCountryChange}
                        style={{paddingTop:20}}
                        disabled={ data.verificationId ? true : false}
                        readOnly={!settings.AllowCountrySelection}
                      />
                      : null}
                      </GridItem>
                      <GridItem  xs={12} sm={12} md={12} lg={6} xl={6}>
                        <CustomInput
                          labelText={t("phone")}
                          id="mobileWithoutCountry"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            required: true,
                            endAdornment: (
                              <InputAdornment position="start">
                                <LocalPhoneIcon
                                  className={classes.inputIconsColor}
                                />
                              </InputAdornment>
                            ),
                          }}
                          onChange={mobileInputChange}
                          value={mobileWithoutCountry}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} lg={6} xl={6}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl variant="standard" fullWidth>
                          <InputLabel
                            id="demo-simple-select-label"
                          >
                            <Typography fontFamily={FONT_FAMILY}>{t("User Type")}</Typography>
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={data.usertype || ""}
                            label={t("approved")}
                            onChange={handleChangeUser}
                            className={classes.selectField}
                            aria-label="userType"
                          >
                            <MenuItem value={"customer"}>
                              <Typography fontFamily={FONT_FAMILY}>{t("customer")}</Typography>
                              </MenuItem>
                            <MenuItem value={"driver"}>
                            <Typography fontFamily={FONT_FAMILY}>{t("driver")}</Typography>
                              </MenuItem>
                          </Select>
                        </FormControl>
                      </GridItem>
                      <GridItem  xs={12} sm={12} md={12} lg={6} xl={6}>
                        <CustomInput
                          labelText={t("email")}
                          id="email"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            required: true,
                            endAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon
                                  className={classes.inputIconsColor}
                                />
                              </InputAdornment>
                            ),
                          }}
                          onChange={onInputChange}
                          value={data.email}
                        />
                      </GridItem>

                      <GridItem  xs={12} sm={12} md={12} lg={6} xl={6}>
                        <CustomInput
                          labelText={t("password")}
                          id="password"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            required: true,
                            type:!showPassword? "text" : "password",
                            endAdornment: (
                              <InputAdornment position="start">
                              {!showPassword ? (
                                    <VisibilityIcon
                                      className={classes.inputIconsColor}
                                      onClick={() => setShowPassword(!showPassword)} sx={{cursor:'pointer'}}
                                    />
                                  ) : (
                                    <VisibilityOffIcon
                                      className={classes.inputIconsColor}
                                      onClick={() => setShowPassword(!showPassword)} sx={{cursor:'pointer'}}
                                    />
                                  )}
                              </InputAdornment>
                            ),
                          }}
                          onChange={onInputChange}
                          value={data.password}
                        />
                      </GridItem>
                      <GridItem  xs={12} sm={12} md={12} lg={6} xl={6}>
                        <CustomInput
                          labelText={t("confirm_password")}
                          id="confirmpassword"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            required: true,
                            type:!showConfirmPassword? "text" : "password",
                            endAdornment: (
                              <InputAdornment position="start">
                                  {!showConfirmPassword ? (
                                      <VisibilityIcon
                                      className={classes.inputIconsColor} sx={{cursor:'pointer'}}
                                      onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                                    />
                                      ) : (
                                        <VisibilityOffIcon
                                        className={classes.inputIconsColor} sx={{cursor:'pointer'}}
                                      onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                                        />
                                      )}
                                  </InputAdornment>
                            ),
                          }}
                          onChange={onInputChange}
                          value={data.confirmpassword}
                        />
                      </GridItem>
                      <GridItem  xs={12} sm={12} md={12} lg={12} xl={12}>
                        <CustomInput
                          labelText={t("referralId")}
                          id="referralId"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                <AccountBoxIcon
                                  className={classes.inputIconsColor}
                                />
                              </InputAdornment>
                            ),
                          }}
                          onChange={onInputChange}
                          value={data.referralId}
                        />
                      </GridItem>
                      
                    </GridContainer>
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                {message ? (
                    <div style={{display:"flex", flexDirection:"column", gap:5}}>
                    <Typography style={{ color: colors.GREEN, fontWeight:"bold" }}>{t("account_create_successfully")}</Typography>
                    <Button className={classes.normalButton} simple color="info" onClick={() => { setShowSignUp(false) }}>
                    <Typography fontFamily={FONT_FAMILY}>{t('signIn')}</Typography>
                   </Button>
                    </div>
                       ) : isLoading ? (
                        <DialogActions
                            style={{
                            justifyContent: "center",
                            alignContent: "center",
                            }}
                            >
                      <CircularProgress />
                        </DialogActions>
                    ) : (
                  <>
                  <Button className={classes.normalButton} simple color="info" size="lg" type="submit" onClick={handleSignUp}>
                  <Typography fontFamily={FONT_FAMILY}>{t('signup')}</Typography>
                  </Button>
                  <Button className={classes.normalButton} simple color="info" size="lg" onClick={handleShowSignup}>
                  <Typography fontFamily={FONT_FAMILY}>{t('login')}</Typography>
                  </Button>
                </>
                    )}
                </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div> 
        :
        <>
        <div id="sign-in-button" />
        <div className={classes.container}>
          <GridContainer justifyContent="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card>
                <form className={classes.form}>
                {settings && settings.socialLogin ?
                  <CardHeader style={{
                        backgroundColor: MAIN_COLOR,
                        borderRadius: 10,
                      }} className={classes.cardHeader}>
                    <h4 style={{color:colors.WHITE, fontSize:20, fontFamily:FONT_FAMILY}}>{t('login')}</h4>
                    <div className={classes.socialLine} style={{alignItems: 'center', justifyContent:'center', alignContent:'center' }}>
                    <div className={classes.socialLine}>
                      <Button
                        justIcon
                        href="#pablo"
                        target="_blank"
                        color="transparent"
                      >
                       <GoogleLogin
                          onSuccess={handleGoogleLogin}
                          onError={handleGoogleLogin}
                        />
                      </Button>
                    </div>
                    </div>
                  </CardHeader>
                  :null}
                  <CardBody>
        
                  {data.selectedcountry && settings.mobileLogin && countries && countries.length>0?
                      <CountrySelect
                        countries={countries}
                        label={t('select_country')}
                        value={data.selectedcountry}
                        onChange={onCountryChange}
                        style={{paddingTop:20}}
                        disabled={data.verificationId  ? true : false}
                        readOnly={!settings.AllowCountrySelection}
                        
                      />
                      : null}
                 
                      <CustomInput
                        labelText={settings.emailLogin && settings.mobileLogin ? t('contact_placeholder'):settings.emailLogin && !settings.mobileLogin ? t('email_id'): t('mobile_number')}
                        id="contact"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          required: true,
                          disabled: data.verificationId ? true : false,
                          endAdornment: (
                            <InputAdornment position="start">
                              <AccountBoxIcon className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                        onChange={onInputChange}
                        value={data.contact}
                      />
                    {(data.contact && isNaN(data.contact)) || (settings.emailLogin && !settings.mobileLogin) ?
                      <CustomInput
                      labelText={((data.contact && isNaN(data.contact)) || (settings.emailLogin && !settings.mobileLogin)) ? t('password') : t('otp_here')}
                        id="otp"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "password",
                          required: true,
                          endAdornment: (
                            <InputAdornment position="start">
                              <Icon className={classes.inputIconsColor}>
                                lock_outline
                            </Icon>
                            </InputAdornment>
                          ),
                          autoComplete: "off"
                        }}
                        onChange={onInputChange}
                        value={data.otp}
                      />
                    :null}

                      {data.verificationId ?   
                        <CustomInput
                          labelText={t('otp')}
                          id="otp"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "password",
                            required: true,
                            endAdornment: (
                              <InputAdornment position="start">
                                <Icon className={classes.inputIconsColor}>
                                  lock_outline
                              </Icon>
                              </InputAdornment>
                            ),
                            autoComplete: "off"
                          }}
                          onChange={onInputChange}
                          value={data.otp}
                        />
                        : null}

                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                  {isLoading ? 
                  <DialogActions style={{justifyContent:'center', alignContent:'center'}}>
                    <CircularProgress/>
                  </DialogActions> 
                  :
                    !data.verificationId ?
                    <div>
                      <Button className={classes.normalButton} simple color="primary" size="lg" type="submit" onClick={handleGetOTP}>
                      <Typography fontFamily={FONT_FAMILY}>{settings.mobileLogin ? data.contact && isNaN(data.contact) ? t('login') : t('login_otp') : t('login')}</Typography>
                      </Button>
                      {data.contact && isNaN(data.contact) ? 
                        <Button className={classes.normalButton} simple color="primary" size="lg" onClick={()=>forgotPassword()}>
                          <Typography fontFamily={FONT_FAMILY}>{t('forgot_password')}</Typography>
                        </Button>
                      :null}
                    </div>
                  :
                    <div>
                      <Button className={classes.normalButton} simple color="primary" size="lg" type="submit" onClick={handleVerifyOTP}>
                      <Typography fontFamily={FONT_FAMILY}>{t('verify_otp')}</Typography>
                      </Button>
                      <Button className={classes.normalButton} simple color="primary" size="lg" onClick={handleCancel}>
                      <Typography fontFamily={FONT_FAMILY}>{t('cancel')}</Typography>
                      </Button>
                    </div>
                  }
                  </CardFooter>
                </form>
                {
                  !isLoading ? 
                  <Button className={classes.normalButton} simple color="primary"  type="submit" size="lg" onClick={handleShowSignup}>
                    <Typography fontFamily={FONT_FAMILY}>{t('signup')}</Typography>
                  </Button>
                      :null
                }
                {
                  !settings.AllowCriticalEditsAdmin  ? 
                  <Card style={{  borderRadius: 50,shadowOffset: { width: 0, height:0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,bottom:25}}>
                  <div style={{alignSelf:'center'}}>
                 <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription} style={{ color: 'black', fontSize: 18, }}>{t('Email Id')} : support@exicube.com</p>
                 <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription} style={{ color: 'black', fontSize: 18,  }}>{t('Password')} : Admin@123</p>
                 </div>
                 </Card>
                 :null
                }
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        </>
        }
        <Footer whiteFont />
        <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>{commonAlert.msg}</AlertDialog>
      </div>
    </div>
  );
}