/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from "react-i18next";
import {MAIN_COLOR, FONT_FAMILY } from "../common/sharedFunctions"

const useStyles = makeStyles({
    option1: {
        fontSize: 15,
        fontFamily: FONT_FAMILY,
        '& > span': {
            marginRight: 10,
            fontSize: 18,
          }
        },
        option2: {
        fontSize: 15,
        fontFamily: FONT_FAMILY,
        '& > span': {
            marginRight: 10,
            fontSize: 18,
        },
        direction:'rtl'
    },
    rootRtl_1:{
        "& label": {
        right: 20,
        left: 'auto',
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
    rootRtl_2:{
        "& label": {
        right: 35,
        left: 'auto',
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
    textField: {
      "& label": {
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
    
});

export default function CountryListSelect(props) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir();
  const classes = useStyles();

  const onlyCode = props.onlyCode;

  return (
    <Autocomplete
      id="country-select-demo"
      style={{ width: '100%',...props.style }}
      options={props.countries}
      classes={isRTL === 'rtl'?{option: classes.option2}:{option: classes.option1}}
      autoHighlight
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      disabled={props.disabled}
      onChange={props.onChange}
      value={props.value}
      disableClearable={props.dis}
      renderInput={(params) => (
        <TextField
          InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
          {...params}
          label={props.label}
          className={isRTL ==="rtl"? (onlyCode? classes.rootRtl_1:classes.rootRtl_2):classes.textField}
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