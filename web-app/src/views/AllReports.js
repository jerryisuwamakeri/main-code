import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTranslation } from "react-i18next";
import DriverEarning from './DriverEarning';
import Earningreports from './Earningreports';
import FleetAdminEarning from './FleetAdminEarning';
import { useSelector } from "react-redux";
import { makeStyles} from '@mui/styles';
import { MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY } from "../common/sharedFunctions";
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

export default function AllReports() {
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const auth = useSelector(state => state.auth);
  const classes =useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className={classes.tabs} variant="scrollable">
        {auth.profile.usertype === "fleetadmin" || auth.profile.usertype === "admin" ?
          <Tab style={{marginRight:"20px"}} label={ <Typography className={classes.typography}>{t('driver_earning')}</Typography>} {...a11yProps(0)} />
        :null}
        {auth.profile.usertype === "admin" ?
          <Tab style={{marginRight:"20px"}} label={ <Typography className={classes.typography}>{t('earning_reports')}</Typography>} {...a11yProps(1)} />
        :null}
        {auth.profile.usertype === "admin" ?
          <Tab style={{marginRight:"20px"}} label={t('fleetadmin_earning_reports')} {...a11yProps(2)} />
        :null}
        </Tabs>
      </Box>
        <TabPanel value={value} index={0}>
          <DriverEarning/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Earningreports/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <FleetAdminEarning/>
        </TabPanel>
    </Box>
  );
}