import React from "react";
import classNames from "classnames";
import { makeStyles } from "@mui/styles";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import styles from '../styles/staticPages.js';
import Parallax from "components/Parallax/Parallax";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { colors } from "components/Theme/WebTheme.js";

const dashboardRoutes = [];

const useStyles = makeStyles(styles);


export default function TermCondition(props) {
    const { t,i18n } = useTranslation();
    const isRTL = i18n.dir();
  const classes = useStyles();
  const settings = useSelector(state => state.settingsdata.settings);
  const { ...rest } = props;
  return (
    <div style={{margin:'-8px'}}>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/header-back.jpg").default} />
      <div className={classNames(classes.main, classes.mainRaised)}>
 
      <div className={classes.container}>
            <br/>
            <h2  style={{textAlign:isRTL === 'rtl'?'right':'left',position: "relative",marginTop: "30px",minHeight: "32px",color:colors.Header,textDecoration: "none",[isRTL === "rtl" ? "marginRight" : "marginRight"]: isRTL ? "30px" : "0px",wordBreak: "break-word"}}>{t('term_condition')}</h2>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>{t('term_condition_para1')}</p>
            <br/>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading1')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para2')}
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading2')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para3')}
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading3')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para4')}
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading4')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para5')}
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading5')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para6')}
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading6')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para7')}
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading7')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para8')}
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading8')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para9')}
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading9')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para10')}
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading10')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para11')}
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading11')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para12')}
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
            <strong>{t('term_condition_heading12')}</strong>
            </p>
            <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
                {t('term_condition_para13')}
            </p>
          <p  className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}>
          {t('term_condition_para14')} 
          {settings && settings.contact_email?
            <a href={"mailto:" + settings.contact_email}><strong>{settings.contact_email}</strong></a>
          :null}
          </p>
          <br/>
          <br/>
        </div>
        </div>
      <Footer/>
    </div>
  );
}
