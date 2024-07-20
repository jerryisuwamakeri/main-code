import React, { useState, useEffect} from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import useStyles from '../styles/styles';
import { useTranslation } from "react-i18next";
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import CarCrashOutlinedIcon from '@mui/icons-material/CarCrashOutlined';
import backImage from '../assets/img/back.png';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {calcEst, showEst, optionsRequired} from '../common/sharedFunctions';
import {FONT_FAMILY} from "../common/sharedFunctions";
import { colors } from './Theme/WebTheme';

const Section = (props) => {
  const settings = useSelector(state => state.settingsdata.settings);
  const classes = useStyles();
  const { t } = useTranslation();
  const cartypes = useSelector(state => state.cartypes);
  const [data, setData] = useState([]);
  const auth = useSelector(state => state.auth);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (cartypes.cars) {
      setData(cartypes.cars.sort((a, b) => a.pos - b.pos));
    } else {
      setData([]);
    }
  }, [cartypes.cars]);

  useEffect(()=>{
    if(auth.profile && auth.profile.uid){
      setLoggedIn(true);
    }else{
      setLoggedIn(false);
    }
  },[auth.profile]);

  const navigate = useNavigate();
  const role = props.role;
  const color=props.color;
  
  const sectionItems = [
    {
      id: 1,
      icon:  <EmojiTransportationIcon style={{ color: 'gold', fontSize: '30px', marginRight: 5 }} />,
      sentence1:t('pruduct_section_heading_1'),
      sentence: t('product_section_1'),
    },
    {
      id: 2,
      icon:  <AccessTimeIcon style={{ color: 'gold', fontSize: '30px', marginRight: 8 }} />,
      sentence1:t('pruduct_section_heading_2'),
      sentence: t('product_section_2'),
    },
  ];
  const sectionItems1 = [
    {
      id: 1,
      icon:   <CarCrashOutlinedIcon style={{ color: 'gold', fontSize: '30px', marginRight: 8 }} />,
      sentence1:t('pruduct_section_heading_3'),
      sentence: t('product_section_3'),
    },
    {
      id: 2,
      icon:  <VerifiedIcon style={{ color: 'gold', fontSize: '30px', marginRight: 8 }} />,
      sentence1:t('pruduct_section_heading_4'),
      sentence: t('product_section_4'),
    },
  ];

  const Boxs = () => {
    return(
      <Box sx={{ flexGrow: 1, minHeight: data.length > 0 ? '480px' : '160px',marginTop:5,marginBottom:1}}>
        {data && data.length > 0 ?
          <Grid container className={classes.sectionGridContainer}>
            {data.map((item, key) => {
              return (
                <div style={{marginBottom: 55}} key={key}>
                  <Box
                    xs={12}
                    md={3.5}
                    height={300}
                    minHeight={300}
                    width={300}
                    minWidth={275}
                    className={classes.sectionGridItem}
                    boxShadow={3}
                    style={{ backgroundColor: key%2 ===0 ? color.CAR_BOX_EVEN : color.CAR_BOX_ODD, textAlign:'center'}}
                  >
                    <img alt='Car' src={item.image} style={{ width: 150, height: 80 }} />
                    <Typography style={{ margin: 11, color: 'black', fontSize: 20,fontFamily:FONT_FAMILY }}>{item.name}</Typography>
                    <Box style={{ backgroundColor: 'white', height: 215, borderRadius: 25, padding: 10}} boxShadow={3}>
                      {settings.swipe_symbol === false ?
                      <Typography style={{ marginTop: 8,fontWeight:'bold',fontSize:25, fontFamily:FONT_FAMILY }}>{settings.symbol}{item.rate_per_unit_distance}/{settings.convert_to_mile ? t('mile') : t('km')}</Typography>
                      :
                      <Typography style={{ marginTop: 8,fontWeight:'bold',fontSize:25, fontFamily:FONT_FAMILY }}>{item.rate_per_unit_distance}{settings.symbol}/{settings.convert_to_mile ? t('mile') : t('km')}</Typography>
                      }
                      <Typography style={{ marginTop: 5 , fontFamily:FONT_FAMILY}}>{t('min_fare')}:{item.min_fare}</Typography>
                      <Typography style={{ marginTop: 5, fontFamily:FONT_FAMILY }}>{t('extra_info')}:{item.extra_info}</Typography>
                      <Button
                        variant="contained"
                        color="warning"
                        sx={{ width: '150px', fontSize: '16px', marginTop: 3, fontFamily:FONT_FAMILY}}
                        onClick={(e) => { e.preventDefault(); 
                          if(loggedIn){
                          navigate(((role && role === 'driver' )|| (calcEst && !showEst && !optionsRequired && (role === 'admin' || role === 'fleetadmin'))) ? '/bookings' : '/addbookings', 
                          { state: { carData: item }} )
                          }else{
                            navigate('/login')
                          }
                        }}
                      > 
                        { role === 'driver' || (calcEst && !showEst && !optionsRequired && (role === 'admin' || role === 'fleetadmin')) ? t('info'): t('book_now')}
                      </Button>
                    </Box>
                  </Box>
                </div>
              )
            })}
          </Grid>
        :
          <Typography variant="h3" fontWeight={400} style={{ textAlign: 'center', padding: 35, color: color.Header}}>{t('service_start_soon')}</Typography>
        }
      </Box>
    )
  }

  return (
    <div>
          <Boxs/>

      <Box sx={{ flexGrow: 1, minHeight: '350px', backgroundImage: `url(${backImage})`, backgroundSize: 'cover'}}>
        <Typography variant="h3" fontWeight={400} style={{ color:colors.CAR_BOX_ODD, fontFamily:FONT_FAMILY, textAlign: 'center', padding: 35}}>{t('best_service_provider')}</Typography>
        <Grid container className={classes.sectionGridContainer}>
          {sectionItems.map((item, key) => {
            return (
              <Box
                key={key}
                xs={12}
                md={3.5}
                minHeight={150}
                className={classes.sectionGridItem1}
              >
                <div style={{display:'flex'}}>
                  {item.icon}
                  <div>
                    <Typography variant="h5" style={{ color:colors.CAR_BOX_ODD, fontFamily:FONT_FAMILY, fontWeight: 'bold'}}>{item.sentence1}</Typography>
                    <Typography style={{ color:colors.WHITE, fontFamily:FONT_FAMILY,}} className={classes.aboutUsSubtitle}>{item.sentence}</Typography>
                  </div>
                </div> 
              </Box>
            )
          })}
        </Grid>

        <Grid container className={classes.sectionGridContainer}>
          {sectionItems1.map((item, key) => {
            return (
              <Box
                key={key}
                xs={12}
                md={3.5}
                minHeight={150}
                
                className={classes.sectionGridItem1}
              >
                <div style={{display:'flex'}}>
                  {item.icon}
                  <div>
                    <Typography variant="h5" style={{ color:colors.CAR_BOX_ODD, fontFamily:FONT_FAMILY, fontWeight: 'bold' }}>{item.sentence1}</Typography>
                    <Typography style={{ color:colors.WHITE, fontFamily:FONT_FAMILY,}} className={classes.aboutUsSubtitle}>{item.sentence}</Typography>
                  </div>
                </div> 
              </Box>
            )
          })}
        </Grid>
      </Box>
    </div>
  );
};

export default Section;