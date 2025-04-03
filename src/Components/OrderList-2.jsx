import React, { useState, useEffect } from "react";
import axios, { isCancel } from "axios";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import moment from "moment";
import RefreshIcon from "@mui/icons-material/Refresh";
import configs, { getParameterByName } from "../Constants";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
//import currencySymbol from 'currency-symbol'
import Currencies from "../root/currency";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import "react-responsive-list/assets/index.css";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import PrintIcon from "@mui/icons-material/Print";
import BillPrint from "./BillPrint";
import TokenIcon from "@mui/icons-material/Token";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { amber, purple } from "@mui/material/colors";
import { useIntl } from "react-intl";
import PaymentOptions from "./sub_comp/PaymentOptions";
import DeleteDiaologue from "./Delete";

const OrderList = (props) => {
  const orderListPath = `/orderList`;
  const [totalOrders, setTotalOrders] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [orderItemsList, setOrderItemsList] = useState([]);
  const [token, setToken] = useState(0);
  const [edit, setEdit] = useState(false);
  const [editQuantity, setEditQuntity] = useState(0);
  const [orderListId, setOrderListId] = useState();
  const [itemName, setItemName] = useState("");
  const [itemId, setItemId] = useState();
  const [alertOpen, setAlertOpen] = useState(false);
  const [notifiData, setNotifiData] = useState([]);
  const [openNotifi, setOpenNotifi] = useState(false);
  const [tabView, setTabView] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [table1Data, setTable1Data] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  let timeOt = null;
  const [orderFilter, setOrderFilter] = useState([]);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const closeModal = () => setPopUpOpen(false);
  const [showProducts, setShowProducts] = useState(true);
  const [waiter, setWaiter] = useState(false);
  const [products, setProducts] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [tablecall, setTableCall] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [selectedOrd, setSelectedOrd] = useState([]);
  const [customerorderpop, setCustomerOrderPop] = useState(false);
  const [isReversed, setIsReversed] = useState(true);
  const [invoiceNo, setInvoiceNo] = useState();
  const [billPrint, setBillPrint] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const { formatMessage: t, locale, setLocale } = useIntl();
  const [payModeSelectDialog, setPayModeSelectDialog] = useState(false);
  const [payModeIndx, setPayModeIndx] = useState(-1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  let baseURL = configs.baseURL;
  let authApi = configs.authapi;
  const theme = createTheme({
    palette: {
      info: amber,
      secondary: purple,
    },
  });
  const handleOrder = () => {
    setShowProducts(false);
  };
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";
  console.log("merch", merchCode);
  const userId = userData ? userData.sub : " ";
  //const getOrderList = `${baseURL}/api/orders?merchantCode=${merchCode}`;
  const getOrderList = `${baseURL}/api/orders/recent?merchantCode=${merchCode}`;
  const notificationURL = `${baseURL}/menu/notification/${userId}`;
  const deleteNOtificationUrl = `${baseURL}/menu/notifications/${userId}`;
  const getTabByUser = baseURL + "/api/tables?merchantCode=" + merchCode;
  const getProductByUser = baseURL + `/api/products?merchantCode=${merchCode}`;

  let currency = Currencies.filter(
    (curen) => curen.abbreviation == merchantData.currency
  );
  console.log(currency);
  let SelectCurrency = currency && currency[0] ? currency[0].symbol : "";
  console.log(SelectCurrency);
  const selectedCurrency = (
    <span dangerouslySetInnerHTML={{ __html: SelectCurrency }} />
  );

  useEffect(() => {
    if (!products.length) {
      axios.get(getProductByUser).then((response) => {
        if (response.data.length !== products.length) {
          setProducts(response.data);
          console.log(response.data);
        }
      });
    }
  }, []);

  useEffect(() => {
    let billData = {};
    billData.userId = merchantData.merchantCode;
    billData.appName = "EPOS";
    billData.payType = "onetime";
    billData.payStatus = "paid";
    // billData.purchaseItems = JSON.stringify(order.orderItems);

    axios.post(`${configs.payUrl}/api/new-order`, billData).then((res) => {
      console.log(res.data);
      setInvoiceNo(res.data.invoiceData.invoicePath);
    });
  }, []);

  const orderListHandler = (orderId, customerId, order) => {
    console.log(orderId.order);
    setToken(order.number);
    setIsOpen(true);

    const SelectedorderItem = orderList.length
      ? orderList.filter((order) => order.id === orderId)
      : [];
    console.log(SelectedorderItem);
    setSelectedOrd(SelectedorderItem);
    axios
      .get(`${baseURL}/api/orders/${orderId}?merchantCode=${merchCode}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.orderItems) {
          setOrderItemsList(res.data.orderItems);
        } else {
          setOrderItemsList(res.data);
        }
      });

    if (customerId) {
      console.log(customerId);
      axios
        .get(`${authApi}/customer/${customerId}`)
        .then((response) => {
          console.log(response.data);
          if (!response.data) {
            response.data = {};
          }
          setCustomerData(response.data);
          setCustomerOrderPop(true);
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    console.log(SelectedorderItem);
  };
  const handleClose = () => {
    setOrderItemsList([]);
    setIsOpen(false);
    setCustomerData([]);
    setCustomerOrderPop(false);
  };

  const handleOrderStatus = (order_Status, order_id, order_payment, order) => {
    console.log(order_id, order_payment);
    // const order_Status = event.target.value;

    if (
      order_Status.toLowerCase() === "ready" ||
      order_Status.toLowerCase() === "deliver"
    ) {
      if (order_payment) {
        console.log(order_payment);
        axios
          .put(`${baseURL}/api/orders/${order_id}?merchantCode=${merchCode}`, {
            action: order_Status,
          })
          .then((response) => {
            console.log(response.data);
            let today = new Date();
            console.log(moment(today).format("DD/MMM/YYYY"));
            axios.get(getOrderList).then((response) => {
              //setTotalOrders(response.data);
              setOrderList(response.data);
            });
            if (order && order_Status.toLowerCase() === "ready") {
              HandleReady([order]);
            } else if (order && order_Status === "deliver") {
              HandleServed([order]);
            }
          });
      } else {
        setAlertOpen(true);
      }
    } else {
      // axios
      //   .delete(`${baseURL}/api/orders/${order_id}?merchantCode=${merchCode}`, {
      //     action: orderStatus,
      //   })
      //   .then((response) => {
      //     console.log(response.data);
      //     let today = new Date();
      //     console.log(moment(today).format("DD/MMM/YYYY"));
      //     axios.get(getOrderList).then((response) => {
      //       //setTotalOrders(response.data);
      //       setOrderList(response.data);
      //     });
      //   });
      // console.log(orderStatus);
      setDeleteItemId(order_id);
      setOrderStatus(order_Status);
      setOpenDeleteDialog(true);
    }
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteItemId) {
      return;
    }

    axios
        .delete(`${baseURL}/api/orders/${deleteItemId}?merchantCode=${merchCode}`, {
          action: orderStatus,
        })
        .then((response) => {
          console.log(response.data);
          let today = new Date();
          console.log(moment(today).format("DD/MMM/YYYY"));
          axios.get(getOrderList).then((response) => {
            //setTotalOrders(response.data);
            setOrderList(response.data);
          });
        });
      console.log(orderStatus);

    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };

  const handleCancel = (order_id, order_cancel) => {
    if (order_cancel === false) {
      axios
        .put(`${baseURL}/api/orders/${order_id}?merchantCode=${merchCode}`, {
          action: "cancel",
        })
        .then((response) => {
          axios.get(getOrderList).then((response) => {
            setOrderList(response.data);
          });
        });
    }
  };
  const handlePayment = (mode) => {
    if (selectedOrder && selectedOrder.id) {
      axios
        .put(
          `${baseURL}/api/orders/${selectedOrder.id}?merchantCode=${merchCode}`,
          {
            paymentState: "PAID",
            isPaid: true,
            payVia: mode,
          }
        )
        .then((response) => {
          console.log(response.data);
          let today = new Date();
          console.log(moment(today).format("DD/MMM/YYYY"));
          axios.get(getOrderList).then((response) => {
            //setTotalOrders(response.data);
            setOrderList(response.data);
          });
        });
    }

    const tabData = tableData.filter(
      (tab) => tab.number == selectedOrder.number
    );

    if (tabData.length > 0) {
      tabData[0].isAvailable = "true";
      axios
        .put(
          `${baseURL}/api/tables/${tabData[0].id}?merchantCode=${
            merchantData ? merchantData.merchantCode : " "
          }`,
          tabData[0]
        )
        .then((res) => {
          console.log(res.data);
        });
    }
  };

  const handleEdit = (itemId) => {
    console.log(itemId);
    const itmName =
      orderItemsList.length &&
      orderItemsList.map(
        (o) =>
          o._id === itemId &&
          setItemName(o.name) & setEditQuntity(o.quantity) & setItemId(o._id)
      );
    console.log(itmName);
    setEdit(true);
  };

  const handleInput = (event) => {
    console.log(event.target.value);
    setEditQuntity(event.target.value);
  };

  const habdleSubmit = (event) => {
    event.preventDefault();
    console.log(editQuantity);

    const updateItems = orderItemsList.map((ordListItem) => {
      if (ordListItem._id === itemId) {
        ordListItem.quantity = editQuantity;
        //ordListItem.price= ordListItem
      }
      return ordListItem;
    });
    console.log(updateItems);

    axios
      .put(baseURL + "/api/orders/" + orderListId, { orderItems: updateItems })
      .then((res) => {
        console.log(res.data);
        let today = new Date();
        console.log(moment(today).format("DD/MMM/YYYY"));
        axios.get(getOrderList).then((response) => {
          //setTotalOrders(response.data);
          setOrderList(response.data);
        });
      });
    const updatePrice = orderItemsList.filter((oli) => oli._id === itemId);
    const ordPrice = orderList.filter((ol) => ol._id === orderListId);
    console.log(updatePrice[0].price, editQuantity, ordPrice[0].totalPrice);
    setEdit(false);
  };

  const HandleServed = (order, itemId) => {
    console.log(order);
    console.log(itemId);
    if (order) {
      let updatedOrderItems = order[0].orderItems.map((ord) => {
        console.log(ord._id);
        console.log(itemId);
        {
          if (ord._id === itemId || !itemId) {
            console.log("Updated");
            ord.status = "delivered";
          }
          return ord;
        }
      });
      order[0].orderStatus = "Delivered";
      console.log(order[0].orderItems);
      setOrderItemsList(updatedOrderItems);
      axios.put(baseURL + "/api/orders/" + order[0].id, {
        orderItems: updatedOrderItems,
      });
    }
  };
  const HandleReady = (order, itemId) => {
    console.log(order);
    console.log(itemId);
    if (order) {
      let updatedOrderItems = order[0].orderItems.map((ord) => {
        if (ord._id === itemId || !itemId) {
          console.log("Updated to Ready");
          ord.status = "ready";
        }
        return ord;
      });
      setOrderItemsList(updatedOrderItems);
      axios.put(baseURL + "/api/orders/" + order[0].id, {
        orderItems: updatedOrderItems,
      });
    }
  };

  const handleDelete = (name, price, quantity, itemId) => {
    console.log(itemId);
  };

  const fetchOrdersAndNoti = () => {
    let today = new Date();
    console.log(moment(today).format("DD/MMM/YYYY"));
    axios.get(getOrderList).then((response) => {
      //setTotalOrders(response.data);
      setOrderList(response.data);
    });

    // axios.get(notificationURL).then((response)=>{
    //     setNotifiData(response.data);
    // });
    console.log(props.refesh);

    axios.get(getTabByUser).then((response) => {
      console.log(response.data);
      setTableData(response.data);
    });
  };

  useEffect(() => {
    fetchOrdersAndNoti();
  }, [props.refesh]);

  useEffect(() => {
    // const interval = setInterval(() => fetchOrdersAndNoti(), 10*1000);
    // return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    console.log("API CALLED");
    fetchOrdersAndNoti();
  };

  const handleNotification = () => {
    axios.get(notificationURL).then((response) => {
      console.log(response.data);
      setNotifiData(response.data);
    });
    setOpenNotifi(true);
  };

  const handleClear = () => {
    console.log("Clear All Data");
    axios.delete(deleteNOtificationUrl).then((response) => {
      console.log(response.data);
      // setNotifiData(response.data);
      setOpenNotifi(false);
      props.setNotification(false);
    });
  };

  const handleTableOrders = () => {
    setTabView(tabView ? false : true);
  };

  const handleTypeOrder = (e) => {
    let val = e.target.value;
    console.log(val);
    let fltOrder = orderList.filter((ord) => ord.orderSource === val);
    console.log(fltOrder);
    setOrderFilter(fltOrder);
    setIsSearch(val ? true : false);
  };
  function summaryPath1(orderDetails) {
    console.log(orderDetails);
    const fullName = userData ? userData.name : "";

    if (orderDetails) {
      window.location.href = `${
        window.location.origin
      }/billPrint?serve_url=${baseURL}&orderId=${
        orderDetails ? orderDetails.id : ""
      }&merchantCode=${merchCode ? merchCode : ""}&currency=${
        currency.length && currency[0].abbreviation
      }&restaurant=${fullName}&address=${
        userData || merchantData ? merchantData.address || userData.address : ""
      }&cgst=${merchantData.taxPerc}&invoice_no=${invoiceNo}`;
    }
  }
  const handlePrint = (order) => {
    console.log("print");
    console.log(order);
    setOrderData({
      orderId: order ? order.id : "",
      merchantCode: merchCode ? merchCode : "",
      currency: currency.length && currency[0].abbreviation,
      restaurant: userData ? userData.name : "",
      address:
        userData || merchantData
          ? merchantData.address || userData.address
          : "",
      cgst: merchantData.taxPerc,
      taxPerc: merchantData.taxPerc,
      invoice_no: invoiceNo,
    });
    if (!window.PrintInterface) {
      console.log(window.PrintInterface);
      sessionStorage.setItem("billing", true);
      summaryPath1(order);
    } else {
      setBillPrint(true);
      localStorage.setItem("isPrintCall", "N");
    }
  };

  const handleNumberSearch = (e) => {
    let val = e.target.value;
    console.log(val);
    let fltOrder = orderList.filter((ord) => ord.number === parseInt(val));
    console.log(fltOrder);
    setOrderFilter(fltOrder);
    setIsSearch(val ? true : false);
  };

  const handleDate = (e) => {
    let val = e.target.value;

    let inputDate = moment(val, "YYYY-MM-DD");

    let fltOrder = totalOrders.filter((ord) => {
      let orderDate = moment(ord.createdAt).format("DD/MMM/YYYY");
      console.log(orderDate);
      console.log(inputDate.format("DD/MMM/YYYY"));
      return orderDate === inputDate.format("DD/MMM/YYYY");
    });

    setOrderFilter(fltOrder);
    setIsSearch(Boolean(val));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrdersAndNoti();
    }, 200000);

    return () => clearTimeout(timeoutId);
  }, []);

  const ListOrders = isSearch ? orderFilter : orderList;
  console.log(ListOrders);

  console.log(orderList);

  //  const orderSTATS =  orderList.filter(cosdata => cosdata.customerId === customerData.user.id)
  // console.log(orderSTATS)
  console.log(customerData);
  const handleSort = () => {
    setIsReversed(!isReversed);
  };

  const handleWaiterToken = () => {
    setWaiter(true);
  };

  const handleWaiterClose = () => {
    setWaiter(false);
  };
  const iframeSrc = `https://digisign24.s3.ap-south-1.amazonaws.com/pub/plugins/waiter-token/tokens.html?serve_url=${baseURL}&merchantCode=${merchCode}`;
  return (
    <div className="container">
      {false && (
        <div className="refresh">
          <IconButton
            variant="contained"
            color="success"
            className="refresh_btn"
            onClick={handleRefresh}
          >
            <RefreshIcon />
          </IconButton>
        </div>
      )}
      <div className="header">
        <h4>{t({ id: "orders" })}</h4>
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            className="search_input"
            onChange={handleNumberSearch}
            placeholder="Search"
          />
        </div>
        <ThemeProvider theme={theme}>
          <Button onClick={handleSort} color="info" variant="outlined">
            <SwapVertIcon />
            Sort
          </Button>
        </ThemeProvider>
        <div id="group">
          {false && <label>Group By: </label>}
          <select
            onChange={handleTypeOrder}
            style={{
              outline: "none",
              borderRadius: "5px",
              background: "transparent",
            }}
          >
            <option value="">ALL</option>
            <option value="Self Order">Self Orders</option>
            <option value="EPOS">EPOS Orders</option>
            <option value="Online Order">Online Orders</option>
            <option value="Table Order">Table Orders</option>
          </select>
        </div>
        <Button onClick={handleWaiterToken} variant="outlined" color="success">
          {t({ id: "ready_to_serve" })}
        </Button>
        <div
          id="head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "auto",
          }}
        >
          {false && (
            <div id="group">
              <label htmlFor="">Date: </label>
              <input
                type="date"
                onChange={handleDate}
                style={{
                  outline: "none",
                  borderRadius: "5px",
                  background: "transparent",
                }}
              />
            </div>
          )}
          {false && (
            <span id="table_group">
              Table orders &nbsp;&nbsp;
              <FormControlLabel
                control={<Switch color="info" />}
                onChange={handleTableOrders}
              />{" "}
            </span>
          )}
          <IconButton
            variant="contained"
            color="success"
            className="refresh_btn"
            onClick={handleRefresh}
          >
            <RefreshIcon />
          </IconButton>
        </div>
      </div>
      {billPrint && (
        <BillPrint orderDetails={orderData} setBillPrint={setBillPrint} />
      )}
      <Dialog open={alertOpen} maxWidth="xs" fullWidth={true}>
        <div className="alert-dialog">
          <h3 className="">{"Payment Pending"}</h3>
          <button
            onClick={() => setAlertOpen(false)}
            className="btn btn-sm btn-primary"
            style={{
              width: "60px",
              padding: "10px 5px",
              margin: "auto",
              height: "40px",
            }}
          >
            OK
          </button>
        </div>
      </Dialog>

      {openDeleteDialog === true ? (
        <DeleteDiaologue
          open={openDeleteDialog}
          onClose={handleDeleteClose}
          onConfirm={handleConfirmDelete}
        />
      ) : (
        <div />
      )}

      <Dialog
        open={openNotifi || props.notification}
        maxWidth="md"
        fullWidth={true}
      >
        <div className="alert-dialog">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span></span>
            <h3 className="">{"Notification"}</h3>
            <button
              style={{ border: "none", color: "red" }}
              onClick={handleClear}
            >
              Clear All{" "}
            </button>
          </div>
          <div style={{ overflowY: "scroll", height: "400px" }}>
            {notifiData.length
              ? notifiData.map((noti) => {
                  return (
                    <div>
                      <p>
                        {noti.msg} on{" "}
                        {moment(`${noti.createdAt}`).format("DD MMM h:mm a")}{" "}
                      </p>
                    </div>
                  );
                })
              : ""}
          </div>

          <Button
            variant="contained"
            color="error"
            style={{ float: "right", right: "10px" }}
            onClick={() => {
              setOpenNotifi(false);
              props.setNotification(false);
            }}
          >
            Close{" "}
          </Button>
        </div>
      </Dialog>

      <Dialog open={waiter} onClose={handleWaiterClose} fullScreen={true}>
        {/* <IconButton
          edge="start"
          color="error"
          variant="contained"
          onClick={handleWaiterClose}
          aria-label="close"
          style={{
            position: "fixed",
            right: 10,
            top: 10,
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <CloseIcon />
        </IconButton> */}
        <Button
          variant="contained"
          color="error"
          style={{ float: "right", marginTop: "5px" }}
          className="btn btn-danger m-2 btn-small"
          onClick={handleWaiterClose}
        >
          Close
        </Button>

        <iframe
          src={iframeSrc}
          style={{ width: "100%", height: "100%", border: "none", zIndex: 1 }}
          title="Waiter Token"
        />
      </Dialog>

      <div className="category-list" style={{ padding: "20px" }}>
        {!tabView ? (
          <Table breakPoint={700} style={{ width: "100%" }}>
            <Thead>
              <Tr>
                <Th>#{t({ id: "token_table" })}</Th>
                <Th>{t({ id: "source" })}</Th>
                <Th>{t({ id: "ammount" })} (Inc Tax)</Th>
                <Th>{t({ id: "order_items" })}</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {ListOrders.length
                ? (isReversed ? ListOrders.slice().reverse() : ListOrders).map(
                    (orderLists, index) => {
                      let paidStaus = notifiData.filter(
                        (nof) => orderLists.number === nof.token
                      );
                      let payStatus = paidStaus.length ? true : false;
                      console.log(orderLists);
                      let tableCall = false;
                      if (orderLists.orderSource === "Table Order") {
                        const table =
                          tableData &&
                          tableData.filter(
                            (tab) => tab.number == orderLists.number
                          );
                        console.log(tableData);
                        //  table.isCallService ? document.getAnimations("point").style.display = "block":document.getAnimations("point").style.display = "none"
                        console.log(table);
                        tableCall = table
                          ? table[0]
                            ? table[0].isServiceCall
                            : ""
                          : "";
                      }
                      return (
                        <Tr
                          style={
                            orderLists.isCanceled === true
                              ? {
                                  backgroundColor: "#fbe3e3cc",
                                  borderBottom: "1px solid #f0eeee",
                                  margin: "5px",
                                }
                              : {
                                  borderBottom: "1px solid #f0eeee",
                                  margin: "5px",
                                }
                          }
                        >
                          <Td
                            style={{
                              fontSize: "25px",
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                              color: "#4d4a4a",
                            }}
                          >
                            {orderLists.orderType.toLowerCase() ===
                              "eat in" && (
                              <img
                                height="20px"
                                alt=""
                                width="20px"
                                src="./images/eat_in.png"
                              />
                            )}
                            {orderLists.orderType.toLowerCase() ===
                              "take away" && (
                              <img
                                height="20px"
                                width="20px"
                                alt=""
                                src="./images/take-out-2.png"
                              />
                            )}
                            {orderLists.orderType.toLowerCase() ===
                              "delivery" && (
                              <DeliveryDiningIcon
                                style={{ height: "30px", width: "30px" }}
                              />
                            )}

                            {orderLists.orderType.toLowerCase() ===
                              "pick up" && (
                              <img
                                height="30px"
                                width="30px"
                                alt=""
                                src="./images/pickup.png"
                              />
                            )}

                            {orderLists.number}
                            <br />
                            {tableCall && (
                              <span
                                className="blinking-dot"
                                style={{
                                  color: "red",
                                  animation: "blinking 1s infinite",
                                  fontSize: "9px",
                                  fontWeight: "bold",
                                  left: "35px",
                                }}
                              >
                                Calling
                              </span>
                            )}
                          </Td>
                          <Td>
                            <Chip
                              label={orderLists.orderSource}
                              color={
                                orderLists.orderSource === "EPOS"
                                  ? "info"
                                  : orderLists.orderSource === "Self Order"
                                  ? "warning"
                                  : orderLists.orderSource === "Table Order"
                                  ? "secondary"
                                  : orderLists.orderSource === "Online Order"
                                  ? "error"
                                  : "default"
                              }
                              style={{
                                marginLeft: "10px",
                                fontSize: "x-small",
                                fontWeight: "bold",
                              }}
                            />
                            <div style={{ fontSize: "12px" }}>
                              {moment(orderLists.createdAt).format(
                                "DD-MMM h:mm a"
                              )}
                            </div>
                          </Td>

                          <Td>
                            {" "}
                            {selectedCurrency}
                            {orderLists.discountType
                              ? orderLists.discountType === "price"
                                ? orderLists.totalPrice -
                                  orderLists.discountAmount
                                : orderLists.totalPrice -
                                  (orderLists.totalPrice *
                                    orderLists.discountAmount) /
                                    100
                              : orderLists.totalPrice}
                            {!orderLists.isPaid ? (
                              <Chip
                                label="PENDING"
                                style={{
                                  fontSize: "x-small",
                                  fontWeight: "bold",
                                  background: "#fdd564",
                                  color: "#6f650e",
                                }}
                              />
                            ) : (
                              <Chip
                                label="&#x2714; PAID"
                                color="success"
                                style={{
                                  fontSize: "x-small",
                                  fontWeight: "bold",
                                }}
                              />
                            )}
                          </Td>
                          <Td style={{ fontSize: "12px" }}>
                            <button
                              className="btn-icon"
                              onClick={() =>
                                orderListHandler(
                                  orderLists.id,
                                  orderLists.customerId,
                                  orderLists
                                )
                              }
                            >
                              <ReceiptLongOutlinedIcon />
                            </button>
                          </Td>

                          <Td>
                            <div className="actions-container">
                              {orderLists.isPaid ? (
                                orderLists.isDelivered ? (
                                  <>
                                    <Chip
                                      label="&#x2714; DELIVERED"
                                      color="success"
                                      style={{
                                        marginLeft: "10px",
                                        fontSize: "x-small",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </>
                                ) : (
                                  <>
                                    {orderLists.isReady &&
                                    orderLists.isCanceled === false ? (
                                      <Button
                                        variant="contained"
                                        color="info"
                                        onClick={() =>
                                          handleOrderStatus(
                                            "deliver",
                                            orderLists.id,
                                            orderLists.isPaid,
                                            orderLists
                                          )
                                        }
                                      >
                                        {t({ id: "deliver" })}
                                      </Button>
                                    ) : orderLists.isCanceled === true ? (
                                      ""
                                    ) : (
                                      <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() =>
                                          handleOrderStatus(
                                            "ready",
                                            orderLists.id,
                                            orderLists.isPaid,
                                            orderLists
                                          )
                                        }
                                      >
                                        {t({ id: "ready" })}
                                      </Button>
                                    )}
                                  </>
                                )
                              ) : (
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={(e) => (
                                    setPayModeSelectDialog(true),
                                    setSelectedOrder(orderLists)
                                  )}
                                  style={{
                                    display: orderLists.isPaid
                                      ? "none"
                                      : "block",
                                    cursor: "pointer",
                                  }}
                                >
                                  {t({ id: "pay_now" })}
                                </Button>
                              )}
                              <PrintIcon
                                color="success"
                                onClick={() => handlePrint(orderLists)}
                                style={{
                                  marginLeft: "45px",
                                  cursor: "pointer",
                                }}
                              />

                              {orderLists.isPaid ? (
                                orderLists.isCanceled === true ? (
                                  <Chip
                                    label="CANCELLED"
                                    color="error"
                                    style={{
                                      marginLeft: "10px",
                                      fontSize: "x-small",
                                      fontWeight: "bold",
                                      cursor: "pointer",
                                    }}
                                  />
                                ) : (
                                  <Button
                                    variant="text"
                                    style={{ marginLeft: "15px" }}
                                    color="error"
                                    onClick={() =>
                                      handleCancel(
                                        orderLists.id,
                                        orderLists.isCanceled
                                      )
                                    }
                                  >
                                    <CancelIcon />
                                  </Button>
                                )
                              ) : (
                                <Button
                                  variant="text"
                                  style={{ marginLeft: "15px" }}
                                  color="error"
                                  onClick={() =>
                                    handleOrderStatus(
                                      "cancel",
                                      orderLists.id,
                                      orderLists.isPaid
                                    )
                                  }
                                >
                                  <DeleteIcon />
                                </Button>
                              )}
                            </div>
                          </Td>
                        </Tr>
                      );
                    }
                  )
                : ""}
            </Tbody>
          </Table>
        ) : (
          <div>
            <h3 align="center">{t({ id: "table_details" })}</h3>
            <div className="mainTab">
              {tableData &&
                tableData.map((tab) => {
                  return (
                    <div
                      className="tab_1 col-lg-2 clo-md-2 col-sm-3"
                      style={{
                        backgroundColor: tab.isAvailable ? "#12cf12" : "orange",
                      }}
                    >
                      <h2>#{tab.number}</h2>
                      <h6>
                        {t({ id: "capacity" })}:{tab.capacity}
                      </h6>
                      {tab.isAvailable === false ? (
                        <h6>Serving By:DL 24</h6>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
      <Dialog
        className="dialog-box"
        maxWidth="md"
        fullWidth={true}
        open={isOpen}
      >
        <div style={{ padding: "10px" }} className="order-tab">
          <h4 style={{ margin: "5px" }} align="center">
            {t({ id: "order_summary_token" })}: #
            <span style={{ fontSize: "35px" }}>{token}</span>
          </h4>
          <div
            style={
              customerorderpop ? { display: "block" } : { display: "none" }
            }
          >
            <h5>
              {t({ id: "name" })}: <span>{customerData.firstName}</span>
            </h5>
            <h5>
              {t({ id: "mobile_no" })}: <span>{customerData.phone}</span>
            </h5>
            <h5>
              {t({ id: "address" })}: <span>{customerData.address}</span>
            </h5>
          </div>
          <Table breakPoint={700} style={{ width: "100%", textAlign: "left" }}>
            <Thead>
              <Tr>
                <Th>{t({ id: "name" })}</Th>
                <Th>{t({ id: "quantity" })}</Th>
                {/* <th>Action</th> */}
              </Tr>
            </Thead>
            <tbody style={{ textAlign: "left !important" }}>
              {orderItemsList.length
                ? orderItemsList.map((orderItem) => {
                    console.log(orderItem);
                    const subProArray =
                      typeof orderItem.sub_pro === "string"
                        ? JSON.parse(orderItem.sub_pro)
                        : orderItem.sub_pro;
                    console.log(subProArray);
                    const subProNames = subProArray
                      ? subProArray.addons.map((subPro) => subPro.name)
                      : [];
                    const subProVariety =
                      subProArray &&
                      subProArray.variety &&
                      Object.keys(subProArray.variety).length
                        ? Object.keys(subProArray.variety)[0]
                        : "";
                    console.log(subProVariety);
                    const subProInstruction =
                      subProArray &&
                      subProArray.cookInstructions &&
                      subProArray.cookInstructions instanceof Array
                        ? subProArray.cookInstructions
                        : [];

                    console.log(orderItemsList);
                    console.log(subProInstruction);
                    return (
                      <Tr id="trow">
                        <Td>
                          <b>{orderItem.name}</b> <br />{" "}
                          {subProNames.length > 0 ? (
                            <Chip
                              label={subProNames.join(", ").toUpperCase()}
                              color="primary"
                              style={{
                                marginLeft: "10px",
                                fontSize: "10px",
                                fontWeight: "bold",
                              }}
                            />
                          ) : (
                            subProNames
                          )}
                          <Chip
                            label={subProInstruction.join(", ").toUpperCase()}
                            color="primary"
                            style={{
                              marginLeft: "10px",
                              fontSize: "8px",
                              fontWeight: "bold",
                            }}
                          />
                          <Chip
                            label={subProVariety.toUpperCase()}
                            color="primary"
                            style={{
                              marginLeft: "10px",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          />
                        </Td>
                        <Td>{orderItem.quantity}</Td>
                        <Td>
                          {orderItem.status === "delivered" ? (
                            <span
                              style={{
                                color: "green",
                                fontSize: "small",
                                fontWeight: "bold",
                              }}
                            >
                              {t({ id: "completed" })}
                            </span>
                          ) : orderItem.status === "ready" ? (
                            <Button
                              id="btnserved"
                              variant="contained"
                              color="success"
                              onClick={() =>
                                HandleServed(selectedOrd, orderItem._id)
                              }
                            >
                              {t({ id: "serve" })}
                            </Button>
                          ) : (
                            <Button
                              id="btnready"
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                HandleReady(selectedOrd, orderItem._id)
                              }
                            >
                              {t({ id: "ready" })}
                            </Button>
                          )}
                        </Td>
                      </Tr>
                    );
                  })
                : ""}
            </tbody>
          </Table>
          <Button
            variant="outlined"
            color="error"
            style={{ float: "right", marginTop: "8px" }}
            className="btn btn-danger m-2 btn-small"
            onClick={handleClose}
          >
            {t({ id: "close" })}
          </Button>
        </div>
      </Dialog>

      <Dialog open={edit} maxWidth="xs" className="pd-2" fullWidth={true}>
        <DialogTitle className="text-center  fw-bold">{itemName}</DialogTitle>
        <form onSubmit={(e) => habdleSubmit(e)} className="p-2">
          <label className="fw-bold mx-2">{t({ id: "item_quantity" })}</label>
          <input
            type="number"
            onChange={handleInput}
            value={editQuantity}
            height="20px"
            width="20px"
            className="form-control w-50 mx-2 "
          />

          <button type="submit" className="btn btn-success m-2 save-btn">
            {t({ id: "save" })}
          </button>

          <button
            onClick={() => setEdit(false)}
            className="btn btn-danger btn-xs m-2 "
            variant="outlined"
          >
            {t({ id: "close" })}
          </button>
        </form>
      </Dialog>
      <Dialog
        open={payModeSelectDialog}
        maxWidth="xs"
        className="pd-2"
        onClose={() => setPayModeSelectDialog(false)}
      >
        <DialogTitle className="text-center  fw-bold">
          {" "}
          {t({ id: "pay_mode" })}
        </DialogTitle>
        <div style={{ padding: "20px" }}>
          <PaymentOptions
            handlePaymentClick={setPayModeSelectDialog}
            handlePayMode={handlePayment}
            paymentIndex={payModeIndx}
            order={selectedOrder}
            closeParentDialog={() => setPayModeSelectDialog(false)}
          />
          <Button
            variant="outlined"
            color="error"
            style={{ float: "right", marginTop: "8px" }}
            className="btn btn-danger m-2 btn-small"
            onClick={() => setPayModeSelectDialog(false)}
          >
            {t({ id: "close" })}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default OrderList;
