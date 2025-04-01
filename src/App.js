import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Category from "./Components/Category";
import FoodDescription from "./Components/FoodDescription";
import Snackbar from "@mui/material/Snackbar";
import Nav from "./Components/Nav";
import OrderList from "./Components/OrderList";
import MerchantInfo from "./Components/MerchantInfo";
import Reports from "./Components/Reports";
import { useEffect, useState } from "react";
import axios from "axios";
import TableView from "./Components/TableView";
import ReactLoading from "react-loading";
import configs, { getParameterByName } from "./Constants";
import Setting from "./Components/Setting";
import Epos from "./Components/Epos";
import DashBoard from "./Components/Dashboard";
import Customers from "./Components/Customers";
import Members from "./Components/Members";
import Variety from "./Components/variety";
import QRCodes from "./Components/QRCodes";
import SettingNew from  "./Components/SettingNew";
import Help from "./Components/Help";
import MemberProducts from "./Components/MemberProducts";
import Cl_Dashboard from "./clover/Dashboard";
import Cl_Categories from "./clover/Category";
import Cl_Fooddescription from "./clover/FoodDescription";
import RolesLogin from "./Components/RolesLogin";
import BillPrint from "./Components/BillPrint";
import MemberTables from "./Components/MemberTables";
import AppPage from "./Components/AppPage";
import { db } from "./root/util";
import { onValue, ref } from "firebase/database";
import { useIntl } from "react-intl";
import Promotion from "./Components/Promotion";
import Inventories from "./Components/Inventories";
import { Kitchen } from "@mui/icons-material";
import KitchenAssign from "./Components/KitchenAssign";

function App() {
  const [notification, setNotification] = useState(false);
  const [refesh, setRefesh] = useState("");
  const [userSets, setUserSets] = useState(null);
  const [thirdParty, setThirdParty] = useState(null);
  const [isEpos, setIsEpos] = useState(true);
  const [openSetting, setOpenSetting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { formatMessage: t, locale, setLocale } = useIntl();
  let  isOrderFbCalled=false;
  let  isTblFbCalled=false;
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";

  let originURL =
    window.location.href.indexOf("localhost") > 0
      ? "https://menu.merchantnations.com"
      : window.location.origin;

  const url_token = getParameterByName("token");
  let userToken = url_token
    ? url_token
    : sessionStorage.getItem("token")
    ? sessionStorage.getItem("token")
    : "";
  const imuserDetails = null;
  let tokenUrl = configs.authapi + "/user/validate-token";
  //  let tokenUrl="http://15.204.58.171:6004/user/validate-token";
  console.log(userToken);
  let baseURL = configs.baseURL;
  if (url_token) {
    sessionStorage.setItem("token", userToken);
    window.location.href = window.location.origin + "/";
  }


  useEffect(() => {
    if (!userToken) return;

    axios({
      method: "post",
      url: tokenUrl,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => {
        console.log("user token details", res.data.user);

        sessionStorage.setItem("userData", JSON.stringify(res.data.user));
        axios
          .get(`${configs.baseURL}/api/settings/${res.data.user.sub}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((resset) => {
            if (resset.status !== 200 || !resset.data.length) {
              setOpenSetting(true);
              return;
            }

            console.log(resset);
            sessionStorage.setItem(
              "merchantData",
              JSON.stringify(resset.data[0])
            );
            let merchantDtl = sessionStorage.getItem("merchantData");
            merchantDtl = JSON.parse(merchantDtl);
            setUserSets(merchantDtl);
            
           
             //fb listener for orders
                
               

            if (merchantDtl.activeProviderId) {
              axios
                .get(
                  baseURL + "/api/thp-source/" + merchantDtl.activeProviderId
                )
                .then((res) => {
                  setThirdParty(res.data);
                });

               


            }
          })
          .catch((err) => {
            console.error(err);
            setOpenSetting(true);
          });
      })
      .catch((err) => {
        console.error(err);
        setOpenSetting(true);
      });
  }, []);

  useEffect(() => {
    if(userSets && userSets.merchantCode){
 console.log('++++FB REGISTERED*********************',userSets.merchantCode);

 const query = ref(db, "orders/"+userSets.merchantCode);
                 onValue(query, (snapshot) => {
                if(isOrderFbCalled){
                const data = snapshot.val();
                var promise = document.querySelector('#noti_sound').play();
                if (promise !== undefined) {
                  promise.then(_ => {
                    // Autoplay started!
                     setSnackbarOpen(true);
                  }).catch(error => {
                    console.log("-----------------------",error);
                    // Autoplay was prevented.
                    // Show a "Play" button so that user can start playback.
                  });
                }
              }else{
                isOrderFbCalled=true;
              }
                
                },(error) => {
  console.error(error);
}); 



//fb listener for tables request
               const tbquery = ref(db, "tables/"+userSets.merchantCode);
                 return onValue(tbquery, (snapshot) => {
                 //const data = snapshot.val();
                 if(isTblFbCalled){
                 var promise2 = document.querySelector('#tbl_call_sound').play();
                if (promise2 !== undefined) {
                  promise2.then(_ => {
                    // Autoplay started!
                  }).catch(error => {
                    // Autoplay was prevented.
                    // Show a "Play" button so that user can start playback.
                  });
                }}
                else{
                  isTblFbCalled = true;
                }
              
                  });

               }
  }, [userSets]);

  const handleNotification = () => {
    setNotification(true);
  };

  const handleRefresh = () => {
    refesh ? setRefesh("") : setRefesh("DATA REFRSHED");
  };
  console.log(sessionStorage.getItem("token"));
  let isBill = sessionStorage.getItem("billing");
  console.log(isBill)
  return (
    <div>
      <Router>
        {isBill === "true"? (
          <Routes>
            <Route exact path="/BillPrint" element={<BillPrint />} />
          </Routes>
        ) : (
          <Nav
            handleNotification={handleNotification}
            handleRefresh={handleRefresh}
            isEpos={isEpos}
            setIsEpos={setIsEpos}
          />
        )}
        {getParameterByName("merchantCode") && (
          <Routes>
            <Route exact path="/" element={<RolesLogin />} />
            <Route exact path="/dashboard" element={<DashBoard />} />
            <Route exact path="/categories" element={<Category />} />
            <Route exact path="/varieties" element={<Variety />} />
            <Route exact path="/productDetails" element={<FoodDescription />} />
            <Route exact path="/productDetailsmember" element={<MemberProducts />} />
            <Route exact path="/tableMember" element={<MemberTables />} />
            <Route
              exact
              path="/orderList"
              element={
                <OrderList
                  notification={notification}
                  setNotification={setNotification}
                  refesh={refesh}
                />
              }
            />
            <Route exact path="/merchantInfo" element={<MerchantInfo />} />
            <Route exact path="/reports" element={<Reports />} />
            <Route exact path="/table" element={<TableView />} />
            <Route exact path="/setting" element={<Setting />} />
            <Route exact path="/settingnew" element={<SettingNew />}/>
            <Route
              exact
              path="/epos"
              element={<Epos setIsEpos={setIsEpos} />}
            />
            <Route exact path="/customers" element={<Customers />} />
            <Route exact path="/members" element={<Members />} />
            <Route exact path="/qrcodes" element={<QRCodes />} />
            <Route exact path="/help" element={<Help />} />
            <Route exact path="/promotion" element={<Promotion/>}/>
            <Route exact path="/kitchen" element={<KitchenAssign/>}/>
            <Route exact path='/inventories' element={<Inventories/>}/>
            <Route exact path="/app" element={<AppPage/>}/>
          </Routes>
        )}

        {userSets &&
          userSets.activeProviderId &&
          thirdParty &&
          !getParameterByName("merchantCode") && (
            <Routes>
              <Route exact path="/" element={<Cl_Dashboard />} />
              <Route exact path="/dashboard" element={<Cl_Dashboard />} />
              <Route exact path="/categories" element={<Cl_Categories />} />
              <Route
                exact
                path="/productDetails"
                element={<Cl_Fooddescription />}
              />
              <Route exact path="/setting" element={<Setting />} />
              <Route exact path="/settingnew" element={<SettingNew />}/>
              <Route exact path="/table" element={<TableView />} />
              <Route exact path="/members" element={<Members />} />
              <Route exact path="/orderList" element={<OrderList />} />
              <Route
                exact
                path="/epos"
                element={<Epos setIsEpos={setIsEpos} />}
              />
              <Route exact path="/qrcodes" element={<QRCodes />} />
            </Routes>
          )}

        {userSets &&
          !userSets.activeProviderId &&
          !getParameterByName("merchantCode") && (
            <Routes>
              <Route exact path="/" element={<DashBoard />} />
              <Route exact path="/dashboard" element={<DashBoard />} />
              <Route exact path="/categories" element={<Category />} />
              <Route exact path="/varieties" element={<Variety />} />
              <Route
                exact
                path="/productDetails"
                element={<FoodDescription />}
              />
              <Route
                exact
                path="/orderList"
                element={
                  <OrderList
                    notification={notification}
                    setNotification={setNotification}
                    refesh={refesh}
                  />
                }
              />
              <Route exact path="/merchantInfo" element={<MerchantInfo />} />
              <Route exact path="/reports" element={<Reports />} />
              <Route exact path="/table" element={<TableView />} />
              <Route exact path="/setting" element={<Setting />} />
              <Route exact path="/settingnew" element={<SettingNew />}/>

              <Route
                exact
                path="/epos"
                element={<Epos setIsEpos={setIsEpos} />}
              />
              <Route exact path="/customers" element={<Customers />} />
              <Route exact path="/members" element={<Members />} />
              <Route exact path="/qrcodes" element={<QRCodes />} />
              <Route exact path="/help" element={<Help />} />
              <Route exact path="/promotion" element={<Promotion/>}/>
              <Route exact path="/kitchen" element={<KitchenAssign/>}/>
              <Route exact path='/inventories' element={<Inventories/>}/>
              <Route exact path="/app" element={<AppPage/>}/>
            </Routes>
          )}
        {!userSets && openSetting && (
          <Routes>
            <Route exact path="/" element={<Setting />} />
          </Routes>
        )}
      </Router>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message={t({ id: "order_update" })}
      />
      <audio  id="noti_sound" src={"./update.mp3"} />
      <audio  id="tbl_call_sound" src={"./table-call.mp3"} />

    </div>
  );
}

export default App;
