import React, { useState, useEffect, useRef } from "react";
import { Typography, Grid, Card, Avatar, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { colors } from "../components/Theme/WebTheme";
import CircularLoading from "../components/CircularLoading";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AlertDialog from "../components/AlertDialog";
import { api } from "common";
import {MAIN_COLOR, SECONDORY_COLOR, FONT_FAMILY} from "../common/sharedFunctions"
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: "10px",
    backgroundColor: SECONDORY_COLOR,
    minHeight: 60,
    minWidth: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 2,
    marginBottom: 10,
    boxShadow: `0px 2px 5px ${MAIN_COLOR}`,
  },
  txt: {
    padding: 10,
    fontWeight: "bold",
    minHeight: 60,
    backgroundColor:SECONDORY_COLOR,
    color: colors.LandingPage_Background,
    boxShadow: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily:FONT_FAMILY
  },
  buttonStyle:{
    borderRadius: "19px",
    minHeight: 50,
    minWidth: 150,
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
    cursor: "pointer",
    boxShadow: `0px 2px 5px ${SECONDORY_COLOR}`,
    fontFamily:FONT_FAMILY
  },
  avatar:{
    width: 300,
    height: 250,
    display: "flex",
    flexDirection: "column",
    boxShadow: 3,
    border: `2px dashed ${colors.TABLE_BORDER}`,
    fontSize: 16,
    background: "none",
    color: "inherit",
    fontWeight: "bold",
  }
}));

function UserDocuments() {
  const { id, rId } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir();
  const navigate = useNavigate();
  const { fetchUsersOnce, updateLicenseImage } = api;
  const [data, setData] = useState([]);
  const staticusers = useSelector((state) => state.usersdata.staticusers);
  const dispatch = useDispatch();
  const IdInputRef = useRef();
  const licenseImageFrontInputRef = useRef();
  const licenseImageBackInputRef = useRef();
  const loaded = useRef(false);
  const [editable, setEditable] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [licenseImageFront, setLicenseImageFront] = useState(null);
  const [licenseImageBack, setLicenseImageBack] = useState(null);
  const [commonAlert, setCommonAlert] = useState({ open: false, msg: "" });
  const settings = useSelector(state => state.settingsdata.settings);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    dispatch(fetchUsersOnce());
  }, [dispatch, fetchUsersOnce]);

  useEffect(() => {
    
    if (staticusers) {
      const user = staticusers.filter((user) => user.id === id.toString())[0];
      if (!user) {
        navigate("/404");
      }
      setData(user);
      
    } else {
      setData([]);
    }
    loaded.current = true;
  }, [staticusers, id, navigate, data]);

  const IdImageChange = async (e) => {
    setIdImage(e.target.files[0]);
  };
  const licenseImageBackChange = async (e) => {
    setLicenseImageBack(e.target.files[0]);
  };
  const licenseImageFrontChange = async (e) => {
    setLicenseImageFront(e.target.files[0]);
  };
  const handleCommonAlertClose = (e) => {
    e.preventDefault();
    setCommonAlert({ open: false, msg: "" });
  };
  const handleSaveUser = () => {
    setLoading(true);
    if(settings.AllowCriticalEditsAdmin){

      if (idImage) {
        dispatch(updateLicenseImage(data.id, idImage, "verifyIdImage")).then(
          ()=>{
            dispatch(fetchUsersOnce());
          }
        )
        
      } else if (data.usertype === "customer" && !idImage) {
        setCommonAlert({ open: true, msg: t("upload_verifyIdImage") });
      }
      if (licenseImageFront) {
        dispatch(updateLicenseImage(data.id, licenseImageFront, "licenseImage")).then(
          ()=>{
            dispatch(fetchUsersOnce());
          }
        )
      }
      if (licenseImageBack) {
        dispatch(
          updateLicenseImage(data.id, licenseImageBack, "licenseImageBack")
        ).then(
          ()=>{
            dispatch(fetchUsersOnce());
          }
        )
      }
      if (
        data.usertype === "driver" &&
        !licenseImageBack &&
        !licenseImageFront &&
        !idImage
      ) {
        setCommonAlert({ open: true, msg: t("update_profile_title") });
      }
      setTimeout(() => {
        setIdImage(null);
        setLicenseImageFront(null);
        setLicenseImageBack(null);
        setLoading(false);
        setEditable(false);
      }, 3000);
      loaded.current = true;
      }else{
      setLoading(false);
      setCommonAlert({ open: true, msg: t("demo_mode") });
    }
  };

  const handleCancel = () => {
    setIdImage(null);
    setLicenseImageBack(null);
    setLicenseImageFront(null);
    setEditable(false);
  };

  return loading ? (
    <CircularLoading />
  ) : (
    <>
      <div>
        <Card
          style={{
            borderRadius: "19px",
            backgroundColor: colors.WHITE,
            minHeight: 200,
            marginTop: 20,
            marginBottom: 20,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: isRTL === "rtl" ? "flex-end" : "flex-start",
            }}
          >
            <Typography
              variant="h5"
              style={{
                margin: "10px 10px 0 5px",
                fontFamily:FONT_FAMILY
              }}
            >
              {t("documents_title")}
            </Typography>
            <div
              style={{
                display: "flex",
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  navigate(`/users/${rId}`);
                }}
              >
                <Typography
                  style={{
                    margin: "10px 10px 0 5px",
                    textAlign: isRTL === "rtl" ? "right" : "left",
                    fontWeight: "bold",
                    color:MAIN_COLOR,
                    fontFamily:FONT_FAMILY
                  }}
                >
                  {`<<- ${t("go_back")}`}
                </Typography>
              </Button>
            </div>
          </div>

          <Grid
            container
            spacing={1}
            direction="column"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Grid item>
              <Grid
                container
                spacing={1}
                justifyContent={"center"}
                alignItems={"center"}
                marginY={10}
                gap={2}
                sx={{
                  display: "flex",
                  flexDirection:  "row",
                  direction:isRTL === "rtl" ? "rtl" : "ltr",
                }}
              >
                {editable ? (
                  <>
                    <>
                      {idImage ? (
                        <div
                          onClick={() => IdInputRef.current.click()}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 10,
                          }}
                        >
                          <img
                            src={URL.createObjectURL(idImage)}
                            alt="Profile"
                            style={{
                              width: 300,
                              height: 250,
                              borderRadius: "19px",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => IdInputRef.current.click()}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 30,
                            cursor: "pointer",
                          }}
                        >
                          <Avatar className={classes.avatar} variant="square" sx={{boxShadow: 3}}>
                            <FileUploadIcon
                              sx={{
                                fontSize: 100,
                                marginBottom: 3,
                                color: colors.Header_Text_back,
                                fontFamily:FONT_FAMILY
                              }}
                            />
                            {<Typography sx={{textAlign:"center"}} fontFamily={FONT_FAMILY}>{t("upload_id_details")}</Typography>}
                          </Avatar>
                        </div>
                      )}
                      <input
                        onChange={(event) => IdImageChange(event)}
                        multiple={false}
                        ref={IdInputRef}
                        type="file"
                        hidden
                      />
                    </>
                    {data?.usertype === "driver" ? (
                      <>
                        <>
                          {licenseImageFront ? (
                            <div
                              onClick={() =>
                                licenseImageFrontInputRef.current.click()
                              }
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 10,
                              }}
                            >
                              <img
                                src={URL.createObjectURL(licenseImageFront)}
                                alt="Profile"
                                style={{
                                  width: 300,
                                  height: 250,
                                  borderRadius: "19px",
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                licenseImageFrontInputRef.current.click()
                              }
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 30,
                                cursor: "pointer",
                              }}
                            >
                              <Avatar className={classes.avatar} variant="square" sx={{boxShadow: 3}}>
                                <FileUploadIcon
                                  sx={{
                                    fontSize: 100,
                                    marginBottom: 3,
                                    color: colors.Header_Text_back,
                                  }}
                                />
                                {<Typography  sx={{textAlign:"center"}} fontFamily={FONT_FAMILY}>{t("upload_driving_license_front")}</Typography>}
                              </Avatar>
                            </div>
                          )}
                          <input
                            onChange={(event) => licenseImageFrontChange(event)}
                            multiple={false}
                            ref={licenseImageFrontInputRef}
                            type="file"
                            hidden
                          />
                        </>
                        <>
                          {licenseImageBack ? (
                            <div
                              onClick={() =>
                                licenseImageBackInputRef.current.click()
                              }
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 10,
                              }}
                            >
                              <img
                                src={URL.createObjectURL(licenseImageBack)}
                                alt="Profile"
                                style={{
                                  width: 300,
                                  height: 250,
                                  borderRadius: "19px",
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() =>
                                licenseImageBackInputRef.current.click()
                              }
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 30,
                                cursor: "pointer",
                              }}
                            >
                              <Avatar className={classes.avatar} variant="square" sx={{boxShadow: 3}}>
                                <FileUploadIcon
                                  sx={{
                                    fontSize: 100,
                                    marginBottom: 3,
                                    color: colors.Header_Text_back,
                                  }}
                                />
                                {<Typography   sx={{textAlign:"center"}} fontFamily={FONT_FAMILY}>{t("upload_driving_license_back")}</Typography>}
                              </Avatar>
                            </div>
                          )}
                          <input
                            onChange={(event) => licenseImageBackChange(event)}
                            multiple={false}
                            ref={licenseImageBackInputRef}
                            type="file"
                            hidden
                          />
                        </>
                      </>
                    ) : null}
                  </>
                ) : (
                  <Grid container spacing={10}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={data.usertype === "customer" ? 12 : 4}
                      xl={data.usertype === "customer" ? 12 : 4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: 15,
                      }}
                    >
                      <Grid
                        item
                        style={{
                          width: "100%",
                        }}
                      >
                        <Card className={classes.card}>
                          <Typography
                            style={{
                              textAlign: "center",
                              fontSize: 16,
                              fontWeight:"bold",
                              fontFamily:FONT_FAMILY
                            }}
                          >
                            {t("verifyid_image")}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid
                        item
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {data.verifyIdImage ? (
                          <div onClick={() => setEditable(true)}>
                            <Avatar
                              alt="Id Image"
                              src={data.verifyIdImage}
                              sx={{
                                width: 300,
                                height: 250,
                                borderRadius: "19px",
                                cursor: "pointer",
                              }}
                              variant="square"
                            />
                          </div>
                        ) : (
                          <div onClick={() => setEditable(true)}>
                            <Avatar className={classes.avatar} variant="square" sx={{boxShadow: 3, cursor:"pointer",fontFamily:FONT_FAMILY,textAlign:"center"}}>
                              {t("verifyid_image")}
                            </Avatar>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                    {data?.usertype === "driver" ? (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            gap: 15,
                          }}
                        >
                          <Grid item style={{ width: "100%" }}>
                            <Card className={classes.card}>
                              <Typography
                                style={{
                                  textAlign: "center",
                                  fontSize: 16,
                                  fontWeight:"bold",
                                  fontFamily:FONT_FAMILY
                                }}
                              >
                                {t("driving_license_font")}
                              </Typography>
                            </Card>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {data.licenseImage ? (
                              <div onClick={() => setEditable(true)}>
                                <Avatar
                                  alt="Id Image"
                                  src={data.licenseImage}
                                  sx={{
                                    width: 300,
                                    height: 250,
                                    borderRadius: "19px",
                                    cursor: "pointer",
                                  }}
                                  variant="square"
                                />
                              </div>
                            ) : (
                              <div onClick={() => setEditable(true)}>
                                <Avatar className={classes.avatar} variant="square" sx={{boxShadow: 3, cursor:"pointer",fontFamily:FONT_FAMILY,textAlign:"center"}}>
                                  {t("driving_license_font")}
                                </Avatar>
                              </div>
                            )}
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            gap: 15,
                          }}
                        >
                          <Grid item style={{ width: "100%" }}>
                            <Card className={classes.card}>
                              <Typography
                                style={{
                                  textAlign: "center",
                                  fontSize: 16,
                                  fontWeight:"bold",
                                  fontFamily:FONT_FAMILY,
                                }}
                              >
                                {t("driving_license_back")}
                              </Typography>
                            </Card>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {data.licenseImageBack ? (
                              <div onClick={() => setEditable(true)}>
                                <Avatar
                                  alt="Id Image"
                                  src={data.licenseImageBack}
                                  sx={{
                                    width: 300,
                                    height: 250,
                                    borderRadius: "19px",
                                    cursor: "pointer",
                                  }}
                                  variant="square"
                                />
                              </div>
                            ) : (
                              <div onClick={() => setEditable(true)}>
                                <Avatar className={classes.avatar} variant="square" sx={{boxShadow: 3, cursor:"pointer",fontFamily:FONT_FAMILY, textAlign:"center"}}>
                                  {t("driving_license_back")}
                                </Avatar>
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      </>
                    ) : null}
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item>
              {!editable ? (
                <Button className={classes.buttonStyle}
                  style={{
                    backgroundColor: MAIN_COLOR,
                    width: "50%",
                  }}
                  variant="contained"
                  onClick={() => setEditable(true)}
                  sx={{
                    cursor: "pointer",
                    borderColor: colors.CARD_DETAIL,
                  }}
                >
                  <Typography
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      color:colors.WHITE,
                      fontWeight:"bold",
                      fontFamily:FONT_FAMILY
                    }}
                  >
                    {t("edit")}
                  </Typography>
                </Button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    flexDirection: isRTL === "rtl" ? "row-reverse" : "row",
                    gap: 10,
                  }}
                >
                  <Button className={classes.buttonStyle}
                    style={{
                      backgroundColor: colors.GREEN,
                      width: "40%",
                    }}
                    variant="contained"
                    onClick={handleSaveUser}
                  >
                    <Typography
                      style={{
                        color: colors.WHITE,
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight:"bold",
                        fontFamily:FONT_FAMILY
                      }}
                    >
                      {t("save")}
                    </Typography>
                  </Button>
                  <Button className={classes.buttonStyle}
                    style={{
                      backgroundColor:colors.RED,
                      width: "40%",
                    }}
                    variant="contained"
                    onClick={handleCancel}
                  >
                    <Typography
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        fontWeight:"bold",
                        color:colors.WHITE,
                        fontFamily:FONT_FAMILY
                      }}
                    >
                      {t("cancel")}
                    </Typography>
                  </Button>
                </div>
              )}
            </Grid>
          </Grid>
        </Card>
        <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>
          {commonAlert.msg}
        </AlertDialog>
      </div>
    </>
  );
}

export default UserDocuments;
