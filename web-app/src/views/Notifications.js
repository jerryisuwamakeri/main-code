import React,{ useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { api } from 'common';
import { useTranslation } from "react-i18next";
import {colors} from '../components/Theme/WebTheme';
import {  useNavigate } from 'react-router-dom';
import { SECONDORY_COLOR } from "../common/sharedFunctions";
import moment from 'moment/min/moment-with-locales';
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

export default function Notifications() {
  const { t, i18n  } = useTranslation();
  const isRTL = i18n.dir();
  const {
    editNotifications
  } = api;

  const columns =  [
    {
      title:t("createdAt"),
      field:"createdAt",
      defaultSort:'desc',render: rowData => rowData.createdAt? moment(rowData.createdAt).format('lll'):null
    },
      {
        title: t('device_type'),
        field: 'devicetype',
        lookup: { All: (t('all')), ANDROID: (t('android')), IOS: (t('ios')) },
      },
      {
        title: t('user_type'),
        field: 'usertype',
        lookup: { customer: t('customer'), driver: t('driver') },
      },
      { title: t('title'),field: 'title', 
    },
      { title: t('body'), field: 'body', 
    },
  ];

  const [data, setData] = useState([]);
  const notificationdata = useSelector(state => state.notificationdata);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
        if(notificationdata.notifications){
            setData(notificationdata.notifications);
        }else{
            setData([]);
        }
  },[notificationdata.notifications]);

  const [selectedRow, setSelectedRow] = useState(null);
  
  return (
    notificationdata.loading? <CircularLoading/>:
    <ThemeProvider theme={theme}>
      <MaterialTable
        title={t('push_notification_title')}
        columns={columns}
        style={{
          direction: isRTL === "rtl" ? "rtl" : "ltr",
          borderRadius: "8px",
          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
          padding: "20px",
        }}
        data={data}
        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
        options={{
          pageSize: 10,
          pageSizeOptions: [10, 15, 20],
          rowStyle: (rowData) => ({
            backgroundColor:
              selectedRow === rowData.tableData.id ? colors.ROW_SELECTED :colors.WHITE
          }),
          editable:{
            backgroundColor: colors.WHITE,
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
            minWidth:"70px"
          },
          cellStyle: {
           border: `1px solid ${colors.TABLE_BORDER}`,
            textAlign: "center",
          },
          actionsColumnIndex: -1,
        }}
        localization={{body:{
          addTooltip: (t('add')),
          deleteTooltip: (t('delete')),
          editTooltip: (t('edit')),
          emptyDataSourceMessage: (
            (t('blank_message'))
        ),
        editRow: { 
          deleteText: (t('delete_message')),
          cancelTooltip: (t('cancel')),
          saveTooltip: (t('save')) 
          }, 
          },
          toolbar: {
            searchPlaceholder: (t('search')),
            exportTitle: (t('export')),
          },
          header: {
            actions: (t('actions')) 
        },
        pagination: {
          labelDisplayedRows: ('{from}-{to} '+ (t('of'))+ ' {count}'),
          firstTooltip: (t('first_page_tooltip')),
          previousTooltip: (t('previous_page_tooltip')),
          nextTooltip: (t('next_page_tooltip')),
          lastTooltip: (t('last_page_tooltip'))
        },
        }}
        editable={{
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                dispatch(editNotifications(oldData,"Delete"));
              }, 600);
            }),
        }}
        actions={[
          {
            icon: 'add',
            tooltip: t("add_notification"),
            isFreeAction: true,
            onClick: (event) => navigate("/notifications/addnotifications")
          },
        ]}
      />
    </ThemeProvider>
  );
}
