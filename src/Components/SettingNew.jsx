import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup , Dialog , DialogTitle } from "@mui/material";
import axios from "axios";
import configs from "../Constants";
import EditableField from "../Components/sub_comp/EditableField";
import { IconButton } from "@mui/material";
import { TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

export default function App() {
  const [tabValue, setTabValue] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [providerDetail, setProviderDetail] = useState([]);
  const [latitude, setLatitude] = useState(""); // For latitude
  const [longitude, setLongitude] = useState("");

  const [dialogOPen, setDialogOPen] = useState(false);
  const [provider, setProvider] = useState("");
  const [providerTitle, setProviderTitle] = useState("");
  const [providerCode, setProviderCode] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [clovId, setClovId] = useState("");
  const [isTest, setIsTest] = useState("");
  const [region, setRegion] = useState("");
  const [open, setOpen] = useState(false);


  const baseURL = configs.baseURL;

  // Fetch user session data
  const userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : null;
  const userId = userData ? userData.sub : null;

  useEffect(() => {
    if (!userId) return; // Prevent API call if userId is missing

    axios
      .get(`${baseURL}/api/settings/${userId}`)
      .then((res) => {
        console.log("Fetched user info:", res.data[0]);
        setLongitude(res.data[0].location.coordinates[0]);
        setLatitude(res.data[0].location.coordinates[1]);
        setUserInfo(res.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, [userId]);

  // Handle field update
  const handleFieldUpdate = (key, newValue) => {
    setUserInfo((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleCheckboxChange = (key) => {
    setUserInfo((prev) => ({
      ...prev,
      [key]: !prev[key], // Toggle value
    }));
  };

  const handleSaveSettings = async () => {
    if (!userInfo) return;

    try {
      await axios.put(`${baseURL}/api/settings/${userInfo.id}`, {
        userId: userInfo.userId,
        merchantCode: userInfo.merchantCode,
        activeProviderId: userInfo.providerId,
        sokBGImg: userInfo.bgImage,
        activePaymentGateway: userInfo.activePaymentGateway,
        activeDeliveryPartner: userInfo.delivaryPartner,
        currency: userInfo.currency,
        logoImg: userInfo.logoImg,
        id: userInfo.id,
        onlyTakeAway: userInfo.onlyTakeAway,
        isLeftAlign: userInfo.MenuLeft,
        filterVegNonVeg: userInfo.filterVegNonVeg,
        themeColor: userInfo.themeColor,
        themeTxtColor: userInfo.themeTxtColor,
        customizeInWizard: userInfo.customizeInWizard,
        dineinTax: userInfo.dineinTax,
        takeAwayTax: userInfo.takeAwayTax,
        notes: userInfo.notes,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      });

      console.log("Settings updated successfully!");
      toast.success("Setting updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

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

  if (!userInfo) {
    return <p>Loading user information...</p>;
  }

  return (
    <div >
      <div className="header">
        <h4 align="center">Reports</h4>
        <Box
          sx={{
            width: "60%",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <ButtonGroup aria-label="Basic button group">
            <Button
              variant={tabValue === 0 ? "contained" : "outlined"}
              style={{
                backgroundColor: tabValue === 0 ? "#F7C919" : "inherit",
                borderColor: "#F7C919",
                color: tabValue === 0 ? "black" : "inherit",
              }}
              onClick={() => setTabValue(0)}
            >
              Details
            </Button>
            <Button
              variant={tabValue === 1 ? "contained" : "outlined"}
              style={{
                backgroundColor: tabValue === 1 ? "#F7C919" : "inherit",
                borderColor: "#F7C919",
                color: tabValue === 1 ? "black" : "inherit",
              }}
              onClick={() => setTabValue(1)}
            >
              External Source
            </Button>
          </ButtonGroup>
        </Box>
      </div>

      {tabValue === 0 && userInfo && (
        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            overflowY: "auto",
            maxHeight: "80vh",
          }}
        >
          {/* Merchant Info */}
          <div
            style={{
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              background: "white",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Merchant Info
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <EditableField
                label="Provider Name"
                value={userInfo.firstName + userInfo.lastName || ""}
                fieldKey="firstName"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
                isEditable={false}
              />
              <EditableField
                label="Merchant Code"
                value={userInfo.merchantCode}
                fieldKey="merchantCode"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
                isEditable={false}
              />
              <EditableField
                label="Logo"
                value={userInfo.logoImg}
                fieldKey="logoImg"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
              />
              <EditableField
                label="Note"
                value={userInfo.notes || "N/A"}
                fieldKey="notes"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
              />
              <EditableField
                label="Theme Text Color"
                value={userInfo.themeTxtColor}
                type="color"
                fieldKey="themeTxtColor"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
              />
              <EditableField
                label="Theme Background"
                value={userInfo.themeColor}
                type="color"
                fieldKey="themeColor"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
              />
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              background: "white",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Common Settings
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label style={{ fontWeight: "bold", width: "40%" }}>
                  Veg/Non-Veg Filter:
                </label>
                <input
                  type="checkbox"
                  checked={!!userInfo.filterVegNonVeg}
                  onChange={() => handleCheckboxChange("filterVegNonVeg")}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label style={{ fontWeight: "bold", width: "40%" }}>
                  Only Take Away
                </label>
                <input
                  type="checkbox"
                  checked={!!userInfo.onlyTakeAway}
                  onChange={() => handleCheckboxChange("onlyTakeAway")}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>

              {/* <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label style={{ fontWeight: "bold", width: "40%" }}>
                  Payment Gateway Enabled?
                </label>
                <input
                  type="checkbox"
                  checked={!!userInfo.activePaymentGateway}
                  onChange={() => handleCheckboxChange("activePaymentGateway")}
                  style={{ width: "20px", height: "20px" }}
                />
              </div> */}

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label style={{ fontWeight: "bold", width: "40%" }}>
                  Tax for Dine-in
                </label>
                <input
                  type="checkbox"
                  checked={!!userInfo.dineinTax}
                  onChange={() => handleCheckboxChange("dineinTax")}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label style={{ fontWeight: "bold", width: "40%" }}>
                  Tax for Take Away
                </label>
                <input
                  type="checkbox"
                  checked={!!userInfo.takeAwayTax}
                  onChange={() => handleCheckboxChange("takeAwayTax")}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
            </div>
            <div
              className="row"
              style={{ marginBottom: "20px", marginTop: "20px" }}
            >
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

            {/* Save Button */}
            <div style={{ marginTop: "16px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveSettings}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {tabValue === 1 && (
        <div style={{padding: "20px"}}>
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
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
