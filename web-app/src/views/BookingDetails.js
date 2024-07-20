import React, { useState, useEffect } from "react";
import { Typography, Grid, Card, Avatar, Button, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { colors } from "../components/Theme/WebTheme";
import moment from "moment/min/moment-with-locales";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { makeStyles } from "@mui/styles";
import { MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY } from "../common/sharedFunctions"

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: "10px",
    backgroundColor: colors.WHITE,
    minHeight: 100,
    marginTop: 5,
    marginBottom: 20,
    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
  },
  txt: {
    padding: 10,
    fontWeight: "bold",
    minHeight: 60,
    backgroundColor: SECONDORY_COLOR,
    color: colors.BLACK,
    boxShadow: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function BookingDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const bookinglistdata = useSelector((state) => state.bookinglistdata);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const settings = useSelector((state) => state.settingsdata.settings);
  const classes = useStyles();
  const role = useSelector(state => state.auth.profile.usertype);

  useEffect(() => {
    if (bookinglistdata.bookings) {
      const booking = bookinglistdata.bookings.filter(
        (item) => item.id === id.toString()
      )[0];

      if (booking) {
        setData(booking);
      } else {
        navigate("/404");
        setData([]);
      }
    }
  }, [bookinglistdata.bookings, id, navigate]);

  const renderGridItem = (item, isRTL) => {
    return (
      <Grid
        key={item.key}
        container
        spacing={1}
        sx={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
        style={{
          justifyContent: "center",
          alignItems: "center",
          minHeight: 60,
          ...item.addressGridStyle
        }}
      >
        <Grid item xs={4}>
          <Typography
            style={{
              fontSize: 16,
              padding: 2,
              textAlign: isRTL === "rtl" ? "right" : "left",
              fontFamily:FONT_FAMILY,
              ...item.typographyStyleAddress
            }}
          >
            {item.label}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            style={{
              fontSize: 18,
              padding: 2,
              letterSpacing: -1,
              textAlign: "center",
              fontFamily:FONT_FAMILY,
            }}
          >
            -----
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            style={{
              fontSize: 16,
              padding: 2,
              textAlign: isRTL === "rtl" ? "left" : "right",
              wordBreak: 'break-word',
              fontFamily:FONT_FAMILY,
              ...item.style,
            }}
          >
            {item.value}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const renderTypography = (text) => {
    return (
      <Typography
      className={classes.txt}
      style={{
        borderBottomRightRadius: isRTL ? "90px" : "",
        borderBottomLeftRadius: isRTL ? "" : "90px",
        fontFamily:FONT_FAMILY,
      }}
      variant="h5"
      >
        {text}
      </Typography>
    );
  };

  return (
    <>
      <div dir={isRTL === "rtl" ? "rtl" : "ltr"}
        style={{
          marginBottom: 20,
        }}
      >
        <Button
          variant="text"
          onClick={() => {
            navigate("/bookings");
          }}
        >
          <Typography
            style={{
              margin: "10px 10px 0 5px",
              textAlign: isRTL === "rtl" ? "right" : "left",
              fontWeight: "bold",
              color: MAIN_COLOR,
              fontFamily:FONT_FAMILY,
            }}
          >
            {`<<- ${t("go_back")}`}
          </Typography>
        </Button>
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Grid item>
              <Card className={classes.card}> 
              {renderTypography(t("ride_information"))}
                <Grid container direction="column" style={{ padding: 10 }}>
                  {data &&
                    [
                      { key: "booking_id", label: t("booking_id"), value: data.id },
                      { key: "booking_ref", label: t("booking_ref"), value: data.reference },
                      {
                        key: "booking_status_web",
                        label: t("booking_status_web"),
                        value: t(data.status),
                        style: {
                          backgroundColor:
                          data?.status === "CANCELLED"
                                ? colors.RED
                                : data?.status === "COMPLETE"
                                  ? colors.GREEN
                                  : colors.YELLOW,
                          color:colors.WHITE,
                          fontWeight: "bold",
                          borderRadius: "10px",
                          textAlign: "center",
                          padding: 3,
                        },
                      },
                      {
                        key: "trip_start_date", label: t("trip_start_date"), value: data?.tripdate
                          ? moment(data?.tripdate).format("lll")
                          : ""
                      },
                      { key: "trip_start_time", label: t("trip_start_time"), value: data?.trip_start_time },
                      { key: "trip_end_time", label: t("trip_end_time"), value: data?.trip_end_time },
                      {
                        key: "parcel_type_web", label: t("parcel_type_web"), value: data.parcelTypeSelected
                          ? data.parcelTypeSelected.description +
                          " (" +
                          data.parcelTypeSelected.amount +
                          ")"
                          : ""
                      },
                      {
                        key: "parcel_option", label: t("parcel_option"), value: data.optionSelected
                          ? data.optionSelected.description +
                          " (" +
                          data.optionSelected.amount +
                          ")"
                          : ""
                      },
                      { key: "deliveryPerson", label: t("deliveryPerson"), value: data?.deliveryPerson },
                      {
                        key: "deliveryPersonPhone", label: t("deliveryPersonPhone"), value: data.deliveryPersonPhone ? (settings.AllowCriticalEditsAdmin
                          ? data.deliveryPersonPhone
                          : t("hidden_demo")) : ""
                      },
                      { key: "take_pickup_image_web", label: t("take_pickup_image_web"), value: data.pickup_image ? data.pickup_image : "", type: 'image', alt: "pickup_image" },
                      { key: "take_deliver_image_web", label: t("take_deliver_image_web"), value: data.deliver_image ? data.deliver_image : "", type: 'image', alt: "deliver_image" },
                      { key: "tripInstructions", label: t("tripInstructions"), value: data?.tripInstructions },
                      { key: "cancellation_reason", label: t("cancellation_reason"), value: data?.reason },
                      { key: "otp", label: t("otp"), value: data?.otp },
                      { key: "total_time", label: t("total_time"), value: data?.total_trip_time },
                      {
                        key: "distance_web", label: t("distance_web"), value: data.distance ? (settings.convert_to_mile
                          ? data?.distance + t("mile")
                          : data?.distance + " " + t("km")) : ""
                      },
                      { key: "pickUpInstructions_web", label: t("pickUpInstructions_web"), value: data?.pickUpInstructions },
                      { key: "deliveryInstructions", label: t("deliveryInstructions"), value: data?.deliveryInstructions },
                      { key: "otherPerson", label: t("otherPerson"), value: data?.otherPerson },
                      { key: "otherPersonPhone", label: t("otherPersonPhone"), value: data?.otherPersonPhone },
                      { key: "feedback", label: t("feedback"), value: data?.feedback },
                      {
                        key: "pickup_address", label: t("pickup_address"), value: data?.pickupAddress, addressGridStyle: {
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          minHeight: 60,
                          marginBottom: 20,
                        }, typographyStyleAddress: { color:colors.GREEN }
                      },
                      { key: "drop_address", label: t("drop_address"), value: data?.dropAddress, typographyStyleAddress: { color:colors.RED, } },
                    ].map((item) =>
                      item.type === "image" && item.value ? (
                        <Grid
                          key={item.key}
                          container
                          spacing={1}
                          sx={{ direction: isRTL === "rtl" ? "rtl" : "ltr" }}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 60,
                          }}
                        >
                          <Grid item xs={4}>
                            <Typography
                              style={{
                                fontSize: 16,
                                padding: 2,
                                textAlign: isRTL === "rtl" ? "right" : "left",
                                fontFamily:FONT_FAMILY,
                              }}
                            >
                              {item.label}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              style={{
                                fontSize: 18,
                                padding: 2,
                                letterSpacing: -1,
                                textAlign: "center",
                                fontFamily:FONT_FAMILY,
                              }}
                            >
                              -----
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <img
                              src={item.value}
                              alt={item.alt}
                              style={{
                                width: 120,
                                height: 90,
                              }}
                            />
                          </Grid>
                        </Grid>
                      ) :
                        item.value ?renderGridItem(item, isRTL) : null
                    )}
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Grid item>
              <Card className={classes.card}>
                {renderTypography(t("payment_info"))}
                <Grid container direction="column" style={{ paddingRight: 15, paddingLeft: 15, paddingBottom: 15 }}>
                  {data &&
                    [
                      {
                        key: "trip_cost", label: t("trip_cost"), value: settings.swipe_symbol
                          ? data?.trip_cost + " " + settings.symbol
                          : settings.symbol + " " + data?.trip_cost
                      },
                      {
                        key: "Customer_paid", label: t("Customer_paid"), value: data?.customer_paid ? (settings.swipe_symbol
                            ? data?.customer_paid + " " + settings.symbol
                            : settings.symbol + " " + data?.customer_paid) : ""
                      },
                      {
                        key: "discount_ammount",
                        label: t("discount_ammount"),
                        value: settings.swipe_symbol
                          ? data?.discount + " " + settings.symbol
                          : settings.symbol + " " + data?.discount,
                      },
                      {
                        key: "driver_share", label: t("driver_share"), value: settings.swipe_symbol
                          ? data?.driver_share + " " + settings.symbol
                          : settings.symbol + " " + data?.driver_share
                      },
                      {
                        key: "fleet_admin_comission", label: t("fleet_admin_comission"), value: data?.fleetCommission && parseFloat(data?.fleetCommission) > 0 ? (settings.swipe_symbol
                          ? data?.fleetCommission + " " + settings.symbol
                          : settings.symbol + " " + data?.fleetCommission) : ""
                      },
                      {
                        key: "convenience_fee", label: t("convenience_fee"), value: settings.swipe_symbol
                          ? data?.convenience_fees + " " + settings.symbol
                          : settings.symbol + " " + data?.convenience_fees
                      },
                      {
                        key: "cancellationFee", label: t("cancellationFee"), value: settings.swipe_symbol
                          ? data.cancellationFee
                            ? data.cancellationFee
                            : (0).toFixed(settings.decimal) +
                            " " +
                            settings.symbol
                          : settings.symbol + " " + data.cancellationFee
                            ? data.cancellationFee
                            : (0).toFixed(settings.decimal)
                      },
                      {
                        key: "payment_gateway", label: t("payment_gateway"), value: data?.gateway
                      },
                      { key: "payment_mode_web", label: t("payment_mode_web"), value: data?.payment_mode ? data.payment_mode : "" },
                      {
                        key: "cash_payment_amount", label: t("cash_payment_amount"), value: data?.cashPaymentAmount ? (settings.swipe_symbol
                          ? data?.cashPaymentAmount + " " + settings.symbol
                          : settings.symbol + " " + data?.cashPaymentAmount) : ""
                      },
                      {
                        key: "card_payment_amount", label: t("card_payment_amount"), value:
                          data?.cardPaymentAmount ? (settings.swipe_symbol
                            ? data?.cardPaymentAmount + " " + settings.symbol
                            : settings.symbol + " " + data?.cardPaymentAmount) : ""
                      },
                      {
                        key: "wallet_payment_amount", label: t("wallet_payment_amount"), value:
                          data?.usedWalletMoney ? (settings.swipe_symbol
                            ? data?.usedWalletMoney + " " + settings.symbol
                            : settings.symbol + " " + data?.usedWalletMoney) : ""
                      },
                      {
                        key: "payable_ammount", label: t("payable_ammount"), value: data?.payableAmount ? (settings.swipe_symbol
                          ? data?.payableAmount + " " + settings.symbol
                          : settings.symbol + " " + data?.payableAmount) : ""
                      },
                    ].map((item) =>
                      item.value ? renderGridItem(item, isRTL): null
                    )}
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Grid item>
              <Card className={classes.card}>
                {renderTypography(t("driver_info"))}
                <Grid container direction="column" style={{ padding: 15 }}>
                  <Grid
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {data?.driver_image ? (
                      <Avatar
                        alt="driver profile image"
                        src={data?.driver_image}
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                    ) : (
                      <AccountCircleIcon sx={{ width: 100, height: 100 }} />
                    )}
                  </Grid>
                  {data &&
                    [
                      { key: "driver_id", label: t("driver_id"), value: data?.driver ? data.driver : "" },
                      { key: "driver_name", label: t("driver_name"), value: data?.driver_name ? data.driver_name : "" },
                      {
                        key: "driver_contact", label: t("driver_contact"), value: data?.driver_contact ? (settings.AllowCriticalEditsAdmin
                          ? data?.driver_contact
                          : t("hidden_demo")) : ""
                      },
                      {
                        key: "driver_email", label: t("driver_email"), value: data?.driver_email ? (settings.AllowCriticalEditsAdmin
                          ? data?.driver_email
                          : t("hidden_demo")) : ""
                      },
                      { key: "car_type", label: t("car_type"), value: data?.carType ? data.carType : "" },
                      { key: "vehicle_no", label: t("vehicle_no"), value: data?.vehicle_number ? data.vehicle_number : "" },
                      { key: "fleetadmins", label: t("fleetadmins"), value: data?.fleetadmin && role === 'admin' ? data.fleetadmin : "" },
                      { key: "device_id", label: t("device_id"), value: data?.driverDeviceId ? data.driverDeviceId : "" },

                    ].map((item) =>
                      item.value ? renderGridItem(item, isRTL): null
                    )}
                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={3}>
            <Grid item>
              <Card className={classes.card}>
                {renderTypography(t("customer_info"))}
                <Grid container direction="column" style={{ padding: 15 }}>
                  <Grid
                    item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {data?.customer_image ? (
                      <Avatar
                        alt="customer profile image"
                        src={data?.customer_image}
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                    ) : (
                      <AccountCircleIcon sx={{ width: 100, height: 100 }} />
                    )}
                  </Grid>
                  {data &&
                    [
                      { key: "customer_id", label: t("customer_id"), value: data?.customer ? data.customer : "" },
                      { key: "customer_name", label: t("customer_name"), value: data?.customer_name ? data.customer_name : "" },
                      {
                        key: "customer_contact", label: t("customer_contact"), value: data?.customer_contact ? (settings.AllowCriticalEditsAdmin
                          ? data?.customer_contact
                          : t("hidden_demo")) : ""
                      },
                      {
                        key: "customer_email", label: t("customer_email"), value: data?.customer_email ? (settings.AllowCriticalEditsAdmin
                          ? data?.customer_email
                          : t("hidden_demo")) : ""
                      },

                    ].map((item) =>
                      item.value ? renderGridItem(item, isRTL): null
                    )}
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default BookingDetails;
