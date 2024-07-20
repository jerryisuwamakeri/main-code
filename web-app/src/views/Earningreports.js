import React,{ useState,useEffect } from 'react';
import MaterialTable from 'material-table';
import { useSelector} from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { useTranslation } from "react-i18next";
import {colors} from '../components/Theme/WebTheme';
import {  SECONDORY_COLOR } from "../common/sharedFunctions";
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

export default function Earningreports() {
  const { t,i18n } = useTranslation();
  const isRTL = i18n.dir();
  
  const settings = useSelector(state => state.settingsdata.settings);

  const columns =  [
    { title: t('year'),field: 'year'},
    { title: t('months'), field: 'monthsName'},
    { title: t('booking_count'), field: 'total_rides'},
    { title: t('Gross_trip_cost'),  render: rowData => (parseFloat(rowData.tripCost) + parseFloat(rowData.cancellationFee)).toFixed(settings.decimal) , editable:'never'},
    { title: t('trip_cost_driver_share'), field: 'rideCost'},
    { title: t('cancellationFee'), field: 'cancellationFee'},
    { title: t('convenience_fee'), field: 'convenienceFee'},
    { title: t('convenience_fee'), field: 'fleetadminFee'},
    { title: t('Discounts'), field: 'discountAmount'},
    { title: t('Profit'),  render: rowData => (parseFloat(rowData.convenienceFee) + parseFloat(rowData.cancellationFee) - parseFloat(rowData.discountAmount)).toFixed(settings.decimal) , editable:'never'}
  ];

  const [data, setData] = useState([]);
  const earningreportsdata = useSelector(state => state.earningreportsdata);

  useEffect(()=>{
        if(earningreportsdata.Earningreportss){
            setData(earningreportsdata.Earningreportss);
        }
  },[earningreportsdata.Earningreportss]);

  const [selectedRow, setSelectedRow] = useState(null);

  return (
    earningreportsdata.loading? <CircularLoading/>:
    <ThemeProvider theme={theme}>
      <MaterialTable
        title={t('earning_reports_title')}
        columns={columns}
        style={{
          direction: isRTL === "rtl" ? "rtl" : "ltr",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
        }}
        data={data}
        
        onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
        options={{
          pageSize: 10,
          pageSizeOptions: [10, 15, 20],
          exportButton: true,
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
