import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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
} from "@mui/material";
import BillPrint from "./BillPrint";
import PaymentOptions from "./sub_comp/PaymentOptions";
import PriceUpdateDialog from "./sub_comp/PriceUpdateDialog";

const Epos = (props) => {
  const [showSelectedData, setShowSelectedData] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

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
  const [selectedTable, setSelectedTable] = useState(null);
  const [editPriceDialog, setEditPriceDialog] = useState(null);
  const [ordId, setOrdId] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);

  const { formatMessage: t, locale, setLocale } = useIntl();
  let authApi = configs.authapi;
  let staticSer = configs.staticSer;

  // state for controlling address dialog
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const handleTableChange = (tabNum) => {
    setSelectedTable(tabNum);
    let tabId = tableData.filter((tab) => tab.number === tabNum);
    console.log(tabId);
    localStorage.setItem("tableId", tabId[0].id);
    setTableDetail(false);
  };

  const handleDiscountMethodSelect = (event) => {
    setSelectedDiscountMethod(event.target.value);
    console.log(event.target.value);
    // setIsDropdownOpen(false)
  };
  const randomNumber = Math.floor(Math.random() * 1000000000);
  const customerID = custId
    ? custId.toString()
    : mobileNo
    ? mobileNo
    : randomNumber.toString();

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
    console.log(AoIndx);
    if (AoIndx != -1) {
      newAdOns.splice(AoIndx, 1);
    } else {
      newAdOns.push(pi);
    }
    setSelAdons(newAdOns);
  };

  let baseURL = configs.baseURL;

  const removeAddons = (itemId) => {
    console.log(itemId);
  };

  let userToken = sessionStorage.getItem("token")
    ? sessionStorage.getItem("token")
    : "";

  const handleOrder = () => {
    //document.getElementById('bar').style.display='none';
    setShowOrders(true);
    setShowProducts(false);
  };
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  console.log(merchantData);
  // merchantData.taxPerc = merchantData.taxPerc || merchantData.takeAwayTax;

  // if (containedIndex == 1) {
  //   merchantData.taxPerc = merchantData.dineinTax;
  // }

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
  console.log(SelectCurrency);

  const userId = userData ? userData.sub : " ";
  const getCatByUser = `${baseURL}/api/categories?merchantCode=${merchCode}`;
  const getProductByUser = baseURL + `/api/products?merchantCode=${merchCode}`;
  const getLatestInvoiceNumber =
    configs.payServer + `/api/invoice/latest/${userId}`;

  let orderDet = JSON.parse(localStorage.getItem("newOrder"));

  const selectedCurrency = (
    <span dangerouslySetInnerHTML={{ __html: SelectCurrency }} />
  );
  console.log(selectedCurrency);

  useEffect(() => {
    if (!categories.length) {
      axios.get(getCatByUser).then((response) => {
        //console.log(response.data);
        setCategories(response.data);
      });
    }

    const query = ref(db, "products/" + merchCode);
    return onValue(query, (snapshot) => {
      console.log("new product update", categories);
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
    //fb listener for orders
  }, []);

  //console.log(categories)
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
    console.log("Incoming product:", p);
    console.log("Existing order:", orderItem);

    let orders = Array.isArray(orderItem) ? [...orderItem] : [];
    let matchFound = false;

    const normalizeAddons = (addons) => {
      if (!addons || !Array.isArray(addons) || addons.length === 0) return null;
      return JSON.stringify(addons);
    };

    const pId = p?.id;
    const pAddons = normalizeAddons(p?.sub_pro?.addons);

    for (let i = 0; i < orders.length; i++) {
      const item = orders[i];

      const itemId = item?.id;
      const itemAddons = normalizeAddons(item?.sub_pro?.addons);

      if (itemId === pId && itemAddons === pAddons) {
        orders[i].quantity += 1;
        matchFound = true;
        break;
      }
    }

    if (!matchFound) {
      const newItem = { ...p, quantity: 1 };
      orders.push(newItem);
    }

    console.log("Updated order:", orders);
    setOrderItem(orders);
    updateOrderDetails(orders);
  };

  const handleProduct = (p) => {
    console.log(p);
    setBillPrint(false);
    if (p.isPriceVariety || p.add_ons || p.cookInstructions) {
      console.log("if running");
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
      console.log("else running");
      addPrductToOrder(p);
    }
  };

  const handleMobileSubmit = () => {
    if (phnumber) {
      // createNewOrder()

      if (existingData != {} && custId != "") {
        axios
          .put(`${authApi}/customer/${custId}`, {
            phone: phnumber,
            firstName: name,
            address: address,
          })
          .then((res) => {
            console.log(res.data);
            setOpenPhone(false);
          });
      } else {
        let data = {
          email: `${phnumber}@menulive.in`,
          phone: phnumber,
          firstName: name,
          lastName: "",
          address: address,
          password: phnumber,
          isEmailVerified: false,
          isPhoneVerified: false,
          referenceDetails: "",
          merchantCode: merchCode,
        };
        axios
          .post(`${authApi}/customer/auth-and-register`, { ...data })
          .then((res) => {
            setCustId(res.data.user.id);
            console.log(res.data);
          });
        setOpenPhone(false);
      }
    }
  };

  const showVarietyBtn = (variety) => {
    if (!Object.keys(variety).length) return;
    let selectedVarArr = Object.keys(selectedVar);
    let selVarArr = selectedVarArr.length
      ? selectedVarArr
      : handleAlignment("", Object.keys(variety)[0]);
    console.log(selVarArr);
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

  console.log(merchantData);

  useEffect(() => {
    if (orderItem && orderItem.length) {
      updateOrderDetails();
    }
  }, [orderItem, containedIndex, discValue, percent]);

  let productItems = isSearch ? filterPro : products;
  console.log("productsItem", productItems);

  const handleAdd = (indx) => {
    order.orderItems[indx].quantity += 1;
    // let item = order.orderItems[indx].map(x => {
    //   if ((x._id ? x._id : x.id) === itemId) {
    //     x.quantity = x.quantity + 1;
    //     subPro.quantity += 1
    //   }
    //   return x
    // });
    setOrderItem(order.orderItems);
  };
  console.log(order);

  const handleRemove = (indx) => {
    console.log("index" + indx);
    let ord = order;
    console.log(ord);
    ord.orderItems[indx].quantity = ord.orderItems[indx].quantity - 1;

    console.log(ord.orderItems);
    let items = ord.orderItems.filter((x) => x.quantity !== 0);
    console.log(items);
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

  console.log("userToken", userToken);
  useEffect(() => {
    axios({
      method: "get",
      url: `${authApi}/user/customers?merchantCode=${merchCode}`,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((res) => {
      console.log("customers", res.data);
      setCustomerData(res.data);
    });
  }, []);

  const updateOrderDetails = (newOrderItem) => {
    console.log(newOrderItem);
    console.log(orderItem);
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
    console.log(merchantData);
    let txPerc = merchantData.taxPerc || merchantData.takeAwayTax;
    let orderType = "Eat In";
    // if (containedIndex == 1) {
    //   // txPerc = merchantData.dineinTax;
    //   txPerc = merchantData.taxPerc
    //   orderType = "Take Away";
    // }
    console.log("----------", txPerc);
    const taxPrice = txPerc
      ? parseFloat((((txPerc / 100) * itemsPrice * 100) / 100).toFixed(2))
      : 0.0;

    let totalPrice = parseFloat(itemsPrice + taxPrice).toFixed(2);

    if (merchantData.isItemInclusiveTax) {
      totalPrice = parseFloat(itemsPrice).toFixed(2);
    }

    console.log(taxPrice);
    const setpro = [addons];
    console.log(selectedDiscountMethod);
    console.log(discValue);

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

  const handleSearchCustomer = async () => {
    if (!phnumber) {
      console.log("📭 No phone number provided.");
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
        // console.log("First matched customer:", firstCustomer);

        setName(firstCustomer.firstName || "");
        setEmail(firstCustomer.email || "");
        setAddress(firstCustomer.address || "");
        setCustId(firstCustomer.id || firstCustomer._id);
      } else {
        console.log("No customers matched.");
      }
    } catch (err) {
      console.log("Search error:", err?.response?.data || err.message);
      setSearchResults([]);
      setIsCustomerFound(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        `${authApi}/user/customers?merchantCode=${merchCode}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setCustomerData(res.data);
      console.log("✅ Customers refreshed:", res.data);
    } catch (err) {
      console.error("❌ Failed to fetch customers:", err);
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
    // setSearchResults([]);
  };

  const handleSaveCustomerSelection = () => {
    if (phnumber) {
      // Set customer details in state
      setMoblileNo(phnumber);
      setName(name);
      setAddress(address);

      // // Initialize or update order object
      // const updatedOrder = {
      //   ...(order || {}), // Create new order if none exists
      //   customerId: custId,
      //   customerPhone: phnumber,
      //   customerName: name,
      //   customerAddress: address,
      //   orderItems: order?.orderItems || [] // Ensure orderItems exists
      // };

      // // Update order state
      // setOrder(updatedOrder);

      // Reset UI states
      setOpenPhone(false);
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

      console.log("Customer added:", res.data);

      setCustId(res.data.id || res.data.user?.id);
      setShowAddressDialog(false);
      await fetchCustomers();
      await handleSearchCustomer();

      setPhnumber("");
      setAddress("");
      setEmail("");
      setName("");
      setSearchResults([])
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

  const handleCancle = () => {
    setOrderItem([]);
    setOrder();
    setPrice();
    setPercent();
    setIsPayment(false);
    setPlaceOrder(true);
    setDialogStep(1);
    setIsDropdownOpen(false);
    setSelectedDiscountMethod("");
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

  useEffect(() => {
    let billData = {};
    billData.userId = merchantData.merchantCode;
    billData.appName = "EPOS";
    billData.payType = "onetime";
    billData.payStatus = "paid";
    // billData.purchaseItems = JSON.stringify(order.orderItems);

    axios.post(`${configs.payUrl}/api/new-order`, billData).then((res) => {
      // console.log(res.data);
      // console.log(res.data.invoiceData._id)
      setInvoiceNo(res.data.invoiceData.invoicePath);
      setInvoiceId(res.data.invoiceData._id);
    });
  }, []);

  console.log("invoiceNo", invoiceNo);
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

  // const createOrder = (e, isOrder, isSaveOrder) => {
  //   if (!order) return;
  //   if (containedIndex == 1) {
  //     console.log(containedIndex);
  //     let tabId = localStorage.getItem("tableId");
  //     order.orderType = "Table Order";
  //     order.number = selectedTable;
  //     order.customerId = customerID;
  //     // order.isPaid = isSaveOrder ? false : true;
  //     order.isPaid = false;
  //     order.isDelivered = order.isPaid;
  //     order.tableId = tabId;
  //     order.invoiceId = invoiceId;
  //     const tabupdate = tableData.filter((tab) => tab.number === selectedTable);
  //     console.log(tabupdate);
  //     if (tabupdate.length > 0) {
  //       tabupdate[0].isAvailable = false;
  //     }
  //     if (tabupdate.length > 0 && !isSaveOrder) {
  //       tabupdate[0].isAvailable = true;
  //     }
  //     if (tabupdate.length > 0) {
  //       axios
  //         .put(
  //           `${baseURL}/api/tables/${tabupdate[0].id}?merchantCode=${
  //             merchantData ? merchantData.merchantCode : " "
  //           }`,
  //           tabupdate[0]
  //         )
  //         .then((res) => {
  //           console.log(res.data);
  //         });
  //       setMoblileNo("");
  //       setSelectedTable("");
  //     }
  //   } else if (containedIndex === 2) {
  //     order.orderType = "Delivery";
  //   } else if (containedIndex === 0) {
  //     order.orderType = "Take Away";
  //     order.isPaid = true;
  //   } else if (containedIndex === 3) {
  //     order.orderType = "Eat In";
  //     order.isPaid = true;
  //   }
  //   order.orderItems = order.orderItems.map((it) => {
  //     console.log(it.sub_pro);
  //     let item = {
  //       _id: it._id,
  //       quantity: it.quantity,

  //       price:
  //         it.price +
  //         (it.sub_pro && it.sub_pro.addons
  //           ? it.sub_pro.addons.reduce((acc, val) => acc + val.price, 0)
  //           : 0),
  //       name: it.name,
  //       sub_pro: JSON.stringify(it.sub_pro),
  //     };
  //     if (order.isDelivered) {
  //       item.status = "delivered";
  //     }
  //     return item;
  //   });
  //   console.log(order);
  //   order.invoiceId = invoiceId;
  //   console.log(invoiceId);
  //   console.log("for checking id",order);

  //   console.log(order.totalPrice);
  //   if (ordId) {
  //     console.log(ordId);
  //     console.log(order.totalPrice);
  //     const updateOrder = async () => {
  //       try {
  //         await axios.put(
  //           `${baseURL}/api/orders/${ordId}?userId=${
  //             merchantData ? merchantData.merchantCode : " "
  //           }`,
  //           order
  //         );
  //         console.log("Order updated successfully.");
  //       } catch (error) {
  //         console.error("Error updating order:", error);
  //       }
  //     };

  //     updateOrder();
  //   } else {
  //     console.log(order);
  //     order.discountType = selectedDiscountMethod;
  //     order.discountAmount = parseFloat(discValue);
  //     axios
  //       .post(
  //         `${baseURL}/api/orders?userId=${
  //           merchantData ? merchantData.merchantCode : " "
  //         }`,
  //         order
  //       )
  //       .then((res) => {
  //         setOrdId(res.data.id);
  //         console.log(res.data);
  //         setSnackbarOpen(true);
  //         setOrderItem();
  //         setOrder();
  //         const savedOrder = { ...res.data, localOrderId: res.data.id };
  //         localStorage.setItem("newOrder", JSON.stringify(savedOrder));
  //         if (order.orderType === "Table Order") {
  //           let holdOrders = JSON.parse(localStorage.getItem("orderOnHold")) || [];
  //           holdOrders.push(savedOrder);
  //           localStorage.setItem("orderOnHold", JSON.stringify(holdOrders));
  //         }
  //         if (!isOrder) {
  //           // if (!PrintInterface) {
  //           if (!window.PrintInterface) {
  //             //console.log(window.PrintInterface);
  //             sessionStorage.setItem("billing", true);
  //             summaryPath1(res.data);
  //           } else {
  //             setBillPrint(true);
  //             setOrdId("");
  //             localStorage.setItem("isPrintCall", "N");
  //           }
  //         }
  //       });
  //   }
  //   console.log(isOrder);
  //   setOrderItem();
  //   setOrder();
  //   setShowOrders(false);
  //   setShowProducts(true);
  //   setItemCount(0);
  //   setOrdId();
  //   // sessionStorage.setItem("billing", true);
  //   // summaryPath1();
  //   setPrice();
  //   setPercent();
  //   setDialogStep(3);
  // };

  const createOrder = (e, isOrder, isSaveOrder) => {
    if (!order) return;

    const currentOrdId = ordId || localStorage.getItem("ordId");

    // 1️⃣ Set order type and table-specific details
    if (containedIndex === 1) {
      let tabId = localStorage.getItem("tableId");
      order.orderType = "Table Order";
      order.number = selectedTable;
      order.customerId = customerID;
      order.isPaid = false;
      order.isDelivered = false;
      order.tableId = tabId;
      order.invoiceId = invoiceId;

      const tabupdate = tableData.find((tab) => tab.number === selectedTable);
      if (tabupdate) {
        tabupdate.isAvailable = !isSaveOrder;
        axios
          .put(
            `${baseURL}/api/tables/${tabupdate.id}?merchantCode=${
              merchantData?.merchantCode || " "
            }`,
            tabupdate
          )
          .then((res) => console.log("✅ Table updated:", res.data));
      }
    } else if (containedIndex === 2) {
      order.orderType = "Delivery";
    } else if (containedIndex === 0) {
      order.orderType = "Take Away";
      order.isPaid = true;
    } else if (containedIndex === 3) {
      order.orderType = "Eat In";
      order.isPaid = true;
    }

    // 2️⃣ Format order items
    order.orderItems = order.orderItems.map((it) => ({
      _id: it._id,
      quantity: it.quantity,
      price:
        it.price +
        (it.sub_pro?.addons?.reduce((acc, val) => acc + val.price, 0) || 0),
      name: it.name,
      status: it.status ? it.status : "inProgress",
      sub_pro: JSON.stringify(it.sub_pro),
      ...(order.isDelivered && { status: "delivered" }),
    }));

    order.invoiceId = invoiceId;
    order.discountType = selectedDiscountMethod;
    order.discountAmount = parseFloat(discValue);

    // 3️⃣ Update or create order
    const orderCallback = (resData, isUpdate = false) => {
      const newId = resData.id;
      const savedOrder = { ...resData, localOrderId: newId };

      if (order.orderType === "Table Order" && !order.isPaid) {
        const holdOrders = JSON.parse(
          localStorage.getItem("orderOnHold") || "[]"
        );

        // Remove any existing order with same customerId or localOrderId
        const filtered = holdOrders.filter(
          (o) => o.customerId !== order.customerId && o.localOrderId !== newId
        );

        filtered.push({
          ...order,
          localOrderId: newId,
          timestamp: new Date().toLocaleString(),
        });

        localStorage.setItem("orderOnHold", JSON.stringify(filtered));
      }

      // ✅ Remove from hold if payment done
      if (order.isPaid && order.orderType === "Table Order") {
        const holdOrders = JSON.parse(
          localStorage.getItem("orderOnHold") || "[]"
        );
        const remaining = holdOrders.filter(
          (o) => o.customerId !== order.customerId
        );
        localStorage.setItem("orderOnHold", JSON.stringify(remaining));
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

      // Reset UI
      setOrderItem([]);
      setOrder(null);
      setOrdId("");
      localStorage.removeItem("ordId");
      setShowOrders(false);
      setShowProducts(true);
      setItemCount(0);
      setPrice();
      setPercent();
      setDialogStep(3);
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
          orderCallback(res.data, false);
        })
        .catch((err) => console.error("❌ Order creation failed:", err));
    }
  };

  const finishOrder = async () => {
    if (containedIndex === 1 && mobileNo) {
      let data = {
        email: `${mobileNo}@menulive.in`,
        phone: mobileNo,
        firstName: name ? name : "No Name",
        lastName: "",
        address: address,
        password: mobileNo,
        isEmailVerified: false,
        isPhoneVerified: false,
        referenceDetails: "",
        merchantCode: merchCode,
      };
      try {
        const res = await axios.post(
          `${authApi}/customer/auth-and-register`,
          data
        );
        console.log(res.data);
        setCustId(res.data.user.id);
      } catch (err) {
        console.error("Registration error:", err);
      }
    }

    if (order) {
      order.discountType = selectedDiscountMethod;
      order.discountAmount = parseFloat(discValue);
      order.invoiceId = invoiceId;
      const timestamp = new Date().toLocaleString();
      order.timestamp = timestamp;

      if (containedIndex === 1 && selectedTable !== "") {
        tableData.isAvailable = "false";
        let isOrderwithPrint = true;
        createOrder(null, isOrderwithPrint, true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

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
    } else {
      alert("Please Add An Order");
    }
  };

  const handleHold = () => {
    if (containedIndex === 1 && mobileNo) {
      let data = {
        email: `${mobileNo}@menulive.in`,
        phone: mobileNo,
        firstName: name ? name : "No Name",
        lastName: "",
        address: address,
        password: mobileNo,
        isEmailVerified: false,
        isPhoneVerified: false,
        referenceDetails: "",
        merchantCode: merchCode,
      };
      axios
        .post(`${authApi}/customer/auth-and-register`, {
          ...data,
        })
        .then((res) => {
          console.log(res.data);
          setCustId(res.data.user.id);
        });
    }
    console.log(order);

    if (order) {
      console.log(order);
      console.log(discValue);
      order.number = selectedTable;
      order.discountType = selectedDiscountMethod;
      order.discountAmount = parseFloat(discValue);
      let orderOnHold = localStorage.getItem("orderOnHold");
      const timestamp = new Date().toLocaleString();
      order.timestamp = timestamp;
      if (containedIndex === 1 && selectedTable != "") {
        console.log(tableData);
        tableData.isAvailable = "false";
        let isOrderwithPrint = true;
        // createOrder(null, isOrderwithPrint, true);
      }
      if (orderOnHold) {
        orderOnHold = JSON.parse(orderOnHold);
        orderOnHold.push(order);
        localStorage.setItem("orderOnHold", JSON.stringify(orderOnHold));
      } else {
        localStorage.setItem("orderOnHold", JSON.stringify([order]));
      }
      if (containedIndex === 1) {
        order.orderType = "Table Order";
      } else if (containedIndex === 0) {
        order.orderType = "Take Away";
      } else if (containedIndex === 2) {
        order.orderType = "Delivery";
      } else {
        order.orderType = "Eat In";
      }

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
    } else {
      alert("Please Add An Order");
    }
  };

  useEffect(() => {
    if (containedIndex === 1) {
      axios
        .get(`${baseURL}/api/tables?merchantCode=${merchCode}`)
        .then((res) => {
          setTableData(res.data.filter((tab) => tab.isAvailable === true));
          //setTableData(res.data);
        });
    }
  }, [containedIndex === 1]);

  console.log("tables available", tableData);

  // const handlepostResume = (customerId, tabNumber) => {
  //   console.log("just checking",customerId, tabNumber);
  //   handleClick(1);
  //   // handleDineIn();
  //   // handleTableDetail();
  //   const orderResume = JSON.parse(localStorage.getItem("orderOnHold"));
  //   const ppostResume = orderResume.find(
  //     (ordRes) => ordRes.customerId === customerId
  //   );
  //   console.log(ppostResume);
  //   const index = orderResume.findIndex(
  //     (ordRes) => ordRes.customerId === customerId
  //   );

  //   if (ppostResume && index !== -1) {
  //     setOrder(ppostResume);
  //     setOrderItem(ppostResume.orderItems);
  //     setOrdId(ppostResume.localOrderId); // ✅ Restore backend order ID here
  //     setSelectedTable(tabNumber);

  //     orderResume.splice(index, 1);
  //     localStorage.setItem("orderOnHold", JSON.stringify(orderResume));
  //     setHoldOpen(false);
  //   }else {
  //     console.error("Unable to find order for user:", userId);
  //   }
  // };

  const handlepostResume = (customerId, tabNumber) => {
    console.log("just checking", customerId, tabNumber);
    handleClick(1);

    const orderResume = JSON.parse(localStorage.getItem("orderOnHold")) || [];
    const ppostResume = orderResume.find(
      (ordRes) => ordRes.customerId === customerId
    );

    const index = orderResume.findIndex(
      (ordRes) => ordRes.customerId === customerId
    );

    if (ppostResume && index !== -1) {
      setOrder(ppostResume);
      setOrderItem(ppostResume.orderItems);

      const restoredOrderId = ppostResume.localOrderId || ppostResume.id;
      console.log("Resumed order ID:", restoredOrderId);
      setOrdId(restoredOrderId);

      setSelectedTable(tabNumber);
      setHoldOpen(false);
    } else {
      console.error("Unable to find order for user:", customerId);
    }
  };

  const handleCancelord = (customerId) => {
    const orderResume = JSON.parse(localStorage.getItem("orderOnHold"));

    const index = orderResume.findIndex(
      (ordRes) => ordRes.customerId === customerId
    );

    if (index !== -1) {
      orderResume.splice(index, 1);
      localStorage.setItem("orderOnHold", JSON.stringify(orderResume));
      setHoldOpen(false);
    } else {
      console.error("Order not found for customerId:", customerId);
    }
  };

  const handleResume = () => {
    console.log("resume");
    setHoldOpen(true);
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
    console.log(mode);
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
    console.log(selectedDiscountMethod);

    if (selectedDiscountMethod === "percentage") {
      const taxPrice = order.totalPrice * (valuedisc / 100);
      const percent = order.totalPrice - taxPrice;
      const formattedPercent = percent.toFixed(2); // Display percent with 2 decimal places
      console.log(formattedPercent);
      setPercent(parseFloat(formattedPercent)); // Set the value as a number
    } else {
      const discValue = order.totalPrice - valuedisc;
      const formattedDiscValue = discValue.toFixed(2); // Display discount value with 2 decimal places
      setPrice(parseFloat(formattedDiscValue)); // Set the value as a number
      console.log(order.totalPrice);
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
  console.log(order);

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
  const handleClick = (index) => {
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
  console.log(order);

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
                    handleClick(3);
                  }}
                >
                  {t({ id: "Eat In" })}
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
                    handleClick(0);
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
                    handleClick(1);
                    handleDineIn();
                    handleTableDetail();
                  }}
                >
                  {t({ id: "Table Order" })}
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
                    handleClick(2);
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
                <DialogTitle id="titorder" style={{ textAlign: "center" }}>
                  <b>Enter Customer Details</b>
                </DialogTitle>
                <h4 style={{ margin: "10px" }}>Enter Mobile Number:</h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "5px",
                  }}
                >
                  {/* <input
                    type="text"
                    placeholder="Enter Mobile"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only digits
                      if (/^\d*$/.test(value)) {
                        setPhnumber(value);
                      }
                    }}
                    value={phnumber}
                    className="number_input"
                    style={{
                      padding: "5px",
                      marginLeft: "10px",
                      width: "70%",
                      fontSize: "1.2em",
                    }}
                    inputMode="numeric" // for mobile numeric keypad
                    pattern="[0-9]*"
                  /> */}

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
                    style={{
                      padding: "5px",
                      marginLeft: "10px",
                      width: "70%",
                      fontSize: "1.2em",
                    }}
                  />

                  {/* <button
                    onClick={() => handleSearchCustomer()}
                    style={{
                      margin: "10px",
                      borderRadius: "10px",
                      background: "#000",
                      color: "#fff",
                    }}
                  >
                    <SearchIcon />
                  </button> */}

                  <button
                    onClick={handleSearchCustomer}
                    style={{
                      margin: "10px",
                      borderRadius: "10px",
                      background: "#000",
                      color: "#fff",
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
                        >
                          <input
                            type="radio"
                            id={customer.id || customer._id}
                            name="customerSelect"
                            onChange={() => handleCustomerSelect(customer)}
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
                        marginTop: "8px",
                        borderRadius: "4px",
                        marginLeft: "10px",
                        marginRight: "10px",
                      }}
                    >
                      Customer not found
                    </div>

                    <div style={{ padding: "20px" }}>
                      <h3>Add Delivery Address:</h3>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Delivery Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        variant="outlined"
                        style={{ marginBottom: "20px" }}
                      />
                    </div>
                  </>
                )}

                <div
                  style={{
                    display: "flex",
                    padding: "10px",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancel}
                  >
                    Close
                  </Button>

                  {searchAttempted && searchResults.length === 0 && (
                    <Button
                      variant="contained"
                      color="primary"
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
              </Dialog>

              {/* <Dialog 
  open={showAddressDialog} 
  onClose={() => setShowAddressDialog(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>Add Delivery Address</DialogTitle>
  <div style={{ padding: "20px" }}>
    <TextField
      fullWidth
      multiline
      rows={3}
      label="Delivery Address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      variant="outlined"
      style={{ marginBottom: "20px" }}
    />
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
      <Button 
        variant="outlined" 
        onClick={() => setShowAddressDialog(false)}
      >
        Cancel
      </Button>
    </div>
  </div>
</Dialog> */}
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
                        console.log(subProArray);
                        const subProNames =
                          subProArray && subProArray.addons
                            ? subProArray.addons.map((subPro) => subPro.name)
                            : [];
                        const subVariety = subProArray
                          ? subProArray.variety
                          : "";
                        console.log(order);
                        console.log(subVariety);
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
                                  >
                                    <RemoveIcon />
                                  </button>
                                  <span style={{ margin: "0px 8px" }}>
                                    {item.quantity}
                                  </span>
                                  <button
                                    className="add_btn"
                                    onClick={() => handleAdd(indx)}
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
                      {order ? order.taxPrice.toFixed(2) : " "}
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
              <CancelIcon onClick={handleCancle} color="error" />

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
                  onClick={handleResume}
                >
                  {t({ id: "resume" })}
                </Button>
              )}

              {containedIndex === 3 ||
              containedIndex === 0 ||
              containedIndex === 2 ? (
                <Button
                  variant="contained"
                  disabled={!order}
                  id="btn"
                  onClick={createOrder}
                >
                  Finish Order
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disabled={!order || selectedTable === null}
                  id="btn"
                  onClick={finishOrder}
                >
                  {containedIndex === 1 ? "Send Order" : "Finish Order"}
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
  console.log(isleftAlign);
  const orderHold = localStorage.getItem("orderOnHold");
  const orderHoldData = orderHold ? JSON.parse(orderHold) : "";
  // console.log(orderHoldData);
  // console.log(billPrint);
  // console.log('selectedTable here',selectedTable);

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
        <BillPrint orderDetails={orderData} setBillPrint={setBillPrint} />
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
              style={{ display: "flex", fontSize: "10px" }}
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
            <span
              style={
                selectedTable
                  ? { display: "block", fontSize: "10px" }
                  : { display: "none" }
              }
            >
              {t({ id: "table_number" })} {selectedTable}
            </span>
            <Button onClick={handleTableDetail} id="butt">
              <TableBarIcon />
              <span style={{ fontSize: "10px" }}>Table</span>
            </Button>
          </div>
          <div
            style={
              containedIndex === 2
                ? { display: "inline-block", marginLeft: "10px" }
                : { display: "none", marginLeft: "10px" }
            }
          >
            <Button color="success" onClick={handleEdit}>
              Edit Customer Info
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

      <Dialog
        open={customerDetail}
        style={{ zIndex: 2132321, width: "50% !important" }}
      >
        <div>
          {customerDetail && (
            <div style={{ padding: "20px" }}>
              <header>
                <h3>{"Customer Details"}</h3>
              </header>
              <input
                type="text"
                placeholder="Customer"
                onChange={(e) =>
                  e.target.value > 3 && setMoblileNo(e.target.value)
                }
                value={mobileNo || name}
                style={{
                  display: "block",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  padding: "5px",
                  borderRadius: "20px",
                }}
              />
              <footer style={{ margin: "10px", textAlign: "end" }}>
                <Button
                  variant="contained"
                  className={"btnDialog-Fill"}
                  onClick={() => {
                    cancelCustomer();
                  }}
                >
                  {"Ok"}
                </Button>
              </footer>
            </div>
          )}
        </div>
      </Dialog>

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
            {tableData.map((tab) => (
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
        <div style={{ padding: "0px", height: "100%" }}>
          <h4 style={{ margin: "10px", textAlign: "center" }}>
            {" "}
            ORDERS ON HOLD
          </h4>
          {orderHold && orderHoldData && orderHoldData.length
            ? orderHoldData
                .filter((ordHold) => ordHold.isDelivered === false)
                .map((ordHold) => (
                  <div className="pro_item" key={ordHold.userId}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        fontSize: "20px",
                      }}
                    >
                      <span>{ordHold.number}</span>
                      <span>
                        {selectedCurrency}
                        {ordHold.discountType === "price" ||
                        ordHold === "discount"
                          ? ordHold.totalPrice - ordHold.discountAmount
                          : ordHold.totalPrice -
                            (ordHold.totalPrice * ordHold.discountAmount) / 100}
                      </span>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleCancelord(ordHold.customerId)}
                      >
                        X
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handlepostResume(ordHold.customerId, ordHold.number)
                        }
                      >
                        {t({ id: "resume" })}
                      </Button>
                    </div>
                    <span style={{ fontSize: "small" }}>
                      {ordHold.timestamp}
                    </span>
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
