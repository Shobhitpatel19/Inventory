import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Dialog, DialogTitle } from "@mui/material";
import axios from "axios";
import configs from "../Constants";
import EditableField from "../Components/sub_comp/EditableField";
import { IconButton } from "@mui/material";
import { TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";
import Chip from "@mui/material/Chip";
import { useMediaQuery } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

export default function App() {
  const [tabValue, setTabValue] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const isMobile = useMediaQuery("(max-width:768px)");
  let userToken = sessionStorage.getItem("token") || "";
  const [dialogOPen, setDialogOPen] = useState(false);
  const [providerDetail, setProviderDetail] = useState([]);
  const [providerId, setProviderId] = useState("");
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
      .get(`${baseURL}/api/settings/${userId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => {
        if (res.data?.length) {
          console.log(JSON.stringify(res));
          console.log("Fetched user info:", res.data[0]);
          setUserInfo({
            ...res.data[0],
            show_category_images: res.data[0].show_category_images ?? false,
          });
          setLatitude(res.data[0].location.coordinates[0]);
          setLongitude(res.data[0].location.coordinates[1]);
        } else {
          let newMerchCode = randomString(
            10,
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          );
          handleSaveSettings(newMerchCode);
        }
      })
      .catch((error) => {
        let newMerchCode = randomString(
          10,
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        );
        handleSaveSettings(newMerchCode);
        console.log("User settings not found", error);
      });
  }, []);

  useEffect(() => {
    console.log("This is userInfo: " + JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    axios
      .get(baseURL + "/api/thp-source?userId=" + userId, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => {
        setProviderDetail(res.data);
      });
  }, []);

  const handleFieldUpdate = (key, newValue) => {
    if (key === "closing_end_date" && userInfo.closing_start_date) {
      if (new Date(newValue) < new Date(userInfo.closing_start_date)) {
        toast.error("Closing end date cannot be before start date.");
        return;
      }
    }

    if (key === "closing_start_date" && userInfo.closing_end_date) {
      if (new Date(userInfo.closing_end_date) < new Date(newValue)) {
        toast.error("Closing start date cannot be after end date.");
        return;
      }
    }

    setUserInfo((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    axios
      .patch(
        `${baseURL}/api/settings/${userId}`,
        { [key]: newValue },
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      .then((res) => {
        console.log("Updated response: " + res);
        toast.success("Settings updated successfully");
      })
      .catch((err) => {
        toast.error("Failed to update settings");
        console.error(err);
      });
  };

  const handleCheckboxChange = async (key) => {
    const updatedValue = !userInfo[key];
    setUserInfo((prev) => ({
      ...prev,
      [key]: updatedValue,
    }));

    try {
      await axios.patch(
        `${baseURL}/api/settings/${userId}`,
        {
          [key]: updatedValue,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      toast.success(`Settings updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${key}`);
      console.error("Error updating field:", error);
    }
  };

  const randomString = (length, chars) => {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  const handleSaveSettings = async (newMerchCode) => {
    if (!userId) return;

    try {
      await axios.post(
        `${baseURL}/api/settings`,
        {
          userId: userId,
          merchantCode: newMerchCode,
          activeProviderId: "",
          sokBGImg: "",
          activePaymentGateway: "",
          activeDeliveryPartner: "",
          currency: "INR",
          logoImg: "",
          onlyTakeAway: false,
          isLeftAlign: true,
          filterVegNonVeg: true,
          themeColor: "#f71919",
          themeTxtColor: "#f71919",
          customizeInWizard: true,
          dineinTax: 0,
          takeAwayTax: 5,
          notes: "",
          location: {
            type: "Point",
            coordinates: [parseFloat(latitude), parseFloat(longitude)],
          },
          openTime: 10,
          closeTime: 23,
          show_category_images: false,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      console.log("Settings updated successfully!");
      toast.success(" New settings added successfully!");
      window.location.reload();
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
        .put(
          baseURL + "/api/thp-source/" + clovId,
          {
            userId: userId,
            provider: provider,
            merchantDetails: JSON.stringify(merchantDetails),
          },
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        )
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
            .get(baseURL + "/api/thp-source?userId=" + userId, {
              headers: { Authorization: `Bearer ${userToken}` },
            })
            .then((res) => {
              console.log(res.data);
              setProviderDetail(res.data);
              console.log("hello");
              setOpen(false);
            });
        });
      setDialogOPen(false);
    } else if (providerCode && providerTitle) {
      axios
        .post(
          baseURL + "/api/thp-source",
          {
            userId: userId,
            provider: provider,
            merchantDetails: JSON.stringify(merchantDetails),
          },
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        )
        .then((res) => {
          console.log(res);
          setApiKey("");
          setProviderCode("");
          setProviderTitle("");
          setProvider("");
          setIsTest("");
          setRegion("");

          axios
            .get(baseURL + "/api/thp-source?userId=" + userId, {
              headers: { Authorization: `Bearer ${userToken}` },
            })
            .then((res) => {
              console.log(res.data);
              setProviderDetail(res.data);
              setOpen(false);
            });
        });
      setDialogOPen(false);
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

  const handleDelete = (cloverId) => {
    axios
      .delete(baseURL + "/api/thp-source/" + cloverId, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => {
        console.log(res);
        axios
          .get(baseURL + "/api/thp-source?userId=" + userId, {
            headers: { Authorization: `Bearer ${userToken}` },
          })
          .then((res) => {
            console.log(res.data);
            setProviderDetail(res.data);
          });
      });
  };

  if (!userInfo) {
    return <p>Loading user information...</p>;
  }

  return (
    <div>
      <div className=" settings header">
        <h4 align="start">Settings</h4>
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
            margin: "20px",
            display: "flex",
            flexDirection: "column",
            overflowY: "scroll",
            height: "calc(100vh - 144px)",
          }}
        >
          {/* Merchant Info */}
          <div
            style={{
              padding: "0px 16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              background: "white",
              marginBottom: "20px",
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
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "16px",
                padding: "10px 20px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label style={{ width: "40%", color: "#726e6e" }}>
                  Activate Provider :
                </label>
                <select
                  className="select_input"
                  value={userInfo.activeProviderId || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setUserInfo((prev) => ({
                      ...prev,
                      activeProviderId: selectedId || "",
                    }));
                    handleSaveSettings({
                      ...userInfo,
                      activeProviderId: selectedId || "",
                    });
                  }}
                >
                  <option value="">CUSTOM</option>
                  {providerDetail.map((pro) => (
                    <option key={pro.id} value={pro.id}>
                      {pro.provider}
                    </option>
                  ))}
                </select>
              </div>
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

          {/* Common Info */}
          <div
            style={{
              padding: "0px 16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              background: "white",
              marginBottom: "20px",
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
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "16px",
                padding: "10px 20px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label style={{ color: "#726e6e", width: "40%" }}>
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
                <label style={{ color: "#726e6e", width: "40%" }}>
                  Only Take Away
                </label>
                <input
                  type="checkbox"
                  checked={!!userInfo.onlyTakeAway}
                  onChange={() => handleCheckboxChange("onlyTakeAway")}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label style={{ color: "#726e6e", width: "40%" }}>
                  Customize In Wizard
                </label>
                <input
                  type="checkbox"
                  checked={!!userInfo.customizeInWizard}
                  onChange={() => handleCheckboxChange("customizeInWizard")}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <EditableField
                  label="Locale"
                  value={localStorage.getItem("locale")}
                  type="select"
                  fieldKey={"locale"}
                  options={[
                    { en: "English" },
                    { hi: "Hindi" },
                    { ch: "German" },
                  ]}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  onUpdate={handleFieldUpdate}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "16px",
                marginTop: "16px",
                padding: "10px 20px",
                marginBottom: "10px",
              }}
            >
              <EditableField
                label="Default Tax (%)"
                value={userInfo.takeAwayTax}
                type="number"
                fieldKey="takeAwayTax"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
              />
              <EditableField
                label="Dine-In Tax (%)"
                value={userInfo.dineinTax}
                type="number"
                fieldKey="dineinTax"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
              />

              <EditableField
                label="Latitude"
                value={userInfo.location.coordinates[0] ?? ""}
                type="number"
                fieldKey="latitude"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
              />

              <EditableField
                label="Longitude"
                value={userInfo.location.coordinates[1] ?? ""}
                type="number"
                fieldKey="longitude"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
              />

              <EditableField
                label="Open Time"
                value={userInfo.openTime}
                type="number"
                fieldKey="openTime"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
              />
              <EditableField
                label="Close Time"
                value={userInfo.closeTime}
                type="number"
                fieldKey="closeTime"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
              />

              <EditableField
                label="Closing Start Date"
                value={userInfo.closing_start_date?.split("T")[0] || ""}
                type="date"
                fieldKey="closing_start_date"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
              />

              <EditableField
                label="Closing End Date"
                value={userInfo.closing_end_date?.split("T")[0] || ""}
                type="date"
                fieldKey="closing_end_date"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
              />

              <EditableField
                label="Closing Reason"
                value={userInfo.closing_remark || ""}
                type="text"
                fieldKey="closing_remark"
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                onUpdate={handleFieldUpdate}
              />
            </div>
          </div>

          {/* POS  Settings */}
          <div
            style={{
              padding: "0px 16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              background: "white",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              POS Settings
            </h2>

            <div // This is the grid container div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "16px",
                padding: "10px 20px",
                marginBottom: "10px",
              }}
            >
              {/* Left Aligned Order Panel Toggle */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <label style={{ color: "#726e6e", width: "40%" }}>
                  Left Aligned Order Panel
                </label>
                <input
                  type="checkbox"
                  checked={!!userInfo.isLeftAlign}
                  onChange={() => handleCheckboxChange("isLeftAlign")}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>

              {/* Show Category Images Toggle */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <label style={{ width: "50%", color: "#726e6e" }}>
                  Show Category Images
                </label>
                <div
                  style={{
                    position: "relative",
                    width: "60px",
                    height: "30px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!userInfo.show_category_images}
                    onChange={() =>
                      handleCheckboxChange("show_category_images")
                    }
                    style={{
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: userInfo.show_category_images
                        ? "#4caf50"
                        : "#ccc",
                      borderRadius: "30px",
                      transition: "0.4s",
                    }}
                  >
                    <div
                      style={{
                        height: "24px",
                        width: "24px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "3px",
                        left: userInfo.show_category_images ? "32px" : "4px",
                        transition: "0.4s",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SOK  Settings */}
          <div
            style={{
              padding: "0px 16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              background: "white",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              SOK Settings
            </h2>
            coming soon...
          </div>

          {/* TTO  Settings */}
          <div
            style={{
              padding: "0px 16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              background: "white",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              TTO Settings
            </h2>
            coming soon...
          </div>

          {/* Online Order  Settings */}
          <div
            style={{
              padding: "0px 16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
              background: "white",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Online Order Settings
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                gap: "16px",
                padding: "10px 20px",
              }}
            >
              {/* Delivery Toggle */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <label style={{ width: "50%", color: "#726e6e" }}>
                  Delivery
                </label>
                <div
                  style={{
                    position: "relative",
                    width: "60px",
                    height: "30px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!userInfo.enable_delivery}
                    onChange={() => handleCheckboxChange("enable_delivery")}
                    style={{
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: userInfo.enable_delivery
                        ? "#4caf50"
                        : "#ccc",
                      borderRadius: "30px",
                      transition: "0.4s",
                    }}
                  >
                    <div
                      style={{
                        height: "24px",
                        width: "24px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "3px",
                        left: userInfo.enable_delivery ? "32px" : "4px",
                        transition: "0.4s",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Pickup Toggle */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <label style={{ width: "50%", color: "#726e6e" }}>Pickup</label>
                <div
                  style={{
                    position: "relative",
                    width: "60px",
                    height: "30px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!userInfo.enable_pickup}
                    onChange={() => handleCheckboxChange("enable_pickup")}
                    style={{
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: userInfo.enable_pickup
                        ? "#4caf50"
                        : "#ccc",
                      borderRadius: "30px",
                      transition: "0.4s",
                    }}
                  >
                    <div
                      style={{
                        height: "24px",
                        width: "24px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "3px",
                        left: userInfo.enable_pickup ? "32px" : "4px",
                        transition: "0.4s",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Schedule Delivery Toggle */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <label style={{ width: "50%", color: "#726e6e" }}>
                  Schedule Delivery
                </label>
                <div
                  style={{
                    position: "relative",
                    width: "60px",
                    height: "30px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!userInfo.enable_schedule_delivery}
                    onChange={() =>
                      handleCheckboxChange("enable_schedule_delivery")
                    }
                    style={{
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: userInfo.enable_schedule_delivery
                        ? "#4caf50"
                        : "#ccc",
                      borderRadius: "30px",
                      transition: "0.4s",
                    }}
                  >
                    <div
                      style={{
                        height: "24px",
                        width: "24px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "3px",
                        left: userInfo.enable_schedule_delivery
                          ? "32px"
                          : "4px",
                        transition: "0.4s",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tabValue === 1 && (
        <div style={{ padding: "20px" }}>
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
                          onClick={() => handleEdit(pro.id)}
                          aria-label="edit"
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => handleDelete(pro.id)}
                          aria-label="delete"
                          color="error"
                        >
                          <DeleteIcon />
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
