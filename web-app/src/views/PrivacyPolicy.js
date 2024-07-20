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


export default function PrivacyPolicy(props) {
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
            <h2  style={{textAlign:isRTL === 'rtl'?'right':'left',position: "relative",marginTop: "30px",minHeight: "32px",color: colors.Header,textDecoration: "none",[isRTL === "rtl" ? "marginRight" : "marginRight"]: isRTL ? "30px" : "0px",wordBreak: "break-word"}}>{t('privacy_policy')}</h2>
            <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription} >{t('privacy_policy_para1')}</p>
            <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >{t('privacy_policy_para2')}</p>
            <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >{t('privacy_policy_para3')}</p>

            <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
            <strong>{t('privacy_policy_heading_info')}</strong>
            </p>
            <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
                {t('privacy_policy_info_para1')}
            </p>
            <ul className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription} style={{direction:isRTL === 'rtl'?'rtl':'ltr'}}>
            <li>
                {t('privacy_policy_info_list1')}
            </li>
            <li>
                {t('privacy_policy_info_list2')}
            </li>
            <li>
               {t('privacy_policy_info_list3')}
            </li>
            <li>
               {t('privacy_policy_info_list4')}
            </li>
            </ul>
            <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
                {t('privacy_policy_info_para2')}
            </p>
            <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
                {t('privacy_policy_info_para3')}
            </p>
            <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
                {t('privacy_policy_info_para4')}
            </p>
            <ul className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}style={{direction:isRTL === 'rtl'?'rtl':'ltr'}}>
                <li>
                    {t('privacy_policy_info_list5')}
                </li>
                <li>
                    {t('privacy_policy_info_list6')}
                </li>
                <li>
                    {t('privacy_policy_info_list7')}
                </li>
                
              </ul> 
            <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
                {t('privacy_policy_info_para5')}
            </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              <strong>{t('privacy_policy_heading_log')}</strong>
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
            {t('privacy_policy_log_para1')}
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              <strong>{t('privacy_policy_heading_cookie')}</strong>
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              {t('privacy_policy_cookie_para1')}
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              {t('privacy_policy_cookie_para2')}
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              <strong>{t('privacy_policy_heading_service')}</strong>
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              {t('privacy_policy_service_para1')}
          </p>
          <ul className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription} style={{direction:isRTL === 'rtl'?'rtl':'ltr'}}>
              <li>
                  {t('privacy_policy_service_list1')}
              </li>
              <li>
                 {t('privacy_policy_service_list2')}
              </li>
              <li>
                  {t('privacy_policy_service_list3')}
              </li>
              <li>
                  {t('privacy_policy_service_list4')}
              </li>
            </ul>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
             {t('privacy_policy_service_para2')}
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              <strong>{t('privacy_policy_heading_security')}</strong>
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              {t('privacy_policy_security_para1')}
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              <strong>{t('privacy_policy_heading_link')}</strong>
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              {t('privacy_policy_link_para1')}
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              <strong>{t('privacy_policy_heading_children')}</strong>
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              {t('privacy_policy_children_para1')}
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              <strong>{t('delete_account_lebel').toUpperCase()}</strong>
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              {t('delete_account_msg')}
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
            {t('delete_account_subheading')}
          </p>
            <ul className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription} style={{direction:isRTL === 'rtl'?'rtl':'ltr'}}>
                <li>
                {t('delete_account_para1')}
                </li>
                <li>
                {t('delete_account_para2')}
                </li>
            </ul>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              <strong>{t('privacy_policy_heading_change_privacy')}</strong>
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              {t('privacy_policy_change_privacy_para1')}
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              {t('privacy_policy_change_privacy_para2')}
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
              <strong>{t('privacy_policy_heading_contact')}</strong>
          </p>
          <p className={isRTL === "rtl" ? classes.rtlDescription : classes.ltrDescription}  >
          {t('privacy_policy_contact_para1')} 
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
