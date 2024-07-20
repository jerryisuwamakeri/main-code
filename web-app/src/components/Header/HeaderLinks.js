/*eslint-disable*/
import React, {useState, useEffect} from "react";
import { makeStyles } from "@mui/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Tooltip from "@mui/material/Tooltip";
import { Info, AccountBox, House } from "@mui/icons-material";
import Button from "components/CustomButtons/Button.js";
import styles from '../../styles/headerLinksStyle.js';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Select, MenuItem  } from '@mui/material';
import moment from 'moment/min/moment-with-locales';
import EmailIcon from '@mui/icons-material/Email';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {Typography} from "@mui/material";
import { FONT_FAMILY } from "common/sharedFunctions.js";
import { colors } from "components/Theme/WebTheme.js";
const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settingsdata.settings);
  const languagedata = useSelector(state => state.languagedata);
  const { i18n,t } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [langSelection, setLangSelection] = useState();
  const [multiLanguage,setMultiLanguage] = useState();

  const handleLanguageSelect = (event) => {
    i18n.addResourceBundle(multiLanguage[event].langLocale, 'translations', multiLanguage[event].keyValuePairs);
    i18n.changeLanguage(multiLanguage[event].langLocale);
    setLangSelection(event);
    moment.locale(multiLanguage[event].dateLocale);
    setIsActive(false);
  };

  useEffect(()=>{
    if(languagedata.langlist){
      for (const key of Object.keys(languagedata.langlist)) {
        if(languagedata.langlist[key].langLocale === i18n.language){
          setLangSelection(key);
        }
      }
      setMultiLanguage(languagedata.langlist);
    }
    
  },[languagedata.langlist]);

  

  useEffect(()=>{
    if(auth.profile && auth.profile.uid){
      setLoggedIn(true);
    }else{
      setLoggedIn(false);
    }
  },[auth.profile]);
  
  const [isActive, setIsActive] = useState(false);

  const toggleDropdown = () => {
    setIsActive(!isActive);
  };

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={(e) => { e.preventDefault(); navigate('/') }}
        >
          <House className={classes.icons} />
          <Typography fontFamily = {FONT_FAMILY} >{t('home')}</Typography> 
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={(e) => { e.preventDefault(); 
            if(loggedIn){
              navigate('/bookings') 
            } else{
              navigate('/login') 
            }
          }}
        >
          {loggedIn?
            <AccountBox className={classes.icons} /> 
            : 
            <AccountBox className={classes.icons} />  
          }         
         
          {loggedIn?
          <Typography fontFamily = {FONT_FAMILY} >{t('myaccount')}</Typography>
            : 
            <Typography fontFamily = {FONT_FAMILY} >{t('login_signup')}</Typography>
          }
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={(e) => { e.preventDefault(); navigate('/about-us') }}
        >
          <Info className={classes.icons} />
          <Typography fontFamily = {FONT_FAMILY} >{t('about_us')}</Typography>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={(e) => { e.preventDefault(); navigate('/contact-us') }}
        >
        <EmailIcon className={classes.icons} />
        <Typography fontFamily = {FONT_FAMILY} >{t('contact_us')}</Typography>
        </Button>
      </ListItem>
      {settings && settings.FacebookHandle?
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-facebook"
          title={t('follow_facebook')}
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href={settings.FacebookHandle}
            target="_blank"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-facebook"} />
          </Button>
        </Tooltip>
      </ListItem>
      :null}
      {settings && settings.TwitterHandle?
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-twitter"
          title={t('follow_twitter')}
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href={settings.TwitterHandle}
            target="_blank"
            color="transparent"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-twitter"} />
          </Button>
        </Tooltip>
      </ListItem>
      :null}
      {settings && settings.InstagramHandle?
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-twitter"
          title={t('follow_instagram')}
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href={settings.InstagramHandle}
            target="_blank"
            color="transparent"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-instagram"} />
          </Button>
        </Tooltip>
      </ListItem>
      :null}
        {multiLanguage && multiLanguage.length >1 ?
      <ListItem className={classes.listItem}>
        <div style={{ display: "flex", justifyContent: "center", }}>
            <div style={{ width: '130px',margin:'5px' }} className={`${isActive ? 'active' : ''}`}>
              <div className={classes.toggleDropdown} onClick={toggleDropdown}>
                <span
                  style={{
                    fontSize: '18px',
                    color: colors.Header,
                    fontFamily:FONT_FAMILY
                  }}
                >
                  {multiLanguage[langSelection].langName}
                </span>
                <i className={`${isActive ? 'active' : ''}`}
                  style={{
                    fontSize: '25px',
                    transition: '0.3s',
                    transform: isActive ? 'rotate(-180deg)' : 'rotate(0)',
                    color:'black'
                  }}>
                  <ArrowDropDownIcon /> </i>
              </div>

              <ul className={classes.optionUl} style={{ display: isActive ? 'block' : 'none', }}>
                {Object.keys(multiLanguage).map((key, index) => (
                  <li
                    className={classes.option}
                    style={{justifyContent:"center", alignItems:"center"}}
                    key={key}
                    onClick={() => handleLanguageSelect(index)}
                  >

                    <span style={{ fontSize: '16px', color: colors.Header, fontFamily:FONT_FAMILY,  }}>{multiLanguage[key].langName}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
      </ListItem>
      :null}
    </List>
  );
}
