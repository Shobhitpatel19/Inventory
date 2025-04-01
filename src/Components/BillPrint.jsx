import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import configs, { getParameterByName } from "../Constants";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Currencies from "./Currencies";
import { useIntl } from "react-intl";

function BillPrint(props) {
  console.log(props);
  const [loading, setLoading] = useState(true);
  const [print, setPrint] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const orderId = props.orderDetails
    ? props.orderDetails.orderId
    : getParameterByName("orderId");
  const currency = props.orderDetails
    ? props.orderDetails.currency
    : getParameterByName("currency");
  const restaurant = props.orderDetails
    ? props.orderDetails.restaurant
    : getParameterByName("restaurant");
  let address = props.orderDetails
    ? props.orderDetails.address
    : getParameterByName("address");

  const cgst = getParameterByName("cgst");
  const nssi = getParameterByName("nssi");
  console.log("props details",  props.orderDetails);
  const invoiceNo = props.orderDetails
    ? props.orderDetails.invoice_no
    : getParameterByName("invoice_no");
  const merchantCode = props.orderDetails
    ? props.orderDetails.merchantCode
    : getParameterByName("merchantCode");
  const baseURL = configs.baseURL;
  // let taxPerc = props.orderDetails.orderType.toLowerCase()=='eat in'? (taxPercent || dineinTax): (taxPercent || takeAwayTax);

  const { formatMessage: t, locale, setLocale } = useIntl();
  // const [canvasUrl, setCanvasUrl] = useState(null);
  const billRef = useRef(null);
  useEffect(() => {
    if (orderId) {
      const getBill = `${baseURL}/api/orders/${orderId}?merchantCode=${merchantCode}`;
      axios.get(getBill).then((response) => {
        setOrderDetails(response.data);
        setLoading(false);
      });
    }
  }, [orderId, merchantCode, baseURL]);

  useEffect(() => {
    console.log(props.orderDetails);
    let isPrinted = localStorage.getItem("isPrintCall");
    if (props.orderDetails && isPrinted === "N" && !loading) {
      let printDetails = {};
      printDetails.tokenNo = "Token #" + orderDetails.number;
      printDetails.merchant = restaurant;
      printDetails.invoiceNo = t({ id: "invoice" }) + "#:" + invoiceNo;
      printDetails.date = moment(orderDetails.createdAt).format(
        "DD-MM-YYYY h:mm a"
      );
      printDetails.header1 = t({ id: "items" });
      printDetails.header2 = t({ id: "quantity" });
      printDetails.header3 = t({ id: "amount" });
      printDetails.orderItems = [];
      //printDetails.currencyIcon=<CurrencySymbol/>;
      printDetails.currency = currency;
      printDetails.address = address;
      printDetails.subTotal =
        t({ id: "amount" }) +
        " " +
        currency +
        " " +
        (orderDetails.totalPrice - orderDetails.taxPrice).toFixed(2);
      printDetails.tax =
        t({ id: "tax" }) +
        "(" +
        props.orderDetails.taxPerc +
        "%) " +
        orderDetails.taxPrice.toFixed(2);
      printDetails.total =
        t({ id: "total" }) +
        ": " +
        currency +
        " " +
        orderDetails.totalPrice.toFixed(2);

      let AddorderItems =
        orderDetails &&
        orderDetails.orderItems &&
        orderDetails.orderItems.map((item, index) => {
          const subProArray = item.sub_pro && JSON.parse(item.sub_pro);
          item.price = item.price;
          printDetails.orderItems.push(item);
        });

      localStorage.setItem("isPrintCall", "Y");
      let bill = document.getElementById("bill");
      console.log(bill);
      if (bill) {
        //html2canvas(bill).then((canvas) => {
        //const canvasUrl = canvas.toDataURL("image/png");
        //const base64Image = canvasUrl.split(",")[1];
        console.log(printDetails);
        window.PrintInterface.print(JSON.stringify(printDetails));
        localStorage.setItem("isPrintCall", "N");
        props.setBillPrint(false);
        // }).catch(error => {
        //   console.error("Error capturing the bill:", error);
        // });
      }
    }
  }, [loading]);

  function handlePrint() {
    setPrint(false);

    const printButtonContainer = document.getElementById("print-container");
    if (printButtonContainer) {
      printButtonContainer.style.display = "none";
    }

    // if (window.PrintInterface && typeof window.PrintInterface.print === 'function') {
    if (window.PrintInterface) {
      window.PrintInterface.print();
      console.log("mobile");
    } else {
      console.log("No print support");
      window.print();
    }
  }

  function curSymbol() {
    let cur = Currencies.filter(
      (curen) => curen.abbreviation == currency.toUpperCase()
    );
    console.log(cur);
    return cur.length && cur[0].symbol;
  }

  const handleBack = () => {
    let isMerchant = sessionStorage.getItem("isMerchant");
    sessionStorage.setItem("billing", false);
    console.log(isMerchant);
    if (isMerchant) {
      window.location.href = `/epos?merchantCode=${merchantCode}`;
    } else {
      window.location.href = "/epos";
    }
  };

  const renderCurrencySymbol = () => {
    return <span dangerouslySetInnerHTML={{ __html: curSymbol() }} />;
  };
  //const [addressPart, gstPart, fssaiPart] = address
  const bodystyle = props.orderDetails
    ? { position: "absolute", zIndex: "-1" }
    : {};
  console.log(orderDetails);
  return (
    <div style={bodystyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ArrowBackIcon onClick={handleBack} style={{ marginLeft: "10px" }} />
        <div
          id="print-container"
          style={
            print
              ? {
                  display: "block",
                  textAlign: "left",
                  marginLeft: "180px",
                  marginTop: "10px",
                }
              : { display: "none" }
          }
        >
          <button id="print" onClick={handlePrint}>
            {t({ id: "print" })}
          </button>
        </div>
      </div>

      <div id="bill">
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <img
              id="load"
              style={{ width: "400px", height: "400px", marginLeft: "10px" }}
              src="./billsummary/loading-icon.gif"
            />
          </div>
        ) : (
          <div
            className="container"
            style={{
              textAlign: "left",
              justifyContent: "start",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div id="orderDetails" style={{ textAlign: "center" }}>
              <span
                style={{
                  display: "inline",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                Token:
              </span>
              <h5
                style={{ textAlign: "left", margin: "5px", display: "inline" }}
              >
                #{orderDetails.number}
              </h5>
              <div
                style={{
                  display: "none",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span id="status_chip"> {t({ id: "preparing" })}</span>
              </div>
              <h6
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "bold",
                  margin: "10px",
                }}
              >
                {t({ id: "order_summary" })}
              </h6>
              <div>
                <b
                  style={{
                    display: "block",
                    height: "20px",
                    width: "100%",
                    textAlign: "center",
                    margin: "10px",
                    fontSize: "1.2em",
                  }}
                >
                  {restaurant}
                </b>
                <p>{address ? address.trim() : ""}</p>
              </div>

              <div
                style={{
                  textAlign: "left",
                  lineHeight: "8px",
                  width: "100%",
                  fontSize: "8px",
                }}
              >
                <p>
                  {t({ id: "invoice" })}#: {invoiceNo}
                </p>
                <p>
                  {t({ id: "date" })}:
                  {moment(orderDetails.createdAt).format("DD-MM-YYYY h:mm a")}
                </p>
              </div>
              <hr style={{ border: "1px solid black", margin: "5px" }} />
              <table
                style={{
                  fontSize: "15px",
                  lineHeight: "15px",
                  fontSize: "8px",
                }}
                align="left"
                height="auto"
                width="100%"
              >
                <thead align="left">
                  <tr
                    style={{
                      borderBottom: "2px dotted #000",
                      fontSize: "8px",
                      fontWeight: "normal",
                    }}
                  >
                    <th align="start">Items</th>
                    <th>Qty</th>
                    <th> {t({ id: "ammount" })}: </th>
                  </tr>
                </thead>
                <tbody align="left">
                  {orderDetails
                    ? orderDetails.orderItems.map((item, index) => {
                        const subProArray =
                          item.sub_pro && JSON.parse(item.sub_pro);
                        return (
                          <tr
                            key={index}
                            style={{ borderBottom: "1px dotted #000" }}
                          >
                            <td align="start" style={{ maxWidth: "130px" }}>
                              {item.name}
                            </td>
                            <td>{item.quantity}</td>
                            <td>
                              {renderCurrencySymbol()} {item.price}
                            </td>
                            <td>
                              {item &&
                              item.status &&
                              item.status.toUpperCase() === "READY" ? (
                                <input
                                  type="checkbox"
                                  style={{
                                    height: "20px",
                                    width: "20px",
                                    accentColor: "#08eb0875",
                                  }}
                                  checked
                                  readOnly
                                />
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        );
                      })
                    : ""}
                  <tr>
                    <td colSpan="4">
                      <hr style={{ border: "1px solid black" }}></hr>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" align="middle">
                      <b> {t({ id: "ammount" })}: :</b>
                    </td>
                    <td align="start">
                      {renderCurrencySymbol()}{" "}
                      {(
                        orderDetails.totalPrice - orderDetails.taxPrice
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" align="middle">
                      <b>
                        {" "}
                        {t({ id: "tax" })}: ({parseFloat(cgst).toFixed(2)}%):
                      </b>
                    </td>
                    <td align="start">
                      {renderCurrencySymbol()}{" "}
                      {orderDetails.taxPrice.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" align="middle">
                      <b> {t({ id: "discount" })}: :</b>
                    </td>
                    <td align="start">
                      -
                      {orderDetails.discountAmount !== null
                        ? orderDetails.discountAmount
                        : 0}
                      {orderDetails.discountType === "discount"
                        ? renderCurrencySymbol()
                        : "%"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3
                align="left"
                style={{
                  margin: "5px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  display: "table",
                  textAlign: "left",
                }}
                id="tot"
              >
                {t({ id: "total" })}: {renderCurrencySymbol()}{" "}
                {orderDetails.discountType === "discount" ||
                orderDetails.discountType === "price"
                  ? (
                      orderDetails.totalPrice - orderDetails.discountAmount
                    ).toFixed(2)
                  : orderDetails.discountType === "percentage"
                  ? (
                      orderDetails.totalPrice -
                      (orderDetails.totalPrice * orderDetails.discountAmount) /
                        100
                    ).toFixed(2)
                  : orderDetails.totalPrice.toFixed(2)}
              </h3>
            </div>
            <p
              style={{ textAlign: "left", fontSize: "8px", maxWidth: "220px" }}
            >
              {t({ id: "thank_you_msg" })}: <br /> {t({ id: "hope_msg" })}.
            </p>
            <p
              style={{
                textAlign: "right",
                marginTop: "10px",
                float: "right",
                fontSize: "10px",
              }}
            >
              <i>Powered by</i> <b>Menulive</b>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BillPrint;
