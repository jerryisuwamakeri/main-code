import React,{ useState, useEffect, useRef } from 'react';
import MaterialTable from 'material-table';
import {
  Grid,
  Typography,
  Button,
  Modal,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector, useDispatch } from "react-redux";
import { api } from 'common';
import { useTranslation } from "react-i18next";
import moment from 'moment/min/moment-with-locales';
import WalletCard from '../components/WalletCard';
import AlertDialog from '../components/AlertDialog';
import AlertDialogTwoButton from '../components/AlertDialogTwoButton';
import styles from '../styles/landingPage.js';
import { useNavigate } from 'react-router-dom';
import {colors} from '../components/Theme/WebTheme';
import { FONT_FAMILY, MAIN_COLOR, SECONDORY_COLOR } from "../common/sharedFunctions";
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

const useStyles = makeStyles(theme => ({
  ...styles,
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  inputRtl: {
    "& label": {
      right: 10,
      left: "auto",
      paddingRight: 20
    },
    "& legend": {
      textAlign: "right",
      marginRight: 20
    }
  },
  textField: {
    "& label.Mui-focused": {
      color: MAIN_COLOR,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: MAIN_COLOR,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: MAIN_COLOR,
      },
    },
  },
  selectField: {
    color: "black",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: MAIN_COLOR,
    },
  },
}));

const icons = {
  'paypal':require('../assets/payment-icons/paypal-logo.png').default,
  'braintree':require('../assets/payment-icons/braintree-logo.png').default,
  'stripe':require('../assets/payment-icons/stripe-logo.png').default,
  'paytm':require('../assets/payment-icons/paytm-logo.png').default,
  'payulatam':require('../assets/payment-icons/payulatam-logo.png').default,
  'flutterwave':require('../assets/payment-icons/flutterwave-logo.png').default,
  'paystack':require('../assets/payment-icons/paystack-logo.png').default,
  'securepay':require('../assets/payment-icons/securepay-logo.png').default,
  'payfast':require('../assets/payment-icons/payfast-logo.png').default,
  'liqpay':require('../assets/payment-icons/liqpay-logo.png').default,
  'culqi':require('../assets/payment-icons/culqi-logo.png').default,
  'mercadopago':require('../assets/payment-icons/mercadopago-logo.png').default,
  'squareup':require('../assets/payment-icons/squareup-logo.png').default,
  'wipay':require('../assets/payment-icons/wipay-logo.png').default,
  'test':require('../assets/payment-icons/test-logo.png').default,
  'razorpay':require('../assets/payment-icons/razorpay-logo.png').default,
  'paymongo':require('../assets/payment-icons/paymongo-logo.png').default,
  'iyzico':require('../assets/payment-icons/iyzico-logo.png').default,
  'slickpay':require('../assets/payment-icons/slickpay-logo.png').default,
}


const UserWallet = (props) => {
  const {
    withdrawBalance,
  } = api;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settingsdata.settings);
  const providers = useSelector(state => state.paymentmethods.providers);
  const [profile,setProfile] = useState();
  const [data,setData] = useState([]);
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });
  const [commonAlertTwoButton, setCommonAlertTwoButton] = useState({ open: false, msg: '' });
  const rootRef = useRef(null);
  const [amount,setAmount] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalInfo,setModalInfo] = useState({
    mOpen: false,
    mType: null
  });
  const [selectedProvider, setSelectedProvider] = useState();
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(0);
  const [paymentModalStatus, setPaymentModalStatus] = useState(false);
  const columns =  [
      { title: t('requestDate'), field: 'date', defaultSort:'desc', render: rowData => rowData.date ? moment(rowData.date).format('lll') : null,},
      { title: t('amount'), field: 'amount',editable: 'never',
        render: (rowData) =>
        rowData.amount
        ? settings.swipe_symbol
        ? rowData.amount + " " + settings.symbol
        : settings.symbol + " " + rowData.amount
        : settings.swipe_symbol
        ? "0 " + settings.symbol
        : settings.symbol + " 0",
     },
     { title: t('transaction_id'), field: 'transaction_id', render: rowData => rowData.transaction_id ? rowData.transaction_id : rowData.txRef, },
     { title: t('type'), field: 'type',   render: (rowData) => (
      <div
        style={{
          backgroundColor:
            rowData.type === "debited"
              ? colors.RED
              : rowData.type === "credited"
              ? colors.GREEN
              : colors.YELLOW,
          color: "white",
          padding: 7,
          borderRadius: "15px",
          fontWeight: "bold",
          width: "150px",
          margin: "auto",
        }}
      >
        {t(rowData.type)}
      </div>
    ),}
  ];

  useEffect(()=>{
    if(providers){
      setSelectedProvider(providers[0]);
    }
  },[providers]);

  useEffect(()=>{
    if(auth.profile){
        setProfile(auth.profile);
        let wdata = auth.walletHistory;
        var wallHis = [];
        for(let key in wdata){
            wdata[key].walletKey = key
            if(wdata[key].type.includes("Credit") || wdata[key].type.includes("credit")){
              wdata[key].type = 'credited'
            }else if(wdata[key].type.includes("Withdraw") || wdata[key].type.includes("withdraw")){
              wdata[key].type = 'withdraw'
            }else{
              wdata[key].type = 'debited'
            }
            wallHis.push(wdata[key])
        }
        if(wallHis.length>0){
          setData(wallHis.reverse());
        }else{
          setData([]);
        }

    } else{
        setProfile(null);
    }
  },[auth.profile,auth.walletHistory]);

  const doRecharge = (e) => {
    e.preventDefault();
    if(!(profile.mobile && profile.mobile.length > 6 && profile.email && profile.firstName)){
      setCommonAlertTwoButton({ open: true, msg: t('profile_incomplete')})
     } else{
      if (providers) {
        setModalInfo({
          mOpen: true,
          mType: 'add'
        });
      } else {
        setCommonAlert({ open: true, msg: t('provider_not_found')})
      }
    }
  }

  const doWithdraw = (e) => {
    e.preventDefault();
    if(!(profile.mobile && profile.mobile.length > 6 && profile.email && profile.firstName)){
      setCommonAlertTwoButton({ open: true, msg: t('profile_incomplete')})
    }else{
        if (parseFloat(profile.walletBalance)>0) {
          setModalInfo({
            mOpen: true,
            mType: 'withdraw'
          });
        } else {
          setCommonAlert({ open: true, msg: t('wallet_bal_low')})
        }
    }
  }

  const gotoOperation = () => {
    navigate('/profile');
    setCommonAlert({ open: false, msg: '' })
  };

  const cancelOperation = () => {
    setAmount(0);
    setModalInfo({
      mOpen: false,
      mType: null
    });
    setCommonAlert({ open: false, msg: '' })
  };

  const cancelOperationTowButton = () => {
    setAmount(0);
    setModalInfo({
      mOpen: false,
      mType: null
    });
    setCommonAlertTwoButton({ open: false, msg: '' })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(amount <= 0){
      setCommonAlert({ open: true, msg: t('valid_amount')});
    } else {
       if(modalInfo.mType === 'add'){
        setModalInfo({
          ...modalInfo,
          mOpen: false
        });
        setPaymentModalStatus(true);
       }else{
        if( parseFloat(profile.walletBalance) < amount){
          setCommonAlert({ open: true, msg: t('valid_amount')});
        }else{
          dispatch(withdrawBalance(profile,amount));
          cancelOperation();
         }
        }
    }
  }

  const createOrderId = () =>{
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const reference = [...Array(4)].map(_ => c[~~(Math.random()*c.length)]).join('');
    return "wallet-" + auth.profile.uid + "-" + reference
  }

  const handlePaymentModalClose = (e) => {
    setTimeout(()=>{
      setPaymentModalStatus(false);
    },1500);
  }
  const inputStyle = { fontFamily: FONT_FAMILY, };
 
  return (
    <div>
      <div  style={{borderRadius: "19px", padding: 10}}>
        <Typography variant="h4" style={{...inputStyle,margin:"20px 20px 20px 15px",textAlign:isRTL==='rtl'?'right':'left'}}>{t('my_wallet_title')}</Typography>
        <Grid container direction="row" spacing={2}>
          <Grid item xs style={{textAlign:'center' }}>
            {settings.swipe_symbol===false?
               <WalletCard crdStyle={{backgroundColor: colors.WALLET_CARD,borderRadius: "5px", boxShadow: `4px 4px 6px ${colors.WALLET_CARD_SHADOW}`}} > 
                <Typography variant="h6" style={{color:'white'}}>{t('Balance')}</Typography>
                <Typography variant="h6" style={{color:'white'}}>{ settings.symbol + ' ' + (profile && profile.hasOwnProperty('walletBalance') ?profile.walletBalance : '')}</Typography></WalletCard>
              :
              <WalletCard crdStyle={{backgroundColor:'#CC3372',borderRadius: "5px", boxShadow: "4px 4px 6px #9E9E9E"}} ><Typography variant="h6" style={{color:'white'}}>{t('Balance')}</Typography><Typography variant="h6" style={{color:'white'}}>{ (profile && profile.hasOwnProperty('walletBalance')?profile.walletBalance : '') + ' ' + settings.symbol }</Typography></WalletCard>
            }
          </Grid>
          <Grid item xs style={{textAlign:isRTL==='rtl'?'right':'left', display:'flex',  direction:"row"}}>
            <Button onClick={doRecharge} variant="contained" style={{width:'100%', backgroundColor:'#A755C2', color:"white", borderRadius: "5px", boxShadow: "4px 4px 6px #9E9E9E"}}  size='large'>{t('add_to_wallet')}</Button>
          </Grid>
          {(settings && settings.RiderWithDraw && auth.profile.usertype === 'customer') || auth.profile.usertype !== 'customer' ?
            <Grid item xs style={{textAlign:isRTL==='rtl'?'right':'left', display:'flex',  direction:"row"}}>
              <Button onClick={doWithdraw} variant="contained" style={{width:'100%', backgroundColor:'#2CDE3A', color:"white", borderRadius: "5px", boxShadow: "4px 4px 6px #9E9E9E"}} size='large'>{t('withdraw')}</Button>
            </Grid>
          :null}
        </Grid>
      </div>
      <ThemeProvider theme={theme}>
      <MaterialTable
        title={t('transaction_history_title')}
        columns={columns}
        style={{direction:isRTL ==='rtl'?'rtl':'ltr', padding: 10, marginTop: 30, borderRadius: "8px", boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,}}
        data={data}
        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
        options={{
          exportButton: true,
          rowStyle: rowData => ({
            backgroundColor: (selectedRow === rowData.tableData.id) ? colors.THIRDCOLOR : colors.WHITE
        }),
          editable:{
            backgroundColor: colors.LandingPage_Background,
            fontSize: "0.8em",
            fontWeight: 'bold ',
          },
          headerStyle: {
            backgroundColor: SECONDORY_COLOR ,
            color: colors.BLACK,
            textAlign: "center",
            fontSize: "0.8em",
            fontWeight: 'bold ',
            border: `1px solid ${colors.TABLE_BORDER}`,
          },
          cellStyle: {
            border: `1px solid ${colors.TABLE_BORDER}`,
            textAlign: "center",
            margin: "auto",
          },
        }}
        localization={{
          toolbar: {
            searchPlaceholder: (t('search')),
            exportTitle: (t('export')),
          },
          pagination: {
            labelDisplayedRows: ('{from}-{to} '+ (t('of'))+ ' {count}'),
            firstTooltip: (t('first_page_tooltip')),
            previousTooltip: (t('previous_page_tooltip')),
            nextTooltip: (t('next_page_tooltip')),
            lastTooltip: (t('last_page_tooltip'))
          },
        }}
      />
      </ThemeProvider>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={paymentModalStatus}
        onClose={handlePaymentModalClose}
        className={classes.modal}
        container={() => rootRef.current}
      >
        <Grid item xs={12} sm={12} md={12} lg={12} className={classes.paper}>
        {providers && selectedProvider && modalInfo.mType === 'add'  && amount>0?
          <form action={selectedProvider.link} method="POST">
            <input type='hidden' name='order_id'style={inputStyle} value={createOrderId()}/>
            <input type='hidden' name='amount' style={inputStyle} value={amount}/>
            <input type='hidden' name='currency' style={inputStyle} value={settings.code}/>
            <input type='hidden' name='product_name' style={inputStyle} value={t('add_money')}/>
            <input type='hidden' name='first_name' style={inputStyle} value={profile.firstName}/>
            <input type='hidden' name='last_name' style={inputStyle} value={profile.lastName}/>
            <input type='hidden' name='quantity' style={inputStyle} value={1}/>
            <input type='hidden' name='cust_id' style={inputStyle} value={auth.profile.uid}/>
            <input type='hidden' name='mobile_no' style={inputStyle} value={profile.mobile}/>
            <input type='hidden' name='email' style={inputStyle} value={profile.email}/>
            <Grid item xs={12} sm={12} md={12} lg={12} style={{marginBottom: '20px'}}>
              <FormControl fullWidth style={inputStyle}>
              <FormLabel component="legend" style={inputStyle} >{t('payment')}</FormLabel>
              <Select
               fullWidth
                  id="selectedProviderIndex"
                  name= "selectedProviderIndex"
                  value={selectedProviderIndex}
                  label={t('payment')}
                  onChange={(e)=>{
                      setSelectedProviderIndex(parseInt(e.target.value));
                      setSelectedProvider(providers[parseInt(e.target.value)]);
                  }}
                  style={{textAlign:isRTL==='rtl'? 'right':'left', ...inputStyle}}
                  inputProps={{ 'aria-label': 'Without label' , ...inputStyle}}
                >
                  {providers.map((provider,index) =>
                     <MenuItem key={provider.name} value={index} style={{ width:'100%', justifyContent:'center', paddingLeft:10}}><img style={{height:24,margin:7}} src={icons[provider.name]} alt={provider.name}/> </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
            <Button onClick={handlePaymentModalClose} variant="contained" color="primary" style={{padding:10,backgroundColor:colors.RED,borderRadius:5, ...inputStyle}}>
              {t('cancel')}
            </Button>
            <Button variant="contained" color="primary" type="submit" onClick={handlePaymentModalClose} style={{marginLeft:10,padding:10,backgroundColor:colors.GREEN,borderRadius:5 , ...inputStyle}}>
              {t('paynow_button')}
            </Button>
            </Grid>
          </form>
          :null}
        </Grid>
      </Modal>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={modalInfo.mOpen}
        onClose={cancelOperation}
        className={classes.modal}
        container={() => rootRef.current}
      >
        <Grid container spacing={1} className={classes.paper} style={{direction:isRTL==='rtl'?'rtl':'ltr'}}>
            <Typography component="h2" variant="h5" style={{marginTop:15, color:colors.BLACK , ...inputStyle}}>
                {t('amount')}
            </Typography>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="amount"
                label={t('amount')}
                name="amount"
                autoComplete="amount"
                sx={{
                  '& .MuiInputBase-root': {
                    fontFamily: FONT_FAMILY,
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: FONT_FAMILY,
                  },
                }}
                onChange={(e)=>{
                  try{
                    if(e.target.value === ""){
                      setAmount(0);
                    }else{
                      setAmount(parseFloat(e.target.value));
                    }
                  }catch(e){
                    setCommonAlert({ open: true, msg: t('no_details_error')});
                    setAmount(0);
                  }          
                }}
                value={amount.toString()}
                autoFocus
                className={isRTL==='rtl'?classes.inputRtl:null}
                style={{direction:isRTL==='rtl'?'rtl':'ltr' }}
              />
            </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{textAlign:isRTL==='rtl'?'right':'left'}}>
            <Button onClick={cancelOperation} variant="contained" color="primary" style={{...inputStyle,padding:10,backgroundColor:colors.RED,borderRadius:5}}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" style={{...inputStyle,marginLeft:10,padding:10,backgroundColor:colors.GREEN,borderRadius:5}}>
              {modalInfo.mType === 'add'? t('add_to_wallet'): t('withdraw')}
            </Button>
          </Grid>
        </Grid>
      </Modal>
      <AlertDialog open={commonAlert.open} onClose={cancelOperation}>{commonAlert.msg}</AlertDialog>
      <AlertDialogTwoButton open={commonAlertTwoButton.open} onClose={cancelOperationTowButton} onGoto={gotoOperation}>{commonAlertTwoButton.msg}</AlertDialogTwoButton>
    </div>
  );
}

export default UserWallet;
