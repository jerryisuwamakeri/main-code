import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from "react-i18next";
import { colors } from '../components/Theme/WebTheme';
import { FONT_FAMILY } from 'common/sharedFunctions';

export default function AlertDialog(props) {
  const { t } = useTranslation();
  const { open, onClose, children } = props;
  
  const commonStyles = {
    fontFamily: FONT_FAMILY,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={commonStyles}>{"Alert"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" style={commonStyles}>
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          style={{
            backgroundColor: colors.ALERT_BUTTON_CLOSE_COLOR,
            color: colors.Black,
            padding: 10,
            fontFamily: FONT_FAMILY,
          }}
        >
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
