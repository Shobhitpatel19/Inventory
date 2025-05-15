import axios from "axios";
import React, { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import configs, { getParameterByName } from "../Constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import QRCode from "react-qr-code";
import TableBarIcon from "@mui/icons-material/TableBar";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ButtonGroup from "@mui/material/ButtonGroup";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MediaCard from "./CardView";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TextField from "@mui/material/TextField";
import { DialogContent, DialogActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useIntl } from "react-intl";
import DeleteDiaologue from "./sub_comp/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { db } from "./../root/util";
//import { onValue, ref } from "firebase/database";
//import Switch from "@mui/material/Switch";
import "./QRCodes.css";

function TableView(props) {
  const [tabNum, setTabNum] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isTableView, setIsTableView] = useState(false);
  const [logo, setLogo] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteitemName, setDeleteItemName] = useState("");
  const { formatMessage: t, locale, setLocale } = useIntl();
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);
  const userToken = sessionStorage.getItem("token") || "";

  let baseURL = configs.baseURL;
  const userId = userData ? userData.sub : " ";
  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";
  const getTabByUser = `${baseURL}/api/tables?merchantCode=${merchCode}`;
  let companyLogo = "/images/logo.png";
  let fbShouldCall = false;

  const fetchTableData = async () => {
    await axios.get(getTabByUser).then((response) => {
      setTableData(response.data);
    });
  };

    useEffect(() => {
    fetchTableData();
  }, []);

  // Function to toggle availability
  const handleToggleAvailability = async (tableId) => {
    try {
      // Call backend API
      await axios.patch(
        `${baseURL}/api/tables/${tableId}/availability?merchantCode=${merchCode}`
      ).then((response) => {
          fetchTableData();
          setTableId("");
        });
      
    } catch (error) {
      console.error("Failed to update availability:", error);
    }
  };

  

  function base64Converter(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  base64Converter(merchantData ? merchantData.logoImg : "", function (dataUrl) {
    //console.log('RESULT:', dataUrl)
    setLogo(dataUrl);
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabCapcity, setTabCapcity] = useState([]);
  const [notes, setNotes] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [tableId, setTableId] = useState("");

  const handleTabNum = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setTabNum(value);
    }
    // setTabNum(event.target.value);
  };

  const handleCapacity = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTabCapcity(value);
    }
    // setTabCapcity(e.target.value);
  };

  const downloadQr = (element_id) => {
    const element = document.getElementById(element_id);
    document.getElementById(element_id).style.display = "block";
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      const x = (pdfWidth - imgWidth * scaleFactor) / 2;
      const y = (pdfHeight - imgHeight * scaleFactor) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        x,
        y,
        imgWidth * scaleFactor,
        imgHeight * scaleFactor
      );
      pdf.save("qrcode.pdf");
    });

    setTimeout(() => {
      document.getElementById(element_id).style.display = "none";
    }, 1000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!tabNum) {
      console.log("All feilds are mandatry");
    } else if (tableId) {
      axios
        .put(`${baseURL}/api/tables/${tableId}?merchantCode=${merchCode}`, {
          number: tabNum,
          capacity: parseInt(tabCapcity),
          isAvailable: isAvailable,
          userId: merchCode,
          notes: notes,
        },
        { headers: { Authorization: `Bearer ${userToken}` } })
        .then((response) => {
          fetchTableData();
          setDialogOpen(false);
          setTableId("");
        });
    } else {
      // Check if table number already exists
      const tableExists = tableData.some(table => table.number === tabNum);
      if (tableExists) {
        toast.error("A table with this number already exists. Please use a different table number.");
        return;
      }

      axios
        .post(`${baseURL}/api/tables?merchantCode=${merchCode}`, {
          number: tabNum,
          capacity: parseInt(tabCapcity),
          isAvailable: true,
          userId: merchCode,
          notes: notes,
        },
        { headers: { Authorization: `Bearer ${userToken}` } })
        .then((response) => {
          fetchTableData();
          setDialogOpen(false);
          setIsAvailable(false);
          setNotes("");
          setTabCapcity("");
          setTabNum("");
          setSelectedOption("");
        });
    }
  };

  const handleDelete = (id,number) => {
    setDeleteItemId(id);
    setDeleteItemName(`Table #${number}`);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteItemId) {
      return;
    }
    console.log(deleteItemId);
    axios
      .delete(
        `${baseURL}/api/tables/${deleteItemId}?merchantCode=${
          merchantData.length ? merchantData[0].merchantCode : " "
        }`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      .then((response) => {
        console.log(response.data);
        fetchTableData();
      });
    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };

  const handleNote = (event) => {
    setNotes(event.target.value);
  };

  const handleAvail = () => {
    setIsAvailable(!isAvailable);
  };

  console.log("Tabel data that shubham want", tableData);

  const handleEdit = (tabId) => {
    console.log(tabId);
    let fltData = tableData.filter((tab) => tab.id === tabId);
    console.log(fltData);
    setTableId(fltData[0].id);
    setIsAvailable(fltData[0].isAvailable);
    setNotes(fltData[0].notes);
    setTabCapcity(fltData[0].capacity);
    setTabNum(fltData[0].number);
    setDialogOpen(true);
  };
    

  return (
    <div>
      <Dialog open={dialogOpen} maxWidth="md" fullWidth={true}>
        <DialogTitle style={{ fontWeight: "bold" }}>
          {tableId ? "Edit Table Info" : "Add Table Info"}
        </DialogTitle>

        <DialogContent dividers>
          <div
            className="container"
            style={{ padding: "20px 40px", borderRadius: "10px" }}
          >
            <TextField
              className="input_cls"
              fullWidth
              label="Enter table no."
              defaultValue=""
              onChange={handleTabNum}
              name="table_number"
              value={tabNum}
            />
            <br />
            <TextField
              className="input_cls"
              fullWidth
              label="Table Capacity"
              defaultValue=""
              onChange={handleCapacity}
              name="table_capacity"
              value={tabCapcity}
              sx={{ mt: 2 }}
            />
            <span
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              Available:
              <input
                type="checkbox"
                style={{
                  height: "25px",
                  width: "25px",
                  marginLeft: "5px",
                  accentColor: "#3622cc",
                }}
                checked={isAvailable}
                onChange={handleAvail}
              />
            </span>
            <TextField
              className="input_cls"
              fullWidth
              label="Enter notes"
              defaultValue=""
              onChange={handleNote}
              name="notes"
              value={notes}
              sx={{ mt: 2 }}
            />
            <br />
          </div>
        </DialogContent>

        <IconButton
          aria-label="close"
          onClick={() => {
            setDialogOpen(false);
            setIsAvailable(false);
            setNotes("");
            setTabCapcity("");
            setTabNum("");
            setTableId("");
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogActions>
          <Button
            color="error"
            style={{ margin: "10px" }}
            className="close-btn"
            onClick={() => {
              setDialogOpen(false);
              setIsAvailable(false);
              setNotes("");
              setTabCapcity("");
              setTabNum("");
              setTableId("");
            }}
          >
            Close
          </Button>
          <Button
            className="save-btn btnDialog-Fill"
            variant="contained"
            color="success"
            style={{ margin: "10px" }}
            onClick={(e) => handleSubmit(e)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {openDeleteDialog === true ? (
        <DeleteDiaologue
          open={openDeleteDialog}
          onClose={handleDeleteClose}
          onConfirm={handleConfirmDelete}
          itemName={deleteitemName}
          msg="delete"
        />
      ) : (
        <div />
      )}

      <div className="header">
        <h4>{t({ id: "manage_tables" })}</h4>
        <ButtonGroup aria-label="Basic button group">
          <Button
            variant={!isTableView ? "contained" : "outlined"}
            style={{
              backgroundColor: !isTableView ? "#F7C919" : "inherit",
              borderColor: !isTableView ? "#F7C919" : "inherit",
              color: !isTableView ? "black" : "inherit",
              borderColor: "#F7C919",
            }}
            onClick={() => setIsTableView(!isTableView)}
          >
            {t({ id: "status_view" })}
          </Button>
          <Button
            variant={!isTableView ? "contained" : "outlined"}
            style={{
              backgroundColor: isTableView ? "#F7C919" : "inherit",
              borderColor: isTableView ? "#F7C919" : "inherit",
              color: isTableView ? "black" : "inherit",
              borderColor: "#F7C919",
            }}
            onClick={() => setIsTableView(!isTableView)}
          >
            {t({ id: "detail_view" })}
          </Button>
        </ButtonGroup>

        {isTableView ? (
          <button className="add_btn" onClick={() => setDialogOpen(true)}>
            <AddIcon /> Add Table
          </button>
        ) : (
          <button className="add_btn" onClick={() => setDialogOpen(true)}>
            <AddIcon /> Add Table
          </button>
        )}
      </div>
      {/* Edited By Sk */}
      {isTableView ? (
        <div className="category-list" style={{ padding: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead
              style={{
                borderBottom: "2px solid rgb(207 205 205)",
                margin: "5px",
              }}
            >
              <tr>
                <th>Table Number</th>
                <th>Capacity</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Download QR</th>
                <th colSpan="2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData &&
                tableData.map((tabInfo, k) => (
                  <tr
                    key={tabInfo.id}
                    style={{
                      borderBottom: "1px solid rgb(207 205 205)",
                      margin: "5px",
                    }}
                  >
                    <td style={{ fontWeight: "bold" }}>{tabInfo.number}</td>
                    <td>{tabInfo.capacity}</td>
                    <td>{tabInfo.notes}</td>
                    <td>
                      {tabInfo.isAvailable ? (
                        <span>
                          {" "}
                          <TableBarIcon style={{ color: "green" }} />
                        </span>
                      ) : (
                        <RestaurantMenuIcon style={{ color: "red" }} />
                      )}
                    </td>
                    <td align="center">
                      <div className="table_QRmain" id={"qr-img~" + k}>
                        <div className="table_QRsub">
                          <h1>{"TABLE #" + (k + 1)}</h1>
                          <div className="tableQRCode">
                            <p>
                              <b>Scan with Mobile Camera</b>
                            </p>
                            <QRCode
                              id="qrcode"
                              size={556}
                              style={{
                                // height: "280px",
                                // width: "280px",
                                height: "326px",
                                width: "314px",
                              }}
                              value={`${configs.ttoUrl}/?merchantCode=${merchCode}&isScan=true&tableNumber=${tabInfo.number}`}
                              // viewBox={0 0 456 456}
                            />
                          </div>
                          <div className="logos">
                            <img src={logo && logo} />
                            <div>
                              <span
                                style={{
                                  color: "#fff",
                                  display: "flex",
                                  flexDirection: "column",
                                  fontStyle: "italic",
                                }}
                              >
                                Powered by
                              </span>
                              <h5
                                style={{
                                  color: "#fff",
                                  fontSize: "27px",
                                  margin: "0px",
                                }}
                              >
                                {configs.productName}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <IconButton
                        aria-label="download"
                        size="large"
                        color="info"
                        // style={{marginLeft:"5rem"}}
                      >
                        <DownloadIcon
                          onClick={() => downloadQr("qr-img~" + k)}
                        />
                      </IconButton>
                    </td>
                    <td align="center">
                      <IconButton
                        aria-label="edit"
                        size="large"
                        color="info"
                        // style={{marginLeft:"5rem"}}
                        onClick={() => handleEdit(tabInfo.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </td>
                    <td align="center">
                      <IconButton
                        aria-label="delete"
                        size="large"
                        color="error"
                        onClick={() => handleDelete(tabInfo.id, tabInfo.number)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="media-card-container">
          {tableData.map((data, index) => (
            <MediaCard
              key={index}
              table={data.number}
              image={
                "https://images.pexels.com/photos/271696/pexels-photo-271696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              capacity={data.capacity}
              available={data.isAvailable}
              merchantCode={merchCode}
              onToggle={() => handleToggleAvailability(data.id)} // Pass toggle function
            />
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default TableView;
