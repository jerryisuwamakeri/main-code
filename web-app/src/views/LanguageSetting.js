import React, { useState, useEffect, useRef } from 'react';
import { api } from 'common';
import { useTranslation } from "react-i18next";
import langlocales from '../lists/langlocales';
import datelocales from '../lists/datelocales';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import BookIcon from '@mui/icons-material/Book';
import {
  Typography,
  Modal,
  Button,
  Grid
} from '@mui/material';
import CircularLoading from 'components/CircularLoading';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import {colors} from '../components/Theme/WebTheme';
import { FONT_FAMILY, downloadCsv } from '../common/sharedFunctions';
import {FirebaseConfig} from '../config/FirebaseConfig';
import {SECONDORY_COLOR } from "../common/sharedFunctions";
import { MAIN_COLOR } from '../common/sharedFunctions';
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: 850,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${colors.BLACK}`,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow:'initial'
  },
  paper2: {
    width: 250,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${colors.BLACK}`,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow:'initial'
  },
}));

export default function LanguageSetting(props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const {
    editLanguage
  } = api;
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [rowIndex, setRowIndex] = useState();
  const classes = useStyles();
  const [data, setData] = useState();
  const languagedata = useSelector(state => state.languagedata);
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settingsdata.settings);
  const [keyValuePair, setKeyValuePair] = useState();
  const [completed,setCompleted] = useState(0);
  const [enSet,setEnSet] = useState();
  const [openLoader, setOpenLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const columns = [
    { title: t('langName'), field: 'langName',  
  },
    {
      title: t('langLocale'),
      field: 'langLocale',
      lookup: langlocales,
    },
    {
      title: t('dateLocale'),
      field: 'dateLocale',
      lookup: datelocales, 
    }
  ];

  useEffect(() => {
    if (languagedata.langlist) {
      setData(languagedata.langlist);
    } else {
      setData([]);
    }
  }, [languagedata.langlist, enSet]);


  const handleClose = () => {
    setKeyValuePair(null);
    setRowIndex(-1);
    setOpen(false);
  }

  const handleLoaderClose = () => {
    setCompleted(0);
    setOpenLoader(false);
  }

  const saveJson = () => {
    let newData = data[rowIndex];
    try {
      if (settings.AllowCriticalEditsAdmin) {
        let obj = {};
        for(let i=0;i< keyValuePair.length; i++){
          obj[keyValuePair[i][0]] = keyValuePair[i][1];
        }
        newData['keyValuePairs'] = obj;
        dispatch(editLanguage(newData, "Update"));
        handleClose();
      } else {
        alert(t('demo_mode'));
      }
    } catch (error) {
      alert("JSON Error"); 
    }
  }

  useEffect(()=>{
    if(keyValuePair && keyValuePair.length> 0){
      setOpen(true);
      setIsLoading(false)
    }else{
      setOpen(false);
    }
  },[keyValuePair])

  const [selectedRow, setSelectedRow] = useState(null);

  const handleEditjson = (rowData)=>{
    setIsLoading(true)
    setRowIndex(rowData.tableData.id);
    setKeyValuePair(Object.entries(data[rowData.tableData.id].keyValuePairs));
  }
  const commonStyles = {
    fontFamily: FONT_FAMILY,
  };
  return (
    languagedata.loading || isLoading?
      <CircularLoading /> :
      <div>
        <ThemeProvider theme={theme}>
          <MaterialTable
            title={t('language_cap')}
            columns={columns}
            style={{direction:isRTL ==='rtl'?'rtl':'ltr',  borderRadius: "8px", boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`}}
            data={data}
            onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
            options={{
              pageSize: 10,
              pageSizeOptions: [10, 15, 20],
              exportCsv: (columns, data) => {
                let hArray = [];
                const headerRow = columns.map(col => {
                  if (typeof col.title === 'object') {
                    return col.title.props.text;
                  }
                  hArray.push(col.field);
                  return col.title;
                });
                const dataRows = data.map(({ tableData, ...row }) => {
                  row.createdAt = new Date(row.createdAt).toLocaleDateString() + ' '+ new Date(row.createdAt).toLocaleTimeString()
                  let dArr = [];
                  for(let i=0;i< hArray.length; i++) {
                    dArr.push(row[hArray[i]]);
                  }
                  return Object.values(dArr);
                })
                const { exportDelimiter } = ",";
                const delimiter = exportDelimiter ? exportDelimiter : ",";
                const csvContent = [headerRow, ...dataRows].map(e => e.join(delimiter)).join("\n");
                const csvFileName = 'download.csv';
                downloadCsv(csvContent, csvFileName);
              },
              exportButton: {
                csv: settings.AllowCriticalEditsAdmin,
                pdf: false,
              },
              maxColumnSort: "all_columns",
              rowStyle: rowData => ({
                backgroundColor: (selectedRow === rowData.tableData.id) ? colors.THIRDCOLOR : colors.WHITE
              }),
              editable:{
                backgroundColor: colors.Header_Text,
                fontSize: "0.8em",
                fontWeight: 'bold '
              },
              headerStyle: {
                position: "sticky",
                top: "0px",
                fontSize: "0.8em",
                fontWeight: 'bold ',
                color: colors.BLACK,
                backgroundColor: SECONDORY_COLOR,
                textAlign: "center",
                border: `1px solid ${colors.TABLE_BORDER}`,
              },
              cellStyle: {
                border: `1px solid ${colors.TABLE_BORDER}`,
                textAlign: "center",
              },
              actionsColumnIndex: -1,
              
            }}
            actions={[
              rowData => ({
                icon: () => <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap',  width: '100px', maxWidth:"150px" }}>
                  <BookIcon />
                  <Typography variant="subtitle2" style={{wordBreak:"break-word"}}>{t('make_default')}</Typography>
                </div>,
                disabled: rowData.default  || (completed > 0 && completed < 100),
                onClick: (event, rowData) => {
                  if (settings.AllowCriticalEditsAdmin) {
                    let curVal = rowData["default"];
                    for (const value of Object.values(data)) {
                      if (rowData.id === value.id) {
                        value["default"] = !curVal;
                      } else {
                        value["default"] = curVal;
                      }
                      dispatch(editLanguage(value, "Update"));
                    }
                  } else {
                    alert(t('demo_mode'));
                  }
                }
              }),
              rowData => ({
                icon: () => <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap',  width: '100px' , maxWidth:"150px"}}>
                  <BookIcon />
                  <Typography variant="subtitle2" style={{wordBreak:"break-word"}}>{t('edit_json')}</Typography>
                </div>,
                disabled: completed > 0 && completed < 100,
                onClick: (event, rowData) => {
                  handleEditjson(rowData)
                }
              })
            ]}
            editable={{
              onRowAdd: newData =>
                settings.AllowCriticalEditsAdmin ?
                  new Promise(resolve => {
                    setTimeout(async () => {
                      let kvSet = {};
                      for (const value of Object.values(data)) {
                        if (value.default) {
                          kvSet = value.keyValuePairs;
                        }
                      }
                      newData['createdAt'] = new Date().getTime();
                      newData['default'] = false;
                      setEnSet(kvSet);
                      setOpenLoader(true);
                      const keys = Object.keys(kvSet);
                      let obj = {};
                      for(let i = 0;i< keys.length;i ++){
                          try{
                            const response = await fetch(`https://us-central1-${FirebaseConfig.projectId}.cloudfunctions.net/gettranslation?str=${kvSet[keys[i]]}&from=en&to=${newData.langLocale}`, {
                              method: 'GET',
                              headers: {
                                'Content-Type': 'application/json'
                              }
                            })
                            const json = await response.json();
                            obj[keys[i]] = json.text;
                          }
                          catch(err) {
                            obj[keys[i]] = kvSet[keys[i]];
                          };
                          setCompleted(parseInt(((i + 1)/keys.length) * 100));
                      }
                      newData['keyValuePairs'] = obj;
                      dispatch(editLanguage(newData, "Add"));
                      resolve();
                      setOpenLoader(false);
                      setCompleted(0);
                    }, 600);
                  })
                  :
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      alert(t('demo_mode'));
                    }, 600);
                  }),
              onRowUpdate: (newData, oldData) =>
                settings.AllowCriticalEditsAdmin ?
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      if(newData !== oldData){
                        delete newData.tableData;
                        dispatch(editLanguage(newData, "Update"));
                      }
                    }, 600);
                  })
                  :
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      alert(t('demo_mode'));
                    }, 600);
                  }),
              onRowDelete: oldData =>
                settings.AllowCriticalEditsAdmin ?
                  oldData.default ?
                    new Promise(resolve => {
                      setTimeout(() => {
                        resolve();
                        alert("Cannot delete default language");
                      }, 600);
                    })
                    :
                    new Promise(resolve => {
                      setTimeout(() => {
                        resolve();
                        dispatch(editLanguage(oldData, "Delete"));
                      }, 600);
                    })
                  :
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      alert(t('demo_mode'));
                    }, 600);
                  }),
            }}
          />
        </ThemeProvider>
        {rowIndex >= 0 ?
          <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            onClose={handleClose}
            open={open}
            className={classes.modal}
            container={() => rootRef.current}
          >
            <div className={classes.paper}>
              <Grid container spacing={2} >
                <Grid item xs={12}>
                  <Typography component="h1" variant="h5" className={classes.title} style={{ textAlign: isRTL === 'rtl' ? 'right' : 'left' ,fontFamily: FONT_FAMILY}}>
                    {t('add_language')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <div style={{height: 400, overflowY: 'auto'}}>
                    {keyValuePair.map((item, index)=>
                    <div key={"key" + item[0]}>
                    <TextField
                        margin="dense"
                        id="name"
                        label={item[0]}
                        type="numeric"
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                          let arr = [...keyValuePair];
                          arr[index][1] = e.target.value;
                          setKeyValuePair(arr);
                        }}
                        value={item[1]}
                        InputLabelProps={{ style: commonStyles }}
                        InputProps={{ style: commonStyles }}
                      />
                    </div>
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} style={{ direction: isRTL === 'rtl' ? 'rtl' : 'ltr', marginLeft: isRTL === 'rtl' ? '65%' : 0 ,overflow:'initial'}}>
                  <Button onClick={handleClose} variant="contained" style={{backgroundColor:MAIN_COLOR, fontFamily: FONT_FAMILY}}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={saveJson} variant="contained"  style={{ fontFamily: FONT_FAMILY, backgroundColor: MAIN_COLOR, marginRight: isRTL === 'rtl' ? 10 : 0, marginLeft: isRTL !== 'rtl' ? 10 : 0 }}
                  >
                    {t('submit')}
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Modal>
          : null}
          {completed > 0 && completed < 100?
          <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            onClose={handleLoaderClose}
            open={openLoader}
            className={classes.modal}
            container={() => rootRef.current}
          >
            <div className={classes.paper2}>
              <Grid container spacing={2} >
                <Grid item xs={12}>
                  <Typography component="h1" variant="h5" className={classes.title} style={{ textAlign: isRTL === 'rtl' ? 'right' : 'left', fontFamily: FONT_FAMILY}}>
                    { completed + " % COMPLETE"}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </Modal>
          : null}
      </div>
  );
}
