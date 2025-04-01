import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import axios from "axios";
import configs, { getParameterByName } from "../Constants";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Navigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { Alert, AlertTitle } from "@mui/material";
const RolesLogin = (props) => {
  const [pin, setPin] = useState("");
  const [rolesData, setRolesData] = useState([]);
  const [merchantData, setMerchantData] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [vertical] = useState("top");
  const [horizontal] = useState("center");
  const [open, setOpen] = useState(false);
  const [userSets, setUserSets] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  console.log(props);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        baseURL +
          "/api/settings/merchants/" +
          getParameterByName("merchantCode") +
          "/open"
      )
      .then((res) => {
        console.log(res.data);
        setMerchantData(res.data);
        sessionStorage.setItem("merchantData", JSON.stringify(res.data));
      });
  }, []);
  console.log(merchantData);
  if (sessionStorage.getItem("token") && merchantData) {
    navigate("/epos?merchantCode=" + getParameterByName("merchantCode"));
  }
  if (sessionStorage.getItem("token") && merchantData) {
    navigate("/epos?merchantCode=" + getParameterByName("merchantCode"));
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }

  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  const handleClose = () => {
    setOpen(false);
    setErrorMessage(false);
  };
  let wrongPinCout = 0;

  let baseURL = configs.baseURL;
  useEffect(() => {
    if (!rolesData.length) {
      axios
        .get(
          baseURL +
            "/api/settings/merchants/" +
            getParameterByName("merchantCode") +
            "/members/open"
        )
        .then((res) => {
          console.log(res.data);
          setRolesData(res.data);
        });
    }
  }, []);
  //  https://api.menulive.in/api/settings/merchants/E2S018YLOT/members/open

  function appendToInput(value) {
    console.log(value);
    setPin((p) => p + value);
  }

  function handleBackSpace() {
    setPin(pin.slice(0, -1));
  }

  const handlePass = () => {
    window.location.href = "https://auth.digitallive24.com/account/login";
  };

  function handleSubmit() {
    let isLoggedIn = false;
    sessionStorage.setItem("isMerchant", true);
    sessionStorage.setItem("isMember", true);
    if (wrongPinCout <= 5) {
      if (roleId && pin) {
        axios({
          method: "post",
          url: configs.authapi + "/user/validate-member-names-pin",
          data: {
            _id: roleId,
            mpin: pin,
          },
        })
          .then((res) => {
            setPin("");
            wrongPinCout = 0;
            isLoggedIn = true;
            sessionStorage.setItem("token", res.data.user.token);

            axios
              .get(
                configs.baseURL + "/api/settings/" + res.data.user.parentUser
              )
              .then((resset) => {
                console.log(resset);
                if (resset.data.length) {
                  sessionStorage.setItem(
                    "merchantData",
                    JSON.stringify(resset.data[0])
                  );
                  let merchantDtl = sessionStorage.getItem("merchantData");
                  merchantDtl = JSON.parse(merchantDtl);
                  setUserSets(merchantDtl);

                  if (merchantDtl.activeProviderId) {
                    axios
                      .get(
                        baseURL +
                          "/api/thp-source/" +
                          merchantDtl.activeProviderId
                      )
                      .then((res) => {
                        //setThirdParty(res.data);
                      });
                  }
                }
              });
          })
          .catch((err) => {
            console.log(err);
            setErrorMessage(err.message);
            setPin("");
            wrongPinCout = wrongPinCout + 1;
          });
        //    history("/epos")
      } else {
        setOpen(true);
      }
      //isLoggedIn&& navigate("/epos");
    } else {
      console.log("Come again");
    }
  }

  const handleKeyDown = (e) => {
    const { key } = e;
    if (/\d/.test(key)) {
      appendToInput(key);
    } else if (key === "Backspace") {
      handleBackSpace();
    } else if (key === "Enter") {
      handleSubmit();
    }
  };
  if (document.getElementById("navBar")) {
    document.getElementById("navBar").style.display = "none";
  }
  // Add event listener for keyboard events
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pin]);
  // if (redirectToOrders) {
  //     return <Navigate to="/orders" />;
  // }

  return (
    <>
      <div className="container" id="role_container">
        <div className="sub_container">
          <div className="input_container">
            <div className="logo_cont">
              <span
                className="logo"
                style={{
                  backgroundImage: `url(${
                    merchantData ? merchantData.logoImg : ""
                  })`,
                }}
              ></span>
            </div>

            <div className="login_pass">
              <button className="logoin_btn" onClick={handlePass}>
                LOG-IN WITH PASSWORD
              </button>
            </div>
          </div>

          <div className="input_container">
            <div className="roles_cont">
              {!roleId && <h3>Select Staff Name</h3>}
              {false && (
                <select onChange={(e) => setRoleId(e.target.value)}>
                  <option>Select Staff Name</option>
                  {rolesData.length
                    ? rolesData.map((role) => {
                        return (
                          <option value={role.id}>{role.firstName}</option>
                        );
                      })
                    : ""}
                </select>
              )}

{!roleId && rolesData.length > 0 &&
  rolesData.map((role) => (
    <Button
      key={role.id}
      onClick={() => setRoleId(role.id)}
      value={role.id}
      variant="outlined"
      style={{ width: "150px",height:"130px" }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize:"1.2em",
          fontWeight:"bold"
        }}
      >
        <Avatar {...stringAvatar(role.firstName)} style={{width:'50px',height:"50px"}} />
        {role.firstName}
      </span>
    </Button>
  ))}

              {roleId && (
                <h3>
                  {"Welcome " +
                    rolesData.filter((r) => r.id == roleId)[0].firstName +
                    "!"}
                </h3>
              )}
            </div>

            <div style={roleId ? { display: "block" } : { display: "none" }}>
              <div className="screen">
                <div className="screen_feild">
                  <input readOnly type="password" defaultValue={pin}/>
                  <BackspaceOutlinedIcon onClick={handleBackSpace} />
                </div>
              </div>
              <div className="keyboard_container">
                <h3 className="input_title">SELECT MPIN</h3>
                <button id="btn1" onClick={() => appendToInput("1")}>
                  1
                </button>
                <button id="btn2" onClick={() => appendToInput("2")}>
                  2
                </button>
                <button id="btn3" onClick={() => appendToInput("3")}>
                  3
                </button>

                <button id="btn4" onClick={() => appendToInput("4")}>
                  4
                </button>
                <br />
                <button id="btn5" onClick={() => appendToInput("5")}>
                  5
                </button>
                <button id="btn6" onClick={() => appendToInput("6")}>
                  6
                </button>
                <button id="btn7" onClick={() => appendToInput("7")}>
                  7
                </button>
                <button id="btn8" onClick={() => appendToInput("8")}>
                  8
                </button>
                <br />

                <button id="btn9" onClick={() => appendToInput("9")}>
                  9
                </button>

                <button id="btn0" onClick={() => appendToInput("0")}>
                  0
                </button>

                <button id="enterBtn" onClick={handleSubmit}>
                  Enter
                </button>
              </div>
            </div>
          </div>

          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={errorMessage}
            onClose={handleClose}
            key={vertical + horizontal}
          >
            <MuiAlert onClose={handleClose} severity="error">
              Error: Wrong PIN entered!!, Please Correct
            </MuiAlert>
          </Snackbar>
        </div>
      </div>
    </>
  );
};

export default RolesLogin;
