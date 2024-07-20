import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from '../components/AlertDialog';
import CircularLoading from "../components/CircularLoading";
import Grid from '@mui/material/Grid';
import { api } from 'common';
import { useTranslation } from "react-i18next";
import {colors} from '../components/Theme/WebTheme';
import Button from "components/CustomButtons/Button.js";
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
    color: colors.WHITE,
    alignContent: 'center'
  },
  container1: {
    backgroundColor: colors.Header_Text,
    borderTopLeftRadius:"0px",
    borderTopRightRadius:"0px",
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
    padding:'30px',
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
    width: '100%',
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
    "& input": {
      fontFamily: FONT_FAMILY,
    },
  },
  rootRtl3: {
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
    "& input": {
      fontFamily: FONT_FAMILY,
    },
  },
  rootRtl_1: {
    "& label": {
      right: 10,
      left: "auto",
      paddingRight: 33,
      fontFamily: FONT_FAMILY,
    },
    "& legend": {
      textAlign: "right",
      marginRight: 25,
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
  right:{
    "& legend": {
      marginRight:30
    },
  },
  rightStorelink:{
    "& legend": {
      marginRight:25
    },
  },
  title: {
    color: colors.WHITE,
    marginBottom: '15px',
    paddingTop: '15px',
    paddingLeft: '15px',
    fontSize: '20px',
    paddingRight:'15px',
    fontFamily:FONT_FAMILY
  },
  buttonStyle: {
    margin: 0,
    width: '100%',
    height: 40,
    borderRadius: "30px",
    backgroundColor: MAIN_COLOR,
    marginTop: '10px',
    color: colors.WHITE,
    fontWeight:"bold",
    fontFamily:FONT_FAMILY
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
    color: colors.BLACK,
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
  },
}));

const AppInformation = (props) => {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  const {
    editSettings,
    clearSettingsViewError
  } = api;
  const settingsdata = useSelector(state => state.settingsdata);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [data, setData] = useState();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (settingsdata.settings) {
      setData(settingsdata.settings);
    }
  }, [settingsdata.settings]);

  const handleTextChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.AllowCriticalEditsAdmin) {
      if (data.bonus === '') {
        alert(t('proper_bonus'))
      } else {
        setClicked(true);
        dispatch(editSettings(data));
      }
    } else {
      alert(t('demo_mode'));
    }
  }

  const handleClose = () => {
    setClicked(false);
    dispatch(clearSettingsViewError());
  };

 
  return (
    data ?
      <form className={classes.form}>
        <Grid item xs={12} sm={12}>
            <Grid item xs={12}>
              <Typography component="h1" variant="h5" className={classes.title} style={{textAlign:isRTL==='rtl'?'right':'left'}}>
                {t('app_info_title')}
              </Typography>
            </Grid>
          <div className={classes.container1}>
          <Grid container spacing={2} style={{direction:isRTL ==='rtl'?'rtl':'ltr'}} >
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Typography component="h1" variant="h5" style={{textAlign:isRTL=== 'rtl'? 'right':'left'}}>
                {t('app_info')}
              </Typography>
              <TextField
              className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="appName"
                label={ t('AppName')}
                name="appName"
                autoComplete="appName"
                onChange={handleTextChange}
                value={data.appName}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
              <TextField
                className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="CompanyName"
                label={t('CompanyName')}
                name="CompanyName"
                autoComplete="CompanyName"
                onChange={handleTextChange}
                value={data.CompanyName}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
              <TextField
                className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="CompanyAddress"
                label={t('CompanyAddress')}
                name="CompanyAddress"
                autoComplete="CompanyAddress"
                onChange={handleTextChange}
                value={data.CompanyAddress}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
              <TextField
                className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="CompanyWebsite"
                label={t('CompanyWebsite')}
                name="CompanyWebsite"
                autoComplete="CompanyWebsite"
                onChange={handleTextChange}
                value={data.CompanyWebsite}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
              <TextField
                className={isRTL ==="rtl"? classes.rootRtl_1:classes.textField}
                variant="outlined"
                margin="normal"
                fullWidth
                id="contact_email"
                label={t('contact_email')}
                name="contact_email"
                autoComplete="contact_email"
                onChange={handleTextChange}
                value={data.contact_email}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
              <TextField
                className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="CompanyPhone"
                label={t('company_phone')}
                name="CompanyPhone"
                autoComplete="CompanyPhone"
                onChange={handleTextChange}
                value={data.CompanyPhone}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
    </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
              <Typography component="h1" variant="h5" style={{ textAlign:isRTL=== 'rtl'? 'right':'left'}}>
                {t('app_link')}
              </Typography>
              <TextField
                className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="CompanyTerms"
                label={t('terms')}
                name="CompanyTerms"
                autoComplete="CompanyTerms"
                onChange={handleTextChange}
                value={data.CompanyTerms}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
               <TextField
                className={isRTL ==="rtl"? classes.rootRtl:classes.textField}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="CompanyTermCondition"
                label={t('term_condition')}
                name="CompanyTermCondition"
                autoComplete="CompanyTermCondition"
                onChange={handleTextChange}
                value={data.CompanyTermCondition}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
              <TextField
                className={isRTL ==="rtl"? classes.rootRtl_1:classes.textField}
                variant="outlined"
                margin="normal"
                fullWidth
                id="FacebookHandle"
                label={t('FacebookHandle')}
                name="FacebookHandle"
                autoComplete="FacebookHandle"
                onChange={handleTextChange}
                value={data.FacebookHandle}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
              <TextField
                className={isRTL ==="rtl"? classes.rootRtl_1:classes.textField}
                variant="outlined"
                margin="normal"
                fullWidth
                id="TwitterHandle"
                label={t('TwitterHandle')}
                name="TwitterHandle"
                autoComplete="TwitterHandle"
                onChange={handleTextChange}
                value={data.TwitterHandle}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
              <TextField
                className={isRTL ==="rtl"? classes.rootRtl_1:classes.textField}
                variant="outlined"
                margin="normal"
                fullWidth
                id="InstagramHandle"
                label={t('InstagramHandle')}
                name="InstagramHandle"
                autoComplete="InstagramHandle"
                onChange={handleTextChange}
                value={data.InstagramHandle}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
              <TextField
                className={isRTL ==="rtl"? [classes.rootRtl,classes.rightStorelink].join(' '):classes.textField}
                variant="outlined"
                margin="normal"
                fullWidth
                id="AppleStoreLink"
                label={t('AppleStoreLink')}
                name="AppleStoreLink"
                autoComplete="AppleStoreLink"
                onChange={handleTextChange}
                value={data.AppleStoreLink}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
              <TextField
                className={isRTL ==="rtl"? [classes.rootRtl,classes.rightStorelink].join(' '):classes.textField}
                variant="outlined"
                margin="normal"
                fullWidth
                id="PlayStoreLink"
                label={t('PlayStoreLink')}
                name="PlayStoreLink"
                autoComplete="PlayStoreLink"
                onChange={handleTextChange}
                value={data.PlayStoreLink}
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
              />
          </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Button
                size="lg"
                onClick={handleSubmit}
                variant="contained" 
                color="secondaryButton"
                className={classes.buttonStyle}
              >
                {t('submit')}
              </Button>

            </Grid>
          </Grid>
          </div>
          <AlertDialog open={settingsdata.error.flag && clicked} onClose={handleClose}>{t('update_failed')}</AlertDialog>
        </Grid>
      </form>
      :
      <CircularLoading />
  );

}

export default AppInformation;