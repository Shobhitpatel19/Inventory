import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import CallMadeIcon from "@mui/icons-material/CallMade";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import configs, { getParameterByName } from "../Constants";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import MicrowaveIcon from '@mui/icons-material/Microwave';
import AppsIcon from "@mui/icons-material/Apps";
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Popup from "reactjs-popup";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MicrowaveRoundedIcon from '@mui/icons-material/MicrowaveRounded';
import Badge from "@mui/material/Badge";
import "reactjs-popup/dist/index.css";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DesktopMacIcon from "@mui/icons-material/DesktopMac";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsActiveSharpIcon from "@mui/icons-material/NotificationsActiveSharp";
import TableChartIcon from "@mui/icons-material/TableChart";
import Groups2Icon from "@mui/icons-material/Groups2";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HelpIcon from "@mui/icons-material/Help";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import QrCodeIcon from "@mui/icons-material/QrCode";
import BallotIcon from '@mui/icons-material/Ballot';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { Dialog } from "@mui/material";
import { useIntl } from "react-intl";

function Nav(props) {
  const [open1, setOpen1] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [franchiseAnchorEl, setFranchiseAnchorEl] = React.useState(null);
  const [selectedFranchise, setSelectedFranchise] = React.useState("Main Branch");
  const [franchises, setFranchises] = React.useState([
    { id: 1, name: "Main Branch" },
    { id: 2, name: "Downtown Location" },
    { id: 3, name: "Uptown Location" },
    { id: 4, name: "West Side Branch" },
    { id: 5, name: "East Side Branch" }
  ]);
  
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);
  const [qRPath, setQRPath] = useState("");
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableService, setTableService] = useState([]);
  const [tableNumber, setTableNumber] = useState(0);

  const userId = userData ? userData.sub : " ";
  // merchantData
  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchantInParam = getParameterByName("merchantCode");

  const merchCode =
    merchantData && merchantData.merchantCode
      ? merchantData.merchantCode
      : merchantInParam;
  // const closeModal = () => setPopUpOpen(false);

  let baseURL = configs.baseURL;
  const getTabByUser = baseURL + "/api/tables?merchantCode=" + merchCode;

  const token = getParameterByName("token");

  const paramPath = merchantInParam ? "merchantCode=" + merchCode : "";
  const catPath = `/categories?${paramPath}`;
  const varPath = `/varieties?${paramPath}`;
  const orderListPath = `/orderList?${paramPath}`;
  const productPath = `/productDetails?${paramPath}`;
  const productPathmember = `/productDetailsmember?${paramPath}`;
  const tablemember = `/tableMember?${paramPath}`;
  const tabPath = `/table?${paramPath}`;
  const reportsPath = `/reports?${paramPath}`;
  const settingPath = `/setting?${paramPath}`;
  const posPath = `/epos?${paramPath}`;
  const memberPath = `/members?${paramPath}`;
  const customerPath = `/customers?${paramPath}`;
  const { formatMessage: t, locale, setLocale } = useIntl();

  useEffect(() => {
    axios
      .get(getTabByUser)
      .then((response) => {
        console.log(response.data);
        setTableData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
  }, []);

  const handleNotification = () => {
    setOpen1(true);
    setTableNumber(0);
    // setTimeout(() => {
    //   setOpen1(false);
    //   setTableService([]);
    // }, 1000);
  };
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userData");
    //  window.location.reload();
    // http://localhost:8080/
    let isMember=sessionStorage.getItem('isMember')
    if(isMember){
       sessionStorage.removeItem("merchantData");
       sessionStorage.removeItem('isMember')
       window.location.href = `${window.location.origin}/?${window.location.href.split('?')[1]}`;
    }else{
    window.location.href =
      configs.authUrl + "/account/login?redirect=" + window.location.origin;
    //  window.location.href ="http://localhost:8080/account/login?redirect="+window.location.origin
  }
  };

  const open = Boolean(anchorEl);
  const franchiseMenuOpen = Boolean(franchiseAnchorEl);
  
  const handleClick = () => {
    setAnchorEl(true);
  };
  const handleOpen = () => {
    console.log("election");
    setPopUpOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(false);
  };

  const handleFranchiseClick = (event) => {
    setFranchiseAnchorEl(event.currentTarget);
  };

  const handleFranchiseClose = () => {
    setFranchiseAnchorEl(null);
  };

  const handleFranchiseSelect = (franchise) => {
    setSelectedFranchise(franchise.name);
    handleFranchiseClose();
  };

  let cmsUrl = `${configs.cmsUrl}?token=${sessionStorage.getItem("token")}`;
  console.log('cms',cmsUrl);

  const canBeOpen = open1 && Boolean(anchorEl);
  const id = canBeOpen ? "transition-popper" : undefined;

  const handleClosePopup = () => setPopUpOpen(false);  
  const handlePopupClose = () => setOpen1(false);
  const navigate = useNavigate()
const handleDashboard = () => {
  navigate("/dashboard");
}
  useEffect(() => {
    const tab = tableData && tableData.length? tableData.filter((table) => table.isServiceCall === true):"";
    console.log(tab);
    setTableService(tab);
    setTableNumber(tab.length);
  }, [tableData]);

  const isMember = sessionStorage.getItem('isMember');
  return (
    <div
      id="navBar"
      className="text-center m-2 "
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        className="logo"
        style={{
          backgroundImage: `url(${merchantData ? merchantData.logoImg : ""})`,
        }}
        onClick={handleDashboard}
      ></span>
      <div>
        {/*<NavLink exact to="/dashboard"><HomeIcon   sx={{ fontSize: 40,color:"black",paddingTop:'5px'}}/></NavLink>*/}
        {/* <div><AppsIcon onClick={()=>setPopUpOpen(true)}  sx={{ fontSize: 40}}/></div> */}
        <AppsIcon
          sx={{ fontSize: 40, cursor: "pointer" }}
          onClick={handleOpen}
        />
  <Popup
  position="bottom left"
  id="popup"
  open={popUpOpen}
  onClose={handleClosePopup}
>
  <div className="menu-link">
    {isMember ? (
      <>
         <NavLink
         to={productPathmember}
         style={{ border: "none", textAlign: "center" }}
         onClick={handleClosePopup}
       >
         <AccountTreeIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
         <label>{t({ id: "items" })}</label>
       </NavLink>    
       <NavLink
          to={reportsPath}
          style={{ border: "none", textAlign: "center" }}
          onClick={handleClosePopup}
        >
          <BarChartIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>Reports</label>
        </NavLink>
        <NavLink
          to={tablemember}
          style={{ textDecoration: "none", color: "black" }}
          onClick={handleClosePopup}
        >
          <TableChartIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>Table View</label>
        </NavLink>
       </>
   
    ) : (
      <>
         <NavLink
        exact
        to={catPath}
        style={{ border: "none", textAlign: "center" }}
        onClick={handleClosePopup}
      >
        <InventoryIcon sx={{ fontSize: "50px", cursor: "pointer", border: "none" }} />
        <label>{t({ id: "categories" })}</label>
      </NavLink>
        <NavLink
          to={productPath}
          style={{ border: "none", textAlign: "center" }}
          onClick={handleClosePopup}
        >
          <AccountTreeIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>{t({ id: "items" })}</label>
        </NavLink>

        <NavLink
          to={orderListPath}
          style={{ border: "none", textAlign: "center" }}
          onClick={handleClosePopup}
        >
          <ListAltIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>{t({ id: "orders" })}</label>
        </NavLink>

        <NavLink
          to={posPath}
          onClick={() => {
            props.setIsEpos(true);
            setPopUpOpen(false);
          }}
          style={{ border: "none", textAlign: "center" }}
        >
          <DesktopMacIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>POS</label>
        </NavLink>

        <NavLink
          to={tabPath}
          style={{ textDecoration: "none", color: "black" }}
          onClick={handleClosePopup}
        >
          <TableChartIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>{t({ id: "tables" })}</label>
        </NavLink>


        <NavLink
          to={"/inventories"}
          style={{ textDecoration: "none", color: "black" }}
          onClick={handleClosePopup}
        >
          <BallotIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>Inventories</label>
        </NavLink>

        <NavLink
          to={reportsPath}
          style={{ border: "none", textAlign: "center" }}
          onClick={handleClosePopup}
        >
          <BarChartIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>{t({ id: "reports" })}</label>
        </NavLink>


        <NavLink
          to={memberPath}
          style={{ textDecoration: "none", color: "black" }}
          onClick={handleClosePopup}
        >
          <Groups2Icon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>{t({ id: "member" })}</label>
        </NavLink>

        <NavLink
          to={customerPath}
          style={{ textDecoration: "none", color: "black" }}
          onClick={handleClosePopup}
        >
          <AccountBoxIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>{t({ id: "customers" })}</label>
        </NavLink>
        

        <NavLink
          to={varPath}
          style={{ textDecoration: "none", color: "black" }}
          onClick={handleClosePopup}
        >
          <FilterAltIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>{t({ id: "varieties" })}</label>
        </NavLink>


        <NavLink
          to={"/kitchen"}
          style={{ textDecoration: "none", color: "black" }}
          onClick={handleClosePopup}
        >
          <MicrowaveIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>{t({ id: "kitchen" })}</label>
        </NavLink>

        <NavLink
          to={"/qrcodes"}
          style={{ textDecoration: "none", color: "black" }}
          onClick={handleClosePopup}
        >
          <QrCodeScannerIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <div>QR Codes</div>
        </NavLink>

        <NavLink
          onClick={() => {
            handleNotification();
            setPopUpOpen(false);
            handleClose();
          }}
          style={{ border: "none", textAlign: "center" }}
        >
          <NotificationsActiveSharpIcon sx={{ fontSize: 50, cursor: "pointer" }} />
          <label>{t({ id: "notification" })}</label>
        </NavLink>

        <NavLink
          to={"/promotion"}
          style={{ textDecoration: "none", color: "black" }}
          onClick={handleClosePopup}
        >
          <AddPhotoAlternateIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>{t({ id: "promotion" })}</label>
        </NavLink>

        <NavLink
            to={`${cmsUrl}`}
            target="_blank"
            style={{
              textDecoration: "none",
              color: "black",
              textAlign: "center",
            }}
          >
            <PersonalVideoIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
            <div>{t({ id: "digi_signage" })}</div>
        </NavLink>

        <NavLink
          to={"/app"}
          style={{ textDecoration: "none", color: "black" }}
          onClick={handleClosePopup}
        >
          <InstallMobileIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>Apps</label>
        </NavLink>

        <NavLink
          to={"/help"}
          style={{ textDecoration: "none", color: "black" }}
          onClick={handleClosePopup}
        >
          <HelpIcon sx={{ fontSize: "50px", cursor: "pointer" }} />
          <label>{t({ id: "help" })}</label>
        </NavLink>
   
      </>
    )}
  </div>
</Popup>

      </div>
      <div
        id="qr-img"
        style={{
          visibility: "hidden",
          border: "1px dotted",
          padding: "10px",
          margin: "10px",
          textAlign: "center",
          position: "absolute",
          top: "20px",
          background: "#52d55a",
        }}
      >
        <h1 style={{ fontSize: "2.7rem" }}>{"SCAN TO ORDER"}</h1>
        <QRCode
          id="qrcode"
          size={556}
          style={{
            height: "300px",
            width: "300px",
          }}
          value={qRPath}
        />
        <h1>{"SELF SERVICE QR"}</h1>
        <p>{"Scan with Mobile Camera"}</p>
        <p>{"[Gogle LENS, Scanner etc]"}</p>
      </div>

      <div
        id={"qr-img-onlymen"}
        style={{
          visibility: "hidden",
          border: "2px dotted",
          padding: "10px",
          margin: "2px",
          textAlign: "center",
          position: "absolute",
          top: "20px",
          background: "#52d55a",
        }}
      >
        <h1 style={{ fontSize: "2.7rem" }}>{"SCAN FOR MENU"}</h1>
        <QRCode
          id="qrcode"
          size={556}
          style={{
            height: "300px",
            width: "300px",
          }}
          value={qRPath}
        />

        <p>{"Scan with Mobile Camera"}</p>
        <p>{"[Gogle LENS, Scanner etc]"}</p>
      </div>
          {/*  */}
      <span className="nav-links">
        {userData && userData.role === "FRANCHISE-ADMIN" && (
          <div className="franchise-dropdown">
            <Button 
              className="franchise-selector"
              onClick={handleFranchiseClick}
              aria-controls={franchiseMenuOpen ? "franchise-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={franchiseMenuOpen ? "true" : undefined}
              endIcon={<KeyboardArrowDownIcon />}
            >
              {selectedFranchise}
            </Button>
            <Menu
              id="franchise-menu"
              anchorEl={franchiseAnchorEl}
              open={franchiseMenuOpen}
              onClose={handleFranchiseClose }
              MenuListProps={{
                "aria-labelledby": "franchise-selector",
              }}
            >
              {franchises.map((franchise) => (
                <MenuItem 
                  key={franchise.id} 
                  onClick={() => handleFranchiseSelect(franchise)}
                  selected={selectedFranchise === franchise.name}
                >
                  {franchise.name}
                </MenuItem>
              ))}
            </Menu>
          </div>
        )}
        
        <NavLink to={orderListPath} className="cont">
        {t({ id: "orders" })}
        </NavLink>
        <NavLink
          to={posPath}
          className="container"
          onClick={() => props.setIsEpos(false)}
        >
          POS
        </NavLink>
      </span>

      <div>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={tableNumber} color="error">
            <NotificationsIcon  onClick={handleNotification} />
          </Badge>
        </IconButton>
      </div>
      <div className="logout">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          style={{ color: "black", marginTop: "5px" }}
        >
          {/* <MoreVertIcon/> */}
          <span style={{ fontSize: "20px" }} id="name">
            {userData ? userData.name : ""}
          </span>
          <AccountCircleOutlinedIcon sx={{ fontSize: 40 }} />
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          autoFocus={true}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {/* <MenuItem onClick={handleClose}>
                   <NavLink to={reportsPath} style={{textDecoration:"none",color:"black"}} >Reports</NavLink>
        </MenuItem> */}

          {/* <MenuItem onClick={handleClose}>
        <NavLink to={tabPath}   style={{textDecoration:"none",color:"black"}}>Table View</NavLink>
        </MenuItem>

        <MenuItem onClick={handleClose}>
        <NavLink to="/customers"   style={{textDecoration:"none",color:"black"}}>Customers</NavLink>
        </MenuItem> */}

         
          {!merchantInParam && (
            <>
           <MenuItem
            onClick={handleClose}
          > <NavLink
          to={memberPath}
          style={{ textDecoration: "none", color: "black"}}
        
        >
          User Profile
        </NavLink>
           
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <NavLink
              to={settingPath}
              style={{ textDecoration: "none", color: "black" }}
            >
              Setting
            </NavLink>
          </MenuItem>
          </>)}
         
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>

      <Dialog
        open={open1}
        style={{top:"2%",height:"auto !important"}}
        onClose={handlePopupClose}
      >
        
          <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
            <div>
              {tableService &&
                tableService.map((service) => (
                  <div style={{ padding: "10px" }}>
                    <div
                      key={service.number}
                      style={{
                        padding: "5px",
                        backgroundColor: "antiquewhite",
                      }}
                    >
                      Table <b>{service.number}</b> is calling for{" "}
                      <b>Service</b>
                    </div>
                  </div>
                ))}
              {tableService && tableService.length === 0 && "No Notification"}
            </div>
          </Box>
      </Dialog>
    </div>
  );
}

export default Nav;
