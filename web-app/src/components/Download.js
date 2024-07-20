import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import HandsOnMobile from '../assets/img/handsonmobile.jpg';
import useStyles from '../styles/styles';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from 'common/sharedFunctions';

const DownloadApp = () => {
  const classes = useStyles();
  const settings = useSelector(state => state.settingsdata.settings);
  const { t } = useTranslation();

  return (
    <Box className={classes.aboutUsContainer} style={{marginBottom: -15}}>
      <Grid container spacing={3} className={classes.gridContainer}>
        <Grid item xs={12} md={5}>
          <img src={HandsOnMobile} alt="My Team" className={classes.largeImage} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight={700} fontFamily={FONT_FAMILY} className={classes.title}>
          {t('mobile_apps_on_store')}
          </Typography>
          <Typography fontFamily={FONT_FAMILY} className={classes.aboutUsSubtitle}>
          {t('app_store_deception1')}
          </Typography>
          {settings && settings.AppleStoreLink?
            <a href={settings.AppleStoreLink}><img src={require("../assets/img/appstore.png").default} alt="Apple Store Link"/></a>
            :null}
            <span style={{marginRight: '5px'}}></span>
            {settings && settings.PlayStoreLink?
            <a href={settings.PlayStoreLink}><img src={require("../assets/img/playstore.png").default} alt="Playstore Link"/></a>
            :null}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DownloadApp;