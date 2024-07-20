import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from "react-i18next";
import {colors} from './Theme/WebTheme';

export default function AlertDialogTwoButton(props) {
  const { t } = useTranslation();
  const { open,onClose,children,onGoto } = props;
  return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Alert"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={onClose} style={{backgroundColor:colors.ALERT_BUTTON_CLOSE_COLOR, color: colors.Black, padding:10,}}>
            {t('close')}
          </Button>
          <Button onClick={onGoto} style={{backgroundColor:colors.ALERT_BUTTON_GOTO_COLOR, color: colors.Black, marginLeft:10,padding:10,}}>
            {t('goto')}
          </Button>
        </DialogActions>
      </Dialog>
  );
}
