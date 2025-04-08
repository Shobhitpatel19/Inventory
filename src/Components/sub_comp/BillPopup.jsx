import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Button,
  Box,
} from "@mui/material";
import { Close, Check, Clear } from "@mui/icons-material";
import axios from "axios";
import configs from "../../Constants";
import Currencies from "../Currencies";

const BillPopup = ({ open, onClose, billDetails }) => {
  const [discountType, setDiscountType] = useState("discount");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [finalTotal, setFinalTotal] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState();

  // New states for the print/generate bill functionality.
  const [orderData, setOrderData] = useState(null);
  const [billPrint, setBillPrint] = useState(false);

  let baseURL = configs.baseURL;
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";

  let currency = Currencies.filter(
    (curen) => curen.abbreviation == merchantData.currency
  );

  useEffect(() => {
    if (billDetails) {
      setFinalTotal(
        billDetails.totalPrice +
          (billDetails.discountAmount || 0)
      );
    }
  }, [billDetails]);

  console.log("final total" , finalTotal);

  if (!billDetails) return null;

  // Discount/coupon functions
  const handleDiscountTypeChange = (event) => {
    setDiscountType(event.target.value);
    setDiscountAmount(0);
    setCouponCode("");
  };

  const handleDiscountChange = (e) => {
    let discountValue = parseFloat(e.target.value) || 0;
    if (discountValue < 0) discountValue = 0;
    if (discountValue > 100) discountValue = 100;
    setDiscountAmount(discountValue);
  };

  const applyDiscount = async () => {
    let newTotal = billDetails.totalPrice;
    let appliedDiscount = 0;
    let appliedDiscountType = "";

    if (discountType === "discount") {
      // Calculate discount as a percentage of newTotal
      appliedDiscount = (newTotal * discountAmount) / 100;
      appliedDiscount = parseFloat(appliedDiscount.toFixed(2));
      console.log("new",appliedDiscount);
      appliedDiscountType = `discount`;
    } else if (discountType === "coupon") {
      appliedDiscountType = `Coupon`;
      if (couponCode === "SAVE50") {
        appliedDiscount = 50;
      } else if (couponCode === "SAVE100") {
        appliedDiscount = 100;
      } else {
        alert("Invalid Coupon Code!");
        return;
      }
    }

    newTotal -= appliedDiscount;
    newTotal = parseFloat(newTotal.toFixed(2));
    console.log("newTotal", newTotal);
    setFinalTotal(newTotal > 0 ? newTotal : 0);

    const updatedBill = {
      ...billDetails,
      discountAmount: appliedDiscount,
      discountType: appliedDiscountType  ,
      taxPrice: billDetails.taxPrice,
    };

    const orderId = billDetails.id;
    try {
      const response = await axios.put(
        `${baseURL}/api/orders/${orderId}?merchantCode=${merchCode}`,
        updatedBill
      );
      console.log("Order Updated:", response.data);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order!");
    }
  };

  const resetDiscount = () => {
    setDiscountAmount(0);
    setCouponCode("");
    setFinalTotal(billDetails.totalPrice + billDetails.taxPrice);
  };

  const summaryPath1 = (orderDetails, invoicePath) => {
    const fullName = userData ? userData.name : "";
    const address = userData?.address || merchantData?.address || "";
    const cgst = merchantData?.taxPerc || 0;
    const currencyAbbr = currency.length && currency[0].abbreviation;
  
    const summaryUrl = `${
      window.location.origin
    }/billPrint?serve_url=${baseURL}&orderId=${orderDetails?.id}&merchantCode=${
      merchCode || ""
    }&currency=${currencyAbbr}&restaurant=${fullName}&address=${address}&cgst=${cgst}&invoice_no=${invoicePath}`;
  
    window.location.href = summaryUrl;
  };

  // const handleGenerateBill = async () => {
  //   console.log("Generating Bill");
  //   console.log(billDetails);
  //   const currency = "INR";
  //   const invoiceNo = `INV-${billDetails.id}`;

  //   const orderId = billDetails.id;
  //   const updatedBill = {
  //     ...billDetails,
  //     discountType : discountType,
  //   };

  //   try {
  //     const response = await axios.put(
  //       `${baseURL}/api/orders/${orderId}?merchantCode=${merchCode}`,
  //       updatedBill
  //     );
  //     console.log("Order Updated:", response.data);
  //   } catch (error) {
  //     console.error("Error updating order:", error);
  //     alert("Failed to update order!");
  //   }


  //   setOrderData({
  //     orderId: billDetails.id,
  //     merchantCode: merchCode,
  //     currency: currency,
  //     restaurant: userData && userData.name ? userData.name : "Restaurant",
  //     address: userData && userData.address ? userData.address : "",
  //     cgst: merchantData && merchantData.taxPerc ? merchantData.taxPerc : 0,
  //     taxPerc: merchantData && merchantData.taxPerc ? merchantData.taxPerc : 0,
  //     invoice_no: invoiceNo,
  //     discountAmount: billDetails.discountAmount,
  //     discountType: billDetails.discountType || "None",
  //     taxPrice: billDetails.taxPrice,
  //     totalPrice: billDetails.totalPrice - billDetails.discountAmount,
      
  //   });

  //   if (!window.PrintInterface) {
  //     console.log("PrintInterface not available:", window.PrintInterface);
  //     sessionStorage.setItem("billing", true);
  //     summaryPath1(billDetails);
  //   } else {
  //     setBillPrint(true);
  //     localStorage.setItem("isPrintCall", "N");
  //   }
  // };

  const handleGenerateBill = async () => {
    console.log("Generating Bill");
  
    const currency = "INR";
    const orderId = billDetails.id;
    const updatedBill = {
      ...billDetails,
      discountType: discountType,
    };
  
    try {
      // Step 1: Update order with discount info
      await axios.put(
        `${baseURL}/api/orders/${orderId}?merchantCode=${merchCode}`,
        updatedBill
      );
  
      // Step 2: Get invoicePath
      const invoiceRes = await axios.get(
        `${configs.payUrl}/api/invoices/${billDetails.invoiceId}`
      );
      const invoicePath = invoiceRes.data.invoicePath;
  
      // Step 3: Prepare orderData (optional for print)
      const preparedOrderData = {
        orderId: billDetails.id,
        merchantCode: merchCode,
        currency: currency,
        restaurant: userData?.name || "Restaurant",
        address: userData?.address || merchantData?.address || "",
        cgst: merchantData?.taxPerc || 0,
        taxPerc: merchantData?.taxPerc || 0,
        invoice_no: invoicePath,
        discountAmount: billDetails.discountAmount,
        discountType: billDetails.discountType || "None",
        taxPrice: billDetails.taxPrice,
        totalPrice: billDetails.totalPrice - billDetails.discountAmount,
      };
      setOrderData(preparedOrderData);
      console.log("Prepared Order Data:", preparedOrderData);
  
      // Step 4: Trigger print or redirect
      if (!window.PrintInterface) {
        sessionStorage.setItem("billing", true);
        summaryPath1({ ...billDetails, discountType }, invoicePath);
        setBillPrint(true);
        localStorage.setItem("isPrintCall", "N");
      }
  
    } catch (error) {
      console.error("Error during bill generation:", error);
      alert("Failed to generate bill!");
    }
  };
  
 
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Bill Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Item Name</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Price (₹)</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billDetails.orderItems?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">₹{item.price}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} align="right">
                  <strong>Tax (₹):</strong>
                </TableCell>
                <TableCell align="right">₹{billDetails.taxPrice}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} align="right">
                  <strong>Apply:</strong>
                </TableCell>
                <TableCell align="right">
                  <Select
                    value={discountType}
                    onChange={handleDiscountTypeChange}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="discount">Discount</MenuItem>
                    <MenuItem value="coupon">Coupon</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
              {discountType === "discount" && (
                <TableRow>
                  <TableCell colSpan={2} align="right">
                    <strong>Discount (%):</strong>
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="text"
                      value={discountAmount}
                      onChange={handleDiscountChange}
                      size="small"
                      variant="outlined"
                      inputProps={{ min: 0, max: 100 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={applyDiscount} color="success">
                              <Check />
                            </IconButton>
                            <IconButton onClick={resetDiscount} color="error">
                              <Clear />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}

              {discountType === "coupon" && (
                <TableRow>
                  <TableCell colSpan={2} align="right">
                    <strong>Coupon Code:</strong>
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      size="small"
                      variant="outlined"
                      placeholder="Enter Code"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={applyDiscount} color="success">
                              <Check />
                            </IconButton>
                            <IconButton onClick={resetDiscount} color="error">
                              <Clear />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell colSpan={2} align="right">
                  <strong>Final Total:</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>₹{finalTotal}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateBill}
        >
          Generate Bill
        </Button>
      </Box>
    </Dialog>
  );
};

export default BillPopup;
