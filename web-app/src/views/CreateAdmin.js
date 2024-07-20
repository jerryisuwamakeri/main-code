import React,{ useState, useEffect, useRef } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { api } from 'common';
import { useTranslation } from "react-i18next";
import {colors} from '../components/Theme/WebTheme';
import { downloadCsv } from '../common/sharedFunctions';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';
import {SECONDORY_COLOR } from "../common/sharedFunctions";
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

export default function Users() {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  const settings = useSelector(state => state.settingsdata.settings);
  const navigate = useNavigate();
  const {
    deleteUser,
    fetchUsersOnce
  } = api;
  const [data, setData] = useState([]);
  const [sortedData, SetSortedData] = useState([]);
  const staticusers = useSelector(state => state.usersdata.staticusers);
  const dispatch = useDispatch();
  const loaded = useRef(false);

  useEffect(()=>{
    dispatch(fetchUsersOnce());
},[dispatch,fetchUsersOnce]);

  useEffect(()=>{
    if(staticusers){
      setData(staticusers.filter(user => user.usertype ==='admin'));
    }else{
      setData([]);
    }
    loaded.current = true;
  },[staticusers]);

  useEffect(()=>{
    if(sortedData){
      SetSortedData(data.sort((a,b)=>(moment(b.createdAt) - moment(a.createdAt))))
    }
  },[data,sortedData])

  const columns = [
    { title: t('first_name'), field: 'firstName', initialEditValue: ''},
    { title: t('last_name'), field: 'lastName', initialEditValue: ''},
    { title: t('mobile'), field: 'mobile', editable:'onAdd',render: rowData => settings.AllowCriticalEditsAdmin ?rowData.mobile : t("hidden_demo")},
    { title: t('email'), field: 'email', editable:'onAdd',render: rowData => settings.AllowCriticalEditsAdmin ?rowData.email : t("hidden_demo"),headerStyle:{textAlign:'center'}},
    {
      title: t("profile_image"),
      field: "profile_image",
      render: (rowData) =>
        rowData.profile_image ? (
          <img
            alt="Profile"
            src={rowData.profile_image}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        ) : (
          <AccountCircleIcon sx={{ fontSize: 40 }} />
        ),
      editable: "never",
  },
  ];

  const [selectedRow, setSelectedRow] = useState(null);
  return (
    !loaded.current? <CircularLoading/>:
    <ThemeProvider theme={theme}>
    <MaterialTable
      title={t('alladmins_title')}
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
        rowStyle: (rowData) => ({
          backgroundColor:
            selectedRow === rowData.tableData.id ? colors.ROW_SELECTED :colors.WHITE
        }),
        editable: {
          backgroundColor: colors.Header_Text,
          fontSize: "0.8em",
          fontWeight: "bold ",
        },
        headerStyle: {
          color: colors.BLACK,
          position: "sticky",
          top: "0px",
          backgroundColor: SECONDORY_COLOR,
          textAlign: "center",
          fontSize: "0.8em",
          fontWeight: "bold ",
          border: `1px solid ${colors.TABLE_BORDER}`,
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
          settings.AllowCriticalEditsAdmin?
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              if(oldData.id === 'admin0001'){
                alert(t('first_admin_deleted'));
              }else{
                dispatch(deleteUser(oldData.id));
                dispatch(fetchUsersOnce());
              }
            }, 600);
          })
          :
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              alert(t('demo_mode'));
            }, 600);
          })
          , 
      }}


      actions={[
        {
          icon: 'add',
          tooltip: t("add_admin"),
          isFreeAction: true,
          onClick: (event) => navigate("/users/edituser/admin"),
          
        },
        {
          icon: 'edit',
          tooltip: t("edit"),
          onClick: (event,rowData) => navigate(`/users/edituser/admin/${rowData.id}`)
        },
        
       
      ]}
    />
     </ThemeProvider>
  );
}
