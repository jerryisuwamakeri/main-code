import React from 'react';
import moment from 'moment/min/moment-with-locales';
import { colors } from "../components/Theme/WebTheme";
import {
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import { useTranslation } from "react-i18next";
import OtherPerson from 'components/OtherPerson';
export const calcEst = false;
export const showEst = true;
export const optionsRequired = false;


export const MAIN_COLOR = colors.TAXIPRIMARY;
export const SECONDORY_COLOR = colors.TAXISECONDORY;

export const FONT_FAMILY =  '"Roboto", "Helvetica", "Arial", sans-serif';

export const bookingHistoryColumns = (role, settings, t, isRTL) => [
  { title: t('booking_ref'), field: 'reference'},
  { title: t('booking_date'), field: 'bookingDate', render: rowData => rowData.bookingDate?moment(rowData.bookingDate).format('lll'):null},
  { title: t('car_type'), field: 'carType'},
  { title: t('assign_driver'), field: 'driver_name'},
  { title: t('booking_status_web'), field: 'status',
   render: rowData => 
  <div
  style={{backgroundColor:rowData.status === "CANCELLED"?colors.RED :rowData.status=== "COMPLETE"?colors.GREEN : colors.YELLOW, color:"white", padding:7, borderRadius:"15px", fontWeight:"bold", width:"150px", margin: 'auto' }}
  >{t(rowData.status)}</div>,  },
    { title: t('otp'), field: 'otp',
  },
  { title: t('trip_cost'), field: 'trip_cost',
  render: (rowData) =>
  rowData.trip_cost
  ? settings.swipe_symbol
  ? rowData.trip_cost + " " + settings.symbol
  : settings.symbol + " " + rowData.trip_cost
: settings.swipe_symbol
  ? "0 " + settings.symbol
  : settings.symbol + " 0",
 },
];

export const BookingModalBody = (props) => {
    const { t, i18n  } = useTranslation();
    const isRTL = i18n.dir();
    const { classes, handleChange, auth, profileData, instructionData,otherPerson, setOtherPerson } = props;
    return (
        <span>
            {auth.profile.usertype === 'customer' && !auth.profile.firstName ?
            <Grid item xs={12}>
              <TextField
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                variant="outlined"
                margin="normal"
                required = {auth.profile.firstName ? false : true }
                fullWidth
                id="firstName"
                label={t('firstname')}
                name="firstName"
                autoComplete="firstName"
                onChange={handleChange}
                value={profileData.firstName}
                autoFocus
                className={isRTL==='rtl'?classes.inputRtl:classes.textField}
                style={{direction:isRTL==='rtl'?'rtl':'ltr'}}
              />
            </Grid>
            : null }
            {auth.profile.usertype === 'customer' && !auth.profile.lastName ?
            <Grid item xs={12}>
              <TextField
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                variant="outlined"
                margin="normal"
                required = {auth.profile.lastName ? false : true }
                fullWidth
                id="lastName"
                label={t('lastname')}
                name="lastName"
                autoComplete="lastName"
                onChange={handleChange}
                value={profileData.lastName}
                className={isRTL==='rtl'?classes.inputRtl:classes.textField}
                style={{direction:isRTL==='rtl'?'rtl':'ltr'}}
              />
            </Grid>
            : null }
            {auth.profile.usertype === 'customer' && !auth.profile.email ?
            <Grid item xs={12}>
              <TextField
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                variant="outlined"
                margin="normal"
                required = {auth.profile.email ? false : true }
                fullWidth
                id="email"
                label={t('email')}
                name="email"
                autoComplete="email"
                onChange={handleChange}
                value={profileData.email}
                className={isRTL==='rtl'?classes.inputRtl:classes.textField}
                style={{direction:isRTL==='rtl'?'rtl':'ltr'}}
              />
            </Grid>
            : null }
            <OtherPerson
              classes = {classes}
              otherPerson={otherPerson}
              handleChange={handleChange}
              setOtherPerson={setOtherPerson}
              instructionData={instructionData}
            />
            <Typography component="h2" variant="h5" style={{marginTop:15, color:colors.BLACK, fontFamily: FONT_FAMILY}}>
                { t('estimate_fare_text')}
            </Typography>
        </span>
    )
}

export const validateBookingObj = (t, bookingObject, instructionData) => {
    delete bookingObject.driverEstimates;
    return { bookingObject };
}

export const PanicSettings = (props) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir();
    const { classes, data, handleTextChange } = props;
    return (
        <span>
            <Typography component="h1" variant="h5" style={{ marginTop: '15px', textAlign: isRTL === 'rtl' ? 'right' : 'left',fontFamily: FONT_FAMILY }}>
                {t('panic_num')}
            </Typography>
            <TextField
                InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                variant="outlined"
                margin="normal"
                fullWidth
                id="panic"
                label={t('panic_num')}
                className={isRTL === "rtl" ? [classes.rootRtl_1, classes.right] : classes.textField}
                name="panic"
                autoComplete="panic"
                onChange={handleTextChange}
                value={data.panic}
            />
        </span>
    )
}

export const DispatchSettings = (props) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir();
    const { autoDispatch, onChange } = props;
    return (
        <FormControlLabel
            style={{ flexDirection: isRTL === 'rtl' ? 'row-reverse' : 'row' }}
            control={
                <Switch
                    checked={autoDispatch}
                    onChange={onChange}
                    name="autoDispatch"
                    color="primary"
                />
            }
        label={ <Typography style={{fontFamily:FONT_FAMILY}}>{t('auto_dispatch')}</Typography>}
      />
    )
}

export const BookingImageSettings = (props) => {
    return null;
}

export const carTypeColumns = (t, isRTL, onClick) =>  [
    { title: t('name'), field: 'name', },
    { title: t('image'),  field: 'image',
      initialEditValue: 'https://cdn.pixabay.com/photo/2012/04/15/22/09/car-35502__480.png',
      render: rowData => rowData.image? <button onClick={()=>{onClick(rowData)}}><img alt='CarImage' src={rowData.image} style={{width: 50}}/></button>:null
    },
    { title: t('base_fare'), field: 'base_fare', type: 'numeric',  initialEditValue: 0 },
    { title: t('rate_per_unit_distance'), field: 'rate_per_unit_distance', type: 'numeric',  initialEditValue: 0},
    { title: t('rate_per_hour'), field: 'rate_per_hour', type: 'numeric',  initialEditValue: 0},
    { title: t('min_fare'), field: 'min_fare', type: 'numeric',  initialEditValue: 0},
    { title: t('convenience_fee'), field: 'convenience_fees', type: 'numeric',  initialEditValue: 0},
    {
      title: t('convenience_fee_type'),
      field: 'convenience_fee_type',
      lookup: { flat: t('flat'), percentage: t('percentage')},
    },
    {
      title: t('fleet_admin_comission'), field: 'fleet_admin_fee', type: 'numeric', 
     initialEditValue: 0
    },
    { title: t('extra_info'), field: 'extra_info' , },
    { title: t('position'), field: 'pos', type: 'numeric', defaultSort:'asc'}
];

export const acceptBid = (selectedBooking, selectedBidder) => {
    return null;
}

export const BidModal = (props) => {
    return null
}

export const  downloadCsv = (data, fileName) => {
    const finalFileName = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
    a.setAttribute("download", finalFileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export const DeliveryFlow = (props) => {
    return null
}