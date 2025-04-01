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
import Download from "@mui/icons-material/Download";
import html2pdf from "html2pdf.js";

function TableView(props) {
  const [tabNum, setTabNum] = useState("");
  const [tableData, setTableData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);

  let baseURL = configs.baseURL;
  const userId = userData ? userData.sub : " ";
  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";

  const getTabByUser = `${baseURL}/api/tables?merchantCode=${merchCode}`;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabCapcity, setTabCapcity] = useState([]);
  const [notes, setNotes] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [tableId, setTableId] = useState("");

  console.log(getTabByUser);

  const handleTabNum = (event) => {
    setTabNum(event.target.value);
  };

  const handleCapacity = (e) => {
    setTabCapcity(e.target.value);
  };

  const downloadQr = (element_id) => {
    let tbl = element_id.split("~")[1];
    var opt = {
      margin: 1,
      filename: "Table-Number" + tbl + ".pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // New Promise-based usage:
    var element = document.getElementById(element_id);
    element.style.display = "block";
    html2pdf().from(element).set(opt).save();
    console.log(element);
    console.log(element_id);

    setTimeout(() => {
      //  document.getElementById("element").style.display = "none";
      element.style.display = "none";
    }, 3000);
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
          userId: userId,
          notes: notes,
        })
        .then((response) => {
          console.log(response.data);
          axios.get(getTabByUser).then((response) => {
            console.log(response.data);
            setTableData(response.data);
          });
          setDialogOpen(false);
          setTableId("");
        });
    } else {
      axios
        .post(`${baseURL}/api/tables?merchantCode=${merchCode}`, {
          number: tabNum,
          capacity: parseInt(tabCapcity),
          isAvailable: isAvailable,
          userId: userId,
          notes: notes,
        })
        .then((response) => {
          console.log(response.data);
          axios.get(getTabByUser).then((response) => {
            console.log(response.data);
            setTableData(response.data);
          });
          setDialogOpen(false);
          setIsAvailable(false);
          setNotes("");
          setTabCapcity("");
          setTabNum("");
          setSelectedOption("");
        });
    }
  };

  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete(
        `${baseURL}/api/tables/${id}?merchantCode=${
          merchantData.length ? merchantData[0].merchantCode : " "
        }`
      )
      .then((response) => {
        console.log(response.data);
        axios.get(getTabByUser).then((response) => {
          console.log(response.data);
          setTableData(response.data);
        });
      });
  };

  useEffect(() => {
    console.log(tableData);
    if (!tableData) {
      axios.get(getTabByUser).then((response) => {
        console.log(response.data);
        setTableData(response.data);
      });
    }
  });

  const handleNote = (event) => {
    setNotes(event.target.value);
  };

  const handleAvail = () => {
    setIsAvailable(!isAvailable);
  };

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
      <Dialog open={dialogOpen} maxWidth="mb" fullWidth={true}>
        <DialogTitle
          style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}
        >
          {tableId ? "Edit Table Info" : "Add Table Info"}
        </DialogTitle>
        {/* <h4 className=" text-center textColor">Categories</h4> */}
        <div
          className="container"
          style={{ padding: "20px 40px", borderRadius: "10px", margin: "20px" }}
        >
          <label>
            {" "}
            Table Number <span className="text-danger">*</span>
          </label>
          <input
            className="input_cls"
            type="text"
            placeholder="Enter table no"
            value={tabNum}
            onChange={handleTabNum}
          />
          <label className="m-2">
            {" "}
            Table Capacity <span className="text-danger">*</span>
          </label>
          <input
            className="input_cls"
            type="number"
            value={tabCapcity}
            onChange={handleCapacity}
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
          <label className="m-2"> Notes (optional)</label>
          <input
            className="input_cls"
            type="text"
            placeholder="Enter notes"
            value={notes}
            onChange={handleNote}
          />

          <Button
            variant="contained"
            color="error"
            style={{ margin: "15px" }}
            onClick={() => {
              setDialogOpen(false);
              setIsAvailable(false);
              setNotes("");
              setTabCapcity("");
              setTabNum("");
              setTableId("");
            }}
          >
            Close{" "}
          </Button>

          <Button
            variant="contained"
            style={{ margin: "15px" }}
            color="success"
            onClick={(e) => handleSubmit(e)}
          >
            Save
          </Button>
        </div>
      </Dialog>
      <div className="header">
        <h4>Table View</h4>
        <button
          className="add_btn"
          style={{ marginRight: "50px" }}
          onClick={() => setDialogOpen(true)}
        >
          <AddIcon /> Add New
        </button>
      </div>

      <div className="category-list" style={{ padding: "20px" }}>
        <table style={{ width: "100%" }}>
          <thead>
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
                  style={{ borderBottom: "1px solid #f0eeee", margin: "5px" }}
                >
                  <td style={{ fontWeight: "bold" }}>{tabInfo.number}</td>
                  <td>{tabInfo.capacity}</td>
                  <td>{tabInfo.notes}</td>
                  <td>{tabInfo.isAvailable ? "Available" : "Unavilable"}</td>
                  <td align="center">
                    <div
                      id={"qr-img~" + k}
                      // className="remove"

                      // id="qr-img"
                      style={{
                        display: "none",
                        border: "2px dotted",
                        padding: "5rem",
                        margin: "5rem",
                        textAlign: "center",
                      }}
                    >
                      <QRCode
                        id="qrcode"
                        size={556}
                        style={{
                          height: "280px",
                          width: "280px",
                        }}
                        value={`https://tto.menulive.in/?merchantCode=${merchCode}&isScan=false&tableNumber=${tabInfo.number}`}
                        // viewBox={0 0 456 456}
                      />
                      <h1>{"Table #" + (k+1)}</h1>
                    </div>

                    <IconButton
                      aria-label="download"
                      size="large"
                      color="info"
                      // style={{marginLeft:"5rem"}}
                    >
                      <DownloadIcon onClick={() => downloadQr("qr-img~" + k)} />
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
                      onClick={() => handleDelete(tabInfo.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableView;
