import React,{ useState, useEffect, useRef } from 'react';
import { downloadCsv } from '../common/sharedFunctions';
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { api } from 'common';
import { useTranslation } from "react-i18next";
import moment from 'moment/min/moment-with-locales';
import {colors} from '../components/Theme/WebTheme';
import Switch from "@mui/material/Switch";
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {SECONDORY_COLOR } from "../common/sharedFunctions";
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

export default function Users() {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  const settings = useSelector(state => state.settingsdata.settings);
  const navigate = useNavigate();
  const {
    editUser, 
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
      setData(staticusers.filter(user => user.usertype ==='fleetadmin'));
    }else{
      setData([]);
    }
    loaded.current = true;
  },[staticusers]);


  useEffect(()=>{
    if(data){
      SetSortedData(data.sort((a,b)=>(moment(b.createdAt) - moment(a.createdAt))))
    }
  },[data])

  const columns = [
    { title: t('createdAt'), field: 'createdAt', editable:'never', defaultSort:'desc',render: rowData => rowData.createdAt? moment(rowData.createdAt).format('lll') :null,
        exportTransformer: (rowData) => new Date(rowData.createdAt).toLocaleDateString() + ' '+ new Date(rowData.createdAt).toLocaleTimeString()},
    { title: t('first_name'), field: 'firstName', initialEditValue: '', },
    { title: t('last_name'), field: 'lastName', initialEditValue: '', },
    { title: t('mobile'), field: 'mobile', editable:'onAdd',render: rowData => settings.AllowCriticalEditsAdmin ?rowData.mobile : t("hidden_demo")},
    { title: t('email'), field: 'email', editable:'onAdd',render: rowData => settings.AllowCriticalEditsAdmin ?rowData.email : t("hidden_demo"),headerStyle:{textAlign:'center'}},
    { title: t('profile_image'),  field: 'profile_image',
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
  },
    { title: t('account_approve'),  field: 'approved', type:'boolean', initialEditValue: true, render:rowData=><Switch
        disabled={!settings.AllowCriticalEditsAdmin}
        checked={rowData.approved}
        onChange={() => handelApproved(rowData)}
      />},
  ];

  const [selectedRow, setSelectedRow] = useState(null);
  const handelApproved= (rowData) => {
    const updatedUser = { ...rowData, approved: !rowData.approved };

    dispatch(editUser(updatedUser.id, updatedUser));
    dispatch(fetchUsersOnce());
    return updatedUser;
  };
  return (
    !loaded.current? <CircularLoading/>:
    <ThemeProvider theme={theme}>
    <MaterialTable
      title={t('fleetadmins_title')}
      columns={columns}
      style={{
        direction: isRTL === "rtl" ? "rtl" : "ltr",
        borderRadius: "8px",
        boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
        padding: "20px",
      }}
      data={sortedData}
      
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
          color: colors.Black,
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
              dispatch(deleteUser(oldData.id));
              dispatch(fetchUsersOnce());
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
          tooltip: t("add_fleetadmin"),
          isFreeAction: true,
          onClick: (event) => navigate("/users/edituser/fleetadmin")
        },
        {
          icon: 'edit',
          tooltip: t("edit"),
          onClick: (event,rowData) => navigate(`/users/edituser/fleetadmin/${rowData.id}`)
        },
        
       
      ]}
    />
    </ThemeProvider>
  );
}
