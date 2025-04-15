import { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import configs from "../../Constants";

export default function EditableField({
  label,
  value,
  type = "text",
  fieldKey,
  userInfo,
  setUserInfo,
  isEditable = true,
  width = "250px",
  options
}) {
  const [editMode, setEditMode] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  const baseURL = configs.baseURL;
  const cmsUrl = configs.cmsUrl;
  let userToken = sessionStorage.getItem("token") || "";
  let staticURL = configs.staticSer;

  const handleSave = async () => {
    if (!userInfo) {
      console.error("User info is undefined");
      return;
    }

    setLoading(true);

    try {
      setUserInfo((prev) => ({
        ...prev,
        [fieldKey]: fieldValue,
      }));

      await axios.put(`${baseURL}/api/settings/${userInfo.id}`, {
        ...userInfo,
        [fieldKey]: fieldValue,
      });

      console.log("Field updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating field:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveForImg = async (newValue = fieldValue) => {
    if (!userInfo) {
      console.error("User info is undefined");
      return;
    }

    setLoading(true);

    try {
      setUserInfo((prev) => ({
        ...prev,
        [fieldKey]: newValue,
      }));

      await axios.put(`${baseURL}/api/settings/${userInfo.id}`, {
        ...userInfo,
        [fieldKey]: newValue,
      });

      console.log("Field updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating field:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFieldValue(value);
    setEditMode(false);
  };

  const openMediaDialog = async () => {
    setMediaOpen(true);
    setMediaLoading(true);
    try {
      const res = await axios.get(`${cmsUrl}/api/user/media`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.data && res.data.mediaData) {
        // Filter out only the files that contain .img, .jpg, or .png
        const extractedImages = res.data.mediaData
          .filter((item) => {
            const fileName = item.original_file_name.toLowerCase();
            return (
              fileName.includes(".img") ||
              fileName.includes(".jpg") ||
              fileName.includes(".png")
            );
          })
          .map((item) => item.original_file_name);

        console.log(extractedImages);

        setMediaList(extractedImages);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setMediaLoading(false);
    }
  };

  console.log("media", mediaList);

  const selectImage = (img) => {
    const fullUrl = `${staticURL}/uploads/${img}`;
    setFieldValue(fullUrl);
    setMediaOpen(false);
    handleSaveForImg(fullUrl); 
  };
   const handleChange = (val, key) => {
    console.log(key);
    console.log(val);
    if(key == 'locale'){
      localStorage.setItem('locale',Object.keys(val)[0]);
    }
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        
        <label style={{ width: "40%",color:"#726e6e" }}>{label}:</label>
        {(editMode && fieldKey !== "logo") && 
          <TextField
            size="small"
            type={type}
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            disabled={loading}
            style={{ width }}
          />}

        {!editMode && type === "color" && 
          <div
            style={{
              width: "40px",
              height: "25px",
              backgroundColor: fieldValue || "#000000",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          ></div>
          } 

        {fieldKey === "logoImg" && 
          <img
            src={fieldValue}
            alt="Logo"
            style={{
              width: "60px",
              height: "auto",
              objectFit: "contain",
              borderRadius: "4px",
            }}
          />
        }
        {type == 'select' &&
          <Autocomplete
            size="small"
            options={options}
            getOptionLabel={(option) => option[Object.keys(option)[0]] || ""}
            value={options.find(o => Object.keys(o)[0] == value )}
            onChange={(event, newValue) => handleChange(newValue,fieldKey)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                placeholder="Select" 
                label="Select" 
                style={{
                  height: "50px",
                  width:"200px",
                  maxWidth: "200px",
                  color:"#000"
                }}
              />
            )}
          />
        } 


        {(fieldKey !== "logoImg" &&
        type != "color" && 
        !editMode &&
        type != 'select') &&
        <span style={{ width: "20%", height: "25px", overflow: "hidden" }}>
            {fieldValue || "N/A"}
        </span>}
      

        <div>
          {isEditable && type != 'select' ? (
            editMode && fieldKey !== "logoImg" ? (
              <>
                <IconButton onClick={handleSave} disabled={loading}>
                  <CheckIcon color="success" />
                </IconButton>
                <IconButton onClick={handleCancel} disabled={loading}>
                  <CloseIcon color="error" />
                </IconButton>
              </>
            ) : (
              <IconButton
                onClick={() => {
                  if (fieldKey === "logoImg") {
                    openMediaDialog();
                  } else {
                    setEditMode(true);
                  }
                }}
              >
                <EditIcon />
              </IconButton>
            )
          ) : null}
        </div>
      </div>

      {/* Media Picker Dialog */}
      <Dialog
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Logo</DialogTitle>
        <DialogContent>
          {mediaLoading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <CircularProgress />
            </div>
          ) : (
            <Grid container spacing={2}>
              {mediaList.map((item, index) => (
                <Grid item xs={3} key={index}>
                  <img
                    src={`${staticURL}/uploads/${item}`}
                    alt={`Media ${index}`}
                    onClick={() => selectImage(item)}
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "cover",
                      cursor: "pointer",
                      borderRadius: "6px",
                      border:
                        item.url === fieldValue
                          ? "3px solid #4caf50"
                          : "1px solid #ccc",
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
