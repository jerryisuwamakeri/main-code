import React, { useState, useEffect, useRef } from "react";
import { FONT_FAMILY, downloadCsv } from "../common/sharedFunctions";
import MaterialTable from "material-table";
import { useSelector } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import moment from "moment/min/moment-with-locales";
import { MAIN_COLOR, SECONDORY_COLOR } from "../common/sharedFunctions";
import { colors } from "../components/Theme/WebTheme";
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

export default function UserRides({data,tabid}) {
  const { id} = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const bookinglistdata = useSelector((state) => state.bookinglistdata);
  const settings = useSelector((state) => state.settingsdata.settings);
  const loaded = useRef(false);
  const [bookingData, setBookingData] = useState([]);
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (bookinglistdata.bookings) {

        if(data.usertype=== "customer"){
            setBookingData(
                bookinglistdata.bookings.filter((item) => item.customer === id)
                );
        }
        else if (data.usertype=== "driver"){
            setBookingData(
                bookinglistdata.bookings.filter((item) => item.driver === id)
              );
        }

    } else {
      setBookingData([]);
    }
    loaded.current = true;


  }, [bookinglistdata.bookings, id,data]);

  const col = [
    {
      title: t("booking_status"),
      field: "status",
      render: (rowData) => (
        <div
          style={{
            backgroundColor:
              rowData.status === "CANCELLED"
                ? colors.RED
                : rowData.status === "COMPLETE"
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
          {t(rowData.status)}
        </div>
      ),
    },
    {
      title: t("booking_ref"),
      field: "reference",
    },
    {
      title: t("booking_date"),
      field: "bookingDate",
      render: (rowData) =>
        rowData.bookingDate ? moment(rowData.bookingDate).format("lll") : null,
    },
    {
      title: t("pickup_address"),
      field: "pickupAddress",
    },
    {
      title: t("drop_address"),
      field: "dropAddress",
    },
  ];

  return !loaded.current ? (
    <CircularLoading />
  ) : (
    <>
      <div
        style={{
          backgroundColor: colors.LandingPage_Background,
          borderRadius: 10,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
         dir={isRTL === "rtl" ? "rtl" : "ltr"}
        >
          <Button
            variant="text"
            onClick={() => {
              navigate(`/users/${tabid}`);
            }}
          >
            <Typography
              style={{
                textAlign: isRTL === "rtl" ? "right" : "left",
                fontWeight: "bold",
                color: MAIN_COLOR,
                fontFamily:FONT_FAMILY
              }}
            >
              {`<<- ${t("go_back")}`}
            </Typography>
          </Button>
        </div>
        <ThemeProvider theme={theme}>
          <MaterialTable
            title={t("bookings_table_title")}
            columns={col}
            style={{
              direction: isRTL === "rtl" ? "rtl" : "ltr",
              borderRadius: "8px",
              boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
              width: "100%",
            }}
            data={bookingData}
            onRowClick={(evt, selectedRow) =>
              setSelectedRow(selectedRow.tableData.id)
            }
            options={{
              pageSize: 10,
              pageSizeOptions: [10, 15, 20],
              exportCsv: (columns, data) => {
                let hArray = [];
                const headerRow = columns.map((col) => {
                  if (typeof col.title === "object") {
                    return col.title.props.text;
                  }
                  hArray.push(col.field);
                  return col.title;
                });
                const dataRows = data.map(({ tableData, ...row }) => {
                  row.createdAt =
                    new Date(row.createdAt).toLocaleDateString() +
                    " " +
                    new Date(row.createdAt).toLocaleTimeString();
                  let dArr = [];
                  for (let i = 0; i < hArray.length; i++) {
                    dArr.push(row[hArray[i]]);
                  }
                  return Object.values(dArr);
                });
                const { exportDelimiter } = ",";
                const delimiter = exportDelimiter ? exportDelimiter : ",";
                const csvContent = [headerRow, ...dataRows]
                  .map((e) => e.join(delimiter))
                  .join("\n");
                const csvFileName = "download.csv";
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
              editable: {
                backgroundColor: colors.Header_Text,
                fontSize: "0.8em",
                fontWeight: "bold ",      
              },
              headerStyle: {
                position: "sticky",
                top: "0px",
                fontSize: "0.8em",
                fontWeight: "bold ",
                color: colors.Black,
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
              body: {
                addTooltip: t("add"),
                deleteTooltip: t("delete"),
                editTooltip: t("edit"),
                emptyDataSourceMessage: t("blank_message"),
                editRow: {
                  deleteText: t("delete_message"),
                  cancelTooltip: t("cancel"),
                  saveTooltip: t("save"),
                },
              },
              toolbar: {
                searchPlaceholder: t("search"),
                exportTitle: t("export"),
              },
              header: {
                actions: t("actions"),
              },
              pagination: {
                labelDisplayedRows: "{from}-{to} " + t("of") + " {count}",
                firstTooltip: t("first_page_tooltip"),
                previousTooltip: t("previous_page_tooltip"),
                nextTooltip: t("next_page_tooltip"),
                lastTooltip: t("last_page_tooltip"),
              },
            }}
          />
        </ThemeProvider>
      </div>
    </>
  );
}
