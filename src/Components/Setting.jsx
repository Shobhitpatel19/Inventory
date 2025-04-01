import { useEffect } from "react";
import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import axios from "axios";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Chip from "@mui/material/Chip";
import TabContext from "@mui/lab/TabContext";
import { TextField, Card, Grid, Typography } from "@mui/material";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import configs from "../Constants";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Setting = () => {
  const [merchantCode, setMerchantCode] = useState("");
  const [providerId, setProviderId] = useState("");
  const [paymentGateWay, setPaymentGateWay] = useState("");
  const [bgImage, setBgImage] = useState("");
  const [delivaryPartner, setDelivaryPartner] = useState("");
  const [currency, setCurrency] = useState("");
  const [logo, setLogo] = useState("");

  const [dialogOPen, setDialogOPen] = useState(false);
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState([]);

  const [provider, setProvider] = useState("");
  const [providerTitle, setProviderTitle] = useState("");
  const [providerCode, setProviderCode] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [clovId, setClovId] = useState("");
  const [isTest, setIsTest] = useState("");
  const [region, setRegion] = useState("");
  const [meal, setMeal] = useState(false);
  const [providerInfoId, setProviderInfoId] = useState("");
  const [onlyTakeAway, setOnlyTakeAway] = useState(false);
  const [MenuLeft, setMenuLeft] = useState(false);

  const [providerDetail, setProviderDetail] = useState([]);

  const [value, setValue] = useState("1");
  // new states for new addon
  const [taxDine, setTaxDine] = useState(0);
  const [taxAway, setTaxAway] = useState(0);
  const [fontColor, setFontColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ff0000");
  const [showAddon, setShowAddon] = useState(false);
  const [customizeInWizard, setCustomizeInWizard] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  // added by sk
  const [note, setNote] = useState(""); // For merchant notes
  const [latitude, setLatitude] = useState(""); // For latitude
  const [longitude, setLongitude] = useState(""); // For longitude
  const [openTime, setOpenTime] = useState(""); // Store open time
  const [closeTime, setCloseTime] = useState(""); // Store close time

  let baseURL = configs.baseURL;

  const handleTaxDine = (e) => {
    //  This function updates the state of taxDine whenever the user interacts with an input field related to dining tax.
    setTaxDine(e.target.value); //setTaxDine is the state updater function it set the value of taxDine                              // (e)The event object, which captures the action (such as typing or changing the value in a form field)
  }; // e.target.value: Refers to the value in the input field where the event occurred (in this case, the tax for dining).
  const handleTaxAway = (e) => {
    setTaxAway(e.target.value); // similar to handleTaxDine its for tax for take away
  };

  const handleFontColor = (e) => {
    setFontColor(e.target.value); //this function is for handling font color
  };

  const handleBackgroundColor = (e) => {
    // handling the backgriund color
    setBackgroundColor(e.target.value);
  };

  const handleChange = (event: React.SyntheticEvent, newValue) => {
    setValue(newValue);
    console.log("HI this is console from the handle change", newValue); // the new value that is passed, which will be stored in the state
  };

  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";

  const userId = userData ? userData.sub : " ";

  const handleSubmit = () => {
    if (providerInfoId) {
      if (merchantCode) {

        console.log("openTime" , openTime , "closeTime" , closeTime);
        //Checks if the merchantCode exists (i.e., the merchant has provided a code). If true, it proceeds to send the request to the server; otherwise, it logs an error.
        setOpen(false); // Close the dialog after saving
        axios
          //makes an HTTP request to update exisiting setting for a specific provider
          .put(baseURL + "/api/settings/" + providerInfoId, {
            //this sends updated pprovider settings to the API end point, here the PUT method is used to modify the exisiting data
            userId: userId,
            merchantCode: merchantCode,
            activeProviderId: providerId,
            sokBGImg: bgImage,
            activePaymentGateway: paymentGateWay,
            activeDeliveryPartner: delivaryPartner,
            currency: currency,
            logoImg: logo,
            id: providerInfoId,
            onlyTakeAway: onlyTakeAway ? onlyTakeAway : false,
            isLeftAlign: MenuLeft,
            filterVegNonVeg: meal ? meal : false,
            themeColor: backgroundColor,
            themeTxtColor: fontColor,
            customizeInWizard: customizeInWizard ? customizeInWizard : false,
            dineinTax: taxDine,
            takeAwayTax: taxAway,
            notes: note,
            openTime: openTime,
            closeTime: closeTime,

            // Add the location as GeoJSON
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          })
          .then((res) => {
            //Handles the response from the PUT request if it is successful. It logs the response to the console.
            console.log("submited the edit form---", res);
            //After successfully updating the provider's settings, this line makes a GET request to fetch the updated
            // user information using the userId and logs the response to the console.
            axios.get(baseURL + "/api/settings/" + userId).then((res) => {
              setUserInfo(res.data);
            });
          });
      } else {
        console.log("err");
      }
    } else {
      if (merchantCode) {
        axios
          .post(
            baseURL + "/api/settings",
            // "http://15.204.58.171:6006/api/settings",

            {
              userId: userId,
              merchantCode: merchantCode, // like USPIZZA-KEMP
              activeProviderId: providerId,
              sokBGImg: bgImage,
              activePaymentGateway: paymentGateWay,
              activeDeliveryPartner: delivaryPartner,
              currency: currency,
              logoImg: logo,
              onlyTakeAway: onlyTakeAway,
              isLeftAlign: MenuLeft,
              //here meal in post method
              filterVegNonVeg: meal,
              customizeInWizard: customizeInWizard,
            }
          )
          .then((res) => {
            console.log(res);

            axios.get(baseURL + "/api/settings/" + userId).then((res) => {
              console.log(res.data);
              setUserInfo(res.data);
            });
          });
      } else {
        console.log("err");
      }
    }
  };

  useEffect(() => {
    axios.get(baseURL + "/api/settings/" + userId).then((res) => {
      setUserInfo(res.data);
    });

    axios.get(baseURL + "/api/thp-source?userId=" + userId).then((res) => {
      console.log(res.data);
      setProviderDetail(res.data); //Updates the providerDetail state with the fetched data
    });
  }, []);

  const handleDialog = () => {
    setOpen(true);
    let randomCode = randomString(10, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    setMerchantCode(randomCode);
  };

  function randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  // /thp-source

  const handleClover = () => {
    let merchantDetails = {
      providerTitle: providerTitle,
      providerCode: providerCode,
      apiKey: apiKey,
      isTestAccount: isTest,
      region: region,
    };

    if (clovId) {
      let data = document.getElementById("country").value;
      console.log(data);

      axios
        .put(baseURL + "/api/thp-source/" + clovId, {
          userId: userId,
          provider: provider,
          merchantDetails: JSON.stringify(merchantDetails),
        })
        .then((res) => {
          console.log(res);
          setApiKey("");

          setProviderCode("");
          setProviderTitle("");
          setProvider("");
          setClovId("");
          setIsTest("");
          setRegion("");

          axios
            .get(baseURL + "/api/thp-source?userId=" + userId)
            .then((res) => {
              console.log(res.data);
              setProviderDetail(res.data);
              console.log("hello");
              setOpen(false);
            });
        });
    } else if (providerCode && providerTitle) {
      axios
        .post(baseURL + "/api/thp-source", {
          userId: userId,
          provider: provider,
          merchantDetails: JSON.stringify(merchantDetails),
        })
        .then((res) => {
          console.log(res);
          setApiKey("");
          setProviderCode("");
          setProviderTitle("");
          setProvider("");
          setIsTest("");
          setRegion("");

          axios
            .get(baseURL + "/api/thp-source?userId=" + userId)
            .then((res) => {
              console.log(res.data);
              setProviderDetail(res.data);
              setOpen(false);
            });
        });
    } else {
      console.log("errr");
    }
  };

  // const handleDelete = (cloverId) => {
  //   axios.delete(baseURL + "/api/thp-source/" + cloverId).then((res) => {
  //     console.log(res);
  //     axios.get(baseURL + "/api/thp-source?userId=" + userId).then((res) => {
  //       console.log(res.data);
  //       setProviderDetail(res.data);
  //     });
  //   });
  // };

  const handleEdit = (cloverId) => {
    console.log(cloverId);
    let filterData = providerDetail.filter((pro) => pro.id === cloverId);
    console.log(filterData);
    setClovId(cloverId);
    setDialogOPen(true);

    let data = JSON.parse(filterData[0].merchantDetails);
    console.log(data);

    setApiKey(data.apiKey);
    setProviderCode(data.providerCode);
    setProviderTitle(data.providerTitle);
    setProvider(filterData[0].provider);
    setIsTest(data.isTestAccount);
    setRegion(data.region);
  };

  function handleProviderEdit(infoId) {
    console.log(infoId);
    setProviderInfoId(infoId);
    let fltData = userInfo.filter((info) => info.id === infoId);
    console.log("fltdata",fltData);
    setMerchantCode(fltData[0].merchantCode);
    setProviderId(fltData[0].activeProviderId);
    setPaymentGateWay(fltData[0].activePaymentGateway);
    setBgImage(fltData[0].sokBGImg);
    setDelivaryPartner(fltData[0].activeDeliveryPartner);
    setCurrency(fltData[0].currency);
    setLogo(fltData[0].logoImg);
    setOnlyTakeAway(fltData[0].onlyTakeAway);
    setMenuLeft(fltData[0].isLeftAlign);
    setMeal(fltData[0].filterVegNonVeg);
    setCustomizeInWizard(fltData[0].customizeInWizard);
    setTaxAway(fltData[0].takeAwayTax);
    setTaxDine(fltData[0].dineinTax);
    setBackgroundColor(fltData[0].themeColor);
    setFontColor(fltData[0].themeTxtColor);
    setOpenTime(fltData[0].openTime);
    setCloseTime(fltData[0].closeTime);

    // Extract latitude and longitude from GeoJSON coordinates
    const coordinates = fltData[0].location?.coordinates || [];
    setLongitude(coordinates[0] || "");
    setLatitude(coordinates[1] || "");
    setNote(fltData[0].notes || ""); // Set Note
    setOpen(true);
  }

  function handleProviderDelete(infoId) {
    console.log(infoId);
    axios.delete(baseURL + "/api/settings/" + infoId).then((res) => {
      console.log(res.data);
      axios.get(baseURL + "/api/settings/" + userId).then((res) => {
        console.log(res.data);
        setUserInfo(res.data);
      });
    });
  }

  const handleEditClick = (infoId, field, value) => {
    setEditField(`${infoId}-${field}`);
    setEditedValues({ ...editedValues, [`${infoId}-${field}`]: value });
  };

  const handleSave = (infoId, field) => {
    handleProviderEdit(infoId);
    setEditField(null);
  };

  const handleCancel = () => {
    setEditField(null);
  };

  return (
    <div className="container">
      <div className="header" style={{ marginBottom: "-7px" }}>
        <h4>Setting</h4>

        {!userInfo.length ? (
          <button className="add_btn" onClick={handleDialog}>
            {" "}
            <AddIcon /> ADD New
          </button>
        ) : (
          ""
        )}
      </div>

      <Dialog
        open={open || userInfo.lenght === 0}
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
          Add Merchant Info
        </DialogTitle>
        <div style={{ padding: "20px" }}>
          <div className="row">
            <div className="col">
              <Box
                sx={{
                  width: 400,
                  maxWidth: "100%",
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  fullWidth
                  id="fullWidth"
                  label="Merchant Code"
                  value={merchantCode}
                  disabled
                  onChange={(e) => setMerchantCode(e.target.value)}
                />
              </Box>
            </div>
            <div className="col">
              <label>Activate Provider :</label>
              <select
                onChange={(e) => setProviderId(e.target.value)}
                className="select_input"
              >
                <option>Select</option>
                <option value="" selected={providerId === ""}>
                  CUSTOM
                </option>
                {providerDetail.map((pro, i) => {
                  console.log(pro);
                  let detail = JSON.parse(pro.merchantDetails);
                  return (
                    <option selected={pro.id === providerId} value={pro.id}>
                      {pro.provider}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col"></div>

            <div className="col" style={{ float: "left", width: "50%" }}>
              <label for="favcolor">Background Theme</label>
              <input
                type="color"
                id="favcolor"
                style={{ margin: "0px 5px" }}
                value={backgroundColor}
                onChange={handleBackgroundColor}
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <Box
                sx={{
                  width: 400,
                  maxWidth: "100%",
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  fullWidth
                  id="fullWidth"
                  label="Currency"
                  defaultValue={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                />
              </Box>
            </div>

            <div className="col">
              <Box
                sx={{
                  width: 400,
                  maxWidth: "100%",
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  fullWidth
                  id="fullWidth"
                  label="Enter Logo url"
                  defaultValue={logo}
                  onChange={(e) => setLogo(e.target.value)}
                />
              </Box>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <Box
                sx={{
                  width: 400,
                  maxWidth: "100%",
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  fullWidth
                  id="fullWidth"
                  label="Delivary Partner"
                  defaultValue={delivaryPartner}
                  onChange={(e) => setDelivaryPartner(e.target.value)}
                />
              </Box>
            </div>

            <div className="col">
              <Box
                sx={{
                  width: 400,
                  maxWidth: "100%",
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  fullWidth
                  id="fullWidth"
                  type="number"
                  label="Online Price increase by %"

                  // onChange={(e) => setDelivaryPartner(e.target.value)}
                />
              </Box>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Take Away"
                  checked={onlyTakeAway}
                  onChange={(e) => setOnlyTakeAway(e.target.checked)}
                />
              </FormGroup>
            </div>

            <div className="row">
              <p className="line1">Theme Font Color</p>
              <input
                type="color"
                id="favcolor"
                style={{ margin: "0px 5px" }}
                value={fontColor}
                onChange={handleFontColor}
              />
            </div>

            <div className="col">
              <Box
                sx={{
                  width: 400,
                  maxWidth: "100%",
                }}
                noValidate
              >
                <TextField
                  fullWidth
                  id="fullWidth"
                  label="Active Payment Gateway"
                  defaultValue={paymentGateWay}
                  onChange={(e) => setPaymentGateWay(e.target.value)}
                />
              </Box>
            </div>

            <div className="col">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Filter VegNonVeg"
                  onChange={(e) => setMeal(e.target.checked)}
                  checked={meal}
                />
              </FormGroup>
            </div>

            <div className="col">
              <p className="line1" htmlFor="">
                Tax for Dine-in
              </p>
              <input
                type="number"
                style={{ marginLeft: "5px", width: "100px" }}
                value={taxDine}
                onChange={handleTaxDine}
              />
            </div>

            <div className="col">
              <p className="line1">Tax for Take Away</p>
              <input
                type="number"
                style={{ marginLeft: "5px", width: "100px" }}
                value={taxAway}
                onChange={handleTaxAway}
              />
            </div>

            <div className="col">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Left Align Order Panel (PoS)"
                  onChange={(e) => setMenuLeft(e.target.checked)}
                  checked={MenuLeft}
                />
              </FormGroup>
            </div>

            <div className="col">
              <p className="line1">Customize In Wizard</p>
              <input
                type="checkbox"
                style={{
                  width: "40px",
                  height: "20px",
                  accentColor: "#31e631",
                  cursor: "pointer",
                }}
                checked={customizeInWizard}
                onChange={() => {
                  setCustomizeInWizard((prev) => !prev);
                }}
              />
            </div>

            <div className="col">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Payement Gatway Enabled"
                  checked={paymentGateWay}
                  onChange={(e) => setPaymentGateWay(e.target.checked)}
                />
              </FormGroup>
            </div>
            <div className="row" style={{ marginBottom: "20px" }}>
              <div className="col" style={{ paddingRight: "10px" }}>
                <Box
                  sx={{
                    width: 400,
                    maxWidth: "100%",
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    fullWidth
                    id="fullWidth"
                    label="Latitude"
                    type="number"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </Box>
              </div>
              <div className="col" style={{ paddingLeft: "10px" }}>
                <Box
                  sx={{
                    width: 400,
                    maxWidth: "100%",
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    fullWidth
                    id="fullWidth"
                    label="Longitude"
                    type="number"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </Box>
              </div>
            </div>
            <div className="row" style={{ marginBottom: "20px" , display : "flex" , gap: "100px" }}>
              <div className="col">
                <p className="line1">Open Time</p>
                <TextField
                  fullWidth
                  type="number"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                />
              </div>

              <div className="col">
                <p className="line1">Close Time</p>
                <TextField
                  fullWidth
                  type="number"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                />
              </div>
            </div>

            <div
              className="row"
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <div className="col" style={{ maxWidth: "50%" }}>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "100%",
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    fullWidth
                    id="fullWidth"
                    label="Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Box>
              </div>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              textAlign: "right",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
              style={{ marginRight: "20px" }}
            >
              Close
            </Button>

            <Button variant="contained" color="success" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </Dialog>

      <TabContext value={value}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", 
            alignItems: "center", 
            flexDirection: "column", 
            textAlign: "center",
            marginBottom: "20px",
            marginTop: "-40px",
            width: "100%", // Ensures it takes full width
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            sx={{
              "& .MuiTabs-indicator": {
                display: "none",
              },
              "& .MuiTab-root": {
                color: "black",
                minWidth: "150px",
                borderRadius: "0px",
              },
              "& .Mui-selected": {
                backgroundColor: "#FFC107",
                color: "black",
                borderRadius: "0px",
              },
            }}
          >
            <Tab
              style={{ border: "1px solid #ccc" }}
              label="DETAILS"
              value="1"
            />
            <Tab
              style={{ border: "1px solid #ccc" }}
              label="EXTERNAL SOURCES"
              value="2"
            />
          </TabList>
        </Box>

        {/* Table 1 starts from heree */}
        <TabPanel
          value="1"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            backgroundColor: "#fff",
            overflow: "auto",
            margin: "0px 10px",
            borderRadius: "10px",
            scrollbarWidth: "none",
          }}
        >
          {userInfo.length
            ? userInfo.map((info, i) => {
                //console.log("fetch information-----", info);
                //console.log("cordinates------", info.location.coordinates[0]);
                let fData = providerDetail.filter(
                  (cl) => cl.id === info.activeProviderId
                );
                let proName = fData.length ? fData[0].provider : "CUSTOM";

                //here the showcasing of part of edits
                return (
                  <div key={i}>
                    <Button
                      variant="contained"
                      color="success"
                      style={{
                        position: "absolute",
                        float: "right",
                        right: "20px",
                      }}
                      className="add_btn"
                      onClick={() => handleProviderEdit(info.id)}
                    >
                      Edit
                    </Button>
                    <div className="rowS ">
                      <div className="col">
                        <span>Provider Name</span>
                        <br />
                        <b>
                          <span className="pName">{proName}</span>
                        </b>
                      </div>
                      <div className="col">
                        <span> Merchant Code</span>
                        <br />
                        <b>
                          <span className="pName">{info.merchantCode}</span>
                        </b>
                      </div>
                    </div>
                    <hr style={{ marginTop: "20px" }} />
                    <div className="rowS">
                      <div className="col">
                        <p className="line1">Show Order Panel (In Pos)</p>
                        <Chip
                          label={info.isLeftAlign ? "LEFT" : "RIGHT"}
                          color="success"
                          style={{
                            marginLeft: "10px",
                            fontSize: "x-small",
                            fontWeight: "bold",
                          }}
                        />
                      </div>

                      <div className="col">
                        <p className="line1">Theme Background :</p>
                        <input
                          type="color"
                          id="favcolor"
                          style={{ margin: "0px 5px" }}
                          value={info.themeColor}
                          readOnly={true}
                        />
                      </div>
                    </div>

                    <div className="rowS">
                      <div className="col">
                        <p className="line1">Theme Text Color</p>
                        <input
                          type="color"
                          id="favcolor"
                          style={{ margin: "0px 5px" }}
                          readOnly={true}
                          value={info.fontColor}
                        />
                      </div>
                      <div className="col">
                        <p className="line1">Veg/Non-Veg Filter</p>
                        <input
                          type="checkbox"
                          checked={info.filterVegNonVeg}
                          readOnly={true}
                          style={{
                            width: "40px",
                            height: "20px",
                            accentColor: "#31e631",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>

                    <div className="rowS">
                      <div className="col">
                        <p className="line1" htmlFor="">
                          Tax for Dine-in
                        </p>
                        <input
                          type="number"
                          readOnly={true}
                          style={{ marginLeft: "5px", width: "100px" }}
                          value={info.dineinTax}
                        />
                      </div>

                      <div className="col">
                        <div>
                          <p className="line1">Payment Gatway Enabled?</p>
                          <input
                            type="checkbox"
                            checked={info.activePaymentGateway}
                            style={{
                              width: "40px",
                              height: "20px",
                              accentColor: "#31e631",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="rowS">
                      <div className="col">
                        <p className="line1">Tax for Take Away</p>
                        <input
                          type="number"
                          style={{ marginLeft: "5px", width: "100px" }}
                          value={info.takeAwayTax}
                        />
                      </div>
                      {/* Add on check no need */}
                      {/* <div
                      className="col"
                    >
                      <p className="line1">
                        AddOn list with category?
                      </p>
                      <input
                        type="checkbox"
                        style={{
                          width: "40px",
                          height: "20px",
                          accentColor: "#31e631",
                          cursor: "pointer",
                        }}
                        value={showAddon}
                        onChange={() => {
                          setShowAddon((prev) => !prev);
                        }}
                      />
                    </div> */}
                    </div>

                    <div className="col">
                      <p className="line1">Customize In Wizard</p>
                      <input
                        type="checkbox"
                        readonly={true}
                        style={{
                          width: "40px",
                          height: "20px",
                          accentColor: "#31e631",
                          cursor: "pointer",
                        }}
                        checked={info.customizeInWizard}
                      />
                    </div>

                    <div className="rowS">
                      <div className="col">
                        <p className="line1">Only Take Away</p>
                        <input
                          type="checkbox"
                          readonly={true}
                          style={{
                            width: "40px",
                            height: "20px",
                            accentColor: "#31e631",
                            cursor: "pointer",
                          }}
                          checked={info.onlyTakeAway}
                        />
                      </div>
                    </div>
                    <div className="rowS">
                      <div className="col">
                        <p className="line1" htmlFor="">
                          Latitude
                        </p>
                        <input
                          type="number"
                          readOnly={true}
                          style={{ marginLeft: "5px", width: "100px" }}
                          value={
                            info?.location?.coordinates
                              ? info.location.coordinates[1]
                              : 0
                          }
                        />
                      </div>

                      <div className="col">
                        <p className="line1" htmlFor="">
                          Longitude
                        </p>
                        <input
                          type="number"
                          readOnly={true}
                          style={{ marginLeft: "5px", width: "100px" }}
                          value={
                            info?.location?.coordinates
                              ? info.location.coordinates[0]
                              : 0
                          }
                        />
                      </div>
                    </div>
                    <div className="rowS">
                      <div className="col">
                        <p className="line1">Open Time</p>
                        <input
                          type="text"
                          readOnly
                          style={{ marginLeft: "5px", width: "150px" }}
                          value={info.openTime}
                        />
                      </div>

                      <div className="col">
                        <p className="line1">Close Time</p>
                        <input
                          type="text"
                          readOnly
                          style={{ marginLeft: "5px", width: "150px" }}
                          value={info.closeTime}
                        />
                      </div>
                    </div>

                    <div className="rowS" style={{ padding: "10px 0" }}>
                      <div className="col" style={{ width: "100%" }}>
                        <p
                          className="line1"
                          style={{
                            fontWeight: "bold",
                            marginBottom: "8px",
                            color: "#333",
                          }}
                        >
                          Note
                        </p>
                        <div
                          style={{
                            backgroundColor: "#f9f9f9",
                            padding: "15px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            fontSize: "14px",
                            color: "#555",
                            lineHeight: "1.6",
                            marginBottom: "50px"
                          }}
                        >
                          {info.notes ? info.notes : "No note available"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : ""}
        </TabPanel>

        {/* Table 1 ends here  */}
        <TabPanel value="2">
          <div style={{ display: "flex", justifyContent: "end" }}>
            <button className="add_btn" onClick={() => setDialogOPen(true)}>
              <AddIcon /> Add New
            </button>
          </div>
          <Dialog open={dialogOPen} maxWidth="lg" fullWidth={true}>
            <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
              {"Add Provider"}
            </DialogTitle>
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "8px",
              }}
              className={"rowinput"}
            >
              <span>
                <lable>Provider *</lable>
                <input
                  className="input_cls"
                  placeholder="Enter Provider"
                  onChange={(e) => setProvider(e.target.value)}
                  defaultValue={provider}
                />
              </span>
              <span>
                <lable>Provider Title *</lable>
                <input
                  className="input_cls"
                  placeholder="Enter Provider title"
                  defaultValue={providerTitle}
                  onChange={(e) => setProviderTitle(e.target.value)}
                />
              </span>
              <span>
                <lable>Provider Code *</lable>
                <input
                  className="input_cls"
                  placeholder="Enter Provider code"
                  defaultValue={providerCode}
                  onChange={(e) => setProviderCode(e.target.value)}
                />
              </span>
              <br />
              <span>
                <lable>Api Key *</lable>
                <input
                  className="input_cls"
                  placeholder="Enter api key"
                  defaultValue={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </span>
              <span>
                <label>Test Account :</label>
                <input
                  type="checkbox"
                  defaultValue={isTest}
                  onChange={(e) => setIsTest(e.target.checked)}
                />
              </span>

              <br />
              <span>
                <label for="country">Region :</label>

                <select
                  name="country"
                  id="country"
                  className="select_input"
                  defaultValue={region}
                  placeholder="Select Country"
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="" disabled selected hidden>
                    Select Country
                  </option>
                  <option value="usa">USA</option>
                  <option value="india">India</option>
                  <option value="uae">UAE</option>
                  <option value="australia">Australia</option>
                </select>
              </span>

              <div
                style={{
                  width: "100%",
                  alignItems: "center",
                  marginTop: "20px",
                  textAlign: "right",
                }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  style={{ marginRight: "20px" }}
                  onClick={() => setDialogOPen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleClover}
                >
                  Save
                </Button>
              </div>
            </div>
          </Dialog>

          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <table
              align="center"
              cellPadding="5px"
              style={{ padding: "10px", width: "100%" }}
            >
              <thead style={{ background: "#f1f1f1" }}>
                <tr>
                  <th>#</th>
                  <th>Provider</th>
                  <th>Merchant Name</th>
                  <th>Merchant Code</th>
                  <th>Key</th>
                  <th>Test Account</th>
                  <th>Region</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {providerDetail.map((pro, i) => {
                  let detail = JSON.parse(pro.merchantDetails);
                  console.log(detail.isTestAccount);
                  return (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{pro.provider}</td>
                      <td>{detail.providerTitle}</td>
                      <td>{detail.providerCode}</td>
                      <td>{detail.apiKey}</td>
                      <td>{detail.isTestAccount ? "Yes" : "No"}</td>
                      <td>{detail.region}</td>
                      <td>
                        <IconButton
                          aria-label="delete"
                          color="info"
                          onClick={() => handleEdit(pro.id)}
                          className="btn bg-light mx-2"
                        >
                          <EditIcon />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabPanel>

        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </div>
  );
};

export default Setting;

// {\"serviceName\":\"Clover\",\"
// providerTitle\":\"THE CHEFS DELIGHT AT STO\",\
// "providerCode\":\"YF5XNRVSS39C1\",\
// "apiKey\":\"6fdaada1-8786-aa21-2b03-a166e0e4d938\"}
