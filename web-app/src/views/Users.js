import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Riders from './Riders';
import Drivers from './Drivers';
import FleetAdmins from './FleetAdmins';
import CreateAdmin from './CreateAdmin';
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { makeStyles} from '@mui/styles';
import {MAIN_COLOR,SECONDORY_COLOR, FONT_FAMILY} from "../common/sharedFunctions"
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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

export default function Users() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();
  const auth = useSelector(state => state.auth);
  const [role, setRole] = React.useState(null);
  const classes = useStyles();

  React.useEffect(() => {
    if(auth.profile && auth.profile.usertype){
      setRole(auth.profile.usertype);
    }
  }, [auth.profile]);

  const handleChange = (event, newValue) => {
    navigate(`/users/${newValue}`)
  };

  React.useEffect(()=>{
    if(id && typeof(Number(id)) === "number" && Number(id)>=0 && Number(id) <=3){
      setValue(Number(id));
    }else{
      navigate("/404");
    }
  },[id,navigate])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"  className={classes.tabs} variant="scrollable">
          <Tab label={ <Typography className={classes.typography}>{t('riders')}</Typography>} {...a11yProps(0)} />
          <Tab  label={ <Typography className={classes.typography}>{t('drivers')}</Typography>} {...a11yProps(1)} />
          {role === 'fleetadmin'?
            null : <Tab  label={ <Typography className={classes.typography}>{t('fleetadmins')}</Typography>} {...a11yProps(2)} />
          }
          {role === 'fleetadmin'?
            null : <Tab label={ <Typography className={classes.typography}>{t('alladmin')}</Typography>} {...a11yProps(3)} />
          }
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Riders/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Drivers/>
      </TabPanel>
        <TabPanel value={value} index={2}>
          <FleetAdmins/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <CreateAdmin/>
        </TabPanel>
    </Box>
  );
}