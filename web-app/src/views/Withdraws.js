import React,{ useState, useEffect } from 'react';
import { downloadCsv } from '../common/sharedFunctions';
import MaterialTable from "material-table";
import CircularLoading from "../components/CircularLoading";
import { useSelector, useDispatch } from "react-redux";
import { api } from 'common';
import { useTranslation } from "react-i18next";
import moment from 'moment/min/moment-with-locales';
import {colors} from '../components/Theme/WebTheme';
import { SECONDORY_COLOR } from "../common/sharedFunctions";
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

const Withdraws = () => {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  const settings = useSelector(state => state.settingsdata.settings);
  const {
    completeWithdraw
  } = api;
  const dispatch = useDispatch();

  const columns =  [
    { title: 'ID', field: 'id',editable: 'never',
  },
    { title: t('requestDate'), field: 'date', defaultSort:'desc', render: rowData => rowData.date ? moment(rowData.date).format('lll') : null,
              exportTransformer: (rowData) => new Date(rowData.date).toLocaleDateString() + ' '+ new Date(rowData.date).toLocaleTimeString()},
    { title: t('driver_name'),field: 'name',editable: 'never', 
  },
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
    { title: t('processed'), field: 'processed', type: 'boolean',editable: 'never', 
  },  
    { title: t('processDate'), field: 'processDate', render: rowData => rowData.processDate ? moment(rowData.processDate).format('lll') : null,
  },
    { title: t('bankName'), field: 'bankName', hidden: settings.bank_fields===false? true: false,editable: 'never'},
    { title: t('bankCode'), field: 'bankCode' , hidden: settings.bank_fields===false? true: false,editable: 'never'},
    { title: t('bankAccount'), field: 'bankAccount', hidden: settings.bank_fields===false? true: false,editable: 'never'}
  ];
  const [data, setData] = useState([]);
  const withdrawdata = useSelector(state => state.withdrawdata);

  useEffect(()=>{
        if(withdrawdata.withdraws){
            setData(withdrawdata.withdraws);
        }else{
          setData([]);
        }
  },[withdrawdata.withdraws]);

  const [selectedRow, setSelectedRow] = useState(null);
  return (
    withdrawdata.loading? <CircularLoading/>:
    <ThemeProvider theme={theme}>
    <MaterialTable
      title={t('Withdraw_title')}
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
            row.date = new Date(row.date).toLocaleDateString() + ' '+ new Date(row.date).toLocaleTimeString()
            row.processDate = row.processDate? new Date(row.processDate).toLocaleDateString() + ' '+ new Date(row.processDate).toLocaleTimeString(): ''
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
        rowStyle: (rowData) => ({
          backgroundColor:
            selectedRow === rowData.tableData.id ? colors.ROW_SELECTED :colors.WHITE
        }),
        editable:{
          backgroundColor: colors.Header_Text,
          fontSize: "0.8em",
          fontWeight: 'bold ',
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
          paddingRight:"20px",
          paddingLeft:"20px",
        },
        cellStyle: {
          border: `1px solid ${colors.TABLE_BORDER}`,
          textAlign: "center",
        },
        actionsColumnIndex: -1,
      }}
      localization={{
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
      actions={[
        rowData => ({
          icon: 'check',
          tooltip: t('process_withdraw'),
          disabled: rowData.processed,
          onClick: (event, rowData) => {
            dispatch(completeWithdraw(rowData));
          }
        }),
      ]}
    />
    </ThemeProvider>
  );
}

export default Withdraws;
