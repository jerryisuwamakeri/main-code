import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTranslation } from "react-i18next";
import AppInformation from './AppInformation';
import GeneralSettings from './GeneralSettings';
import LanguageSetting from './LanguageSetting';
import SMTPSettings from './SMTPSettings';
import SmsSettings from './SmsSettings';
import { makeStyles} from '@mui/styles';
import {FONT_FAMILY, MAIN_COLOR,SECONDORY_COLOR} from "../common/sharedFunctions"
import CancellationReasons from './CancellationReasons';
import { Typography } from '@mui/material';

const useStyles = makeStyles({
  tabs: {

    "& .MuiTabs-indicator": {
      backgroundColor: SECONDORY_COLOR,
      height: 3,
    },
    "& .MuiTab-root.Mui-selected": {
      color: MAIN_COLOR
    }
  },
  typography:{
    fontFamily:FONT_FAMILY
  }
})

function TabPanel(props) {
  const { children, value, index, ...other } = props;


  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Settings() {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className={classes.tabs} variant="scrollable">
          <Tab  label={ <Typography className={classes.typography}>{t('app_info')}</Typography>} {...a11yProps(0)} />
          <Tab  label={ <Typography className={classes.typography}>{t('general_settings')}</Typography>} {...a11yProps(1)} />
          <Tab  label={ <Typography className={classes.typography}>{t('language')}</Typography>} {...a11yProps(2)} />
          <Tab  label={ <Typography className={classes.typography}>{t('smtp')}</Typography>} {...a11yProps(3)} />
          <Tab  label={ <Typography className={classes.typography}>{t('smssettings')}</Typography>} {...a11yProps(4)} />
          <Tab  label={ <Typography className={classes.typography}>{t('cancellation_reasons_title')}</Typography>} {...a11yProps(5)} />

        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AppInformation/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GeneralSettings/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <LanguageSetting/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SMTPSettings/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <SmsSettings/>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <CancellationReasons/>
      </TabPanel>
    </Box>
  );
}