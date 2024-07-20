/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { List, ListItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import styles from '../../styles/footerStyle.js';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { colors } from "../../components/Theme/WebTheme";
import { FONT_FAMILY} from "../../common/sharedFunctions.js"

const useStyles = makeStyles(styles);


export default function HomeFooter(props) {
  const classes = useStyles();
  const settings = useSelector(state => state.settingsdata.settings);
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const navigate = useNavigate();
  const { t, i18n  } = useTranslation();
  const isRTL = i18n.dir();

  return (
    <footer className={footerClasses} style={{backgroundColor: colors.HEADER}}>
      <div className={classes.container} style={{direction:isRTL === 'rtl' ? 'rtl' : 'ltr'}}>
        <div className={isRTL === 'rtl' ? classes.right : classes.left} style={{marginBottom: '12px'}}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                style={{cursor:'pointer', color: colors.Header_Background,fontFamily: FONT_FAMILY,}}
                className={classes.block }
                onClick={(e) => { e.preventDefault(); navigate('/') }}
              >
                {t('home')}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
                style={{cursor:'pointer', color: colors.Header_Background,fontFamily: FONT_FAMILY}}
                onClick={(e) => { e.preventDefault(); navigate('/bookings') }}
              >
                {t('myaccount')}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
                style={{cursor:'pointer', color: colors.Header_Background,fontFamily: FONT_FAMILY}}
                onClick={(e) => { e.preventDefault(); navigate('/about-us') }}
              >
                {t('about_us')}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
                style={{cursor:'pointer', color: colors.Header_Background,fontFamily: FONT_FAMILY}}
                onClick={(e) => { e.preventDefault(); navigate('/contact-us') }}
              >
                {t('contact_us')}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                style={{cursor:'pointer', color: colors.Header_Background,fontFamily: FONT_FAMILY}} 
                className={classes.block}
                onClick={(e) => { e.preventDefault(); navigate('/privacy-policy') }}
              >
                {t('privacy_policy')}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                style={{cursor:'pointer', color: colors.Header_Background,fontFamily: FONT_FAMILY}} 
                className={classes.block}
                onClick={(e) => { e.preventDefault(); navigate('/term-condition') }}
              >
                {t('term_condition')}
              </a>
            </ListItem>
          </List>
        </div>
        {settings && settings.CompanyWebsite?
        <div style={{marginTop: "12px", color: colors.Header_Background}}>
          &copy; {1900 + new Date().getYear() + " "} 
          <a
          style={{color: colors.Header_Background,fontFamily: FONT_FAMILY }}
            href={settings.CompanyWebsite}
            className={aClasses}
            target="_blank"
          >
            {settings.CompanyName}
          </a>
        </div>
        :null}
      </div>
    </footer>
  );
}

HomeFooter.propTypes = {
  whiteFont: PropTypes.bool
};
