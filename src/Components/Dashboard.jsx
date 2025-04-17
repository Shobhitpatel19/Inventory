import React, { useEffect, useState } from "react";
import configs, { getParameterByName } from "../Constants";
import axios from "axios";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

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
import { ToastContainer, toast } from "react-toastify";

const Dashboard = () => {
  const [orderList, setOrderList] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [report, setReport] = useState();
  const [value, setValue] = React.useState(1);
  const [branchId, setBranchId] = useState(sessionStorage.getItem("selectedBranchId"));
  const [inventoryData, setInventoryData] = useState([]);
  const [inventoryMetrics, setInventoryMetrics] = useState({
    belowLimit: 0,
    almostFinished: 0,
    nearExpiry: 0
  });
  const [branchData, setBranchData] = useState({
    totalBranches: 0,
    newBranchesLastMonth: 0,
    newBranchesLast3Months: 0
  });
  const { formatMessage: t, locale, setLocale } = useIntl();
  const navigate = useNavigate();

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

  useEffect(() => {
    // Fetch branch data when component mounts
    const fetchBranchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const authApiServer = configs.authapi;
        const userId = userData ? userData.sub : " ";

        if (userId && userId !== " ") {
          const response = await axios.get(`${authApiServer}/user/members?userid=${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          // Filter out IAM users to get only branches
          const branches = response.data.filter(member => !member.isIAM);
          
          // Calculate metrics
          const totalBranches = branches.length;
          
          // Calculate branches added last month
          const lastMonthDate = new Date();
          lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
          
          const branchesLastMonth = branches.filter(branch => {
            const createdDate = new Date(branch.createdDate);
            return createdDate >= lastMonthDate;
          }).length;
          
          // Calculate branches added in last 3 months
          const last3MonthsDate = new Date();
          last3MonthsDate.setMonth(last3MonthsDate.getMonth() - 3);
          
          const branchesLast3Months = branches.filter(branch => {
            const createdDate = new Date(branch.createdDate);
            return createdDate >= last3MonthsDate;
          }).length;
          
          setBranchData({
            totalBranches,
            newBranchesLastMonth: branchesLastMonth,
            newBranchesLast3Months: branchesLast3Months
          });
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };
    
    if(userData && userData.role.toUpperCase() === "FRANCHISE-ADMIN"){
    fetchBranchData();
    }
   
  }, []);

  useEffect(() => {
    // Fetch inventory data when component mounts
    const fetchInventoryData = async () => {
      try {
        const userToken = sessionStorage.getItem("token");
        const response = await axios.get(
          `${baseURL}/api/inventories?merchantCode=${merchCode}`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        
        const inventory = response.data;
        setInventoryData(inventory);
        
        // Calculate inventory metrics based on the actual data structure
        const belowLimit = inventory.filter(item => item.availableQnty < item.minLimit).length;
        
        // Items that are almost finished (less than 20% of minimum limit)
        const almostFinished = inventory.filter(item => {
          // If minLimit is very low (close to 0), we'll use a different approach
          if (item.minLimit < 1) {
            return item.availableQnty <= 5; // Arbitrary low number for small items
          }
          return item.availableQnty <= item.minLimit * 1.2; // 20% more than minimum
        }).length;
        
        // Items expiring in the next 30 days
        const nearExpiry = inventory.filter(item => {
          if (!item.expiryDate) return false;
          
          const expiryDate = new Date(item.expiryDate);
          const today = new Date();
          const diffTime = Math.abs(expiryDate - today);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          return diffDays <= 30;
        }).length;
        
        setInventoryMetrics({
          belowLimit,
          almostFinished,
          nearExpiry
        });
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };
    
    fetchInventoryData();
  }, []);

  const handleCloneMenu = async () => {
    try {
      const token = sessionStorage.getItem("token");
      
      const merchantDataObj = JSON.parse(sessionStorage.getItem("merchantData"));
      const merchantcode = merchantDataObj ? merchantDataObj.merchantCode : "";
      // console.log("Merchant code for cloning:", merchantcode);
      const cloneData = {
        sourceUserId: userId,
        targetUserId: branchId
      };
      
      const response = await axios.post(
        `${baseURL}/api/franchise/clone-menu/`,
        cloneData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        toast.success("Menu cloned successfully!");
      } else {
        toast.error("Failed to clone menu. Please try again.");
      }
    } catch (error) {
      console.error("Error cloning menu:", error);
       toast.error("Failed to clone menu. Please try again.");
    }
  };

  const totalOrders = report ? report.length : 0;
  const totalAmount = report
    ? report.reduce((sum, item) => sum + item.totalPrice, 0)
    : 0;
  const cancelOrders = report
    ? report.filter((item) => item.isCanceled === true)
    : 0;

  return (
    <div className="main_dash">
      <div className="welcome-container">
        <h4 className="welcome-heading">Welcome!</h4>
        {userData && userData.role.toUpperCase() == "FRANCHISE-ADMIN" && !branchId && (
          <button className="member-btn" onClick={() => navigate('/members')}>
            + Add New Branch
          </button>
        )}
        {userData && userData.role.toUpperCase() == "FRANCHISE-ADMIN" && branchId  && (
           <button className="member-btn" onClick={handleCloneMenu}>
            Clone Master Copy
          </button>
        )}

      </div>
      
     {userData && userData.role.toUpperCase() === "FRANCHISE-ADMIN" && !branchId && <div className="item_list branch-info-container">
        <div className="branch-info-header">
          <h3>FRANCHISE SUMMARY </h3>
         
        </div>
        <div
          className="branch-info-wrapper"
          style={{
            display: "flex",
            gap: "2%",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <Card className="list branch-metric-card" sx={{ minWidth: "20%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 16 }}
                color="text.secondary"
                gutterBottom
                className="branch-metric-label"
              >
                Total Branches
              </Typography>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ fontSize: 36 }}
                className="branch-metric-value"
              >
                {branchData.totalBranches}
              </Typography>
            </CardContent>
          </Card>

          <Card className="list branch-metric-card" sx={{ minWidth: "20%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 16 }}
                color="text.secondary"
                gutterBottom
                className="branch-metric-label"
              >
                Added previous month
              </Typography>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ fontSize: 36 }}
                className="branch-metric-value"
              >
                {branchData.newBranchesLastMonth}
              </Typography>
            </CardContent>
          </Card>

          <Card className="list branch-metric-card" sx={{ minWidth: "20%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 16 }}
                color="text.secondary"
                gutterBottom
                className="branch-metric-label"
              >
                Added In 3 Months
              </Typography>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ fontSize: 36 }}
                className="branch-metric-value"
              >
                {branchData.newBranchesLast3Months}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>}

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
      <div className="item_list branch-info-container">
        <div className="branch-info-header">
          <h3>Inventory Data</h3>
        </div>
        <div
          className="branch-info-wrapper"
          style={{
            display: "flex",
            gap: "2%",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <Card className="list branch-metric-card" sx={{ minWidth: "20%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 16 }}
                color="text.secondary"
                gutterBottom
                className="branch-metric-label"
              >
                Below expected limit
              </Typography>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ fontSize: 36 }}
                className="branch-metric-value"
              >
                {inventoryMetrics.belowLimit}
              </Typography>
            </CardContent>
          </Card>

          <Card className="list branch-metric-card" sx={{ minWidth: "20%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 16 }}
                color="text.secondary"
                gutterBottom
                className="branch-metric-label"
              >
                Almost finished 
              </Typography>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ fontSize: 36 }}
                className="branch-metric-value"
              >
                {inventoryMetrics.almostFinished}
              </Typography>
            </CardContent>
          </Card>

          <Card className="list branch-metric-card" sx={{ minWidth: "20%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 16 }}
                color="text.secondary"
                gutterBottom
                className="branch-metric-label"
              >
                Near Expired Dates
              </Typography>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ fontSize: 36 }}
                className="branch-metric-value"
              >
                {inventoryMetrics.nearExpiry}
              </Typography>
            </CardContent>
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
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
