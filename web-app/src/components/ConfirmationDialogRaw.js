import React, { useState, useEffect, useRef } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from 'common/sharedFunctions';

export default function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const { t, i18n  } = useTranslation();
  const isRTL = i18n.dir();
  const [value, setValue] = useState(valueProp);
  const radioGroupRef = useRef(null);
  const options = useSelector(state => state.cancelreasondata.simple);

  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      style={{ direction: isRTL === 'rtl' ? 'rtl' : 'ltr', fontFamily: FONT_FAMILY }}
    >
      <DialogTitle id="confirmation-dialog-title" style={{ textAlign: 'center', fontFamily: FONT_FAMILY }}>
        {t('select_reason')}
      </DialogTitle>
      <DialogContent dividers style={{ fontFamily: FONT_FAMILY }}>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={value}
          onChange={handleChange}
          style={{ fontFamily: FONT_FAMILY }}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio style={{ margin: 10, fontFamily: FONT_FAMILY }} />}
              label={option}
              style={{ padding: 8, fontFamily: FONT_FAMILY }}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontFamily: FONT_FAMILY,
                },
              }}
             
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions style={{ fontFamily: FONT_FAMILY }}>
        <Button autoFocus onClick={handleCancel} color="primary" style={{ fontFamily: FONT_FAMILY }}>
          {t('cancel')}
        </Button>
        <Button onClick={handleOk} color="primary" style={{ fontFamily: FONT_FAMILY }}>
          {t('ok')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
