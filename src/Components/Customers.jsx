import React, { useEffect, useState } from "react";
import configs from "../Constants";
import axios from "axios";
import TablePagination from "@mui/material/TablePagination";
import SearchIcon from "@mui/icons-material/Search";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, TextField, Button } from "@mui/material";
import DeleteDiaologue from "./sub_comp/Delete";
const Customers = () => {
  const [customerData, setCustomerData] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [name, setName] = useState("");
  const [mobileNo, setMoblileNo] = useState(0);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [edit, setEdit] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const [filterPro, setFilterPro] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  let domain =
    window.location.href.indexOf("localhost") > 0
      ? "https://menu.merchantnations.com"
      : window.location.origin;

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);
  const userId = userData ? userData.sub : " ";
  let baseURL = configs.baseURL;
  let authApi = configs.authapi;
  console.log(`${authApi}/api/customer/${userId}`);

  let userToken = sessionStorage.getItem("token")
    ? sessionStorage.getItem("token")
    : "";
  // let userToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTZmMmE2ODc0YTRkNjIzYmJlM2Q1ODAiLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NDQyNjUxNTAsImV4cCI6MTc0NDg2OTk1MH0.NmI9JEM2gChfmIL9R8eR3XVpjLom4PUdKx0NTD_0bCE";
  console.log(userToken);
  const getCustomerList = () => {
    // console.log("This is the token: " + userToken)
    // console.log("This is the api that is calling from the customers end : " + `${authApi}/customer?merchantCode=${merchCode}`)
    axios({
      method: "get",
      url: `${authApi}/user/customers?merchantCode=${merchCode}`,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((res) => {
      console.log(res.data);
      setCustomerData(res.data);
    });
  };
  useEffect(() => {
    if (!customerData.length) {
      getCustomerList();
    }
  }, []);
  const handleSubmit = () => {
    console.log(mobileNo);
    axios
      .put(`${authApi}/customer/${editedData.id}`, {
        phone: mobileNo !== 0 ? mobileNo : editedData.phone,
        firstName: name !== "" ? name : editedData.firstName,
        address: address !== "" ? address : editedData.address,
        email: email !== "" ? email : editedData.email,
      })
      .then((res) => {
        console.log(res.data);
        setEdit(false);
        getCustomerList();
      });
  };
  const handleDelete = (id) => {
    // console.log(id);
    // axios.delete(`https://authapi.digitallive24.com/customer/${deleteItemId}`).then((response) => {
    //     getCustomerList();
    // });
    setDeleteItemId(id);
    setOpenDeleteDialog(true);
  };
  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteItemId) {
      axios
        .delete(`${authApi}/customer/${deleteItemId}`)
        .then((response) => {
          getCustomerList();
        });
    }
    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEdit = async (id) => {
    // setEdit(true);
    console.log(id);
    try{
      if (id) {
        await axios
          .get(`${authApi}/customer/${id}`)
          .then((res) => {
            console.log(res.data);
            const data = res.data;
            setEditedData(data);
  
            setName(data.firstName || "");
            setMoblileNo(data.phone || "");
            setAddress(data.address || "");
            setEmail(data.email || "");
          });
      }
    }catch (e){
      console.log(e);
    }finally{
      setEdit(true);
    }
  };
  const filterCustomers = (e) => {
    console.log(customerData);
    let val = e.target.value;
    let fltData = customerData.filter(
      (pro) =>
        pro.firstName.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        pro.phone.indexOf(val.toLowerCase()) !== -1 ||
        pro.email.indexOf(val.toLowerCase()) !== -1 ||
        pro.address.indexOf(val.toLowerCase()) !== -1
    );
    setFilterPro(fltData);
    setIsSearch(val ? true : false);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleMobileNo = (e) => {
    setMoblileNo(e.target.value);
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleClose = () => {
    setEdit(false);
  };

  let productItems = isSearch ? filterPro : customerData;
  return (
    <div className="container">
      <div className="header">
        <h4>Customers</h4>
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            onChange={filterCustomers}
            placeholder="Enter Customer Details"
            style={{
              border: "none",
              outline: "none",
              width: "87%",
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>
      <div className="product-list">
        <Table width="100%" cellPadding="4px">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Mobile Number</Th>
              <Th>Address</Th>
              <Th>Email ID</Th>
              <Th>Created Date</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {productItems.length
              ? productItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer) => {
                    return (
                      <Tr
                        style={{
                          borderBottom: "1px solid #f0eeee",
                          margin: "5px",
                        }}
                      >
                        <Td>{customer.firstName}</Td>
                        <Td>{customer.phone}</Td>
                        <Td>{customer.address}</Td>
                        <Td>{customer.email}</Td>
                        <Td>
                          {moment(customer.createdDate).format(
                            "h:mm a  DD MMM YYYY"
                          )}
                        </Td>
                        <Td>
                          <Td align="center">
                            <IconButton
                              aria-label="delete"
                              size="large"
                              color="info"
                              onClick={() => handleEdit(customer.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Td>

                          <Td align="center">
                            {/* <button className='btn btn-danger' onClick={()=> handleDelete(p.id)}><DeleteIcon/></button> */}
                            <IconButton
                              aria-label="delete"
                              size="large"
                              color="error"
                              onClick={() => handleDelete(customer.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Td>
                        </Td>
                      </Tr>
                    );
                  })
              : ""}
          </Tbody>
        </Table>
        {customerData && customerData.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={customerData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </div>
      {openDeleteDialog === true ? (
        <DeleteDiaologue
          open={openDeleteDialog}
          onClose={handleDeleteClose}
          onConfirm={handleConfirmDelete}
        />
      ) : (
        <div />
      )}
      <Dialog open={edit} maxWidth="md">
        <div className="dialogTitle">
          <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
            {"Edit Customer Data"}
          </DialogTitle>
        </div>

        <div>
          <>
            <form
              style={{
                padding: "18px",
                paddingLeft: "18px",
                paddingTop: "50px",
              }}
            >
              <div className="row">
                <div>
                  <Box
                    sx={{
                      width: 500,
                      maxWidth: "100%",
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <label>Name</label>
                    <TextField
                      fullWidth
                      id="fullWidth"
                      onChange={handleName}
                      // value={name ? name : editedData.firstName || ""}
                      value={name}
                    />
                  </Box>
                </div>

                <div>
                  <Box
                    sx={{
                      width: 300,
                      maxWidth: "100%",
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <label>Mobile Number</label>
                      <TextField
                        fullWidth
                        id="fullWidth"
                        type="number"
                        onChange={handleMobileNo}
                        name="Mobile Number"
                        // value={mobileNo ? mobileNo : editedData.phone || 0}
                        value={mobileNo}
                      />
                    </div>
                  </Box>
                </div>
              </div>{" "}
              <div className="row">
                <div>
                  <Box
                    sx={{
                      width: 500,
                      maxWidth: "100%",
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <label>Address</label>
                    <TextField
                      fullWidth
                      id="fullWidth"
                      onChange={handleAddress}
                      // value={address ? address : editedData.address || ""}
                      value={address}
                    />
                  </Box>
                </div>

                <div>
                  <Box
                    sx={{
                      width: 500,
                      maxWidth: "100%",
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <label>Email Id</label>
                      <TextField
                        fullWidth
                        id="fullWidth"
                        onChange={handleEmail}
                        name="description"
                        // value={email ? email : editedData.email || ""}
                        value={email}
                      />
                    </div>
                  </Box>
                </div>
              </div>
            </form>

            <div className="fixed-buttons">
              <Button
                className="save-btn"
                variant="contained"
                color="success"
                style={{ margin: "20px", background: "#f7c919" }}
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                style={{ margin: "20px" }}
                className="close-btn"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </>
        </div>
      </Dialog>
    </div>
  );
};

export default Customers;
