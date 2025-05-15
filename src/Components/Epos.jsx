import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from 'react-router';
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import configs from "../Constants";
import Currencies from "../root/currency";

import TableBarIcon from "@mui/icons-material/TableBar";
import Chip from "@mui/material/Chip";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { onValue, ref } from "firebase/database";
import { db } from "./../root/util";

import CancelIcon from "@mui/icons-material/Cancel";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  DialogActions,
  DialogContent
} from "@mui/material";
import BillPrint from "./BillPrint";
import PaymentOptions from "./sub_comp/PaymentOptions";
import PriceUpdateDialog from "./sub_comp/PriceUpdateDialog";
import { CoPresentOutlined } from "@mui/icons-material";

const Epos = (props) => {
  const [showSelectedData, setShowSelectedData] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const { oid } = useParams();
  console.log('-------------------------',oid);
  const [searchResults, setSearchResults] = useState([]);

  const [order, setOrder] = useState();
  const [popUpOpen, setPopUpOpen] = useState(false);
  const closeModal = () => setPopUpOpen(false);
  const [totalProducts, setTotalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openPhone, setOpenPhone] = useState(false);
  const [cashPayDialog, setCashPayDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectPro, setSelectPro] = useState();
  const [proOpen, setProOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filterPro, setFilterPro] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [orderItem, setOrderItem] = useState([]);
  const [variety, setVariety] = useState([]);
  const [cookInst, setCookInst] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDiscountMethod, setSelectedDiscountMethod] = useState("");
  const [price, setPrice] = useState("");
  const [percent, setPercent] = useState(0);
  const [catProducts, setCatProducts] = useState([]);
  const [catId, setCatId] = useState("");
  const [isPayment, setIsPayment] = useState(false);
  const [placeOrder, setPlaceOrder] = useState(true);
  const [procheckbox, setProCheckBox] = useState([]);
  const [addons, setAddons] = useState([]);
  const [addonsGroup, setAddonsGroup] = useState([]);
  const [totalAddons, setTotalAddons] = useState([]);
  const [addOnOrders, setAddOnOrders] = useState([]);
  const [cookalignment, setCookAlignment] = useState([]);
  const [custId, setCustId] = useState("");
  const [alignment, setAlignment] = useState("left");
  const [selectedVar, setSelectedVar] = useState({});
  const [addonvalue, setAddonValue] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selAdons, setSelAdons] = useState([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [dialogStep, setDialogStep] = useState(1);
  const [invoiceNo, setInvoiceNo] = useState(new Date().getTime());
  const [showProducts, setShowProducts] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [qRPath, setQRPath] = useState("");
  const [paymentAndBillDialog, setPaymentAndBillDialog] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(false);
  const [tableDetail, setTableDetail] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(false);
  const [discValue, setDiscValue] = useState(0);
  const [isleftAlign, setIsLeftAign] = useState(false);
  const [mobileNo, setMoblileNo] = useState("");
  const [containedIndex, setContainedIndex] = useState(3);
  const [paymentIndex, setPaymentIndex] = useState(1);
  const [existingData, setExistingData] = useState({});
  const [isCustomerFound, setIsCustomerFound] = useState(true);
  const [billPrint, setBillPrint] = useState(false);
  const [payModeIndx, setPayModeIndx] = useState(1);
  const [payModeSelectDialog, setPayModeSelectDialog] = useState(false);
  const [phnumber, setPhnumber] = useState(
    existingData ? existingData.phoneNo : 0
  );
  const [selectedCat, setSelectedCat] = useState("");
  const [name, setName] = useState(existingData ? existingData.Name : "");
  const [email, setEmail] = useState(existingData ? existingData.Email : "");
  const [customInstr, setCustomInstr] = useState("");
  const [address, setAddress] = useState(
    existingData ? existingData.Address : ""
  );
  const [tableData, setTableData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [editPriceDialog, setEditPriceDialog] = useState(null);
  const [ordId, setOrdId] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);

  const { formatMessage: t, locale, setLocale } = useIntl();
  let authApi = configs.authapi;
  let staticSer = configs.staticSer;
 
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const handleTableChange = (tabNum) => {
    setSelectedTable(tabNum);
    let tabId = tableData.filter((tab) => tab.number === tabNum);
    localStorage.setItem("tableId", tabId[0].id);
    setTableDetail(false);
  };

  const handleDiscountMethodSelect = (event) => {
    setSelectedDiscountMethod(event.target.value);
  };
  const randomNumber = Math.floor(Math.random() * 1000000000);
  const customerID = custId;

  const handleClose = () => {
    setAnchorEl(false);
  };

  let cmsUrl = `${configs.cmsUrl}?token=${sessionStorage.getItem("token")}`;
  const handledisc = () => {
    setIsDropdownOpen(true);
  };

  const handleAlignment = (event, newAlignment) => {
    let newVar = {};
    newVar[newAlignment] = variety[newAlignment];
    setSelectedVar(newVar);
  };

  const handleCookAlignment = (newAlignment) => {
    let updateCookInst = [...cookalignment];
    if (cookalignment.indexOf(newAlignment) == -1) {
      updateCookInst.push(newAlignment);
    } else {
      updateCookInst.splice(updateCookInst.indexOf(newAlignment), 1);
    }
    setCookAlignment(updateCookInst);
  };

  let cat = categories;

  const adAddons = (e, itemId, index, pi) => {
    let AoIndx = -1;
    let newAdOns = [...selAdons];
    newAdOns.map((ao, i) => {
      return ao.id == itemId ? (AoIndx = i) : false;
    });
    // console.log(AoIndx);
    if (AoIndx != -1) {
      newAdOns.splice(AoIndx, 1);
    } else {
      newAdOns.push(pi);
    }
    setSelAdons(newAdOns);
  };

  // let baseURL = configs.baseURL;
  let baseURL = "https://inventory-service-gthb.onrender.com";
  const removeAddons = (itemId) => {
    // console.log(itemId);
  };

  let userToken = sessionStorage.getItem("token")
    ? sessionStorage.getItem("token")
    : "";

  // let userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTZmMmE2ODc0YTRkNjIzYmJlM2Q1ODAiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NDQyNjUxNTAsImV4cCI6MTc0NDg2OTk1MH0.NmI9JEM2gChfmIL9R8eR3XVpjLom4PUdKx0NTD_0bCE"

  const handleOrder = () => {
    //document.getElementById('bar').style.display='none';
    setShowOrders(true);
    setShowProducts(false);
  };
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  // console.log(userData);

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  
   merchantData.taxPerc = userData.taxPerc || merchantData.takeAwayTax;
   console.log(containedIndex);
  if ((containedIndex == 1 || containedIndex == 3) && merchantData.dineinTax) {
    merchantData.taxPerc = merchantData.dineinTax;
  }

  const merchCode = merchantData ? merchantData.merchantCode : "";
  useEffect(() => {
    setIsLeftAign(merchantData.isLeftAlign);
  }, [merchantData]);

  if (document.getElementById("navBar")) {
    document.getElementById("navBar").style.display = "flex";
  }

  let currency = Currencies.filter(
    (curen) => curen.abbreviation == merchantData.currency
  );
  //console.log(currency)
  let SelectCurrency = currency && currency[0] ? currency[0].symbol : "";
  // console.log(SelectCurrency);

  const userId = userData ? userData.sub : " ";
  const getCatByUser = `${baseURL}/api/categories?merchantCode=${merchCode}`;
  const getProductByUser = `${baseURL}/api/products?merchantCode=${merchCode}`;
  const getLatestInvoiceNumber =
    configs.payServer + `/api/invoice/latest/${userId}`;

  let orderDet = JSON.parse(localStorage.getItem("newOrder"));

  const selectedCurrency = (
    <span dangerouslySetInnerHTML={{ __html: SelectCurrency }} />
  );
  // console.log(selectedCurrency);

  useEffect(() => {

    const query = ref(db, "products/" + merchCode);
    return onValue(query, (snapshot) => {
      // console.log("new product update", categories);
      const data = snapshot.val();
      axios.get(getCatByUser).then((response) => {
        //console.log(response.data);
        setCategories(response.data);
      });
    });
  }, []);

  const listProductAndCat = (categories) => {
    axios.get(getProductByUser).then((response) => {
      let orderableCats = [];
      categories.map((ct) => {
        if (ct.isOrderableAlone || !ct.isAddOn) {
          orderableCats.push(ct.id);
        }
      });
      let orderableItems = response.data.filter(
        (itm) => itm.inStock && orderableCats.indexOf(itm.category) != -1
      );
      setTotalProducts(response.data);
      setProducts(orderableItems);

      let addons = [];
      categories.map((c) => {
        if (c.isAddOn) {
          addons.push(c.id);
        }
      });
      setAddonsGroup(
        response.data.filter((pro) => addons.indexOf(pro.category) != -1)
      );
    });
  };

  useEffect(() => {
    listProductAndCat(categories);
  }, [categories]);

  const handleTableDetail = () => {
    setTableDetail(true);
  };
  const handleCustomerDetail = () => {
    // setCustomerDetail(true);
    setOpenPhone(true);
  };
  const cancelCustomer = () => {
    setCustomerDetail(false);
  };
  const cancelTable = () => {
    setTableDetail(false);
  };

  const nextHandler = () => {
    selectedProduct.sub_pro = {};
    // Set price if variety price available
    let varName = Object.keys(selectedVar);
    selectedProduct.price = varName.length
      ? parseFloat(variety[varName[0]])
      : selectedProduct.price;

    selectedProduct.sub_pro.addons = [...selAdons];
    selectedProduct.sub_pro.variety = selectedVar;
    selectedProduct.sub_pro.cookInstructions = cookalignment;

    if (customInstr) {
      selectedProduct.sub_pro.cookInstructions.push(customInstr);
    }

    // Add product to the order with addons and variety
    addPrductToOrder(selectedProduct);

    // Add addons to the order
    addOnOrders.map((a) => addPrductToOrder(a));

    setIsOpen(false);
    setAddons([]);
    setSelAdons([]);
    setSelectedProduct();
  };

  const addPrductToOrder = (p) => {
    const orders = Array.isArray(orderItem) ? [...orderItem] : [];
    let matchedIndex = -1;
  
    // If p.sub_pro is defined, do deep comparison
    if (p.sub_pro) {
      const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  
      for (let i = 0; i < orders.length; i++) {
        const item = orders[i];
  
        if (item.id !== p.id) continue;
  
        // Case 1: Both have sub_pro
        if (item.sub_pro) {
          const sameVariety = isEqual(p.sub_pro.variety || {}, item.sub_pro.variety || {});
          const sameAddons = isEqual(p.sub_pro.addons || [], item.sub_pro.addons || []);
          if (sameVariety && sameAddons) {
            matchedIndex = i;
            break;
          }
        }
      }
    } else {
      // If p.sub_pro is undefined, match only by id
      for (let i = 0; i < orders.length; i++) {
        console.log(orders[i]);
        if (orders[i].id === p.id) {
          matchedIndex = i;
          break;
        }
      }
    }
  
    if (matchedIndex !== -1) {
      orders[matchedIndex].quantity = (orders[matchedIndex].quantity || 1) + 1;
    } else {
      orders.push({ ...p, quantity: 1 });
    }
  
    setOrderItem(orders);
    updateOrderDetails(orders);
  };

  
  

  const handleProduct = (p) => {
    console.log(p);
    setBillPrint(false);
    if (p.isPriceVariety || p.add_ons || p.cookInstructions) {
      // console.log("if running");
      setIsOpen(true);
      setSelectedVar({});
      setCookAlignment([]);
      setVariety(p && p.varietyPrices ? JSON.parse(p.varietyPrices) : {});
      setCookInst(p && p.cookInstructions ? p.cookInstructions.split(",") : []);

      const paddon = p.add_ons.split(",").filter((a) => a.length);
      let addName = addonsGroup.filter((li) => paddon.indexOf(li.id) != -1);
      setAddons(addName);
      setProCheckBox([]);
      setSelAdons([]);
      setSelectedProduct(p);
    } else {
      // console.log("else running");
      addPrductToOrder(p);
    }
  };

  const showVarietyBtn = (variety) => {
    if (!Object.keys(variety).length) return;
    let selectedVarArr = Object.keys(selectedVar);
    let selVarArr = selectedVarArr.length
      ? selectedVarArr
      : handleAlignment("", Object.keys(variety)[0]);
    // console.log(selVarArr);
    return (
      <ToggleButtonGroup
        value={selVarArr}
        onChange={handleAlignment}
        exclusive
        aria-label="text alignment"
        style={{ backgroundColor: "white", overflow: "auto" }}
      >
        {Object.keys(variety).map((key, index) => (
          <ToggleButton
            style={{ display: "inline-block", padding: "none !important" }}
            value={key}
            aria-label="left aligned"
          >
            <div style={{ display: "block", width: "100%" }}>{key}</div>
            <div
              style={{ color: "#000", fontWeight: "bold", fontSize: "1.2em" }}
            >
              {selectedCurrency}
              {+variety[key]}
            </div>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  };

  const showinstructionBtn = () => {
    return (
      <div>
        <ToggleButtonGroup
          value={cookalignment}
          exclusive
          aria-label="text alignment"
          style={{ backgroundColor: "white" }}
        >
          {cookInst.map((key, index) => (
            <ToggleButton
              style={{ display: "inline-block", padding: "none !important" }}
              value={key}
              onClick={() => handleCookAlignment(key)}
              aria-label="left aligned"
            >
              <div style={{ display: "block", width: "100%" }}>{key}</div>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <div style={{ padding: "10px 50px" }}>
          <TextField
            className="notes"
            type="text"
            variant="outlined"
            min={1}
            style={{ fontSize: "1.2em" }}
            value={customInstr}
            onChange={(e) => setCustomInstr(e.target.value)}
            fullWidth={true}
            placeholder={t({ id: "add_custom_notes" })}
          />
        </div>
      </div>
    );
  };

   useEffect(() => {
      if(oid){
      axios
      .get(`${baseURL}/api/orders/${oid}?merchantCode=${merchCode}`)
      .then((res) => {
        console.log(res.data);
        let odr = res.data;
        if (odr.orderItems) {
         setOrder(odr);
         setOrderItem(odr.orderItems);
         let containdInx = getContainIndx(odr.orderType);
         setContainedIndex(containdInx);
         containdInx==1 && setSelectedTable(odr.number);
         updateOrderDetails();
        } 
      });
      }
      
  }, [oid]);

  useEffect(() => {
    if (orderItem && orderItem.length) {
      updateOrderDetails();
    }
  }, [orderItem, containedIndex, discValue, percent]);

  let productItems = isSearch ? filterPro : products;
  // console.log("productsItem", productItems);

  const handleAdd = (indx) => {
    order.orderItems[indx].quantity += 1;
    
    setOrderItem(order.orderItems);
  };
  // console.log(order);

  const handleRemove = (indx) => {
    // console.log("index" + indx);
    let ord = order;
    // console.log(ord);
    ord.orderItems[indx].quantity = ord.orderItems[indx].quantity - 1;

    // console.log(ord.orderItems);
    let items = ord.orderItems.filter((x) => x.quantity !== 0);
    // console.log(items);
    ord.orderItems = items;
    ord.totalPrice = 0;
    ord.taxPrice = 0;
    items.length >= 0 ? setOrderItem(items) : setOrder(ord);
    // setOrderItem(items);
    setPrice();
    setPercent();
    setItemCount(items.length);
  };

  const deleteItem = (itemId) => {
    // myArray.shift();
    if (order.orderItems.length === 1) {
      let ord = order;
      let item = ord.orderItems.filter((item, i) => i !== 0);
      ord.totalPrice = 0;
      ord.taxPrice = 0;
      ord.orderItems = item;
      setOrder(ord);
      setOrderItem(item);
    } else {
      let item = order.orderItems.filter((x) => x._id !== itemId);
      setOrderItem(item);
    }
  };

  const handleSearch = (e) => {
    let val = e.target.value;
    let fltData = totalProducts.filter(
      (pro) => pro.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
    );
    setFilterPro(fltData);
    setIsSearch(val ? true : false);
  };

  const updateOrderDetails = (newOrderItem) => {
    let orderItems = (newOrderItem || orderItem).map((x) => {
      if (!x.sub_pro) {
        x.sub_pro = { addons: [], variety: {}, cookInstructions: [] };
      }
      if (!x.quantity) {
        x.quantity = 1;
      }
      let addonsPrice =
        x.sub_pro && x.sub_pro.addons
          ? x.sub_pro.addons.reduce((acc, val) => acc + val.price, 0)
          : 0;
      x.totalPrice = (x.price + addonsPrice) * x.quantity;
      return x;
    });
    const itemsCount = orderItems.reduce((a, c) => a + c.quantity, 0);
    setItemCount(itemsCount);
    const itemsPrice = orderItems.reduce((a, c) => a + c.totalPrice, 0);
    // console.log(merchantData);
    let txPerc = merchantData.taxPerc || merchantData.takeAwayTax;
    let orderType = "Eat In";
    
    const taxPrice = txPerc
      ? parseFloat((((txPerc / 100) * itemsPrice * 100) / 100).toFixed(2))
      : 0.0;

    let totalPrice = parseFloat(itemsPrice + taxPrice).toFixed(2);

    if (merchantData.isItemInclusiveTax) {
      totalPrice = parseFloat(itemsPrice).toFixed(2);
    }

    // console.log(taxPrice);
    const setpro = [addons];
    // console.log(selectedDiscountMethod);
    // console.log(discValue);

    let order = {
      number: 0,
      isPaid: false,
      isReady: false,
      inProgress: true,
      isCanceled: false,
      isDelivered: false,
      orderType: orderType,
      customerId: customerID,
      orderSource: "EPOS",
      paymentType: "At Counter",
      payGateOrderId: "",
      payVia: "UPI",
      currency: currency[0].abbreviation,
      set_pro: setpro,
      orderStatus: "NEW", //ACCEPTED, REJECTED
      totalPrice: totalPrice,
      taxPrice: taxPrice,
      discountType: selectedDiscountMethod,
      discountAmount: parseFloat(discValue),
      orderItems: orderItems,
      userId: merchCode,
    };
    setOrder(order);
  };

  const getCustomerById = async(custId) => {
    if(custId){
      const res = await axios.get(
        `${authApi}/customer/${custId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if(res.data.id){
      handleCustomerSelect(res.data);
      }
    }
  }

  const handleSearchCustomer = async () => {
    if (!phnumber) {
      // console.log("📭 No phone number provided.");
      return;
    }

    try {
      // console.log("🔍 Searching customer with phone:", phnumber);

      setSearchAttempted(true);

      const res = await axios.post(
        `${authApi}/user/customers/find`,
        { phone: phnumber },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      // console.log("Full API response:", res);

      const customers = Array.isArray(res.data?.customers)
        ? res.data.customers
        : [];

      // console.log("Parsed customers array:", customers);

      setSearchResults(customers);
      setIsCustomerFound(customers.length > 0);

      if (customers.length > 0) {
        const firstCustomer = customers[0];
        setName(firstCustomer.firstName || "");
        setEmail(firstCustomer.email || "");
        setAddress(firstCustomer.address || "");
        setCustId(firstCustomer.id || firstCustomer._id);
      } 
    } catch (err) {
      // console.log("Search error:", err?.response?.data || err.message);
      setSearchResults([]);
      setIsCustomerFound(false);
    }
  };
  // Add this new function to handle radio selection
  const handleCustomerSelect = (customer) => {
    setName(customer.firstName);
    setEmail(customer.email);
    setPhnumber(customer.phone);
    setCustId(customer.id);
    setAddress(customer.address);
    setIsCustomerFound(true);
  };

  const handleSaveCustomerSelection = () => {
    if (phnumber) {
      // Set customer details in state
      setMoblileNo(phnumber);
      setName(name);
      setAddress(address);

      // check whether the  order has items in it or not.
      const hasItems = order?.orderItems && order.orderItems.length > 0;

      if (hasItems) {
        updateOrderDetails(order.orderItems);
      }
      // Initialize or update order object
      const updatedOrder = {
        ...(order || {}), // Create new order if none exists
        customerId: custId,
        customerPhone: mobileNo,
        customerName: name !== "" ? name : phnumber,
        customerAddress: address,
        orderItems: order?.orderItems || [], // Ensure orderItems exists
      };

      // Update order state
      setOrder(updatedOrder);

      // Reset UI states
      setOpenPhone(false);
      setSearchAttempted(false);
      setPhnumber("");
      setSearchResults([]);
      setCustomerDetail(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!phnumber) {
      console.log("Phone number is required");
      return;
    }
    const generatedEmail = email || `${phnumber}@menulive.in`;
    try {
      const data = {
        email: generatedEmail,
        phone: phnumber,
        firstName: name || phnumber,
        lastName: "",
        address: address || "",
        password: phnumber,
        isEmailVerified: false,
        isPhoneVerified: false,
        referenceDetails: "",
        merchantCode: merchCode,
        userType: "CUSTOMER",
      };

      // console.log("Sending to API:", data);

      const res = await axios.post(`${authApi}/user/customer`, data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // console.log("Customer added:", res.data);
      if(res?.data?.user?.customer?.id){
      setCustId(res.data.user.customer.id);
      }
      setShowAddressDialog(false);
      setSearchResults([]);
      setSearchAttempted(false);
      setOpenPhone(false);
    } catch (error) {
      console.log(
        "Error adding customer:",
        error?.response?.data || error.message
      );
      console.log("Customer could not be added.");
    }
  };

  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpg";
  };
  const catPath = `/categories`;
  const varPath = `/varieties`;
  const orderListPath = `/orderList`;
  const productPath = `/productDetails`;
  const tabPath = `/table`;
  const reportsPath = `/reports`;
  const settingPath = "/setting";

  const handleCancel = () => {
    setOpenPhone(false);
    setBillPrint(false);

    setSearchAttempted(false);

    // Reset all customer-related states
    setPhnumber("");
    setName("");
    setEmail("");
    setAddress("");
    setCustId("");
    setSearchResults([]);
    setShowSelectedData(false);
    setIsCustomerFound(true);
  };

  // console.log("invoiceNo", invoiceNo);
  
  const getOrderPrintDetails = () =>{
    orderDet = JSON.parse(localStorage.getItem("newOrder"));
    let orderData = {
        orderId: orderDet ? orderDet.id : "",
        merchantCode: merchCode ? merchCode : "",
        currency: currency.length && currency[0].abbreviation,
        restaurant: merchantData ? merchantData.firstName : "",
        address:
          userData || merchantData ? merchantData.address || userData.address : "",
        cgst: merchantData.taxPerc,
        taxPerc: merchantData.taxPerc,
        invoice_no: invoiceNo,
      };

      console.log(orderData);
      return orderData;
  }

  function summaryPath1(orderDetails) {
    // console.log(orderDetails);
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

  const getNewInvoice = (orderItms) => {
    return new Promise((resolve, reject) => {
        try {
           let billData = {};
          billData.userId = merchantData.merchantCode;
          billData.appName = "EPOS";
          billData.payType = "onetime";
          billData.payStatus = "paid";
          billData.purchaseItems = JSON.stringify(orderItms);

          axios
            .post(`${configs.payUrl}/api/new-order`, billData)
            .then((res) => {
              setInvoiceNo(res.data.invoiceData.invoicePath);
              setInvoiceId(res.data.invoiceData._id);
              // console.log('got')
              resolve(res.data.invoiceData); 
            });
         
        } catch (err) {
          reject(err); 
        }
      })
  }

  const createOrder = async (e, isOrder, isSaveOrder) => {
    if (!order) return;
    
    const currentOrdId = oid || order.id || ordId || localStorage.getItem("ordId");
    if (containedIndex === 1) {//table specific
      let tabId = localStorage.getItem("tableId");
      order.number = selectedTable;
      order.isPaid = false;
      order.isDelivered = false;
      order.tableId = tabId;
      order.invoiceId = invoiceId;
      updateTblStatus(selectedTable, !isSaveOrder);
    } 
    if (containedIndex === 0 || containedIndex === 3) {
      order.isPaid = true;
    }
    order.orderType=getOrderType();
    order.customerId = custId;
    order.orderItems = order.orderItems.map((it) => ({
      _id: it._id||it.id,
      quantity: it.quantity,
      kitchenId : it.kitchenId,
      price:
        it.price +
        (it.sub_pro?.addons?.reduce((acc, val) => acc + val.price, 0) || 0),
      name: it.name,
      status: it.status ? it.status : "inProgress",
      sub_pro: JSON.stringify(it.sub_pro),
      ...(order.isDelivered && { status: "delivered" }),
    }));
    let invData= await getNewInvoice();
    order.invoiceId = invData._id;
    order.discountType = selectedDiscountMethod;
    order.discountAmount = parseFloat(discValue);
    // Update or create order
    const orderCallback = (resData, isUpdate = false) => {
      const newId = resData.id;
      const savedOrder = { ...resData, localOrderId: newId };
      if (!order.isPaid) {
        saveUpdateHoldOrd(order, true);
      }

      if (!isOrder) {
        if (!window.PrintInterface) {
          sessionStorage.setItem("billing", true);
          summaryPath1(resData);
        } else {
          setBillPrint(true);
          localStorage.setItem("isPrintCall", "N");
        }
      }
     resetStates();
    };

    if (currentOrdId) {
      // Update existing order
      axios
        .put(
          `${baseURL}/api/orders/${currentOrdId}?userId=${
            merchantData?.merchantCode || " "
          }`,
          order
        )
        .then((res) => {
          console.log("✅ Order updated:", res.data);
          orderCallback(res.data, true);
        })
        .catch((err) => console.error("❌ Order update failed:", err));
    } else {
      // Create new order
      axios
        .post(
          `${baseURL}/api/orders?userId=${merchantData?.merchantCode || " "}`,
          order
        )
        .then((res) => {
          console.log("🆕 Order created:", res.data);
            setOrdId(res.data.id);
          setSnackbarOpen(true);
          localStorage.setItem("newOrder", JSON.stringify(res.data));
          orderCallback(res.data, false);
        })
        .catch((err) => console.error("❌ Order creation failed:", err));
    }
  };

  const updateTblStatus = (tblNumber, isAvailable) => {
      const tabupdate = tableData.find((tab) => tab.number == selectedTable);
      if(isAvailable== tabupdate.isAvailable){
        return;
      }
      if (tabupdate) {
        axios
          .patch(
            `${baseURL}/api/tables/${tabupdate.id}/availability?merchantCode=${
              merchantData?.merchantCode || " "
            }`,

          )
          .then((res) => console.log("✅ Table updated:", res.data));
      }
  }

  const finishOrder = async () => {
    if (order) {
      order.discountType = selectedDiscountMethod;
      order.discountAmount = parseFloat(discValue);
      order.invoiceId = "";
      const timestamp = new Date().toLocaleString();
      order.timestamp = timestamp;
      if (containedIndex === 1 && selectedTable) {
        let isOrderwithPrint = true;
        createOrder(null, isOrderwithPrint, true);

      }
    }
  };

  const saveUpdateHoldOrd =(order,toBeRemoveFrmHold) =>{
    let HOs = localStorage.getItem("ordersOnHold");
    if (HOs) {
        HOs = JSON.parse(HOs);
        let savedIndx = HOs.findIndex(ho=> ((ho.customerId && ho.customerId== order.customerId)|| (order.number && ho.number== order.number )));
        if(savedIndx> -1){
          HOs.splice(savedIndx,1);
        }
        !toBeRemoveFrmHold && HOs.push(order);
        localStorage.setItem("ordersOnHold", JSON.stringify(HOs));
      } else {
        localStorage.setItem("ordersOnHold", JSON.stringify([order]));
      }
      resetStates();
  }

  const getContainIndx = (oType) =>{

    let containedIndex = 3;
       if(oType =="Take Away") {
        containedIndex = 0;
      } else if (oType == "Table Order") {
        containedIndex = 1;
      }else if (oType == "Delivery") {
        containedIndex =2;
      } 
      return containedIndex;
  }

  const getOrderType = () =>{
      let orderType = "Eat In";
       if (containedIndex === 0) {
        orderType = "Take Away";
      } else if (containedIndex === 1) {
        orderType = "Table Order";
      }else if (containedIndex === 2) {
        orderType = "Delivery";
      } 
      return orderType;
  }

  const handleHold = () => {
    if(order) {
      order.number = selectedTable;
      order.discountType = selectedDiscountMethod;
      order.discountAmount = parseFloat(discValue);
      order.customerId= custId;
      order.customerName= name;
      order.customerAddress = address;
      order.customerPhone = mobileNo;
      const timestamp = new Date().toLocaleString();
      order.timestamp = timestamp;
      order.orderType=getOrderType();
      saveUpdateHoldOrd(order);
      if (containedIndex === 1 && selectedTable) {
        updateTblStatus(selectedTable,false);
        let isOrderwithPrint = true;
      }
    }
    resetStates();
  };

  const resetStates = () => {
      setOrderItem([]);
      setOrder();
      setPrice();
      setPercent();
      setIsPayment(false);
      setPlaceOrder(true);
      setDialogStep(1);
      setIsDropdownOpen(false);
      setSelectedDiscountMethod("");
      setCustomInstr("");
      setSelectedVar({});
      setSelectedTable("");
      setContainedIndex(3);
      setName("");
      setPhnumber(null);
      setEmail("");
      setAddress("");
      setCustId("");
      setSearchResults([]);
  }

  useEffect(() => {
      axios
        .get(`${baseURL}/api/tables?merchantCode=${merchCode}`)
        .then((res) => {
          setTableData(res.data);
        });
    
  }, []);

 

  const resumeOrder = (customerId, tblNumber) => {
    handleOrderTypeTabClick(1);
    const HOs = JSON.parse(localStorage.getItem("ordersOnHold")) || [];
    const resumeOrd = HOs.filter(
      (ho) => ((customerId && ho.customerId == customerId) || (tblNumber && ho.number == tblNumber))
    );
    if(resumeOrd && resumeOrd.length){
       if(resumeOrd[0].customerId && resumeOrd[0].customerName){
      let customer = {
        id : resumeOrd[0].customerId,
        firstName :resumeOrd[0].customerName,
        email: resumeOrd[0].email,
        address: resumeOrd[0].customerAddress,
        phone:resumeOrd[0].customerPhone
      };
      handleCustomerSelect(customer);
    }
      if(resumeOrd[0].customerId){
        getCustomerById(resumeOrd[0].customerId);
      }
      setOrder(resumeOrd[0]);
      setOrderItem(resumeOrd[0].orderItems);
      setOrdId(resumeOrd[0].id);
      if(resumeOrd[0].orderType == 'Table Order'){
      setSelectedTable(tblNumber);
      }
      setContainedIndex(getContainIndx);
      setHoldOpen(false);


      }
    };

   
  const handleCancelOrd = (customerId) => {
    const orderResume = JSON.parse(localStorage.getItem("ordersOnHold"));

    const index = orderResume.findIndex(
      (ordRes) => ordRes.customerId === customerId
    );

    if (index !== -1) {
      orderResume.splice(index, 1);
      localStorage.setItem("ordersOnHold", JSON.stringify(orderResume));
      setHoldOpen(false);
    } else {
      console.error("Order not found for customerId:", customerId);
    }
  };


  const categoryClickHandler = (catName, catId, isAddOn) => {
    let prodAsPerCat = totalProducts.filter((p) => p.category == catId);
    setProducts(prodAsPerCat);
    setSelectedCat(catId);
  };

  const handleItem = () => {};

  const cancleOrder = () => {
    setIsPayment(false);
    // setPlaceOrder(false)
    //setPlaceOrder(true);
    setOrderItem([]);
    setBillPrint(false);
    setOrder();
    // setDialogStep(1);
    window.location.href = "/epos";
  };

  const handleBack = () => {
    document.getElementById("bar").style.display = "flex";
    setShowOrders(false);
    setBillPrint(false);
    setShowProducts(true);
  };

  const handlePayMode = (mode) => {
    // console.log(mode);
    let ord = order;
    ord.paymentState = "PAID";
    ord.isPaid = true;
    ord.payVia = mode || "UPI";
    setOrder(ord);
  };

  const closeHandler = () => {
    setIsOpen(false);
    setDialogStep(1);
    setIsDropdownOpen(false);
    setSelectedDiscountMethod("");
  };

  const handlediscsubmit = () => {
    const valuedisc = parseFloat(discValue);
    // console.log(selectedDiscountMethod);

    if (selectedDiscountMethod === "percentage") {
      const taxPrice = order.totalPrice * (valuedisc / 100);
      const percent = order.totalPrice - taxPrice;
      const formattedPercent = percent.toFixed(2); // Display percent with 2 decimal places
      // console.log(formattedPercent);
      setPercent(parseFloat(formattedPercent)); // Set the value as a number
    } else {
      const discValue = order.totalPrice - valuedisc;
      const formattedDiscValue = discValue.toFixed(2); // Display discount value with 2 decimal places
      setPrice(parseFloat(formattedDiscValue)); // Set the value as a number
      // console.log(order.totalPrice);
    }

    setIsDropdownOpen(false);
  };

  const showCategories = () => {
    return (
      <div>
        <div className={"cat_cont"}>
          <div onClick={handleAllCategory}>
            <img src={"./images/cat_logo.jpeg"} className={"cat_epos_icon"} />
            <div className={!selectedCat ? "chip selected-chip" : "chip"}>
              All{" "}
            </div>
          </div>
          {cat &&
            cat
              .filter((ct) => ct.isOrderableAlone || !ct.isAddOn)
              .map((category) => {
                let cId = category._id || category.id;

                return (
                  <div
                    onClick={() =>
                      categoryClickHandler(category.name, cId, category.isAddOn)
                    }
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      marginLeft: "10px",
                    }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="cat_epos_icon"
                      onError={(e) => (e.target.src = "./images/blank.jpg")}
                      style={{ display: "block", margin: "0 auto" }}
                    />

                    <div
                      className={
                        category.id === selectedCat
                          ? "chip selected-chip"
                          : "chip"
                      }
                      style={{ marginTop: "8px" }} // Adds space between image and text
                    >
                      {category.name}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    );
  };

  window.onafterprint = () => {
    setPaymentAndBillDialog(false);
    //setShowBillBtn(false);
  };

  const handleEdit = () => {
    setOpenPhone(true);
    setExistingData({
      phoneNo: phnumber,
      Name: name,
      Address: address,
    });
  };
  // console.log(order);

  const handleAllCategory = () => {
    setProducts(totalProducts);
    setSelectedCat("");
  };

  const showdialogForAddons = () => {
    let adonsCats = categories.filter(
      (cat) => selectedProduct.add_ons.indexOf(cat.id) != -1
    );
    return (
      <Box className="boxdialog">
        <Dialog
          onClose={closeHandler}
          aria-labelledby="max-width-dialog-title"
          open={isOpen}
          fullWidth={true}
        >
          <div id="dbox">
            <h2 style={{ textAlign: "center" }}>{selectedProduct.name}</h2>
            <Box id="adionorder" style={{ margin: "10px" }}>
              {variety && Object.keys(variety).length ? (
                <h4 style={{ textAlign: "center" }}>{"SELECT SIZE"}</h4>
              ) : (
                ""
              )}
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                {showVarietyBtn(variety)}
              </div>

              {adonsCats.length
                ? adonsCats.map((aoCat, i) => (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignContent: "center",
                        padding: "3px 15px",
                        fontSize: "20px",
                        flexWrap: "wrap",
                        marginBottom: "20px",
                      }}
                    >
                      <h3
                        style={{
                          width: "100%",
                          margin: "5px",
                          textAlign: "center",
                          color: "#fff",
                        }}
                      >
                        <b> {aoCat.name}</b>
                      </h3>
                      <div className="textsmall_b">
                        {"(Min. " +
                          aoCat.minAddOnAllowed +
                          ", Max " +
                          aoCat.maxAddOnAllowed +
                          ")"}
                      </div>
                      {totalProducts
                        .filter((aopi) => aopi.category == aoCat.id)
                        .map((pi) => (
                          <div
                            className="chip-select"
                            style={{
                              backgroundColor: procheckbox[i]
                                ? "#0cb600"
                                : "#c6c2c2",
                            }}
                          >
                            <Checkbox
                              id={`checkboxId-${i}`}
                              checked={procheckbox[i]}
                              onChange={(e) => adAddons(e, pi.id, i, pi)}
                            />
                            <span> {pi.name} </span>
                            <b style={{ fontSize: "0.7em", color: "#fff" }}>
                              {selectedCurrency} {pi.price}
                            </b>
                          </div>
                        ))}
                    </div>
                  ))
                : ""}

              <h4 style={{ textAlign: "center" }}>
                {t({ id: "select_cook_instruction" })}
              </h4>
              <div
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                {showinstructionBtn(cookInst)}
              </div>

              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Button
                  variant="outlined"
                  id="btn_cancel"
                  onClick={closeHandler}
                >
                  {t({ id: "cancel" })}
                </Button>
                <Button variant="contained" id="btnAdd" onClick={nextHandler}>
                  {t({ id: "Next" })}
                </Button>
              </Box>
            </Box>
          </div>
        </Dialog>
      </Box>
    );
  };
  const handleOrderTypeTabClick = (index) => {
    setContainedIndex(index);
    // updateOrderDetails();
  };

  const handlePaymentClick = (index) => {
    setPaymentIndex(index);
  };

  const handleTakeAway = () => {};
  const handleDineIn = () => {};
  const handleDelivery = () => {
    // setOpenPhone(true);
  };
  // console.log(order);

  const showOrdersItems = () => {
    return (
      <div className="pos_container" style={{ background: "#fff" }}>
        <div className="items">
          <div className="content">
            <div style={{ textAlign: "center" }}>
              <ButtonGroup aria-label="Basic button group">
                <Button
                  variant={containedIndex === 3 ? "contained" : "outlined"}
                  style={{
                    backgroundColor:
                      containedIndex === 3 ? "#F7C919" : "inherit",
                    borderColor: containedIndex === 3 ? "#F7C919" : "inherit",
                    color: containedIndex === 3 ? "black" : "inherit",
                    borderColor: "#F7C919",
                  }}
                  onClick={() => {
                    handleOrderTypeTabClick(3);
                  }}
                >
                  {t({ id: "eat_in" })}
                </Button>
                <Button
                  variant={containedIndex === 0 ? "contained" : "outlined"}
                  style={{
                    backgroundColor:
                      containedIndex === 0 ? "#F7C919" : "inherit",
                    borderColor: containedIndex === 0 ? "#F7C919" : "inherit",
                    color: containedIndex === 0 ? "black" : "inherit",
                    borderColor: "#F7C919",
                  }}
                  onClick={() => {
                    handleOrderTypeTabClick(0);
                    handleTakeAway();
                  }}
                >
                  {t({ id: "take_away" })}
                </Button>
                <Button
                  variant={containedIndex === 1 ? "contained" : "outlined"}
                  style={{
                    backgroundColor:
                      containedIndex === 1 ? "#F7C919" : "inherit",
                    borderColor: containedIndex === 1 ? "#F7C919" : "inherit",
                    color: containedIndex === 1 ? "black" : "inherit",
                    borderColor: "#F7C919",
                  }}
                  onClick={() => {
                    handleOrderTypeTabClick(1);
                    handleDineIn();
                    handleTableDetail();
                  }}
                >
                  {t({ id: "table_order" })}
                </Button>
                <Button
                  variant={containedIndex === 2 ? "contained" : "outlined"}
                  style={{
                    backgroundColor:
                      containedIndex === 2 ? "#F7C919" : "inherit",
                    borderColor: containedIndex === 2 ? "#F7C919" : "inherit",
                    color: containedIndex === 2 ? "black" : "inherit",
                    borderColor: "#F7C919",
                  }}
                  onClick={() => {
                    handleOrderTypeTabClick(2);
                    handleDelivery();
                  }}
                >
                  {t({ id: "delivery" })}
                </Button>
              </ButtonGroup>

              <Dialog
                aria-labelledby="max-width-dialog-title"
                style={{ backgroundColor: "#fff !important" }}
                open={openPhone}
                fullWidth={true}
                maxWidth="xs"
                // className='Orderp'
              >
                <DialogTitle id="titorder">
                 Enter Customer Details
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={()=>setOpenPhone(false)}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                  >
                <CloseIcon />
                </IconButton>

                <DialogContent dividers>
                <h4 style={{ margin: "10px" }}>Enter Mobile Number:</h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "5px",
                  }}
                >

                  <input
                    type="text"
                    placeholder="Enter Mobile"
                    value={phnumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setPhnumber(value);
                    }}
                    className="number_input"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    onKeyPress={(e)=> e.key =='Enter' && handleSearchCustomer(e)}
                    style={{
                      padding: "5px",
                      marginLeft: "10px",
                      width: "70%",
                      fontSize: "1.2em",
                    }}
                  />

                  <button
                    onClick={handleSearchCustomer}
                    onSubmit={handleSearchCustomer}
                    type="submit"
                    style={{
                      marginLeft: "10px",
                      borderRadius: "10px",
                      background: "#000",
                      color: "#fff",
                      width:"130px",
                      cursor:"pointer"
                    }}
                  >
                    <SearchIcon />
                  </button>
                </div>

                {searchAttempted && searchResults.length > 0 && (
                  <div style={{ margin: "20px" }}>
                    <Typography variant="subtitle1">
                      Select Existing Customer:
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {searchResults.map((customer) => (
                        <div
                          key={customer.id || customer._id}
                          style={{ display: "flex", alignItems: "center" }}
                          onClick={() => handleCustomerSelect(customer)}

                        >
                          <input
                            type="radio"
                            checked={customer.id == custId}
                            id={customer.id || customer._id}
                            name="customerSelect"
                            style={{fontSize:"1.3em",padding:"4px"}}
                          />
                          <label
                            htmlFor={customer.id || customer._id}
                            style={{ marginLeft: "10px" }}
                          >
                            {customer.firstName} - {customer.phone}
                            {customer.address && ` - ${customer.address}`}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchAttempted && searchResults.length === 0 && (
                  <>
                    <div
                      style={{
                        color: "#f44336",
                        padding: "8px 16px",
                        marginTop: "1px",
                        borderRadius: "4px",
                        marginRight: "10px",
                      }}
                    >
                      Customer not found, Add New
                    </div>

                    <div style={{ padding: "20px" }}>
                      <TextField 
                    type="text"
                    label="Customer Name"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    className="number_input"
                    
                  />
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Delivery Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        variant="outlined"
                        style={{ marginBottom: "20px",marginTop:"10px" }}
                      />
                    </div>
                  </>
                )}
</DialogContent>
<DialogActions>
                <div
                  style={{
                    display: "flex",
                    padding: "10px",
                    justifyContent: "space-between",
                  }}
                >
                 

                  {searchAttempted && searchResults.length === 0 && (
                    <Button
                       className="save-btn btnDialog-Fill"
                    variant="contained"
                    color="success"
                      onClick={handleAddCustomer}
                    >
                      ADD NEW
                    </Button>
                  )}

                  {searchAttempted && searchResults.length > 0 && (
                    <Button
                      variant="contained"
                      onClick={handleSaveCustomerSelection}
                      style={{
                        width: "50px",
                        textAlign: "center",
                        background: "#f7c919",
                        padding: "5px 50px",
                      }}
                    >
                      SELECT
                    </Button>
                  )}
                </div>
                </DialogActions>
              </Dialog>

            </div>

            <div>
              <ArrowBackIcon onClick={handleBack} id="back" />
              <table
                align="center"
                id="pos-items"
                cellPadding="5px"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>{t({ id: "price" })}</th>
                    <th style={{ width: "120px", textAlign: "center" }}>
                      QNT.
                    </th>
                    <th>{t({ id: "total" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {order
                    ? order.orderItems.map((item, indx) => {
                        const subProArray = item.sub_pro;
                        // console.log(subProArray);
                        const subProNames =
                          subProArray && subProArray.addons
                            ? subProArray.addons.map((subPro) => subPro.name)
                            : [];
                        const subVariety = subProArray
                          ? subProArray.variety
                          : "";
                        // console.log(order);
                        // console.log(subVariety);
                        return (
                          <>
                            <tr>
                              <td>
                                {" "}
                                <b>{item.name}</b> <br />{" "}
                                {subProNames.length > 0 ? (
                                  <Chip
                                    label={subProNames.join(",").toUpperCase()}
                                    color="primary"
                                    style={{
                                      marginLeft: "10px",
                                      fontSize: "10px",
                                      fontWeight: "bold",
                                    }}
                                  />
                                ) : (
                                  subProNames
                                )}{" "}
                                {subProArray &&
                                subProArray.cookInstructions &&
                                subProArray.cookInstructions.length ? (
                                  <Chip
                                    label={subProArray.cookInstructions
                                      .join(",")
                                      .toUpperCase()}
                                    color="primary"
                                    style={{
                                      marginLeft: "10px",
                                      fontSize: "8px",
                                      fontWeight: "bold",
                                    }}
                                  />
                                ) : (
                                  ""
                                )}
                                {subVariety ? (
                                  <Chip
                                    label={Object.keys(subVariety)
                                      .join(",")
                                      .toUpperCase()}
                                    color="primary"
                                    style={{
                                      marginLeft: "10px",
                                      fontSize: "10px",
                                      fontWeight: "bold",
                                    }}
                                  />
                                ) : (
                                  ""
                                )}
                              </td>
                              <td>
                                {selectedCurrency}
                                {item.price +
                                  (subProArray && subProArray.addons
                                    ? subProArray.addons.reduce(
                                        (acc, val) => acc + val.price,
                                        0
                                      )
                                    : 0)}
                                {item.isPriceEditable && (
                                  <EditIcon
                                    style={{ height: "20px" }}
                                    onClick={() => setEditPriceDialog(indx + 1)}
                                  />
                                )}
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <button
                                    className="add_btn"
                                    onClick={() => handleRemove(indx)}
                                    style={{display:item.status== 'ready' || item.status=='delivered'?'none':"inline-block"}}
                                  >
                                    <RemoveIcon />
                                  </button>
                                  <span style={{ margin: "0px 8px" }}>
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="add_btn"
                                    onClick={() => handleAdd(indx)}
                                    style={{display:item.status== 'ready' || item.status=='delivered'?'none':"inline-block"}}
                                  >
                                    <AddIcon />
                                  </button>
                                </div>
                              </td>
                              <td>
                                {selectedCurrency}
                                {item.quantity *
                                  (item.price +
                                    (subProArray && subProArray.addons
                                      ? subProArray.addons.reduce(
                                          (acc, val) => acc + val.price,
                                          0
                                        )
                                      : 0))}
                              </td>
                              {false && (
                                <td>
                                  <IconButton
                                    aria-label="delete"
                                    size="small"
                                    color="error"
                                    onClick={() => deleteItem(item._id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </td>
                              )}
                            </tr>
                          </>
                        );
                      })
                    : ""}

                  <tr>
                    <td colSpan="3" align="left" style={{ color: "#81ed40" }}>
                      {t({ id: "sub_total" })}
                    </td>
                    <td>
                      <b>
                        {order
                          ? (order.totalPrice - order.taxPrice).toFixed(2)
                          : ""}
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" style={{ color: "#81ed40" }} align="left">
                      {t({ id: "tax" })}
                    </td>
                    <td>
                      {selectedCurrency}{" "}
                      {order && typeof order.taxPrice === "number"
                        ? order.taxPrice.toFixed(2)
                        : " "}
                    </td>
                  </tr>
                  <tr
                    style={
                      price || percent
                        ? { display: " table-row" }
                        : { display: "none" }
                    }
                  >
                    <td style={{ color: "#aa3c06" }} colSpan="3" align="left">
                      {t({ id: "discount" })}
                    </td>
                    <td>
                      {"- "}{" "}
                      {price ? discValue : percent ? discValue + "%" : ""}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "#81ed40", fontSize: "1.2em" }}
                      colSpan="2"
                      align="left"
                    >
                      <b>{t({ id: "total" })}</b>
                    </td>
                    <td colSpan="2" align="right">
                      <b style={{ fontSize: "1.6em" }}>
                        {selectedCurrency}{" "}
                        {price || percent
                          ? price || percent
                          : order
                          ? order.totalPrice
                          : ""}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {order && order.totalPrice && (
              <Button
                variant="outlined"
                className="btn-border"
                id="discbtn"
                onClick={handledisc}
              >
                {t({ id: "discount" })}
              </Button>
            )}
            <div id="disc">
              {isDropdownOpen && (
                <div id="sel1">
                  <div>
                    <Button
                      onClick={(event) => handleDiscountMethodSelect(event)}
                      variant="outlined"
                      value="percentage"
                    >
                      Percent(%)
                    </Button>
                    <Button
                      onClick={(event) => handleDiscountMethodSelect(event)}
                      variant="outlined"
                      value="price"
                    >
                      {"Fix( " + merchantData.currency + " )"}
                    </Button>
                    {false && (
                      <Button
                        onClick={handleDiscountMethodSelect}
                        variant="outlined"
                        value="coupon"
                      >
                        Coupon
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              {selectedDiscountMethod && (
                <div style={{ display: "inline-block" }}>
                  <TextField
                    id="discval"
                    size="small"
                    variant="outlined"
                    type="number"
                    value={discValue}
                    onChange={(e) => setDiscValue(e.target.value)}
                    style={{
                      display: "inline-block",
                      borderRadius: "10px",
                      width: "150px",
                      backgroundColor: "#577283",
                    }}
                  />

                  <Button
                    variant="contained"
                    color="success"
                    style={
                      selectedDiscountMethod
                        ? { display: "inline-block", marginLeft: "10px" }
                        : { display: "none" }
                    }
                    onClick={handlediscsubmit}
                  >
                    {t({ id: "apply" })}
                  </Button>
                </div>
              )}
              {custId&&<div style={{color:"#ccc",fontSize:"0.8em"}}>{`Customer: ${name||email||mobileNo}`}</div>}
            </div>
          </div>

          <div
            className="footer"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
              position: "relative",
              height: "30vh",
            }}
          >
            {containedIndex === 1 ? (
              ""
            ) : (
              <div>
                <PaymentOptions
                  handlePaymentClick={handlePaymentClick}
                  handlePayMode={handlePayMode}
                  // paymentIndex={paymentIndex}

                  setPayModeIndx={setPayModeIndx}
                  paymentIndex={payModeIndx}
                  order={order}
                  closeParentDialog={() => setPayModeSelectDialog(false)}
                />
              </div>
            )}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "absolute",
                bottom: "30%",
              }}
            >
              <CancelIcon onClick={resetStates} color="error" />

              {/* Conditionally render Resume or Save button */}
              {order && Object.keys(order).length >= 1 ? (
                <Button
                  variant="outlined"
                  className="btn-border"
                  onClick={handleHold}
                  disabled={!order}
                >
                  {t({ id: "save" })}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  className="btn-border"
                  onClick={()=>setHoldOpen(true)}
                >
                  {t({ id: "resume" })}
                </Button>
              )}

              {containedIndex === 3 ||
              containedIndex === 0 ||
              containedIndex === 2 ? (
                <Button
                  variant="contained"
                  disabled={!order || !order.orderItems.length}
                  id="btn"
                  onClick={createOrder}
                >
                  Finish Order
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disabled={!order || !selectedTable}
                  id="btn"
                  onClick={finishOrder}
                >
                  {"Send To Kitchen"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const showProductsCard = () => {
    return (
      <div className="product_container">
        {productItems.length ? (
          productItems.map((p) => {
            return (
              <>
                <Card onClick={() => handleProduct(p)} className="product">
                  <CardActionArea
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexWrap: "wrap",
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt={p.name}
                      onError={imageOnErrorHandler}
                      image={p.image}
                      className="img-product"
                    />

                    <CardContent className="cardFooter">
                      <Box className="foot">
                        <Typography variant="h6" component="p" className="txtf">
                          {p.name}
                        </Typography>
                        <b style={{ fontSize: "0.7em" }}>
                          {selectedCurrency} {p.price}
                        </b>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </>
            );
          })
        ) : (
          <h5 className="text-danger">{"No Item Found"}</h5>
        )}
      </div>
    );
  };
  const orderHold = localStorage.getItem("ordersOnHold");
  const orderHoldData = orderHold ? JSON.parse(orderHold) : "";

  return (
    <div
      className="main_po"
      style={
        isleftAlign
          ? { flexDirection: "row-reverse" }
          : { flexDirection: "row" }
      }
    >
      <div style={{ display: "inline-block" }} className="orderlist">
        {showOrdersItems()}
        <style>
          {`
                @media (orientation: portrait) {
                    .orderlist {
                        display: ${
                          showOrders ? "block !important" : "none !important"
                        };
                    }
                }
                `}
        </style>
      </div>
      {billPrint && (
        <BillPrint orderDetails={getOrderPrintDetails()} setBillPrint={setBillPrint} />
      )}

      <div
        style={showProducts ? { display: "inline-block" } : { display: "none" }}
        className="productslist"
      >
        {showCategories()}

        <div
          style={{
            display: "flex",
            marginTop: "10px",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "inline-block",
              marginLeft: "10px",
              width: "50%",
            }}
          >
            <Button
              onClick={handleCustomerDetail}
              id="butt"
              style={{ display: "flex", fontSize: "1em" }}
            >
              <PermContactCalendarIcon />
              <span> {t({ id: "customer" })}</span>
            </Button>
          </div>
          <div
            style={
              containedIndex === 1
                ? {
                    display: "inline-block",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }
                : { display: "none", marginLeft: "10px" }
            }
          >
            
            <Button onClick={handleTableDetail} id="butt">
              <TableBarIcon />
              <span style={{ fontSize: "2em" }}> {'#'+selectedTable}</span>
            </Button>
          </div>

          <div className="search">
            <SearchIcon />
            <input
              type="text"
              className="search_input"
              placeholder="Search Item"
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="products-epos-list">{showProductsCard()}</div>
      </div>
      <span id="bar" onClick={handleOrder}>
        <span className="cart_count">{itemCount}</span>
        <ShoppingBagIcon sx={{ cursor: "pointer", color: "white" }} />
      </span>
      {selectedProduct && showdialogForAddons()}

    
      <Dialog open={tableDetail} fullWidth={true} maxWidth={500}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          SELECT TABLE
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon
            onClick={() => {
              cancelTable();
            }}
          />
        </IconButton>
        {tableData.length ? (
          <ul id="ul-list">
            {tableData.filter(tb => tb.isAvailable).map((tab) => (
              <li
                key={tab.number}
                onClick={() => handleTableChange(tab.number)}
                className={`table-Select ${tab.isAvailable ? "green" : "red"}`}
              >
                <TableBarIcon />
                <h3
                  style={{ display: "block", textAlign: "center" }}
                >{`Table# ${tab.number}`}</h3>
                <label>{`Capacity: ${tab.capacity}`}</label>
                <label>{`${tab.notes}`}</label>
                {tab.isServiceCall ? (
                  <b style={{ fontSize: "0.8", color: "red" }}>"CALLING"</b>
                ) : (
                  ""
                )}
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}

        <div style={{ margin: "10px", textAlign: "end" }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              cancelTable();
            }}
          >
            {"Cancel"}
          </Button>
        </div>
      </Dialog>

      <Dialog
        onClose={() => setEditPriceDialog(null)}
        open={editPriceDialog ? true : false}
        maxWidth="xs"
        fullWidth={false}
      >
        <PriceUpdateDialog
          orderItems={orderItem}
          oItemIndx={editPriceDialog}
          closeDialog={setEditPriceDialog}
          updateOrder={updateOrderDetails}
        />
      </Dialog>

      <Dialog
        onClose={() => setProOpen(false)}
        open={proOpen}
        maxWidth="xs"
        fullWidth={true}
      >
        <div style={{ padding: "0px", height: "100%" }}>
          {selectPro ? (
            <div className="pro_item">
              <img
                src={
                  selectPro.image === ""
                    ? "../images/blank.jpeg"
                    : selectPro.image
                }
                onError={imageOnErrorHandler}
                style={{ width: "100%", height: "150px", borderRadius: "8px" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  fontSize: "20px",
                }}
              >
                <h5>{selectPro.name}</h5>
                <span>
                  {SelectCurrency}
                  {selectPro.price}
                </span>
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              className="btn btn-danger btn-small m-2"
              onClick={() => {
                setSelectPro();
                setProOpen(false);
              }}
            >
              {"Close"}
            </button>
            <button className="btn btn-info btn-small m-2" onClick={handleItem}>
              {"Add"}
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        onClose={() => setHoldOpen(false)}
        open={holdOpen}
        maxWidth="xs"
        fullWidth={true}
      >
        <div style={{ padding: "10px", height: "100%" }}>
          <h4 style={{ margin: "10px", textAlign: "center" }}>
            {" "}
            ORDERS ON HOLD
          </h4>
          {orderHold && orderHoldData && orderHoldData.length
            ? orderHoldData
                .filter((ordHold) => !ordHold.isDelivered && !ordHold.isPaid)
                .map((ordHold, index) => (
                  <div className="pro_item" key={index}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "16px",
                        margin: "10px 0",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Customer Name */}
                      <div style={{ flex: 2, fontWeight: "bold" }}>
                        {"Table/Customer "}{ordHold.customerName ||
                          ordHold.customerPhone || ordHold.number ||
                          index}
                      </div>

                      {/* Price */}
                      <div style={{ flex: 1, textAlign: "center" }}>
                        {selectedCurrency}
                        {ordHold.discountType === "price"
                          ? (
                              ordHold.totalPrice - ordHold.discountAmount
                            ).toFixed(2)
                          : (
                              ordHold.totalPrice -
                              (ordHold.totalPrice * ordHold.discountAmount) /
                                100
                            ).toFixed(2)}
                      </div>

                      {/* ❌ Cancel Button */}
                      <div>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleCancelOrd(ordHold.customerId)}
                        >
                          X
                        </Button>
                      </div>

                      {/* Resume Button */}
                      <div>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            resumeOrder(ordHold.customerId, ordHold.number)
                          }
                        >
                          {t({ id: "resume" })}
                        </Button>
                      </div>
                    </div>

                    {/* 🕒 Timestamp below */}
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        textAlign: "right",
                      }}
                    >
                      {ordHold.timestamp}
                    </div>
                  </div>
                ))
            : ""}
        </div>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message="Order Added Successfully!"
      />
    </div>
  );
};

export default Epos;
