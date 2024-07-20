import React from 'react';
import {
    Grid,
    TextField,
    FormControlLabel,
    Checkbox,
    Typography
} from '@mui/material';

import { useTranslation } from "react-i18next";
import { FONT_FAMILY} from "../common/sharedFunctions"

export default function OtherPerson(props){
    const { t, i18n  } = useTranslation();
    const isRTL = i18n.dir();
    const { classes, otherPerson, handleChange, setOtherPerson, instructionData } = props;
    return (
        <Grid>
         <FormControlLabel
              control={
                <Checkbox checked={otherPerson} onChange={() => setOtherPerson(!otherPerson)} name={t('for_other_person')} />
              }
              label={ <Typography className={classes.typography}>{t('for_other_person')}</Typography>}
            />
            {otherPerson ?
            <Grid>
              <Grid item xs={12}>
                <TextField
                  InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="otherPerson"
                  label={t('otherPerson')}
                  name="otherPerson"
                  autoComplete="otherPerson"
                  onChange={handleChange}
                  value={instructionData.otherPerson}
                  //autoFocus
                  className={isRTL==='rtl'?classes.inputRtl:classes.textField}
                  style={{direction:isRTL==='rtl'?'rtl':'ltr'}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  InputLabelProps={{ style: { fontFamily: FONT_FAMILY } }}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="otherPersonPhone"
                  label={t('otherPersonPhone')}
                  name="otherPersonPhone"
                  autoComplete="otherPersonPhone"
                  type="number"
                  onChange={handleChange}
                  value={instructionData.otherPersonPhone}
                  className={isRTL==='rtl'?[classes.inputRtl, classes.rightRty]:classes.textField}
                  style={{direction:isRTL==='rtl'?'rtl':'ltr'}}
                />
              </Grid>
            </Grid>
            : null }   
        </Grid>
    );
}