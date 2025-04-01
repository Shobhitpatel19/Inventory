import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import SearchIcon from "@mui/icons-material/Search";
import configs, { getParameterByName } from "../Constants";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import "react-responsive-list/assets/index.css";
import Box from "@mui/material/Box";
import { DialogActions, FormControlLabel } from "@mui/material";
import Gallery from "./Gallery";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function MemberProducts() {
  const [addonsGroup, setAddonsGroup] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [price, setPrice] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const [inStock, setInstock] = useState(false);
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [variety, setVariety] = useState(false);
  const [option, setOption] = useState([]);
  const [hideProductList, setHideProductList] = useState(false);
  const [selectProductId, setSelectProductId] = useState(0);
  const [hideEdit, setHideEdit] = useState(false);
  const [products, setProducts] = useState([]);
  const [catItem, setCatItem] = useState();
  const [catType, setCatType] = useState();
  const [proStack, setProStack] = useState();
  const [catId, setCatId] = useState(0);
  const [tags, setTags] = useState();
  const [cooktags, setCookTags] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPro, setFilterPro] = useState([]);
  const [addOn, setAddOn] = useState([]);
  const [select, setSelect] = useState("");
  const [pricevalues, SetPriceValues] = useState({});
  const [selOption, setSeloption] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [image, setImage] = useState(false);
  const [optMap, setOptMap] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddon, setShowAddon] = useState(true);
  const [open, setOpen] = useState(false);
  const [alignment, setAlignment] = React.useState("all");
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  console.log(pricevalues);

  let baseURL = configs.baseURL;

  const [userInfo, setUserInfo] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleSelectedImage = (image) => {
    setSelectedImage(image);
  };
  const handleGallery = () => {
    setShowGallery(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleSubmitImage = () => {
    if (selectedImage) {
      console.log("Selected Image:", selectedImage);
      // Perform any other actions with the selected image
    } else {
      console.error("No image selected!");
    }
    setShowGallery(false); // Close the dialog after submission
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const removeTags = (indexToRemove) => {
    setCookTags([...cooktags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = (event) => {
    if (event.target.value !== "") {
      setCookTags([...cooktags, event.target.value]);
      //props.selectedTags([...tags, event.target.value]);
      event.target.value = "";
    }
  };
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";

  console.log(baseURL + "/api/products");
  let cur = merchantData ? merchantData.currency : "";
  let SelectCurrency = cur.toUpperCase() === "INR" ? "₹" : "$";

  const userId = userData ? userData.sub : " ";
  const getCatByUser = `${baseURL}/api/categories?merchantCode=${merchCode}`;
  const getProductByUser = baseURL + `/api/products?merchantCode=${merchCode}`;
  const getVariety = baseURL + `/api/varieties?merchantCode=${merchCode}`;

  const handleCategoryType = (event) => {
    console.log(event.target.value);
    setCategoryType(event.target.value);
  };

  const handleCheckboxChange = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleFoodNameChange = (event) => {
    setFoodName(event.target.value);
  };
  const handleChangeVariety = (e) => {
    setVariety(e.target.checked);
    axios.get(getVariety).then((response) => {
      console.log(response.data);
      setOption(response.data);
    });
  };
  useEffect(() => {
    if (variety) {
      axios.get(getVariety).then((response) => {
        console.log(response.data);
        setOption(response.data);
      });
    }
  }, [variety]);

  console.log(select);
  const handleSelectChange = (e) => {
    setSelect(e.target.value);

    let opt = option.filter((opt) => opt.id === select);
    console.log(opt);
    let optmap = opt.map((optmap, index) => optmap.items.split(","));
    console.log(optmap);
    optmap.map((items, index) => {
      let obj = {};
      items.forEach((item) => {
        obj[item] = "";
      });
      console.log(obj);
    });
  };

  useEffect(() => {
    const opt = option.filter((opt) => opt.id === select);
    console.log(opt);
    setOptMap(opt.map((optmap, index) => optmap.items.split(",")));
  }, [option, select]);

  const handleInputChange = (e) => {
    var formData = new FormData();
    let file = e.target.files[0];
    console.log(e.target);
    console.log(file);
    let fileName = "pro_" + new Date().getTime() + file.name;

    formData.append("uploader", file, fileName);
    let postQueriesUrl = baseURL + "/api/upload/INVENTORY_ITEM";
    axios.post(postQueriesUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setImageURL("app-uploads/customers/inventories/" + fileName);

    //setImageURL(file);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleCalorieChange = (event) => {
    setCalorie(event.target.value);
  };

  const handleInStockChange = (event) => {
    setInstock(event.target.value);
    console.log(event.target.value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // const handleAddOns=(event)=>{
  //   setAddOn(event.target.value);
  // }
  let catAddongrp;
  if (categories.length) {
    catAddongrp = [...categories, ...addonsGroup];
  }
  console.log(catAddongrp);

  const handleClose = () => {
    setHideProductList(false);
    setHideEdit(false);
    setInstock("");
    setCalorie("");
    setFoodName("");
    setDescription("");
    setPrice("");
    setVariety(false);
    setSelect("");
    SetPriceValues("");
    setInstock("");
    setTags("");
    setCookTags("");
    setImageURL("");
    setAddOn([]);
    setCatType("");
    setCatItem("");
    setProStack("");
    setSelectProductId("");
  };

  const setTextValue = (value, item) => {
    SetPriceValues((prevValues) => ({
      ...prevValues,
      [item]: value,
    }));
  };
  console.log(pricevalues);
  console.log(catType);
  const handleSubmit = (event) => {
    event.preventDefault();
    // setHideProductList(false);
    console.log(pricevalues);
    console.log(
      `Food name: ${foodName},image:${imageURL}, cat_type:${categoryType},category:${catId},Description: ${description}, Price: ${price}, Calorie: ${calorie}, InStock:${inStock},Tags:${tags}`
    );
    console.log(cooktags);
    if (!foodName || !catId) {
      console.log("error");
      let cat_type = document.getElementsByClassName("category");
      cat_type[0].style.borderColor = "red";

      let fname = document.getElementsByClassName("name");
      fname[0].innerHTML = "required";
      fname[1].style.borderColor = "red";
    } else if (selectProductId) {
      console.log(cooktags.length ? cooktags.join(",") : "");

      axios
        .put(baseURL + "/api/products/" + selectProductId, {
          cat_type: categoryType,
          category: catId,
          name: foodName,
          description: description,
          image: imageURL ? imageURL : selectedImage.image,
          isPriceVariety: variety,
          varietyGroupId: select.toString(),
          varietyPrices: JSON.stringify(pricevalues),
          cookInstructions: cooktags.length ? cooktags.join(",") : "",
          price: price,
          calorie: calorie,
          inStock: inStock,
          id: selectProductId,
          tags: tags,
          add_ons: addOn.length ? addOn.join(",") : "",
          userId: userId,
        })
        .then((response) => {
          console.log(response.data);
          axios.get(`${getProductByUser}`).then((response) => {
            console.log(response.data);
            setProducts(response.data);
          });
        });
      setHideProductList(false);
      setHideEdit(false);
    } else {
      axios
        .post(baseURL + "/api/products", {
          cat_type: categoryType,
          category: catId,
          name: foodName,
          description: description,
          image: imageURL != "" ? imageURL : selectedImage.image,
          price: price,
          isPriceVariety: variety,
          varietyGroupId: select,
          varietyPrices: JSON.stringify(pricevalues),
          calorie: calorie,
          inStock: inStock ? inStock : false,
          tags: tags,
          cookInstructions: cooktags.length ? cooktags.join(",") : "",
          add_ons: addOn.length ? addOn.join(",") : "",
          userId: userId,
        })
        .then((response) => {
          console.log(response.data);
          axios.get(`${getProductByUser}`).then((response) => {
            console.log(response.data);
            setProducts(response.data);
          });
        });
      setHideProductList(false);
      setHideEdit(false);
    }

    setCookTags("");
    setTags("");
    setInstock("");
    setCatId("");
    setCalorie("");
    setFoodName("");
    setDescription("");
    setPrice("");
    setVariety(false);
    setSelect("");
    SetPriceValues("");
    setInstock("");
    setImageURL("");
    setCookTags([]);
    setAddOn([]);
    setCatType("");
    setProStack("");
    setCatItem("");
    setSelectProductId("");
  };
  useEffect(() => {
    console.log(categories);

    if (!categories.length) {
      axios.get(getCatByUser).then((response) => {
        console.log(response.data);
        if (response.data.length !== categories.length) {
          setCategories(response.data);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!products.length) {
      getProductsList();
    }
  });

  const getProductsList = () => {
    axios.get(getProductByUser).then((response) => {
      if (response.data) {
        console.log(response.data);
        setProducts(response.data);
        let addons = [];
        addons = categories.filter((c) => c.isAddOn);
        let addIds = addons.map((a) => a.id);
        console.log(addIds);
        setAddonsGroup(
          response.data.filter((pro) => addIds.indexOf(pro.category) !== -1)
        );
      }
    });
  };
  console.log(addonsGroup);
  const handleCategoryId = (event) => {
    setCatId(event.target.value);
    console.log(event.target.value);
    console.log(categories);
    let addonsval = categories.filter((addcat) => addcat.isAddOn === true);
    console.log(addonsval, event.target.value);
    let addvalue = addonsval.filter(
      (addonval) => addonval.id === event.target.value
    );
    console.log(addvalue);
    if (addvalue.length > 0) {
      setShowAddon(false);
    } else {
      setShowAddon(true);
    }
  };
  console.log(addonsGroup);
  const handleUpload = () => {
    setImage(true);
  };
  const handleDelete = (id) => {
    console.log(id);
    axios.delete(baseURL + "/api/products/" + id).then((response) => {
      getProductsList();
    });
  };

  const handleEdit = (
    pro_id,
    pro_image,
    pro_category,
    proCat_type,
    pro_stock
  ) => {
    console.log(pro_image);
    console.log(pro_id);
    setHideEdit(true);
    setCatItem(pro_category);
    setCatType(proCat_type);
    setProStack(pro_stock);

    setSelectProductId(pro_id);
    if (pro_image) {
      setImageURL(pro_image);
    } else {
      setImageURL(imageURL);
    }
    axios.get(getVariety).then((response) => {
      console.log(response.data);
      setSeloption(response.data);
    });

    const prodata = products.filter((pro) => pro.id === pro_id);

    setFoodName(prodata[0].name);
    setDescription(prodata[0].description);
    setVariety(prodata[0].isPriceVariety);
    if (prodata[0].isPriceVariety) {
      setSelect(prodata[0].varietyGroupId);
      SetPriceValues(JSON.parse(prodata[0].varietyPrices));
    }
    setPrice(prodata[0].price);
    setInstock(prodata[0].inStock);
    setCalorie(prodata[0].calorie);
    setTags(prodata[0].tags);
    setCookTags(
      prodata[0].cookInstructions ? prodata[0].cookInstructions.split(",") : []
    );

    console.log(prodata[0]);
    setCatId(prodata[0].category);
    setAddOn(prodata[0].add_ons.split(",").filter((a) => a.length));
  };

  const handleStocks = (prod) => {
    console.log(prod);
    axios
      .put(baseURL + "/api/products/" + prod.id, {
        cat_type: prod.cat_type,
        category: prod.category,
        name: prod.name,
        description: prod.description,
        image: prod.image,
        price: prod.price,
        calorie: prod.calorie,
        inStock: prod.inStock ? false : true,
        id: prod.id,
        tags: prod.tags,
        add_ons: prod.add_ons,
        userId: prod.userId,
      })
      .then((response) => {
        getProductsList();
        setOpen(false);
      });
  };

  const handleClosePopup = () => {
    setOpen(false);
    setSelectedProduct(null);
  };
  const filterProducts = (event) => {
    let fname = event.target.value;
    console.log(fname);
    let filter = products.filter(
      (li) => li.name.toLowerCase().indexOf(fname.toLowerCase()) !== -1
    );
    console.log(filter);
    setFilterOpen(fname ? true : false);
    setFilterPro(fname ? filter : []);
  };

  const removeAddons = (indexToRemove) => {
    setAddOn([...addOn.filter((_, index) => index !== indexToRemove)]);
  };
  const handleAddOns = (event) => {
    let val = event.target.value;
    if (val !== "") {
      let existItem = addOn.filter((x) => x === val);
      const items = existItem.length
        ? addOn.map((x) => (x === existItem[0] ? val : x))
        : [...addOn, val];
      console.log(event.target.value);
      setAddOn(items);
    }
  };
  let cat_ad = [];

  if (categories && products) {
    console.log(categories, products);
    let adFilter = categories.filter((cat) => cat.isAddOn);
    console.log(adFilter);
    let addPro = products.filter((pro) =>
      adFilter.filter((li) => {
        if (li.id === pro.category) {
          cat_ad.push(pro);
        }
      })
    );
  }

  console.log(select.length);
  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpeg";
  };

  let catAddon = categories;
  console.log(products)

  const filterProductsByAvailability = (products, alignment) => {
  console.log(products)

    if (alignment === "available") {
      return products.filter((product) => product.inStock);
    } else if (alignment === "notavailable") {
      return products.filter((product) => !product.inStock);
    } else {
      return products;
    }
  };

  const filteredProducts = filterProductsByAvailability(products, alignment);
  console.log(catId);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  return (
    <>
      <div className="container">
        <div className="header">
          <h4 className="">Items</h4>
          <div className="search">
            <SearchIcon />
            <input
              type="text"
              onChange={filterProducts}
              placeholder="Enter Name"
              style={{
                border: "none",
                outline: "none",
                width: "87%",
                backgroundColor: "transparent",
              }}
            />
          </div>
          <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="all">All</ToggleButton>
      <ToggleButton value="available">Available</ToggleButton>
      <ToggleButton value="notavailable">Not Available</ToggleButton>
    </ToggleButtonGroup>

        </div>

      
    

        <div className="product-list">
          <Table width="100%" cellPadding="4px">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Images</Th>
                <Th>is Available ?</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.length
                ? filteredProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((p) => {
                      console.log(p);
                      let cat_name =
                        catAddon && catAddon.length
                          ? catAddon.filter(
                              (cat) =>
                                (p.category.id ? p.category.id : p.category) ===
                                (cat._id ? cat._id : cat.id)
                            )
                          : [];
                      console.log(p);
                      cat_name = cat_name.length ? cat_name[0].name : "";

                      return (
                        <Tr
                          style={{
                            borderBottom: "1px solid #f0eeee",
                            margin: "5px",
                          backgroundColor: p.inStock ? "#e5ffe5" : "#ffe5e5"
                          }}
                        >
                          <Td
                            style={{
                              overflow: "hidden",
                              whiteSpace: "wrap",
                              fontWeight: "bold",
                            }}
                          >
                            {p.name}
                          </Td>
                          <Td style={{ padding: "10px 0px" }}>
                            <img
                              src={
                                p.image === ""
                                  ? "./images/blank.jpg"
                                  : baseURL + "/" + p.image
                              }
                              alt={p.name}
                              onError={imageOnErrorHandler}
                              style={{
                                width: "80px",
                                height: "40px",
                                borderRadius: "5px",
                              }}
                            />
                          </Td>
                          <Td>
                            <input
                              type="checkbox"
                              checked={p.inStock}
                              onChange={() => handleCheckboxChange(p)}
                              style={{
                                width: "40px",
                                height: "20px",
                                accentColor: p.inStock ? "#31e631" : "#ff0000", 
                                cursor: "pointer",
                              }}
                            />
                          </Td>
                        </Tr>
                      );
                    })
                : ""}
            </Tbody>
          </Table>
          {filteredProducts && filteredProducts.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            height: "auto",
            maxWidth: "none",
          },
        }}
      >
        <DialogTitle id="responsive-dialog-title">Confirm Action</DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ textAlign: "center" }}>
            {selectedProduct ? (
              <>
                <strong>{selectedProduct.name}</strong>{" "}
                {selectedProduct.inStock ? (
                  <strong style={{ color: "red" }}> NOT-AVAILABLE</strong>
                ) : (
                  <strong style={{ color: "green" }}> AVAILABLE</strong>
                )}
                ?
              </>
            ) : (
              "Loading..."
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="Outlined"
            color="error"
            onClick={handleClosePopup}
            style={{ color: "red" }}
          >
            <strong>Cancel</strong>
          </Button>
          <Button
            onClick={() => handleStocks(selectedProduct)}
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MemberProducts;
