import { CloudDone, Spa } from "@mui/icons-material";
import axios from "axios";
import moment from "moment";
import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import configs, { getParameterByName } from "../Constants";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Currencies from "../root/currency";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import Card from "@mui/material/Card";
import { useIntl } from "react-intl";
import { Menu, MenuItem, Select } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";

const Reports = () => {
  const [statusType, setStatusType] = useState("inProgressOrders");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [showMostOrdered, setShowMostOrdered] = useState(false);
  const [handleDate, setHandleDate] = useState([]);
  const [fliterData, setFilterData] = useState([]);
  const [mostOrdered, setMostOrdered] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [report, setReport] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [todaySummary, setTodaySummary] = useState(true);
  const [mostFilter, setMostFilter] = useState("all");
  const [value, setValue] = React.useState(1);
  console.log("fromDate", fromDate);
  console.log("toDate", toDate);
  console.log(handleDate);
  console.log(fliterData);
  const [orderDetails, setOrderDetails] = useState();
  const [isOpen, setIsOpen] = useState(false);
  let baseURL = configs.baseURL;
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";

  const userId = userData ? userData.sub : " ";
  console.log(baseURL + "/api/orders/report/" + userId);

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";
  useEffect(() => {
    // axios.get(baseURL+"/api/orders?userid="+userId)
    //   // .then(response => setOrderDetails(response.data))
  }, []);

  let currency = Currencies.filter(
    (curen) => curen.abbreviation == merchantData.currency
  );
  //console.log(currency)
  let SelectCurrency = currency && currency[0] ? currency[0].symbol : "";
  console.log(SelectCurrency);
  console.log(orderDetails);

  useEffect(() => {
    handleSummaryPeriod("Today");
  }, []);

  let handleData = () => {
    if (fromDate && toDate) {
      axios
        .get(
          `${baseURL}/api/orders/report/${merchCode}?start_date=${fromDate}&end_date=${toDate}`
        )
        .then((response) => {
          console.log(response.data);
          setReport(response.data);
          setFromDate();
          setToDate();
        });
    }
  };

  const orderStatus1 = (e) => {
    let status = e.target.value;
    if (status === "pending") {
      let orderItems =
        report.length && report.filter((item) => item.inProgress);
      setFilterData(orderItems);
      setIsSearch(true);
    } else if (status === "deliver") {
      let orderItems =
        report.length && report.filter((item) => item.isDelivered);
      setFilterData(orderItems);
      setIsSearch(true);
    } else if (status === "serving") {
      let orderItems = report.length && report.filter((item) => item.isReady);
      setFilterData(orderItems);
      setIsSearch(true);
    } else if (status === "cancel") {
      let orderItems =
        report.length && report.filter((item) => item.isCanceled);
      setFilterData(orderItems);
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
  };

  const downloadAsPDF = () => {
    console.log("Downloading...");

    const pdf = new jsPDF("p", "mm");

    if (todaySummary) {
      pdf.setFontSize(14);
      const todayDate = moment().format("DD-MM-YYYY");
      const yStart = 5;
      let y = yStart;
      const items = [
        `Total Orders: ${fullReports ? fullReports.length : 0}`,
        `Total Amount: ${totalAmount}`,
        `Cancelled Orders: ${cancelOrders.length}`,
        `CGST: ${cgst.toFixed(2)}`,
        `SGST: ${sgst.toFixed(2)}`,
        `POS Orders: ${eposOrders.length}`,
        `POS Amount: ${eposAmount}`,
        `SOK Orders: ${sokOrders.length}`,
        `SOK Amount: ${sokAmount}`,
        `TOK Orders: ${tokOrders.length}`,
        `TOK Amount: ${tokAmount}`,
      ];
      y += 1;
      pdf.text(`Daily Sales summary`, 14, y);
      y = y + 7;
      pdf.text(`Date: ${todayDate}`, 14, y);
      items.forEach((item, index) => {
        y = y + 8;
        pdf.text(item, 14, y);
      });

      pdf.save(`Report_${todayDate}.pdf`);
    } else {
      const rowsPerPage = 40;
      const totalRows = fullReports.length;
      let currentPage = 1;
      let yPos = 0;
      let overallRowIndex = 0;

      const addPage = () => {
        if (currentPage > 1) {
          pdf.addPage();
        }
        yPos = 0;
      };

      const tableHeader = [
        "#Token",
        "",
        "Price(Inc Tax)",
        "Time",
        "Payment",
        "More",
      ];
      addPage();
      const headerRowHeight = 30;
      tableHeader.forEach((header, index) => {
        pdf.text(header, 10 + index * 50, 10 + yPos);
      });
      yPos += headerRowHeight + 30;

      for (let i = 0; i < totalRows; i += rowsPerPage) {
        addPage();
        const pageRows = fullReports.slice(i, i + rowsPerPage);
        pageRows.forEach((row, rowIndex) => {
          overallRowIndex++;
          const rowData = [
            `# ${row.number}`,
            row.orderType === "Eat in" ? "Eat In" : "Take Out",
            row.discountAmount
              ? row.discountType === "price"
                ? row.totalPrice - row.discountAmount
                : row.totalPrice - (row.totalPrice * row.discountAmount) / 100
              : row.totalPrice,
            moment(`${row.createdAt}`).format("DD-MM-YYYY h:m a"),
            row.paymentType === "Pay here" ? "Online" : "Cash",
          ];
          const rowHeight = 10;
          rowData.forEach((data, colIndex) => {
            pdf.text(data.toString(), 10 + colIndex * 50, 30 + yPos);
          });
          yPos += rowHeight;
        });
        currentPage++;
      }
    }

    pdf.save("Report.pdf");
  };

  const downloadAsExcel = () => {
    console.log("fullReports", fullReports);
    console.log("Downloading as Excel...");
    const excelData = fullReports.map((row) => {
      const discountAmount = row.discountAmount ? row.discountAmount : 0;

      return {
        "Token /Tabel Number": row.number,
        "Order Type":
          row.orderType === "Eat In"
            ? "Eat In"
            : row.orderType === "Table Order"
            ? "Table Order"
            : "Take Away",
        "Price (Inc Tax)":
        (row.discountType === "discount" || row.discountType === "price" )
            ? row.totalPrice - discountAmount
            : row.totalPrice - (row.totalPrice * discountAmount) / 100,
        Time: moment(`${row.createdAt}`).format("DD-MM-YYYY h:m a"),

        Payment:
          row.payVia === "CASH"
            ? "Cash"
            : row.payVia === "UPI"
            ? "UPI"
            : row.payVia === "CARD"
            ? "Card"
            : row.payVia === "COUPON"
            ? "Coupon"
            : "UPI",
      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Report.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const orderListHandler = (itemId) => {
    let orderItems = report.filter((item) => item.id === itemId);
    setOrderDetails(orderItems[0]);
    setIsOpen(true);
  };

  let fullReports = isSearch ? fliterData : report;
  console.log("fullreports",fullReports);

  const handleMostOrdered = () => {
    setShowMostOrdered(true);
    const orderCounts = {};
    console.log("orders", fullReports);
    fullReports.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (orderCounts[item.name]) {
          orderCounts[item.name] += item.quantity;
        } else {
          orderCounts[item.name] = item.quantity;
        }
      });
    });

    const sortedOrders = Object.entries(orderCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, quantity]) => ({ name, quantity }));

    setMostOrdered(sortedOrders);
  };

  const handleClose = (period) => {
    if (period) {
      setSelectedPeriod(period);
      handleSummaryPeriod(period);
    }
  };

  const handleSummaryPeriod = (period) => {
    setTodaySummary(true);
    let startDate, endDate;
    const today = new Date();

    switch (period) {
      case "Yesterday":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = new Date(startDate);
        break;
      case "Last Week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = new Date(today);
        break;
      case "Last Month":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        endDate = new Date(today);
        break;
      case "Today":
      default:
        startDate = new Date(today);
        endDate = new Date(today);
    }

    setFromDate(startDate.toISOString().split("T")[0]);
    setToDate(endDate.toISOString().split("T")[0]);
  };

  useEffect(() => {
    if (fromDate && toDate) {
      axios
        .get(
          `${baseURL}/api/orders/report/${merchCode}?start_date=${fromDate}&end_date=${toDate}`
        )
        .then((response) => {
          console.log(response.data);
          setReport(response.data);
        })
        .catch((error) => {
          console.error("Error fetching report data:", error);
        });
    }
  }, [fromDate, toDate, baseURL, merchCode]);
  const totalAmount = fullReports
    ? fullReports.reduce((sum, item) => sum + item.totalPrice, 0)
    : 0;
  const cancelOrders = fullReports
    ? fullReports.filter((item) => item.isCanceled === true)
    : 0;
  const totalTax = fullReports
  ? fullReports.reduce((sum , item)=> sum + item.taxPrice,0)
  : 0;
  const cgst = (totalTax/2).toFixed(2);
  const sgst = (totalTax/2).toFixed(2);
  const eposOrders = fullReports
    ? fullReports.filter((item) => item.orderSource === "EPOS")
    : 0;
  const sokOrders = fullReports
    ? fullReports.filter((item) => item.orderSource === "Self Order")
    : 0;
  const tokOrders = fullReports
    ? fullReports.filter((item) => item.orderSource === "Table Order")
    : 0;

  const eposAmount = eposOrders
    ? eposOrders.reduce((acc, item) => acc + item.totalPrice, 0)
    : 0;
  const sokAmount = sokOrders
    ? sokOrders.reduce((acc, item) => acc + item.totalPrice, 0)
    : 0;
  const tokAmount = tokOrders
    ? tokOrders.reduce((acc, item) => acc + item.totalPrice, 0)
    : 0;
  // console.log(cancelOrders);

  const { formatMessage: t, locale, setLocale } = useIntl();

  const handleFilterChange = (event) => {
    setMostFilter(event.target.value);
    setShowMostOrdered(true);
  };

  const aggregateOrders = () => {
    const orderCounts = {};
    fullReports?.forEach((order) => {
      order.orderItems.forEach((item) => {
        orderCounts[item.name] = (orderCounts[item.name] || 0) + item.quantity;
      });
    });
    return Object.entries(orderCounts).map(([name, quantity]) => ({
      name,
      quantity,
    }));
  };

  const allOrders = aggregateOrders();
  const filteredOrders = [...allOrders];

  if (mostFilter === "mostOrdered") {
    filteredOrders.sort((a, b) => b.quantity - a.quantity);
  } else if (mostFilter === "leastOrdered") {
    filteredOrders.sort((a, b) => a.quantity - b.quantity);
  }

  const backHandler = () => {
    setShowMostOrdered(false);
    setTodaySummary(false);
    setMostFilter("all");
  };

  return (
    <div className="container bg-light">
      <div className="header">
        <h4 align="center">Reports</h4>
        <Box
          sx={{
            // width: "100%",
            // bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ButtonGroup aria-label="Basic button group">
            <Button
              variant={value === 0 ? "contained" : "outlined"}
              style={{
                backgroundColor: value === 0 ? "#F7C919" : "inherit",
                borderColor: value === 0 ? "#F7C919" : "inherit",
                color: value === 0 ? "black" : "inherit",
                borderColor: "#F7C919",
              }}
              onClick={() => {
                setValue(0);
                setReport([]);
                setFromDate("");
                setToDate("");
              }}
            >
              Date View
            </Button>
            <Button
              variant={value === 1 ? "contained" : "outlined"}
              style={{
                backgroundColor: value === 1 ? "#F7C919" : "inherit",
                borderColor: value === 1 ? "#F7C919" : "inherit",
                color: value === 1 ? "black" : "inherit",
                borderColor: "#F7C919",
              }}
              onClick={() => {
                setValue(1);
                setReport([]);
                setFromDate("");
                setToDate("");
              }}
            >
              Summary View
            </Button>
          </ButtonGroup>
        </Box>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "10px",
            padding: "8px",
            borderRadius: "50px",
            border: "none",
            backgroundColor: "white",
            color: "#007bff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #007bff",
          }}
        >
          <RefreshIcon fontSize="medium" />
        </button>
      </div>
      <div
        style={{
          padding: "12px",
          backgroundColor: "white",
          borderRadius: "10px",
          margin: "10px",
          minHeight: "80vh",
        }}
      >
        <div className="sub-container">
          {value === 0 ? (
            <span style={{ display: "flex", gap: "10px" }}>
              <div>
                <label htmlFor="">From:</label>
                <br />
                <input
                  type="date"
                  className="mx-3"
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{
                    borderRadius: "5px",
                    outline: "none",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div>
                <label htmlFor="">To:</label>
                <br />
                <input
                  type="date"
                  className="mx-3"
                  onChange={(e) => setToDate(e.target.value)}
                  style={{
                    borderRadius: "5px",
                    outline: "none",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </span>
          ) : (
            ""
          )}

          <span className="m-3 ">
            <label htmlFor="">{t({ id: "orders" })} Status</label>
            <br />
            <select
              onChange={orderStatus1}
              style={{
                border: "1px solid #ccc",
                outline: "none",
                height: "25px",
                width: "120px",
                borderRadius: "5px",
              }}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="deliver">Delivered</option>
              <option value="serving">Serving</option>
              <option value="cancel">Cancelled</option>
            </select>
          </span>
          {value === 0 && (
            <span>
              <label htmlFor="">{t({ id: "orders" })}</label>
              <br />
              <select
                value={mostFilter}
                onChange={handleFilterChange}
                style={{
                  border: "1px solid #ccc",
                  outline: "none",
                  height: "25px",
                  width: "120px",
                  borderRadius: "5px",
                }}
              >
                <option value="all">All Orders</option>
                <option value="mostOrdered">Most Ordered </option>
                <option value="leastOrdered">Least Ordered</option>
              </select>
            </span>
          )}

          {value === 1 ? (
            <span>
              <label htmlFor="">{t({ id: "orders" })} Summary</label>
              <br />
              <select
                value={selectedPeriod}
                onChange={(e) => handleClose(e.target.value)}
                style={{
                  border: "1px solid #ccc",
                  outline: "none",
                  height: "25px",
                  width: "120px",
                  borderRadius: "5px",
                }}
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last Week">Last Week</option>
                <option value="Last Month">Last Month</option>
              </select>
            </span>
          ) : (
            ""
          )}

          <span>
            <Button
              variant="contained"
              color="info"
              style={{ margin: "8px" }}
              onClick={downloadAsExcel}
            >
              Excel
            </Button>
            <Button
              variant="outlined"
              color="warning"
              style={{ margin: "8px" }}
              onClick={downloadAsPDF}
            >
              Pdf
            </Button>
          </span>
        </div>

        {false && <div
          className="button-container"
          style={{ disflex: "flex", justifyContent: "space-between" }}
        >
          <Button
            variant="contained"
            color="primary"
            style={
              showMostOrdered
                ? { opacity: "initial" }
                : { opacity: "0", cursor: "none" }
            }
            onClick={backHandler}
          >
            Back
          </Button>
        </div>}
        {value === 0 ? (
          <>
            {!showMostOrdered ? (
              <div
                id="tableReport"
                style={{
                  overflow: "scroll",
                  maxHeight: "60vh",
                  backgroundColor: "white",
                }}
              >
                <table
                  class="r-responsive-table"
                  style={{ width: "100%", fontSize: "18px" }}
                >
                  <thead style={{ background: "#fff" }}>
                    <th>#Token</th>
                    <th></th>
                    <th>Price(Inc Tax)</th>
                    <th>Time</th>
                    <th>Payment</th>
                    {/* <th>Paid?</th>  */}
                    {/* <th>Details</th> */}
                    <th>More</th>
                  </thead>
                  <tbody>
                    {fullReports && fullReports.length
                      ? fullReports.map((items, key) => {
                          console.log(items);
                          return (
                            <>
                              <tr key={key} style={{ textAlign: "center" }}>
                                <td># {items.number}</td>
                                <td>
                                  {items.orderType === "Eat In" ? (
                                    <img
                                      height="20px"
                                      width="20px"
                                      alt=""
                                      src="./images/eat_in.png"
                                    />
                                  ) : items.orderType === "Table Order" ? (
                                    <img
                                      height="20px"
                                      width="20px"
                                      alt=""
                                      src="./images/tableOrder.png"
                                    />
                                  ) : (
                                    <img
                                      height="20px"
                                      width="20px"
                                      alt=""
                                      src="./images/take-out-2.png"
                                    />
                                  )}
                                </td>
                                <td>
                                  {items.discountAmount
                                    ? (items.discountType === "discount" || items.discountType === "price" )
                                      ? items.totalPrice - items.discountAmount
                                      : items.totalPrice -
                                        (items.totalPrice *
                                          items.discountAmount) /
                                          100
                                    : items.totalPrice}
                                </td>
                                <td style={{ fontSize: "12px" }}>
                                  {moment(`${items.createdAt}`).format(
                                    "DD-MM-YYYY h:m a"
                                  )}
                                </td>
                                <td>
                                  {items.payVia === "CASH"
                                    ? "Cash"
                                    : items.payVia === "UPI"
                                    ? "UPI"
                                    : items.payVia === "CARD"
                                    ? "Card"
                                    : items.payVia === "COUPON"
                                    ? "Coupon"
                                    : "UPI"}
                                </td>

                                <td>
                                  <button
                                    className="btn"
                                    id="show_btn"
                                    onClick={() => orderListHandler(items.id)}
                                  >
                                    <ReceiptLongOutlinedIcon />
                                  </button>
                                </td>
                                <td></td>
                              </tr>
                            </>
                          );
                        })
                      : ""}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                style={{ overflow: "auto", maxHeight: "60vh", padding: "10px" }}
              >
                <table
                  className="r-responsive-table"
                  style={{
                    width: "100%",
                    fontSize: "18px",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead style={{ backgroundColor: "#f1f1f1" }}>
                    <tr>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        Item
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        Quantity Ordered
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((item, index) => (
                        <tr
                          key={index}
                          style={{
                            textAlign: "center",
                            border: "1px solid #ddd",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {item.name}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {item.quantity}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            textAlign: "center",
                            padding: "15px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <>
            <h3 style={{ marginLeft: "20px" }}>{selectedPeriod} Reports</h3>
            <Card
              id="card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                padding: "20px",
                width: "fit-content",
                border: "1px solid #ddd",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span>{t({ id: "daily_summary" })}</span>
              <span>{fromDate}</span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <span>{t({ id: "total_orders" })}:</span>
                <span>{fullReports ? fullReports.length : 0}</span>
              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <span>{t({ id: "total_ammount" })}:</span>
                <span>{parseFloat(totalAmount).toFixed(2)}</span>

              </span>
              {/* <span style={{ display: "flex", justifyContent: "space-between", width: "200px" }}>
    <span>Cancel Orders:</span> 
    <span>{cancelOrders.length > 0 ? cancelOrders : 0}</span>
  </span> */}
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <span>CGST:</span>
                <span>{cgst}</span>
              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <span>SGST :</span>
                <span>{sgst}</span>
              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <span>POS {t({ id: "orders" })}:</span>
                <span>{eposOrders.length}</span>
              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <span>POS {t({ id: "ammount" })}:</span>
                <span>{parseFloat(eposAmount).toFixed(2)}</span>

              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <span>SOK {t({ id: "orders" })}:</span>
                <span>{sokOrders.length}</span>
              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <span>SOK {t({ id: "ammount" })}:</span>
                <span>{sokAmount}</span>
              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <span>TOK {t({ id: "orders" })}:</span>
                <span>{tokOrders.length}</span>
              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "200px",
                }}
              >
                <span>TOK {t({ id: "ammount" })}:</span>
                <span>{tokAmount}</span>
              </span>
            </Card>
          </>
        )}
        <Dialog
          className="dialog-box"
          maxWidth="md"
          fullWidth={true}
          open={isOpen}
        >
          <div style={{ padding: "20px" }} className="order-tab">
            <h5 align="center">
              Order summary token : #
              <span style={{ fontSize: "35px" }}>
                {orderDetails && orderDetails.number}
              </span>
            </h5>

            <table style={{ width: "100%", textAlign: "center" }} border="1">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails &&
                  orderDetails.orderItems.map((orderItems) => (
                    <tr>
                      <td>{orderItems.name}</td>
                      <td>{orderItems.quantity}</td>
                      <td>{orderItems.price}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Button
              variant="contained"
              color="error"
              style={{ float: "right", margin: "9px" }}
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Reports;
