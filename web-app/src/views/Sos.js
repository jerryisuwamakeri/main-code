import React,{ useState, useEffect } from 'react';
import { downloadCsv } from '../common/sharedFunctions';
import MaterialTable from "material-table";
import CircularLoading from "../components/CircularLoading";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from 'moment/min/moment-with-locales';
import {colors} from '../components/Theme/WebTheme';
import {SECONDORY_COLOR} from "../common/sharedFunctions"
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

const Sos = () => {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  const settings = useSelector(state => state.settingsdata.settings);
  const columns =  [
    { title: t('id'), field: 'bookingId',editable: 'never'},
    { title: t('name'),field: 'user_name',editable: 'never'},
    { title: t('contact'),field: 'contact',editable: 'never',render: (rowData) =>
    settings.AllowCriticalEditsAdmin ? rowData.contact : t("hidden_demo"),},
    { title: t('user_type'),field: 'user_type',editable: 'never'},
    { title: t('complain_date'), field: 'complainDate', editable:'never', defaultSort:'desc',render: rowData => rowData.complainDate? moment(rowData.complainDate).format('lll'):null},
  ];
  const [data, setData] = useState([]);
  const sosdata = useSelector(state => state.sosdata);

  useEffect(()=>{
        if(sosdata.sos){
            setData(sosdata.sos);
        }else{
          setData([]);
        }
  },[sosdata.sos]);

  const [selectedRow, setSelectedRow] = useState(null);
  
  return (
    sosdata.loading? <CircularLoading/>:
    <ThemeProvider theme={theme}>
    <MaterialTable
      title={t('sos_title')}
      columns={columns}
      style={{direction:isRTL ==='rtl'?'rtl':'ltr', borderRadius: "8px", boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,}}
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
    />
    </ThemeProvider>
  );
}

export default Sos;