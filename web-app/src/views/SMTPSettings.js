import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { useSelector } from "react-redux";
import Grid from '@mui/material/Grid';
import { api } from 'common';
import { useTranslation } from "react-i18next";
import {colors} from '../components/Theme/WebTheme';
import Button from "components/CustomButtons/Button.js";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import {MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY } from "../common/sharedFunctions"

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
      fontFamily: FONT_FAMILY,
    },
  },
  typography: {
    fontFamily: FONT_FAMILY,
  },
  container: {
    zIndex: "12",
    color:colors.WHITE,
    alignContent: 'center',
    width:'70%'
  },
  container1: {
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
    padding: '30px',
    width: '100%',
    top: "19px",
    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
  },
  gridcontainer: {
    alignContent: 'center'
  },
  items: {
    margin: 0,
    width: '100%'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: 192,
    height: 192
  },
  form: {
    width: '50%',
    marginTop: theme.spacing(1),
    backgroundColor: MAIN_COLOR,
    alignContent: 'center',
    borderRadius: "8px",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  rootRtl: {
    "& label": {
      right: 10,
      left: "auto",
      paddingRight: 20,
      fontFamily: FONT_FAMILY,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 20,
      fontFamily: FONT_FAMILY,
    },
    "& label.Mui-focused": {
      color: MAIN_COLOR,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: MAIN_COLOR,
      },
    },
    "& input": {
      fontFamily: FONT_FAMILY,
    },
  },
  rootRtl_1: {
    "& label": {
      right: 15,
      left: "auto",
      paddingRight: 25,
      fontFamily: FONT_FAMILY,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 25,
      fontFamily: FONT_FAMILY,
    },
    "& label.Mui-focused": {
      color: MAIN_COLOR,
      fontFamily: FONT_FAMILY,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: MAIN_COLOR,
      },
    },
  },
  rootRtl_2: {
    "& label": {
      right: 10,
      left: "auto",
      paddingRight: 12,
      fontFamily: FONT_FAMILY,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 25,
      fontFamily: FONT_FAMILY,
    },
    "& label.Mui-focused": {
      color: MAIN_COLOR,
      fontFamily: FONT_FAMILY
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: MAIN_COLOR,
      },
    },
  },
  right: {
    "& legend": {
      marginRight: 30
    },
  },
  rightStorelink: {
    "& legend": {
      marginRight: 25
    },
  },
  title: {
    color: colors.WHITE,
    marginBottom: '15px',
    paddingTop: '15px',
    paddingLeft: '15px',
    fontSize: '20px',
    fontFamily: FONT_FAMILY,
  },
  buttonStyle: {
    margin: 0,
    width: '100%',
    padding: '12px 24px',
    minWidth: '150px',
    height: 40,
    borderRadius: "30px",
    backgroundColor: MAIN_COLOR,
    color:colors.WHITE,
    fontFamily: FONT_FAMILY,
  },
  textField: {
    "& label.Mui-focused": {
      color: MAIN_COLOR,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: MAIN_COLOR,
      },
    },
    "& input": {
      fontFamily: FONT_FAMILY,
    },
  },
  selectField: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
  },
}));

const SmtpSettings = (props) => {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  const {
    checkSMTP
  } = api;
  const settings = useSelector(state => state.settingsdata.settings);
  const smtpdata = useSelector(state => state.smtpdata);
  const classes = useStyles();
  const [data, setData] = useState();
  const [fromEmail, setFromEmail] = useState('');

  useEffect(() => {
    if (smtpdata.smtpDetails) {
        setData(smtpdata.smtpDetails);
        setFromEmail(smtpdata.fromEmail);
    }                                                                             
    if (smtpdata.fromEmail) {
        setData(smtpdata.smtpDetails);
        setFromEmail(smtpdata.fromEmail);
    }
  }, [smtpdata.smtpDetails, smtpdata.fromEmail]);
                    
  const handleTextChange = (e) => {
    if (e.target.name === 'pass' || e.target.name === 'user' ){
        setData({...data,auth: data?.auth?{...data.auth, [e.target.name]: e.target.value}:{[e.target.name]: e.target.value}});
    }else if (e.target.name === 'port' ){
        setData({...data, port:parseInt(e.target.value)});
    }else{
        setData({...data, [e.target.name]: e.target.value});
    }
  };

  const handleSubmit = (e) => {
    if (settings.AllowCriticalEditsAdmin) {
      checkSMTP(fromEmail, data).then((res)=>{
        if(res.success){
            alert(t('success'));
        }else{
          alert(t('smtp_error'));
        }
      })
    } else {
      alert(t('demo_mode'));
    }
  }

  const handleSwitchChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.checked });
  };

  return (
    <form className={classes.form}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5" className={classes.title} style={{ textAlign: isRTL === 'rtl' ? 'right' : 'left',  paddingRight:5 }}>
              {t('smtpsettings_title')}
            </Typography>
          </Grid>
         <div className={classes.container1}>
            <Grid container spacing={2} style={{direction:isRTL ==='rtl'?'rtl':'ltr'}} >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextField
                        InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                        className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="fromEmail"
                        label={t('fromEmail')}
                        name="fromEmail"
                        autoComplete="fromEmail"
                        onChange={(e)=>setFromEmail(e.target.value)}
                        value={settings.AllowCriticalEditsAdmin ? fromEmail :t("hidden_demo")}
                    />
                    <TextField
                        InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                        className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="host"
                        label={t('host')}
                        name="host"
                        autoComplete="host"
                        onChange={handleTextChange}
                        value={settings.AllowCriticalEditsAdmin ? data && data.host? data.host: '': t("hidden_demo")}
                    />
                    <TextField
                        InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                        className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="port"
                        label={t('port')}
                        name="port"
                        autoComplete="port"
                        onChange={handleTextChange}
                        value={settings.AllowCriticalEditsAdmin ? data && data.port? data.port.toString(): "" : t("hidden_demo")}
                    />
                    <TextField
                        InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                        className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="user"
                        label={t('username')}
                        name="user"
                        autoComplete="user"
                        onChange={handleTextChange}
                        value={settings.AllowCriticalEditsAdmin ? data && data.auth && data.auth.user? data.auth.user: '' : t("hidden_demo")}
                    />
                    <TextField
                        InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                        className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="pass"
                        label={t('password')}
                        name="pass"
                        autoComplete="pass"
                        onChange={handleTextChange}
                        value={settings.AllowCriticalEditsAdmin ? data && data.auth && data.auth.pass? data.auth.pass: '' : t("hidden_demo")}
                        type='password'
                    />
                    <FormControlLabel
                        style={{ flexDirection: isRTL === 'rtl' ? 'row' : 'row-reverse', paddingTop:10, paddingBottom:15, marginLeft:5 }}
                        label={ <Typography className={classes.typography}>{t('secure')}</Typography>}
                        control={
                            <Switch
                                checked={data && data.secure? data.secure : false}
                                onChange={handleSwitchChange}
                                name="secure"
                                color="primary"
                            />
                        }
                    />
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        variant="contained" 
                        color="secondaryButton"
                        className={classes.buttonStyle}
                    >
                    <Typography style={{fontFamily:FONT_FAMILY, wordBreak:"break-word",whiteSpace: 'normal',fontSize: '14px', textOverflow:"ellipsis"}}>{t('submit')}</Typography>
                    </Button>
                </Grid>
            </Grid>
        </div>
      </Grid>
    </form>
  );

}

export default SmtpSettings;