import React, { useState, useEffect, useRef } from "react";
import CircularLoading from "../components/CircularLoading";
import { useSelector, useDispatch } from "react-redux";
import ConfirmationDialogRaw from "../components/ConfirmationDialogRaw";
import { FONT_FAMILY, SECONDORY_COLOR, downloadCsv } from "../common/sharedFunctions";
import MaterialTable from "material-table";
import {
  Grid,
  Typography,
  Modal,
  Button,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { api } from "common";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UsersCombo from "../components/UsersCombo";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import CancelIcon from "@mui/icons-material/Cancel";
import PaymentIcon from "@mui/icons-material/Payment";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import AlertDialog from "../components/AlertDialog";
import { colors } from "../components/Theme/WebTheme";
import { useNavigate } from "react-router-dom";
import {
  bookingHistoryColumns,
  BidModal,
  acceptBid,
  showEst,
} from "../common/sharedFunctions";
import { ThemeProvider } from '@mui/material/styles';
import theme from "styles/tableStyle";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: 680,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${colors.BLACK}`,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  action: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    borderRadius: "20px",
    paddingLeft: "10px",
    paddingRight: "10px",
    width: "10rem",
    minHeight:"40px"
  },
}));

const icons = {
  paypal: require("../assets/payment-icons/paypal-logo.png").default,
  braintree: require("../assets/payment-icons/braintree-logo.png").default,
  stripe: require("../assets/payment-icons/stripe-logo.png").default,
  paytm: require("../assets/payment-icons/paytm-logo.png").default,
  payulatam: require("../assets/payment-icons/payulatam-logo.png").default,
  flutterwave: require("../assets/payment-icons/flutterwave-logo.png").default,
  paystack: require("../assets/payment-icons/paystack-logo.png").default,
  securepay: require("../assets/payment-icons/securepay-logo.png").default,
  payfast: require("../assets/payment-icons/payfast-logo.png").default,
  liqpay: require("../assets/payment-icons/liqpay-logo.png").default,
  culqi: require("../assets/payment-icons/culqi-logo.png").default,
  mercadopago: require("../assets/payment-icons/mercadopago-logo.png").default,
  squareup: require("../assets/payment-icons/squareup-logo.png").default,
  wipay: require("../assets/payment-icons/wipay-logo.png").default,
  test: require("../assets/payment-icons/test-logo.png").default,
  razorpay: require("../assets/payment-icons/razorpay-logo.png").default,
  paymongo:require("../assets/payment-icons/paymongo-logo.png").default,
  iyzico:require("../assets/payment-icons/iyzico-logo.png").default,
};

const BookingHistory = (props) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const { cancelBooking, updateBooking, RequestPushMsg, forceEndBooking } = api;
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const userdata = useSelector((state) => state.usersdata);
  const settings = useSelector((state) => state.settingsdata.settings);
  const role = useSelector((state) => state.auth.profile.usertype);
  const [paymentModalStatus, setPaymentModalStatus] = useState(false);
  const providers = useSelector((state) => state.paymentmethods.providers);
  const [selectedProvider, setSelectedProvider] = useState();
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(0);
  const [data, setData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState();
  const bookinglistdata = useSelector((state) => state.bookinglistdata);
  const [users, setUsers] = useState(null);
  const [userCombo, setUserCombo] = useState(null);
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [rowIndex, setRowIndex] = useState();
  const [bidModalStatus, setBidModalStatus] = useState(true);
  const [selectedBidder, setSelectedBidder] = useState();
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
  const classes = useStyles();
  const columns = bookingHistoryColumns(role, settings, t, isRTL);
  const [walletModalStatus, setWalletModalStatus] = useState(false);

  useEffect(() => {
    if (bookinglistdata.bookings) {
      setData(bookinglistdata.bookings);
    } else {
      setData([]);
    }
  }, [bookinglistdata.bookings]);

  useEffect(() => {
    if (userdata.users) {
      let arr = [];
      for (let i = 0; i < userdata.users.length; i++) {
        let user = userdata.users[i];
        if (
          user.usertype === "driver" &&
          ((user.fleetadmin === auth.profile.uid && role === "fleetadmin") ||
            role === "admin")
        ) {
          arr.push({
            firstName: user.firstName,
            lastName: user.lastName,
            mobile: user.mobile,
            email: user.email,
            uid: user.id,
            desc:
              user.firstName +
              " " +
              user.lastName +
              " (" +
              (settings.AllowCriticalEditsAdmin
                ? user.mobile
                : t("hidden_demo")) +
              ") " +
              (settings.AllowCriticalEditsAdmin
                ? user.email
                : t("hidden_demo")),
            pushToken: user.pushToken ? user.pushToken : "",
            carType: user.carType,
          });
        }
      }
      setUsers(arr);
    }
  }, [
    userdata.users,
    settings.AllowCriticalEditsAdmin,
    auth.profile.uid,
    role,
    t,
  ]);

  const assignDriver = () => {
    let booking = data[rowIndex];
    if (booking["requestedDrivers"]) {
      booking["requestedDrivers"][userCombo.uid] = true;
    } else {
      booking["requestedDrivers"] = {};
      booking["requestedDrivers"][userCombo.uid] = true;
    }
    dispatch(updateBooking(booking));
    RequestPushMsg(userCombo.pushToken, {
      title: t("notification_title"),
      msg: t("new_booking_notification"),
      screen: "DriverTrips",
      channelId: settings.CarHornRepeat ? "bookings-repeat" : "bookings",
    });
    setUserCombo(null);
    handleClose();
    alert("Driver assigned successfully and notified.");
  };

  const onConfirmClose = (value) => {
    if (value) {
      dispatch(
        cancelBooking({
          reason: value,
          booking: selectedBooking,
          cancelledBy: role,
        })
      );
    }
    setOpenConfirm(false);
  };

  const handleChange = (e) => {
    if (e.target.name === "selectedProviderIndex") {
      setSelectedProviderIndex(parseInt(e.target.value));
      setSelectedProvider(providers[parseInt(e.target.value)]);
    }
    if (e.target.name === "selectedBidder") {
      setSelectedBidder(e.target.value);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePaymentModalClose = (e) => {
    setTimeout(() => {
      setPaymentModalStatus(false);
    }, 1500);
  };

  const handleWalletModalClose = (e) => {
    setTimeout(() => {
      setWalletModalStatus(false);
    }, 1500);
  };

  useEffect(() => {
    if (providers) {
      setSelectedProvider(providers[0]);
    }
  }, [providers]);

  const processPayment = (rowData) => {
    const curBooking = rowData;
    if (curBooking.payment_mode === "card") {
      let paymentCost = curBooking.selectedBid
        ? curBooking.selectedBid.trip_cost
        : curBooking.trip_cost;
      const paymentPacket = {
        payment_mode: "card",
        customer_paid: parseFloat(paymentCost).toFixed(settings.decimal),
        cardPaymentAmount: parseFloat(paymentCost).toFixed(settings.decimal),
        discount: 0,
        usedWalletMoney: 0,
        cashPaymentAmount: 0,
        promo_applied: false,
        promo_details: null,
        payableAmount: parseFloat(paymentCost).toFixed(settings.decimal),
      };
      curBooking.paymentPacket = paymentPacket;
      dispatch(updateBooking(curBooking));
      setSelectedBooking(curBooking);
      setPaymentModalStatus(true);
    }
    if (curBooking.payment_mode === "wallet") {
      let curBooking = { ...rowData };
      if (rowData.status === "PAYMENT_PENDING") {
        curBooking.status = "NEW";
        curBooking.prepaid = true;
      } else if (rowData.status === "PENDING") {
        curBooking.status = "PAID";
      } else if (rowData.status === "NEW") {
        curBooking.prepaid = true;
        curBooking.status = "ACCEPTED";
      }

      curBooking.customer_paid =
        curBooking.status === "ACCEPTED"
          ? 0
          : parseFloat(curBooking.trip_cost).toFixed(settings.decimal);
      curBooking.discount = 0;
      curBooking.usedWalletMoney =
        curBooking.status === "ACCEPTED"
          ? 0
          : parseFloat(curBooking.trip_cost).toFixed(settings.decimal);
      curBooking.cardPaymentAmount = 0;
      curBooking.cashPaymentAmount = 0;
      curBooking.payableAmount =
        curBooking.status === "ACCEPTED"
          ? parseFloat(curBooking.selectedBid.trip_cost).toFixed(
              settings.decimal
            )
          : parseFloat(curBooking.trip_cost).toFixed(settings.decimal);

      if (curBooking.status === "ACCEPTED") {
        curBooking.driver = curBooking.selectedBid.driver;
        curBooking.driver_image = curBooking.selectedBid.driver_image;
        curBooking.driver_name = curBooking.selectedBid.driver_name;
        curBooking.driver_contact = curBooking.selectedBid.driver_contact;
        curBooking.driver_token = curBooking.selectedBid.driver_token;
        curBooking.vehicle_number = curBooking.selectedBid.vehicle_number;
        curBooking.vehicleModel = curBooking.selectedBid.vehicleModel;
        curBooking.vehicleMake = curBooking.selectedBid.vehicleMake;
        curBooking.driverRating = curBooking.selectedBid.driverRating;
        curBooking.trip_cost = curBooking.selectedBid.trip_cost;
        curBooking.convenience_fees = curBooking.selectedBid.convenience_fees;
        curBooking.driver_share = curBooking.selectedBid.driver_share;
        curBooking.fleetadmin = curBooking.selectedBid.fleetadmin ? curBooking.selectedBid.fleetadmin : null;
        curBooking.fleetCommission= curBooking.selectedBid.fleetadmin ? ((parseFloat( curBooking.selectedBid.trip_cost) - parseFloat(curBooking.selectedBid.convenience_fees)) * (parseFloat(curBooking.fleet_admin_comission) / 100)).toFixed(2) : null;
        curBooking.driverOffers = {};
        curBooking.requestedDrivers = {};
        curBooking.driverEstimates = {};
        curBooking.selectedBid = {};
      }
      dispatch(updateBooking(curBooking));

      setBidModalStatus(false);
    }
    if (curBooking.payment_mode === "cash") {
      let curBooking = { ...rowData };
      if (rowData.status === "PAYMENT_PENDING") {
        curBooking.status = "NEW";
      } else if (rowData.status === "PENDING") {
        curBooking.status = "PAID";
      } else if (rowData.status === "NEW") {
        curBooking.status = "ACCEPTED";
      }

      curBooking.customer_paid =
        curBooking.status === "ACCEPTED"
          ? 0
          : parseFloat(curBooking.trip_cost).toFixed(settings.decimal);
      curBooking.discount = 0;
      curBooking.usedWalletMoney = 0;
      curBooking.cardPaymentAmount = 0;
      curBooking.cashPaymentAmount =
        curBooking.status === "ACCEPTED"
          ? 0
          : parseFloat(curBooking.trip_cost).toFixed(settings.decimal);
      curBooking.payableAmount =
        curBooking.status === "ACCEPTED"
          ? parseFloat(curBooking.selectedBid.trip_cost).toFixed(
              settings.decimal
            )
          : parseFloat(curBooking.trip_cost).toFixed(settings.decimal);

      if (curBooking.status === "ACCEPTED") {
        curBooking.driver = curBooking.selectedBid.driver;
        curBooking.driver_image = curBooking.selectedBid.driver_image;
        curBooking.driver_name = curBooking.selectedBid.driver_name;
        curBooking.driver_contact = curBooking.selectedBid.driver_contact;
        curBooking.driver_token = curBooking.selectedBid.driver_token;
        curBooking.vehicle_number = curBooking.selectedBid.vehicle_number;
        curBooking.vehicleModel = curBooking.selectedBid.vehicleModel;
        curBooking.vehicleMake = curBooking.selectedBid.vehicleMake;
        curBooking.driverRating = curBooking.selectedBid.driverRating;
        curBooking.trip_cost = curBooking.selectedBid.trip_cost;
        curBooking.convenience_fees = curBooking.selectedBid.convenience_fees;
        curBooking.driver_share = curBooking.selectedBid.driver_share;
        curBooking.fleetadmin = curBooking.selectedBid.fleetadmin ? curBooking.selectedBid.fleetadmin : null;
        curBooking.fleetCommission= curBooking.selectedBid.fleetadmin ? ((parseFloat( curBooking.selectedBid.trip_cost) - parseFloat(curBooking.selectedBid.convenience_fees)) * parseFloat(curBooking.fleet_admin_comission) / 100).toFixed(2):null;
        curBooking.driverOffers = {};
        curBooking.requestedDrivers = {};
        curBooking.driverEstimates = {};
        curBooking.selectedBid = {};
      }
      dispatch(updateBooking(curBooking));
      setBidModalStatus(false);
    }
  };

  const handleWalletPayment = (e) => {
    e.preventDefault();
    let curBooking = { ...selectedBooking };
    let paymentCost = curBooking.selectedBid
      ? curBooking.selectedBid.trip_cost
      : curBooking.trip_cost;
    if (parseFloat(paymentCost) > parseFloat(auth.profile.walletBalance)) {
      setCommonAlert({ open: true, msg: t("wallet_balance_low") });
    } else {
      curBooking.prepaid =
        curBooking.status === "NEW" || curBooking.status === "PAYMENT_PENDING"
          ? true
          : false;
      curBooking.status = curBooking.status === "NEW" ? "ACCEPTED" : "PAID";
      curBooking.customer_paid = parseFloat(paymentCost).toFixed(
        settings.decimal
      );
      curBooking.discount = 0;
      curBooking.usedWalletMoney = parseFloat(paymentCost).toFixed(
        settings.decimal
      );
      curBooking.cardPaymentAmount = 0;
      curBooking.cashPaymentAmount = 0;
      curBooking.payableAmount = 0;
      curBooking.promo_applied = false;
      curBooking.promo_details = null;
      curBooking.paymentPacket = null;
      curBooking.driver = curBooking.selectedBid
        ? curBooking.selectedBid.driver
        : curBooking.driver;
      curBooking.driver_image = curBooking.selectedBid
        ? curBooking.selectedBid.driver_image
        : curBooking.driver_image;
      curBooking.driver_name = curBooking.selectedBid
        ? curBooking.selectedBid.driver_name
        : curBooking.driver_name;
      curBooking.driver_contact = curBooking.selectedBid
        ? curBooking.selectedBid.driver_contact
        : curBooking.driver_contact;
      curBooking.driver_token = curBooking.selectedBid
        ? curBooking.selectedBid.driver_token
        : curBooking.driver_token;
      curBooking.vehicle_number = curBooking.selectedBid
        ? curBooking.selectedBid.vehicle_number
        : curBooking.vehicle_number;
      curBooking.vehicleModel = curBooking.selectedBid
        ? curBooking.selectedBid.vehicleModel
        : curBooking.vehicleModel;
      curBooking.vehicleMake = curBooking.selectedBid
        ? curBooking.selectedBid.vehicleModel
        : curBooking.vehicleModel;
      curBooking.driverRating = curBooking.selectedBid
        ? curBooking.selectedBid.driverRating
        : curBooking.driverRating;
      curBooking.trip_cost = curBooking.selectedBid
        ? curBooking.selectedBid.trip_cost
        : curBooking.trip_cost;
      curBooking.convenience_fees = curBooking.selectedBid
        ? curBooking.selectedBid.convenience_fees
        : curBooking.convenience_fees;
      curBooking.driver_share = curBooking.selectedBid
        ? curBooking.selectedBid.driver_share
        : curBooking.driver_share;
      curBooking.driverOffers = null;
      curBooking.requestedDrivers = null;
      curBooking.driverEstimates = null;
      curBooking.selectedBid = null;

      dispatch(updateBooking(curBooking));

      setTimeout(() => {
        setWalletModalStatus(false);
      }, 1500);
    }
  };

  const handleBidModalClose = () => {
    setBidModalStatus(false);
  };

  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };

  const [selectedRow, setSelectedRow] = useState(null);
  const inputStyle = { fontFamily: FONT_FAMILY, };

  return bookinglistdata.loading ? (
    <CircularLoading />
  ) : (
    <div>
      <ThemeProvider theme={theme}>
        <MaterialTable
          title={t("booking_title")}
          style={{
            direction: isRTL === "rtl" ? "rtl" : "ltr",
            borderRadius: "8px",
            boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
          }}
          columns={columns}
          data={data}
          onRowClick={(evt, selectedRow) =>
            setSelectedRow(selectedRow.tableData.id)
          }
          options={{
            pageSize: 10,
            pageSizeOptions: [10, 15, 20],
            toolbarbuttonalignment: "right",
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
                row.bookingDate =
                  new Date(row.bookingDate).toLocaleDateString() +
                  " " +
                  new Date(row.bookingDate).toLocaleTimeString();
                row.tripdate =
                  new Date(row.tripdate).toLocaleDateString() +
                  " " +
                  new Date(row.tripdate).toLocaleTimeString();
                row.pickupAddress = row.pickupAddress.replace(/,/g, ";");
                row.dropAddress = row.dropAddress.replace(/,/g, ";");
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
            rowStyle: (rowData) => ({
              backgroundColor:
                selectedRow === rowData.tableData.id ? colors.ROW_SELECTED :colors.WHITE
            }),
            maxBodyHeight: "calc(100vh - 199.27px)",
            headerStyle: {
              position: "sticky",
              top: "0px",
              backgroundColor: SECONDORY_COLOR,
              color: colors.Black,
              fontWeight: "bold ",
              textAlign: "center",
              zIndex: 1,
              border: `1px solid ${colors.TABLE_BORDER}`,
              
            },
            cellStyle: {
              border: `1px solid ${colors.TABLE_BORDER}`,
              textAlign: "center",
              margin: "auto",
            },
            actionsColumnIndex: -1,
          }}
          localization={{
            toolbar: {
              searchPlaceholder: t("search"),
              exportTitle: t("export"),
              exportCSVName: t("export"),
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
          actions={[
            (rowData) => ({
              icon: () => (
                <div
                  className={classes.action}
                  style={{
                    color: colors.Header_Background,
                    backgroundColor:
                      rowData.status === "NEW" || rowData.status === "ACCEPTED"
                        ? colors.Action_Button_Back
                        : colors.BORDER_BACKGROUND,
                  }}
                >
                  <CancelIcon />
                  <Typography variant="subtitle2">
                    {t("cancel_booking")}
                  </Typography>
                </div>
              ),
              disabled:
                rowData.status === "NEW" ||
                rowData.status === "ACCEPTED"
                  ? false
                  : true,
              onClick: (event, rowData) => {
                if (
                  settings.AllowCriticalEditsAdmin &&
                  (role === "customer" ||
                    role === "admin" ||
                    role === "fleetadmin")
                ) {
                  if (rowData.status === "NEW" || rowData.status === "ACCEPTED") {
                    setSelectedBooking(rowData);
                    setOpenConfirm(true);
                  } else {
                    setTimeout(() => {
                      dispatch(
                        cancelBooking({
                          reason: t("cancelled_incomplete_booking"),
                          booking: rowData,
                          cancelledBy: role,
                        })
                      );
                    }, 1500);
                  }
                } else {
                  alert(t("demo_mode"));
                }
              },
            }),
            (rowData) =>
              rowData.status === "NEW" &&
              role === "customer" &&
              rowData.driverOffers
                ? {
                    icon: () => (
                      <div
                        className={classes.action}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          color:
                            rowData.status === "NEW"
                              ? colors.Header_Background
                              : colors.Table_Header,
                          backgroundColor:
                            rowData.status === "NEW"
                              ? colors.Action_Button_Back
                              : colors.BORDER_BACKGROUND,
                        }}
                      >
                        <PlaylistAddCheckIcon />
                        <Typography variant="subtitle2">
                          {t("selectBid")}
                        </Typography>
                      </div>
                    ),
                    onClick: (event, rowData) => {
                      setRowIndex(rowData.tableData.id);
                      setSelectedBooking(rowData);
                      setBidModalStatus(true);
                    },
                  }
                : null,
            (rowData) =>
              rowData.status === "NEW" &&
              (role === "admin" || role === "fleetadmin") &&
              settings.autoDispatch === false &&
              showEst
                ? {
                    icon: () => (
                      <div
                        className={classes.action}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          color:
                            rowData.status === "NEW"
                              ? colors.Header_Background
                              : colors.Table_Header,
                          backgroundColor:
                            rowData.status === "NEW"
                              ? colors.Action_Button_Back
                              : colors.BORDER_BACKGROUND,
                        }}
                      >
                        <PersonAddIcon />
                        <Typography variant="subtitle2">
                          {t("assign_driver")}
                        </Typography>
                      </div>
                    ),
                    onClick: (event, rowData) => {
                      setOpen(true);
                      setRowIndex(rowData.tableData.id);
                    },
                  }
                : null,
            (rowData) =>
              (rowData.status === "PAYMENT_PENDING" || rowData.status ===  "PENDING") && role === "customer"
                ? {
                    icon: () => (
                      <div
                        className={classes.action}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          color:
                            (rowData.status === "PAYMENT_PENDING" || rowData.status === "PENDING")
                              ? colors.Header_Background
                              : colors.Table_Header,
                          backgroundColor:
                            (rowData.status === "PAYMENT_PENDING" || rowData.status === "PENDING")
                              ? colors.Action_Button_Back
                              : colors.BORDER_BACKGROUND,
                        }}
                      >
                        <PaymentIcon />
                        <Typography variant="subtitle2">
                          {t("paynow_button")}
                        </Typography>
                      </div>
                    ),
                    onClick: (event, rowData) => {
                      processPayment(rowData);
                    },
                  }
                : null,
            (rowData) =>
              rowData.status === "STARTED" && role === "admin"
                ? {
                    icon: () => (
                      <div
                        className={classes.action}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          color:
                            rowData.status === "STARTED"
                              ? colors.Header_Background
                              : colors.Table_Header,
                          backgroundColor:
                            rowData.status === "STARTED"
                              ? colors.Action_Button_Back
                              : colors.BORDER_BACKGROUND,
                        }}
                      >
                        <PlaylistAddCheckIcon />
                        <Typography variant="subtitle2">
                          {t("force_end")}
                        </Typography>
                      </div>
                    ),
                    onClick: (event, rowData) => {
                      dispatch(forceEndBooking(rowData));
                    },
                  }
                : null,
            {
              icon: "info",
              tooltip: t("booking_details"),
              onClick: (event, rowData) => {
                navigate(`/bookings/bookingdetails/${rowData.id}`);
              },
            }
          ]}
        />
      </ThemeProvider>
      <BidModal
        ref={rootRef.current}
        role={role}
        selectedBooking={selectedBooking}
        bidModalStatus={bidModalStatus}
        handleBidModalClose={handleBidModalClose}
        classes={classes}
        settings={settings}
        acceptBid={() => {
          const bookingObj = acceptBid(selectedBooking, selectedBidder);
          processPayment(bookingObj);
          handleBidModalClose();
        }}
        selectedBidder={selectedBidder}
        handleChange={handleChange}
      />
      {selectedBooking &&
      selectedBooking.payment_mode === "wallet" &&
      (selectedBooking.status === "PENDING" ||
        (selectedBooking &&
          selectedBooking.selectedBid &&
          selectedBooking.status === "NEW")) &&
      role === "customer" ? (
        <Modal
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          open={walletModalStatus}
          onClose={handleWalletModalClose}
          className={classes.modal}
          container={() => rootRef.current}
        >
          <Grid container spacing={2} className={classes.paper}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ marginBottom: "20px" }}
            >
              <Typography style={{ fontWeight: "bolder", marginBottom: 10 ,fontFamily: FONT_FAMILY,}}>
                {t("payment")}
              </Typography>
              {selectedBooking ? (
                <Typography color={"primary"} style={{ fontSize: 30 ,fontFamily: FONT_FAMILY}}>
                  {settings.swipe_symbol === false
                    ? settings.symbol + selectedBooking.trip_cost
                    : selectedBooking.trip_cost + settings.symbol}
                </Typography>
              ) : null}
              <Typography style={{fontFamily: FONT_FAMILY}}>
                {t("use_wallet_balance") +
                  " " +
                  (settings.swipe_symbol === false
                    ? settings.symbol + auth.profile.walletBalance
                    : auth.profile.walletBalance + settings.symbol) +
                  ")"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Button
                onClick={handleWalletModalClose}
                variant="contained"
                style={{backgroundColor:colors.RED, fontFamily: FONT_FAMILY }}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 10 , backgroundColor:colors.GREEN, fontFamily: FONT_FAMILY }}
                onClick={handleWalletPayment}
              >
                {t("paynow_button")}
              </Button>
            </Grid>
          </Grid>
        </Modal>
      ) : null}
      {selectedBooking &&
      selectedBooking.paymentPacket &&
      selectedBooking.payment_mode === "card" &&
      ((selectedBooking.status === "PENDING" || selectedBooking.status === "PAYMENT_PENDING") ||
        (selectedBooking &&
          selectedBooking.selectedBid &&
          selectedBooking.status === "NEW")) &&
      role === "customer" ? (
        <Modal
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          open={paymentModalStatus}
          onClose={handlePaymentModalClose}
          className={classes.modal}
          container={() => rootRef.current}
        >
          <Grid container spacing={2} className={classes.paper}>
            {providers && selectedProvider && selectedBooking ? (
              <form action={selectedProvider.link} method="POST">
                <input
                  type="hidden"
                  name="order_id"
                  value={selectedBooking.id}
                  style={inputStyle}
                />
                <input
                  type="hidden"
                  name="amount"
                  value={
                    selectedBooking.selectedBid
                      ? selectedBooking.selectedBid.trip_cost
                      : selectedBooking.trip_cost
                  }
                  style={inputStyle}
                />
                <input
                  type="hidden"
                  name="currency"
                  value={settings.code}
                  style={inputStyle}
                />
                <input
                  type="hidden"
                  name="product_name"
                  value={t("bookingPayment")}
                  style={inputStyle}
                />
                <input
                  type="hidden"
                  name="first_name"
                  value={auth.profile.firstName}
                  style={inputStyle}
                />
                <input
                  type="hidden"
                  name="last_name"
                  value={auth.profile.lastName}
                  style={inputStyle}
                />
                <input
                  type="hidden"
                  name="quantity"
                  value={1}
                  style={inputStyle}
                />
                <input
                  type="hidden"
                  name="cust_id"
                  value={selectedBooking.customer}
                  style={inputStyle}
                />
                <input
                  type="hidden"
                  name="mobile_no"
                  value={selectedBooking.customer_contact}
                  style={inputStyle}
                />
                <input
                  type="hidden"
                  name="email"
                  value={selectedBooking.customer_email}
                  style={inputStyle}
                />
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginBottom: "20px" }}
                >
               <FormControl fullWidth style={{ fontFamily: FONT_FAMILY }}>
                  <FormLabel component="legend" style={{ fontFamily: FONT_FAMILY }}> {t("payment")} </FormLabel>
                  <Select
                    id="selectedProviderIndex"
                    name="selectedProviderIndex"
                    value={selectedProviderIndex}
                    label={t("payment")}
                    onChange={handleChange}
                    style={{ textAlign: isRTL === "rtl" ? "right" : "left", fontFamily: FONT_FAMILY }}
                    inputProps={{ "aria-label": "Without label", style: { fontFamily: FONT_FAMILY } }}
                  >
                    {providers.map((provider, index) => (
                      <MenuItem key={provider.name} value={index} style={{ fontFamily: FONT_FAMILY }}>
                        <img
                          style={{ height: 24, margin: 7 }}
                          src={icons[provider.name]}
                          alt={provider.name}
                        />{" "}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button
                    onClick={handlePaymentModalClose}
                    variant="contained"
                    style={{  backgroundColor:colors.RED,fontFamily: FONT_FAMILY }}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{ marginLeft: 10 , backgroundColor:colors.GREEN, fontFamily: FONT_FAMILY }}
                    onClick={handlePaymentModalClose}
                  >
                    {t("paynow_button")}
                  </Button>
                </Grid>
              </form>
            ) : null}
          </Grid>
        </Modal>
      ) : null}
      <ConfirmationDialogRaw
        open={openConfirm}
        onClose={onConfirmClose}
        value={""}
      />
      {users && data && rowIndex >= 0 ? (
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  component="h1"
                  variant="h5"
                  className={classes.title}
                  style={{ textAlign: isRTL === "rtl" ? "right" : "left", fontFamily: FONT_FAMILY}}
                >
                  {t("select_driver")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <UsersCombo
                  className={classes.items}
                  placeholder={t("select_user")}
                  users={users.filter(
                    (usr) => usr.carType === data[rowIndex].carType
                  )}
                  value={userCombo}
                  onChange={(event, newValue) => {
                    setUserCombo(newValue);
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{
                  direction: isRTL === "rtl" ? "rtl" : "ltr",
                  marginLeft: isRTL === "rtl" ? "65%" : 0,
                }}
              >
                <Button
                  onClick={handleClose}
                  variant="contained"
                  style={{  backgroundColor:colors.RED, fontFamily: FONT_FAMILY }}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={assignDriver}
                  variant="contained"
                  color="primary"
                  style={{
                    ...(isRTL === "rtl" ? { marginRight: 10 } : { marginLeft: 10 }),
                    backgroundColor:colors.RED,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {t("assign")}
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      ) : null}
      <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
        {commonAlert.msg}
      </AlertDialog>
    </div>
  );
};

export default BookingHistory;
