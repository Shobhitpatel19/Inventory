import axios from "axios";
import React, { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import configs, { getParameterByName } from "../Constants";
import Button from "@mui/material/Button";
import TableBarIcon from "@mui/icons-material/TableBar";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

function MemberTables(props) {
  const [tabNum, setTabNum] = useState("");
  const [tableData, setTableData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isTableView, setIsTableView] = useState(false);
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
  const handleTabNum = (event) => {
    setTabNum(event.target.value);
  };

  const handleCapacity = (e) => {
    setTabCapcity(e.target.value);
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
  useEffect(() => {
    console.log(tableData);
    if (!tableData) {
      axios.get(getTabByUser).then((response) => {
        console.log(response.data);
        setTableData(response.data);
      });
    }
  });
  const handleAvail = () => {
    setIsAvailable(!isAvailable);
  };

  function openCanvas() {
    const tableContainer = document.querySelector(".category-list");
    const table = tableContainer.querySelector("table");

    if (!tableContainer.querySelector("canvas")) {
      const canvas = document.createElement("canvas");
      canvas.width = table.offsetWidth;
      canvas.height = tableContainer.offsetHeight;
      tableContainer.appendChild(canvas);

      const ctx = canvas.getContext("2d");

      const rectangleWidth = 150;
      const rectangleHeight = 100;
      const borderWidth = 2;

      let isDragging = false;
      let clickedIndex = null;
      let isFrozen = false; // Flag to check if tables are frozen

      function drawRectangle(index, tableInfo) {
        const x = tableInfo.x;
        const y = tableInfo.y;

        ctx.strokeStyle = "black";
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(x, y, rectangleWidth, rectangleHeight);

        if (tableInfo.isAvailable) {
          ctx.fillStyle = "lightgreen";
        } else {
          ctx.fillStyle = "red";
        }

        ctx.fillRect(
          x + borderWidth,
          y + borderWidth,
          rectangleWidth - borderWidth * 2,
          rectangleHeight - borderWidth * 2
        );

        ctx.fillStyle = "black";
        ctx.font = "14px Arial";

        ctx.fillStyle = "black";
        ctx.font = "24px Arial bold";
        const textWidth = ctx.measureText(tableInfo.capacity).width;
        const textX = x + (rectangleWidth - textWidth) / 2;
        const textY = y + rectangleHeight / 2;
        ctx.fillText(tableInfo.capacity, textX, textY);

        ctx.fillText(
          `Table ${tableInfo.number}`,
          x + borderWidth + 10,
          y + borderWidth + 20
        );
      }

      // Mouse event handling
      canvas.addEventListener("mousedown", (event) => {
        if (!isFrozen) {
          // Don't allow dragging if frozen
          const clickX = event.offsetX;
          const clickY = event.offsetY;

          tableData.forEach((tableInfo, index) => {
            const x = tableInfo.x;
            const y = tableInfo.y;

            if (
              clickX >= x &&
              clickX <= x + rectangleWidth &&
              clickY >= y &&
              clickY <= y + rectangleHeight
            ) {
              isDragging = true;
              clickedIndex = index;
            }
          });
        }
      });

      canvas.addEventListener("mousemove", (event) => {
        if (isDragging && !isFrozen) {
          const newX = event.offsetX - rectangleWidth / 2;
          const newY = event.offsetY - rectangleHeight / 2;
          tableData[clickedIndex].x = newX;
          tableData[clickedIndex].y = newY;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          tableData.forEach((tableInfo, index) =>
            drawRectangle(index, tableInfo)
          );
        }
      });

      canvas.addEventListener("mouseup", () => {
        isDragging = false;
        clickedIndex = null;
      });

      let currentX = borderWidth;
      let currentY = 0;
      const spacing = 50;

      tableData.forEach((tableInfo, index) => {
        tableInfo.x = currentX;
        tableInfo.y = currentY;
        drawRectangle(index, tableInfo);

        currentX += rectangleWidth + borderWidth * 2 + spacing;
        if (currentX + rectangleWidth + borderWidth * 2 > canvas.width) {
          currentX = borderWidth;
          currentY += rectangleHeight + borderWidth * 2 + spacing;
        }
      });
    }

    table.style.display = isTableView ? "block" : "none";
    const canvas = tableContainer.querySelector("canvas");
    canvas.style.display = isTableView ? "none" : "block";

    if (isTableView) {
      table.style.display = "table";
    }
  }
  const handleCheckboxChange = (tabInfo) => {
    const newAvailability = !tabInfo.isAvailable;

    // Update the API
    axios
      .put(`${baseURL}/api/tables/${tabInfo.id}?merchantCode=${merchCode}`, {
        number: tabInfo.number,
        capacity: tabInfo.capacity,
        isAvailable: newAvailability,
        userId: userId,
        notes: tabInfo.notes,
      })
      .then((response) => {
        console.log(response.data);

        setTableData((prevData) =>
          prevData.map((table) =>
            table.id === tabInfo.id
              ? { ...table, isAvailable: newAvailability }
              : table
          )
        );
      })
      .catch((error) => {
        console.error("There was an error updating the table!", error);
      });
  };

  return (
    <div>
      <div className="header">
        <h4>Table View</h4>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isTableView}
                onChange={() => {
                  setIsTableView(!isTableView);
                  openCanvas();
                }}
              />
            }
            label="Table View"
          />
        </FormGroup>
      </div>

      <div className="category-list" style={{ padding: "20px" }}>
        <Table style={{ width: "100%" }}>
          <Thead>
            <Tr>
              <Th>Table Number</Th>
              <Th>Capacity</Th>
              <Th>Status</Th>
              <Th>is Available ?</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData &&
              tableData.map((tabInfo, k) => (
                <Tr
                  key={tabInfo.id}
                  style={{ borderBottom: "1px solid #f0eeee", margin: "5px" }}
                >
                  <Td style={{ fontWeight: "bold" }}>{tabInfo.number}</Td>
                  <Td>{tabInfo.capacity}</Td>

                  <Td>
                    {tabInfo.isAvailable ? (
                      <span>
                        {" "}
                        <TableBarIcon style={{ color: "green" }} />
                      </span>
                    ) : (
                      <RestaurantMenuIcon style={{ color: "red" }} />
                    )}
                  </Td>
                  <Td>
                    <Switch
                      checked={tabInfo.isAvailable}
                      onChange={() => {
                        handleCheckboxChange(tabInfo);
                      }}
                    />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}

export default MemberTables;
