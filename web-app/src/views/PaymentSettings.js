import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from '@mui/styles';
import { MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY } from "../common/sharedFunctions"
import Grid from '@mui/material/Grid';
import Button from "components/CustomButtons/Button.js";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { api } from 'common';
import { colors } from '../components/Theme/WebTheme';
import { Typography } from '@mui/material';

const useStyles = makeStyles({
    tabs: {
        "& .MuiTabs-indicator": {
            backgroundColor: SECONDORY_COLOR,
            height: 3,
        },
        "& .MuiTab-root.Mui-selected": {
            color: MAIN_COLOR,
            fontFamily: FONT_FAMILY,
        },
        "& .MuiTab-root": {
            fontFamily: FONT_FAMILY,
        }
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
    textField: {
        "& input": {
            fontFamily: FONT_FAMILY,
        },
    },
    buttonStyle: {
        margin: 0,
        minWidth: 250,
        height: 40,
        borderRadius: "30px",
        backgroundColor: MAIN_COLOR,
        color: colors.WHITE,
        fontWeight: "bold",
        fontSize: "16px",
        fontFamily: FONT_FAMILY,
    },
    switchLabel: {
        fontFamily: FONT_FAMILY
    }
});
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function PaymentSettings() {
    const { t,i18n } = useTranslation();
    const isRTL = i18n.dir();
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
    const {
        editPaymentMethods
    } = api;

    const [paymentSettings, setPaymentSettings] = useState();
    const [oldPaymentSettings, setOldPaymentSettings] = useState();
    const paymentmethods = useSelector(state => state.paymentmethods);
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.settingsdata.settings);
    
    useEffect(() => {
        const copyOfProviders = JSON.parse(JSON.stringify(paymentmethods.providers));
      if (paymentmethods.providers) {
        setPaymentSettings(paymentmethods.providers); 
        setOldPaymentSettings(copyOfProviders); 
      }else{
        setPaymentSettings(null);
        setOldPaymentSettings(null);
      }
    }, [paymentmethods.providers]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCheck = (e) => {
        let pgName = e.target.name.split("|")[0];
        let pgKey = e.target.name.split("|")[1];
        let ps = Object.assign({}, paymentSettings);;
        ps[pgName][pgKey] = e.target.checked;
        setPaymentSettings(ps);
    }

    const handleText = (e) => {
        let pgName = e.target.name.split("|")[0];
        let pgKey = e.target.name.split("|")[1];
        let ps = Object.assign({}, paymentSettings);;
        ps[pgName][pgKey] = (pgName === 'payulatam') && (pgKey === 'merchantId' || pgKey === 'accountId') && e.target.value.length> 0? parseInt(e.target.value): e.target.value;
        setPaymentSettings(ps);
    }

    const handleSubmit = () => {
        if(settings.AllowCriticalEditsAdmin){
            dispatch(editPaymentMethods(paymentSettings));
        }else{
            alert(t("demo_mode"))
        }
    }

    return (
        paymentSettings?
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}  variant="scrollable" aria-label="basic tabs example" className={classes.tabs}>
                    {Object.keys(paymentSettings).map((pgname, index) =>
                        <Tab key={"key"+index} label={t(pgname)} {...a11yProps(index)} />
                                            )}
                </Tabs>
            </Box>
            {Object.keys(paymentSettings).map((pgname, index) =>
                <TabPanel value={value} index={index} key={"key"+index}>
                    <Grid container spacing={2} style={{ direction: isRTL === 'rtl' ? 'rtl' : 'ltr' }} >
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {Object.keys(paymentSettings[pgname]).map((pgKey) => 
                                paymentSettings[pgname][pgKey] === true ||  paymentSettings[pgname][pgKey] === false ?
                                <FormControlLabel
                                    key={"key"+pgKey}
                                    style={{ flexDirection: isRTL === 'rtl' ? 'row' : 'row-reverse', paddingTop: 10, paddingBottom: 15, marginLeft: 5 }}
                                    label={pgKey}
                                    labelPlacement={isRTL === 'rtl' ? 'end' : 'end'}
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                          fontFamily: FONT_FAMILY,
                                        },
                                      }}
                                    control={
                                        <Switch
                                            checked={paymentSettings[pgname][pgKey]}
                                            onChange={handleCheck}
                                            name={pgname + "|" + pgKey}
                                            color="primary"
                                        />
                                    }
                                />
                                :
                                <TextField
                                    key={"key"+pgKey}
                                    className={isRTL === "rtl" ? classes.rootRtl : classes.textField}
                                    variant="outlined"
                                    margin="normal"
                                    type={paymentSettings[pgname][pgKey] === oldPaymentSettings[pgname][pgKey] ? "password" : "text" }
                                    onFocus={(e)=>{
                                        let pgName = e.target.name.split("|")[0];
                                        let pgKey = e.target.name.split("|")[1];
                                        let ps = Object.assign({}, paymentSettings);
                                        ps[pgName][pgKey] = (pgName === 'payulatam') && (pgKey === 'merchantId' || pgKey === 'accountId') && e.target.value.length> 0? "": "";
                                        setPaymentSettings(ps);
                                    }}
                                    required
                                    fullWidth
                                    id={pgname + "|" + pgKey}
                                    label={pgKey}
                                    name={pgname + "|" + pgKey}
                                    autoComplete={pgname + "|" + pgKey}
                                    onChange={handleText}
                                    value={paymentSettings[pgname][pgKey]}
                                    InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                                />
                            )}
                            <Button
                                size="lg"
                                onClick={handleSubmit}
                                variant="contained"
                                color="secondaryButton"
                                className={classes.buttonStyle}
                            >
                              <Typography style={{fontFamily: FONT_FAMILY, margin:5}} >{t('submit')}</Typography>
                            </Button>   
                        </Grid>
                    </Grid>
                </TabPanel>
            )}
        </Box>
        :null
    );
}