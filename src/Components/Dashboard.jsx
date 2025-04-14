import React, { useEffect, useState } from "react";
import configs, { getParameterByName } from "../Constants";
import axios from "axios";
import { useIntl } from "react-intl";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import Currencies from "../root/currency";
const Dashboard = () => {
  const [orderList, setOrderList] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [report, setReport] = useState();
  const [value, setValue] = React.useState(1);
  const { formatMessage: t, locale, setLocale } = useIntl();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (value === 0) {
      setFromDate(yesterday.toISOString().split("T")[0]);
      setToDate(yesterday.toISOString().split("T")[0]);
    } else if (value === 1) {
      setFromDate(today.toISOString().split("T")[0]);
      setToDate(today.toISOString().split("T")[0]);
    }
  }, [value]);

  let baseURL = configs.baseURL;
  let staticSer = configs.staticSer;

  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);
  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const userId = userData ? userData.sub : " ";
  const merchCode = merchantData ? merchantData.merchantCode : "";
  console.log("dashboard", merchCode);
  const getOrderList = `${baseURL}/api/orders?merchantCode=${merchCode}`;
  const getProductByUser = baseURL + `/api/products?merchantCode=${merchCode}`;
  const getCatByUser = `${baseURL}/api/categories?merchantCode=${merchCode}`;
  let cur = userData ? userData.currency : "";
  let currency = Currencies.filter(
        (curen) => curen.abbreviation == merchantData.currency
      );
    let SelectCurrency = currency && currency[0] ? currency[0].symbol : "";
    console.log(SelectCurrency);
     const selectedCurrency = (
        <span dangerouslySetInnerHTML={{ __html: SelectCurrency }} />
      );
    console.log(selectedCurrency);

  useEffect(() => {
    axios.get(getOrderList).then((response) => {
      setOrderList(response.data);
    });

    axios.get(getProductByUser).then((response) => {
      if (response.data.length !== products.length) {
        setProducts(response.data);
        console.log(response.data);
      }
    });

    axios.get(getCatByUser).then((response) => {
      console.log(response.data);
      setCategories(response.data);
    });
  }, []);

  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpg";
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

  const totalOrders = report ? report.length : 0;
  const totalAmount = report
    ? report.reduce((sum, item) => sum + item.totalPrice, 0)
    : 0;
  const cancelOrders = report
    ? report.filter((item) => item.isCanceled === true)
    : 0;

  return (
    <div className="main_dash">
      <h4
        style={{
          marginBottom: "0px",
          fontSize: "25px",
          fontWeight: "bolder",
          letterSpacing: "2px",
        }}
      >
        Welcome!
      </h4>
      <div className="item_list">
        <h3>SALES REPORT</h3>

        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
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
              }}
            >
              {t({ id: "yesterday" })}
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
              }}
            >
              Today
            </Button>
          </ButtonGroup>
        </Box>

        <div
          style={{
            display: "flex",
            gap: "5%",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <Card className="list" sx={{ minWidth: "20%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Total Orders
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontSize: 44 }}>
                {totalOrders}
              </Typography>
            </CardContent>
            {/* <CardActions>
            <Button size="small">Know More</Button>
          </CardActions> */}
          </Card>

          <Card className="list" sx={{ minWidth: "20%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Total Amount
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontSize: 44 }}>
                {selectedCurrency}
                {totalAmount.toFixed(2)}
              </Typography>
            </CardContent>
            {/* <CardActions>
            <Button size="small">Know More</Button>
          </CardActions> */}
          </Card>

          <Card className="list" sx={{ minWidth: "20%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Cancelled Orders
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontSize: 44 }}>
                {cancelOrders.length}
              </Typography>
            </CardContent>
            {/* <CardActions>
            <Button size="small">Know More</Button>
          </CardActions> */}
          </Card>
        </div>
      </div>

      <div className="item_list">
        <h3>MOST POPULAR ITEMS</h3>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            padding: "0px 30px",
            overflowX: "auto",
            flexWrap: "nowrap",
            height: "220px",
          }}
        >
          {products.length
            ? products.slice(0, 5).map((pro) => {
                return (
                  <div className="item-img-name">
                    <img
                      src={pro.image}
                      onError={imageOnErrorHandler}
                      style={{ height: "120px", width: "100%" }}
                    />
                    <span
                      className="title-ellipsis"
                      style={{ fontWeight: "bold", width: "180px" }}
                    >
                      {pro.name}
                    </span>
                  </div>
                );
              })
            : " "}
        </div>
      </div>
      <div className="item_list">
        <h3>MENU SUMMARY</h3>

        <div
          style={{
            display: "flex",
            gap: "5%",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <Card className="list">
            <div className="cat_logo"></div>
            <div style={{ textAlign: "start" }}>
              <h5
                style={{ fontSize: "15px", color: "black", lineHeight: "0px" }}
              >
                Total Categories
              </h5>
              <p style={{ fontSize: "44px" }}>{categories.length}</p>
            </div>
          </Card>
          <Card className="list">
            <div className="item_logo"></div>
            <div style={{ textAlign: "start" }}>
              <h5
                style={{ fontSize: "15px", color: "black", lineHeight: "0px" }}
              >
                Total Products
              </h5>
              <p style={{ fontSize: "44px", lineHeight: "0px" }}>
                {products.length}
              </p>
            </div>
          </Card>
          <Card className="list">
            {<div className="order_logo"></div>}
            <div style={{ textAlign: "start" }}>
              <h5
                style={{ fontSize: "15px", color: "black", lineHeight: "0px" }}
              >
                Total Orders
              </h5>
              <p style={{ fontSize: "44px", lineHeight: "0px" }}>
                {orderList.length}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
