/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from "react-i18next";
import Box from '@mui/material/Box';
import { FONT_FAMILY,MAIN_COLOR } from 'common/sharedFunctions';

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
      fontFamily:FONT_FAMILY,
    },
  },
  rootRtl_1:{
    "& label": {
      right: 75,
      left: "auto",
      fontFamily:FONT_FAMILY,
    },
    "& legend": {
      textAlign: "right",
      marginRight:60,
      fontFamily:FONT_FAMILY,
    },
    "& input": {
      fontFamily: FONT_FAMILY,
    },
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
});

export default function CountrySelect(props) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir();
  const classes = useStyles();

  return (
    <Autocomplete
      id="country-select-demo"
      style={{ width: '100%',...props.style }}
      options={props.countries}
      classes={{
        option: classes.option,
      }}
      autoHighlight
      getOptionLabel={(option) => `${option.label} +${option.phone}`}
      
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          <Typography fontFamily={FONT_FAMILY}>{option.label} ({option.code}) +{option.phone}</Typography>
        </Box>
      )}
      disabled={props.disabled}
      onChange={props.onChange}
      value={props.value}
      disableClearable={props.dis}
      renderInput={(params) => (
        <TextField
          InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
          {...params}
          label={props.label}
          className={isRTL ==="rtl"? classes.rootRtl_1:classes.textField}
          style={{direction:isRTL === 'rtl'?'rtl':'ltr'}}
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password'
          }}
          
        />
      )}
    />         
  );
}