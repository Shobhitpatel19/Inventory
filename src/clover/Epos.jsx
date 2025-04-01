import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import configs, { getParameterByName } from "../Constants";
import SearchIcon from "@mui/icons-material/Search";
//import Slider from "react-slick";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import WestIcon from "@mui/icons-material/West";
import { NavLink } from "react-router-dom";

const Epos = (props) => {
  const [order, setOrder] = useState();

  const [totalProducts, setTotalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectPro, setSelectPro] = useState();
  const [proOpen, setProOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [filterPro, setFilterPro] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [orderItem, setOrderItem] = useState([]);

  const [catProducts, setCatProducts] = useState([]);
  const [catId, setCatId] = useState("");
  const [isPayment, setIsPayment] = useState(false);
  const [placeOrder, setPlaceOrder] = useState(true);

  const [addonsGroup, setAddonsGroup] = useState([]);
  const [totalAddons, setTotalAddons] = useState([]);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  let baseURL = configs.baseURL;

  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);

  let originURL =
    window.location.href.indexOf("localhost") > 0
      ? "https://pos.menulive.in"
      : window.location.origin;
  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : [];

  // const baseURL = 'https://api.menulive.in';
  console.log(baseURL + "/api/products");
  let cur = merchantData ? merchantData[0].currency : "";
  let SelectCurrency = cur.toUpperCase() === "INR" ? "₹" : "$";

  const userId = userData ? userData.sub : " ";
  const getCatByUser = `${baseURL}/api/categories?merchantCode=${
    merchantData.length ? merchantData[0].merchantCode : " "
  }`;
  const getProductByUser =
    baseURL +
    `/api/products?merchantCode=${
      merchantData.length ? merchantData[0].merchantCode : " "
    }`;

  console.log(getProductByUser);

  let catAddon;
  if (categories.length && addonsGroup.length) {
    catAddon = [...categories, ...addonsGroup];
  }
  console.log(catAddon);

  useEffect(() => {
    if (!totalProducts.length) {
      axios.get(getProductByUser).then((response) => {
        console.log(response.data);
        if (response.data.length !== totalProducts.length) {
          setTotalProducts(response.data);
        }
      });
    }
  });

  useEffect(() => {
    if (!categories.length) {
      axios.get(getCatByUser).then((response) => {
        console.log(response.data);
        if (response.data.length !== categories.length) {
          setCategories(response.data);
        }
      });
    } else {
      // listProducts(dispatch, categories[0]._id?categories[0]._id:categories[0].id);
      axios
        .get(
          baseURL +
            `/api/categories/${
              categories[0]._id ? categories[0]._id : categories[0].id
            }?merchantCode=${
              merchantData.length ? merchantData[0].merchantCode : " "
            }`
        )
        .then((response) => {
          if (response.data.length !== products.length) {
            setProducts(response.data);
            console.log(response.data);
          }
        });
    }
  }, [categories]);

  useEffect(() => {
    if (!addonsGroup.length) {
      axios
        .get(
          `${baseURL}/api/modifiers?merchantCode=${
            merchantData.length ? merchantData[0].merchantCode : " "
          }`
        )
        .then((res) => setAddonsGroup(res.data));
    }

    // if(!totalAddons.length ){
    //   axios.get(`${baseURL}/api/product-modifiers?merchantCode=${merchantData.length ? merchantData[0].merchantCode:" "}`)
    //   .then(res=>{
    //     let adon=res.data.map(ad=>{
    //       ad["quantity"]=0
    //     return ad
    //     })
    //     setTotalAddons(adon);
    //   })
    // }
  }, []);

  console.log("its open");

  const handleProduct = (p) => {
    setIsOpen(true);
    console.log("its open");
    // console.log(p);
    setProOpen(true);

    let existItem = orderItem.filter((x) => x.name === p.name);
    const items = existItem.length
      ? orderItem.map((x) => (x.name === existItem.name ? p : x))
      : [...orderItem, p];
    setOrderItem(items);
  };

  const handleItem = () => {
    // setProOpen(false);
    // setSelectPro();
  };

  console.log(orderItem);

  useEffect(() => {
    if (orderItem.length) {
      // let  orderItems=orderItem.filter(x=>x.quantity !==0);

      let orderItems = orderItem.map((x) => {
        if (!x.quantity) {
          x.quantity = 1;
        }
        return x;
      });

      const itemsCount = orderItems.reduce((a, c) => a + c.quantity, 0);

      console.log(itemsCount, orderItems);
      const itemsPrice = orderItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );
      const taxPrice = Math.round((5 / 100) * itemsPrice * 100) / 100;
      const totalPrice = Math.round((itemsPrice + taxPrice) * 100) / 100;

      let order = {
        number: 0,
        isPaid: false,
        isReady: false,
        inProgress: true,
        isCanceled: false,
        isDelivered: false,
        orderType: "Eat in",
        customerId: "1234",
        orderSource: "EPOS",
        paymentType: "At Counter",
        payGateOrderId: "",
        currency: cur,
        orderStatus: "NEW", //ACCEPTED, REJECTED
        totalPrice: totalPrice,
        taxPrice: taxPrice,
        orderItems: orderItems,
        userId: userId,
      };
      console.log(order);
      setOrder(order);
    }
  }, [orderItem]);

  let productItems = isSearch
    ? filterPro
    : catProducts.length
    ? catProducts
    : products;

  const handleAdd = (itemId) => {
    let item = order.orderItems.map((x) => {
      if ((x._id ? x._id : x.id) === itemId) {
        x.quantity = x.quantity + 1;
      }
      return x;
    });
    setOrderItem(item);
  };

  const handleRemove = (itemId) => {
    console.log(itemId);
    console.log(order.orderItems);
    let ord = order;
    let item = ord.orderItems.map((x) => {
      if ((x._id ? x._id : x.id) === itemId) {
        x.quantity = x.quantity - 1;
      }
      return x;
    });

    let items = item.filter((x) => x.quantity !== 0);
    ord.orderItems = items;
    ord.totalPrice = 0;
    ord.taxPrice = 0;
    items.length >= 0 ? setOrderItem(items) : setOrder(ord);
    console.log(items);
    // setOrderItem(items);
  };

  const deleteItem = (itemId) => {
    console.log(order.orderItems);
    // myArray.shift();
    if (order.orderItems.length === 1) {
      console.log("single element");
      let ord = order;
      let item = ord.orderItems.filter((item, i) => i !== 0);
      ord.totalPrice = 0;
      ord.taxPrice = 0;
      ord.orderItems = item;
      console.log(item);
      setOrder(ord);
      setOrderItem(item);
    } else {
      let item = order.orderItems.filter((x) => x._id !== itemId);
      console.log(item);
      setOrderItem(item);
    }
  };

  const handleSearch = (e) => {
    console.log(e.target.value);
    let val = e.target.value;
    let fltData = products.filter(
      (pro) => pro.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
    );
    console.log(fltData);
    setFilterPro(fltData);
    setIsSearch(val ? true : false);
  };

  const handleCancle = () => {
    setOrderItem([]);
    setOrder();
    setIsPayment(false);
    setPlaceOrder(true);
  };

  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpg";
  };

  const createOrder = () => {
    let orde = order;

    orde.orderItems = orde.orderItems.map((it) => {
      let ite = {
        _id: it._id,
        quantity: it.quantity,
        price: it.price,
        sub_pro: "",
      };
      return ite;
    });
    console.log(orde);

    if (orde && orderItem.length && orde.orderItems.length) {
      console.log("order Placed");
      axios
        .post(
          `${baseURL}/api/orders?merchantCode=${
            merchantData.length ? merchantData[0].merchantCode : " "
          }`,
          orde
        )
        .then((res) => {
          console.log(res.data);
          setOrderItem([]);
          setOrder();
          setIsPayment(false);
          setPlaceOrder(false);
        });
    }
  };

  const handleContinue = () => {
    if (order && orderItem.length && order.orderItems.length) {
      setIsPayment(true);
    }
  };

  const categoryClickHandler = (catName, catId, isAddOn) => {
    console.log(catName, catId);
    // let fltPro =products.filter(p=>(p.category.id?p.category.id:p.category)===catId);
    if (isAddOn) {
      if (totalAddons.length) {
        let filt = totalAddons.filter((it) => it.category === catId);
        setProducts(filt);
      } else if (totalProducts.length) {
        let filt = totalProducts.filter((it) => it.category === catId);
        setProducts(filt);
      }
    } else {
      axios
        .get(
          baseURL +
            `/api/categories/${catId}?merchantCode=${
              merchantData.length ? merchantData[0].merchantCode : " "
            }`
        )
        .then((response) => {
          setProducts(response.data);
          console.log(response.data);
        });
    }
    // setCatProducts();
    setCatId(catId);
  };

  const cancleOrder = () => {
    setIsPayment(false);
    // setPlaceOrder(false)
    setPlaceOrder(true);
    setOrderItem([]);
    setOrder();
  };

  const handleBack = () => {
    props.setIsEpos(true);
  };

  const handleCash = () => {
    let ord = order;
    ord.paymentState = "PAID";
    console.log(ord);
    setOrder(ord);
    setPlaceOrder(false);
  };

  let cat = catAddon ? catAddon : categories;
  return (
    <div className="main_po">
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
                    : baseURL + "/" + selectPro.image
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
              Close
            </button>
            <button className="btn btn-info btn-small m-2" onClick={handleItem}>
              Add
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        onClose={closeHandler}
        aria-labelledby="max-width-dialog-title"
        style={{ backgroundColor: "#FFBC00 !important" }}
        open={isOpen}
        fullWidth={true}
        maxWidth={state.widthScreen ? "sm" : "xs"}
      >
        <DialogTitle id="titorder" className={styles.center}>
          <Card
            className={styles.cardd}
            style={{
              width: "252px",
              height: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CardMedia
              component="img"
              alt={product.name}
              image={`${baseURL}/` + product.image}
              className={styles.media}
              onError={imageOnErrorHandler}
              style={{ paddingTop: "10px !important" }}
            />
            {product.name} <br />
            {selectedCurrency} {product.price}
          </Card>
        </DialogTitle>
        <Box id="btnorder" className={[styles.countRow, styles.center]}>
          <Button
            className={styles.minus}
            id="minus_btn"
            variant="contained"
            color="primary"
            disabled={quantity === 1}
            onClick={(e) => quantity > 1 && setQuantity(quantity - 1)}
          >
            <RemoveIcon />
          </Button>
          <TextField
            inputProps={{ className: styles.largeInput }}
            InputProps={{
              bar: true,
              inputProps: {
                className: styles.largeInput,
              },
            }}
            // className={styles.largeNumber}
            className="largeNumber"
            type="number"
            variant="filled"
            min={1}
            value={quantity}
          />

          <Button
            className={styles.add}
            id="plus_btn"
            variant="contained"
            color="primary"
            onClick={(e) => setQuantity(quantity + 1)}
          >
            <AddIcon sx={{ fontSize: "1px" }} />
          </Button>
        </Box>
        <Box id="adionorder" style={{ margin: "10px" }}>
          <h4 style={{ textAlign: "center" }}>
            {addons.length >= 1 ? "Add-ons" : ""}
          </h4>
          {addons.length >= 1
            ? addons.map((li) => (
                <div
                  id="addons"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignContent: "center",
                    padding: "3px 15px",
                    fontSize: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <span id="addname"> {li.name} </span>
                  <div className={styles.btn_group} id="btn_group">
                    <span id="pri">
                      {selectedCurrency} {li.price}{" "}
                    </span>
                    <span className={styles.addons} id="addonsbtn">
                      <button
                        className={styles.minus1}
                        onClick={() => removeAddons(li._id ? li._id : li.id)}
                      >
                        <RemoveIcon />
                      </button>
                      {li.quantity}
                      <button
                        className={styles.plus}
                        onClick={() => adAddons(li._id ? li._id : li.id)}
                      >
                        {" "}
                        <AddIcon sx={{ fontSize: "1px" }} />
                      </button>
                    </span>
                  </div>
                </div>
              ))
            : ""}
        </Box>
        <Box id="footorder" className={[styles.row, styles.around]}>
          <Button
            onClick={cancelOrRemoveFromOrder}
            size="large"
            className={[styles.AddlargeButton]}
            style={{
              backgroundColor: "#FFF !important",
              color: "#000 !important",
            }}
            id="btcart"
          >
            {orderItems.find((x) => x.name === product.name)
              ? "Remove"
              : "Cancel"}
            {/* Add */}
          </Button>

          <Button
            onClick={addToOrderHandler}
            variant="contained"
            size="large"
            className={styles.rightlargeButton}
            id="btcart"
          >
            Add
          </Button>
        </Box>
      </Dialog>
      <div className="pos_container" style={{ background: "#fff" }}>
        <div className="items">
          <div style={{ marginTop: "15px" }}>
            {/* <IconButton size="large" color="info"> */}
            <NavLink exact to="/dashboard">
              <WestIcon onClick={handleBack} />
            </NavLink>
            {/* </IconButton> */}
          </div>
          <div>
            <div>
              <table
                align="center"
                cellPadding="5px"
                style={{ padding: "10px", width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>PRICE</th>
                    <th style={{ width: "120px", textAlign: "center" }}>
                      QNT.
                    </th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {order
                    ? order.orderItems.map((item) => {
                        return (
                          <tr
                            style={{
                              borderBottom: "1px solid rgb(164 164 164)",
                            }}
                          >
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td
                              align="start"
                              style={{
                                width: "100px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginRight: "15px",
                              }}
                            >
                              <button
                                className="add_btn"
                                onClick={() =>
                                  handleRemove(item._id ? item._id : item.id)
                                }
                              >
                                <RemoveIcon />
                              </button>
                              <span style={{ margin: "0px 8px" }}>
                                {item.quantity}
                              </span>
                              <button
                                className="add_btn"
                                onClick={() =>
                                  handleAdd(item._id ? item._id : item.id)
                                }
                              >
                                <AddIcon />
                              </button>
                            </td>
                            <td>{(item.quantity * item.price).toFixed(2)}</td>
                            {false && (
                              <td>
                                {/* <button className="btn" onClick={()=>deleteItem(item.name)}>X</button> */}
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
                        );
                      })
                    : ""}
                  <tr>
                    <td colSpan="3" align="end">
                      Sub Total:
                    </td>
                    <td>
                      <b>
                        {order
                          ? (order.totalPrice - order.taxPrice).toFixed(2)
                          : " "}
                      </b>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: "2px solid rgb(164 164 164)" }}>
                    <td colSpan="3" align="end">
                      Tax:
                    </td>
                    <td>{order ? order.taxPrice.toFixed(2) : " "}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" align="end">
                      Total:
                    </td>
                    <td>
                      <b style={{ fontSize: "1.4em" }}>
                        {order ? order.totalPrice.toFixed(2) : " "}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button variant="contained" color="error" onClick={handleCancle}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleContinue}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>

        {!isPayment ? (
          <div className="products" style={{ background: "transparent" }}>
            {/* <div className="cat_container"> */}
            {/* .filter(cat=>!cat.isAddOn) */}
            <div className="cat_cont">
              {cat &&
                cat.map((category) => (
                  <div
                    onClick={() =>
                      categoryClickHandler(
                        category.name,
                        category._id ? category._id : category.id,
                        category.isAddOn
                      )
                    }
                  >
                    {category.image && false ? (
                      <div className="img_container">
                        <img
                          style={{ height: "100%", width: "100%" }}
                          alt="ab"
                          src={`${baseURL}/` + category.image}
                          onError={imageOnErrorHandler}
                        />
                      </div>
                    ) : (
                      <div
                        className="chip"
                        style={{
                          backgroundColor:
                            catId ===
                            (category._id ? category._id : category.id)
                              ? "#f29a2e"
                              : "#32473a",
                        }}
                      >
                        {category.name}
                        {category.isAddOn ? <br /> : ""}
                        {category.isAddOn ? (
                          <>
                            <div className="adons-chip">Add</div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                    <div>{category.image && false ? category.name : ""}</div>
                  </div>
                ))}
            </div>

            {/* </div> */}
            <div>
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
            {/* <div className="product_container">
                            {
                                productItems.length?
                                productItems.map((p)=>{
                                    return(
                                       <div onClick={()=>handleProduct(p)} className="products" style={{paddingBottom:"5px",paddingRight:"0px"}}>
                                         <div className="pro_item">
                                                <img src={p.image===""?"../images/blank.jpeg":baseURL+'/'+p.image}
                                                onError={imageOnErrorHandler}
                                                style={{width:"100%",height:"144px"}}/>
                                                <div style={{display:"flex",justifyContent:"center",alignItems:"center",fontSize:"15px"}}> 
                                                    <span style={{fontWeight:"bold"}}>{p.name}</span>
                                                    <p style={{fontSize:"15px"}}>{SelectCurrency}{p.price}</p>
                                                </div>
                                        </div>
                                       </div>
                                    )
                                })   
                                :<h5 className="text-danger">No Item Found</h5>}
                </div> */}
          </div>
        ) : placeOrder ? (
          <div
            style={{
              width: "57%",
              height: "100vh",
              display: "inline-block",
              textAlign: "center",
              background: "#fff",
            }}
          >
            <h4>Pay Thorugh</h4>
            <div>
              <Button
                variant="contained"
                color="info"
                style={{ height: "50px", margin: "20px" }}
                onClick={handleCash}
              >
                Cash
              </Button>
              <Button
                variant="contained"
                color="info"
                style={{ height: "50px", margin: "20px" }}
                onClick={() => setPlaceOrder(false)}
              >
                Credit Card
              </Button>
              <Button
                variant="contained"
                color="info"
                style={{ height: "50px", margin: "20px" }}
                onClick={() => setPlaceOrder(false)}
              >
                Debit Card
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                color="info"
                style={{ height: "50px", margin: "20px" }}
                onClick={() => setPlaceOrder(false)}
              >
                Check
              </Button>
              <Button
                variant="contained"
                color="info"
                style={{ height: "50px", margin: "20px" }}
                onClick={() => setPlaceOrder(false)}
              >
                Gift Card
              </Button>
              <Button
                variant="contained"
                color="info"
                style={{ height: "50px", margin: "20px" }}
                onClick={() => setPlaceOrder(false)}
              >
                Store Credit
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ width: "56%", background: "#fff" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Button variant="contained" color="error" onClick={cancleOrder}>
                Cancel
              </Button>
              <Button variant="contained" color="success" onClick={createOrder}>
                Place Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Epos;
