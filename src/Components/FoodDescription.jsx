import React, { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import configs, { getParameterByName } from "../Constants";
import { json } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Paper from '@mui/material/Paper';
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import CloseIcon from "@mui/icons-material/Close";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Divider from '@mui/material/Divider';
import TablePagination from "@mui/material/TablePagination";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import "react-responsive-list/assets/index.css";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuList from '@mui/material/MenuList';
import Box from "@mui/material/Box";
import { FormControlLabel } from "@mui/material";
import InventoryProLink from  './sub_comp/InventoryProLink';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  Typography,
  DialogActions,
  DialogContent,
  DialogContentText,

} from "@mui/material";
import Gallery from "./Gallery";
import Currencies from "../root/currency";
import DeleteDiaologue from "./sub_comp/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import AddLinkIcon from '@mui/icons-material/AddLink';

function FoodDescription() {
  const [addonsGroup, setAddonsGroup] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [kitchenList, setKitchenList] = useState([]); 
  const [selectedKitchen, setSelectedKitchen] = useState(""); 
  const [price, setPrice] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const [inStock, setInstock] = useState(true);
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
  );
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
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const [image, setImage] = useState(false);
  const [optMap, setOptMap] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddon, setShowAddon] = useState(false);
  const [isPriceEditable, setEditablePrice] = useState(false);
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState("");

  const [showInventory, setShowInventory] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [openActions, setOpenActions] = React.useState(false);

  const getVarietyOptions = () => {
    const selectedOpt = option.find((opt) => opt.id === select);
    return selectedOpt ? selectedOpt.items.split(",") : [];
  };

  //add by sk
  const [selectedCategory, setSelectedCategory] = useState("");
  let baseURL = configs.baseURL;
  // let baseURL = "https://inventory-service-gthb.onrender.com"
  let staticSer = configs.staticSer;
  const userToken = sessionStorage.getItem("token") || "";

  const [userInfo, setUserInfo] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const handleSelectedImage = (image) => {
    setSelectedImage(image);
  };

  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/kitchens?merchantCode=${merchCode}`
        );
        setKitchenList(response.data); // Assuming response.data is an array of kitchens
      } catch (error) {
        console.error("Error fetching kitchens:", error);
      }
    };

    fetchKitchens();
  }, []);

  

  const handleGallery = () => {
    setSearchQuery(foodName);
    setShowGallery(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleSubmitImage = () => {
    if (selectedImage) {
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

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";


  let currency = Currencies.filter(
    (curen) => curen.abbreviation == merchantData.currency
  );
  let SelectCurrency = currency && currency[0] ? currency[0].symbol : "";
  const selectedCurrency = (
    <span dangerouslySetInnerHTML={{ __html: SelectCurrency }} />
  );

  const userId = userData ? userData.sub : " ";
  const getCatByUser = `${baseURL}/api/categories?merchantCode=${merchCode}`;
  const getProductByUser = baseURL + `/api/products?merchantCode=${merchCode}`;
  const getVariety = baseURL + `/api/varieties?merchantCode=${merchCode}`;

  const handleCategoryType = (event) => {
    setCategoryType(event.target.value);
  };

  const handleFoodNameChange = (event) => {
    setFoodName(event.target.value);
  };
  const handleChangeVariety = (e) => {
    setVariety(e.target.checked);
    axios.get(getVariety).then((response) => {
      setOption(response.data);
    });
  };
  useEffect(() => {
      axios.get(getVariety).then((response) => {
        setOption(response.data);
      });
  }, []);

  const handleSelectChange = (e) => {
    setSelect(e.target.value);

    let opt = option.filter((opt) => opt.id === select);
    let optmap = opt.map((optmap, index) => optmap.items.split(","));
    optmap.map((items, index) => {
      let obj = {};
      items.forEach((item) => {
        obj[item] = "";
      });
    });
  };

  useEffect(() => {
    const opt = option.filter((opt) => opt.id === select);
    setOptMap(opt.map((optmap, index) => optmap.items.split(",")));
  }, [option, select]);

  const handleInputChange = (e) => {
    var formData = new FormData();
    let file = e.target.files[0];
    let fileName = "pro_" + new Date().getTime() + file.name;

    formData.append("uploader", file, fileName);
    let postQueriesUrl = baseURL + "/api/upload/INVENTORY_ITEM";
    axios.post(postQueriesUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setImageURL(`${configs.staticSer}/INVENTORY_ITEM/${fileName}`);

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
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  let catAddongrp;
  if (categories.length) {
    catAddongrp = [...categories, ...addonsGroup];
  }

  const handleClose = () => {
  resetVars();
  };

  const setTextValue = (value, item) => {
    SetPriceValues((prevValues) => ({
      ...prevValues,
      [item]: value,
    }));
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!foodName || !catId) {
        const catElement = document.getElementsByClassName("category")[0];
        if (catElement) {
            catElement.style.borderColor = "red";
        }

        const nameElements = document.getElementsByClassName("name");
        if (nameElements && nameElements.length > 1) {
            if (nameElements[0]) {
                nameElements[0].innerHTML = "required";
            }
            if (nameElements[1]) {
                nameElements[1].style.borderColor = "red";
            }
        }
        return;
    }

    // Check for duplicate name if creating new product
    if (!selectProductId) {
      const duplicateProduct = products.find(
        (product) => product.name.toLowerCase() === foodName.toLowerCase()
      );
      
      if (duplicateProduct) {
        toast.error("An item with this name already exists!");
        return;
      }
    }

    if (selectProductId) {
      // Update existing product
      axios
        .put(
          baseURL +
            "/api/products/" +
            selectProductId +
            "?merchantCode=" +
            merchCode,
          {
            cat_type: categoryType,
            category: catId,
            name: foodName,
            description: description,
            image:
              selectedImage && selectedImage.image
                ? selectedImage.image
                : imageURL,
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
            isPriceEditable: isPriceEditable,
            kitchenId: selectedKitchen,
          },
          { headers: { Authorization: `Bearer ${userToken}` } }
        )
        .then((response) => {
          axios.get(`${getProductByUser}`).then((response) => {
            setProducts(response.data);
          });
        });
      setHideProductList(false);
      setHideEdit(false);
    } else {
      // Create new product
      axios
        .post(
          baseURL + "/api/products?merchantCode=" + merchCode,
          {
            cat_type: categoryType,
            category: catId,
            name: foodName,
            description: description,
            image:
              selectedImage && selectedImage.image
                ? selectedImage.image
                : imageURL,
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
            isPriceEditable: isPriceEditable,
          },
          {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          const newProductId = response.data.id || "newProduct";
          axios.get(`${getProductByUser}`).then((response) => {
            setProducts(response.data);
          });
         
        });
      setHideProductList(false);
      setHideEdit(false);
    }
    // Reset states after submit
    resetVars();
  };

  const resetVars = () => {
    setCookTags("");
    setSelectedImage();
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
    setImageURL(
      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
    );
    setCookTags([]);
    setAddOn([]);
    setCatType("");
    setProStack("");
    setCatItem("");
    setSelectProductId("");
    setEditablePrice(false);
     setHideProductList(false);
     setHideEdit(false);
  }

  useEffect(() => {
    if (!categories.length) {
      axios.get(getCatByUser).then((response) => {
        if (response.data.length !== categories.length) {
          setCategories(response.data);
        }
      });
    }
  }, []);

  useEffect(() => {
      getProductsList();
  },[]);

  const getProductsList = () => {
    axios.get(getProductByUser).then((response) => {
      if (response.data) {
        setProducts(response.data);
        let addons = [];
        addons = categories.filter((c) => c.isAddOn);
        let addIds = addons.map((a) => a.id);
        setAddonsGroup(
          response.data.filter((pro) => addIds.indexOf(pro.category) !== -1)
        );
      }
    });
  };
  const handleCategoryId = (event, catId) => {
    let selectCatId = event?.target?.value || catId;
    setCatId(selectCatId);
    setCatItem(selectCatId);
    let addonsval = categories.filter((addcat) => addcat.isAddOn === true);
    let addvalue = addonsval.filter((addonval) => addonval.id === selectCatId);
    if (addvalue.length > 0) {
      setShowAddon(false);
    } else {
      setShowAddon(true);
    }
  };
  const handleUpload = () => {
    setImage(true);
  };
  const handleDelete = (id) => {
    const product = products.find((prod) => prod.id === id);
    setDeleteItemName(product?.name || "this item");
    setDeleteItemId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteItemId) {
      axios.delete(`${baseURL}/api/products/${deleteItemId}`).then(() => {
        getProductsList();
        handleDeleteClose();

      });
    }

  };

  const handleEdit = (
    pro_id,
    pro_image,
    pro_category,
    proCat_type,
    pro_stock
  ) => {
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
    setEditablePrice(prodata[0].isPriceEditable);

    setCatId(prodata[0].category);
    setAddOn(prodata[0].add_ons.split(",").filter((a) => a.length));
    handleCategoryId(null, prodata[0].category);
  };

  const handleStocks = (prod) => {
    axios
      .put(
        baseURL + "/api/products/" + prod.id + "?merchantCode=" + merchCode,
        {
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
          isPriceEditable: prod.isPriceEditable,
        },
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        getProductsList();
      });
  };
  const filterProducts = (event) => {
    let fname = event.target.value;
    let filter = products.filter(
      (li) => li.name.toLowerCase().indexOf(fname.toLowerCase()) !== -1
    );
    setFilterOpen(fname ? true : false);
    setFilterPro(fname ? filter : []);
  };

  const removeAddons = (indexToRemove) => {
    setAddOn([...addOn.filter((_, index) => index !== indexToRemove)]);
  };
  const handleAddOns = (event) => {
    let val = event.target.value;
    if (val) {
      let existItem = addOn.filter((x) => x === val);
      const items = existItem.length
        ? addOn.map((x) => (x === existItem[0] ? val : x))
        : [...addOn, val];
      setAddOn(items);
    }
  };
  let cat_ad = [];

  if (categories && products) {
    let adFilter = categories.filter((cat) => cat.isAddOn);
    let addPro = products.filter((pro) =>
      adFilter.filter((li) => {
        if (li.id === pro.category) {
          cat_ad.push(pro);
        }
      })
    );
  }

  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpeg";
  };

  let catAddon = categories;
  let prod = filterOpen ? (filterPro.length ? filterPro : "") : products;

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleShowProductForm = () => {
    setSelectProductId("");
    setHideProductList(true);
  };

  const handleKitchenChange = (event) => {
    setSelectedKitchen(event.target.value);
  };


  const handleActionsClick = (pro_id) => {
     setSelectProductId(pro_id);
    setOpenActions(!openActions);
  };

  const handleActionsClose = () => {
    console.log(openActions);
    setOpenActions(false);
  };

  const showInventoryDialog = (foodName) => {
    setShowDialog(true);
    setShowInventory(foodName);
    setOpenActions(false);

  }
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

          {/* add by sk */}
          <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="category-select-label">
                <label>Category</label>
              </InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory||"all"}
                label="Category"
                size="small"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">
                  <em>All</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {merchCode && !merchCode.activeProviderId ? (
            <button
              className="add_btn"
              onClick={handleShowProductForm}
            >
              <AddIcon /> Add New
            </button>
          ) : (
            <span></span>
          )}
        </div>



        <Dialog
          open={hideProductList || hideEdit}
          maxWidth="lg"
          fullWidth={true}
        >
        
            <DialogTitle style={{ fontWeight: "bold" }}>
              {hideEdit ? "Edit Products" : "Add Products"}
            </DialogTitle>
  
        <IconButton
          aria-label="close"
          onClick={resetVars}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div>
            {hideProductList || hideEdit ? (
              <>
                <form>
                  <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      label="Category"
                      value={catId}
                      onChange={(e) => handleCategoryId(e)}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {catAddon &&
                        catAddon.length &&
                        catAddon.map((cat) => (
                          <MenuItem
                            key={cat.id}
                            value={cat.id}
                            selected={catItem === cat.id}
                          >
                            {cat.name}
                            {cat.isAddOn ? (
                              <span
                                className="MuiChip-filledError MuiChip-filled"
                                style={{
                                  padding: "3px 7px",
                                  marginLeft: "5px",
                                }}
                              >
                                {"ADD-ON"}
                              </span>
                            ) : (
                              ""
                            )}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <br />
                  <div className="row">
                    <div className="col">
                      <Box
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          fullWidth
                          label="Name"
                          defaultValue=""
                          onChange={handleFoodNameChange}
                          name="foodname"
                          value={foodName}
                        />
                      </Box>
                    </div>

                    <div className="col">
                      <Box
                        
                        noValidate
                        autoComplete="off"
                      >
                        <div>
                          <TextField
                            fullWidth
                            label="Description"
                            defaultValue=""
                            onChange={handleDescriptionChange}
                            name="description"
                            value={description}
                          />
                        </div>
                      </Box>
                    </div>
                  </div>
                  <br />
                  <div className="row dialog-row">
                    <label><b>Item Image </b></label>
                    <div className="col">
                      <Box
                      
                        noValidate
                        autoComplete="off"
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginLeft: "10px",
                          }}
                        >
                          <Button variant="contained" onClick={handleGallery}>
                            Add From Gallery
                          </Button>
                          <Button variant="outlined" onClick={handleUpload}>
                            Upload New
                          </Button>
                        </div>
                      </Box>
                      <span style={{ fontSize: "1rem" }}>
                        {selectedImage ? selectedImage.name : ""}
                      </span>
                    </div>
                    <div
                      className="col"
                      style={image ? { display: "block" } : { display: "none" }}
                    >
                      <Box
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          label=""
                          defaultValue=""
                          onChange={handleInputChange}
                          type="file"
                          name="image"
                        />
                      </Box>
                    </div>
                  </div>
                  <br />
                  <Divider sx={{ my: 0.5 }} />
                  <div className="row">
                    <label style={{ marginTop: "8px" }}>
                      <b>SET PRICE DETAILS</b>{" "}
                    </label>{" "}
                   </div>

                  <div className="row">
                    <div  style={
                            variety ? { display: "block" } : { display: "none" }
                          }>
                        <div
                          id="itemPrice">
                          {optMap.flat().map((item, index) => (
                            <div className="col">
                            <TextField
                              key={index}
                              size="small"
                              id={`outlined-basic-${index}`}
                              label={item}
                              variant="outlined"
                              value={pricevalues[item]}
                              style={{ marginRight: "10px" }}
                              onChange={(e) =>
                                setTextValue(e.target.value, item)
                              }
                            />
                            </div>
                          ))}
                        </div>
                        </div>
                        <div className="col"  style={{ display: variety ? "none" : "block" }}>
                        <div id="price">
                          <TextField
                            fullWidth
                            label="Add Item Price"
                            defaultValue=""
                            onChange={handlePriceChange}
                            type="number"
                            name="price"
                            value={price}
                          />
                        </div>
                     
                    </div>
                   
                  </div>
                  <div className="row">
                    <div className="col" style={{display:"flex"}}>
                     <input
                      onChange={() => setEditablePrice(!isPriceEditable)}
                      type="checkbox"
                      name="isPriceEditable"
                      style={{
                        height: "25px",
                        width: "25px",
                        marginLeft: "5px",
                        cursor: "pointer",
                        accentColor: "rgb(54, 34, 204)",
                      }}
                      checked={isPriceEditable}
                    />
                    <label
                      style={{ marginLeft: "10px",marginTop:"3px" }}
                      htmlFor=""
                    >
                      Editable Price ?
                    </label>
                   </div>

                    <div className="col" style={{display:"flex"}}>
                     <input
                      onChange={handleChangeVariety}
                      type="checkbox"
                      name="variety"
                      style={{
                        height: "25px",
                        width: "25px",
                        marginLeft: "5px",
                        cursor: "pointer",
                        accentColor: "rgb(54, 34, 204)",
                      }}
                      checked={variety}
                    />
                    <label
                      style={{ marginLeft: "10px",marginTop:"3px" }}
                      htmlFor=""
                    >
                      Has Varieties ?
                    </label>
                    </div>

                    <div
                      style={{
                        display: variety ? "block" : "none",
                      }}
                      className="col"
                    >
                     <FormControl sx={{ m: 1, minWidth: 150 }}>
                          <InputLabel id="variety-group-label" htmlFor="">
                            Variety Group
                          </InputLabel>
                      <Select
                            labelId="variety-group-label"
                            id="variety-group-select"
                            value={select}
                            onChange={handleSelectChange}
                            label="Variety Group"
                          >
                            {option.map((opt) => (
                              <MenuItem value={opt.id}>{opt.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>

                    <Divider sx={{ my: 0.5 }} />
                    <div className="row">
                      <label style={{ marginTop: "8px" }}>
                        <b>ADDITIONAL DETAILS</b>{" "}
                      </label>{" "}
                    </div>
                    <div className="row">
                      <div className="col" style={{ marginTop: "8px" }}>
                        <TextField
                         
                          label="Calorie"
                          defaultValue=""
                          onChange={handleCalorieChange}
                          type="number"
                          name="calorie"
                          value={calorie}
                        />
                      </div>

                      <div className="col">
                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                          <InputLabel id="demo-simple-select-helper-label">
                            In Stock
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={inStock}
                            label="In Stock"
                            onChange={handleInStockChange}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={true} selected={proStack}>
                              Yes
                            </MenuItem>
                            <MenuItem value={false} selected={!proStack}>
                              No
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="col">
                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                          <InputLabel id="demo-simple-select-helper-label">
                            Food Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            label="Food Type"
                            value={categoryType || "Non-Veg"}
                            onChange={handleCategoryType}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="Veg">Veg</MenuItem>
                            <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                   
                  <div className="row">


                    <div className="col">
                      <Box
                        noValidate
                        autoComplete="off"
                      >
                        <ul id="tags">
                          {cooktags && cooktags.length ? (
                            cooktags.length &&
                            cooktags.map((cooktags, index) => (
                              <li key={index} className="tag">
                                <span className="tag-title">{cooktags}</span>
                                <span
                                  className="btn"
                                  onClick={() => removeTags(index)}
                                >
                                  x
                                </span>
                              </li>
                            ))
                          ) : (
                            <span className="tag-title"></span>
                          )}{" "}
                        </ul>
                        <TextField
                        
                          label="Cooking Instruction"
                          defaultValue=""
                          onKeyUp={(event) =>
                            event.key === "Enter" ? addTags(event) : null
                          }
                          placeholder="Press Enter to Add new"
                          type="text"
                        />
                      </Box>
                    </div>
                    <div className="col">
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                      <InputLabel id="kitchen-select-label">
                        Assign Kitchen
                      </InputLabel>
                      <Select
                        labelId="kitchen-select-label"
                        id="kitchen-select"
                        value={selectedKitchen}
                        label="Assign Kitchen"
                        onChange={handleKitchenChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {kitchenList.map((kitchen) => (
                          <MenuItem key={kitchen.id} value={kitchen.id}>
                            {kitchen.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    </div>
                  </div>
                 
                <Divider sx={{ my: 0.5 }} />
                <div className="row">
                    <label style={{ marginTop: "8px" }}>
                      <b>ADD-ON DETAILS</b>{" "}
                    </label>{" "}
                   </div>
                 <div className="row">
                 <div className="col" style={{ display: showAddon ? "block" : "none" }}>
                    <label
                      style={{ marginTop: "10px", marginLeft: "10px" }}
                      htmlFor=""
                    >
                      Add-on Categories
                    </label>
                    <div className="tags-input " style={{ display: "block" }}>
                      <div id="addons">
                        {addOn.map((tag, index) => {

                          let addName = categories.filter(
                            (li) => li.id === tag
                          );
                          addName = addName.length ? addName[0].name : "";
                          return (
                            <span key={index} className="tag">
                              <span className="tag-title">{addName}</span>
                              <span
                                className="rmv-btn"
                                onClick={() => removeAddons(index)}
                              >
                                x
                              </span>
                            </span>
                          );
                        })}
                      </div>

                      <select
                        className="select_input"
                        style={{ marginTop: "10px" }}
                        onChange={handleAddOns}
                      >
                        <option>Select</option>
                        {categories
                          .filter((cat) => cat.isAddOn)
                          .map((li) => (
                            <option value={li.id}>{li.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="col"></div>
                  <div className="col">
                      <Box
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          label="Tags"
                          defaultValue=""
                          onChange={handleTagsChange}
                          //className="input_cls"
                          type="text"
                          name="tags"
                          placeholder="Comma separated"
                          value={tags}
                        />
                      </Box>
                    </div>
                 </div>
                </form>
              </>
            ) : (
              ""
            )}
          </div>
          </DialogContent>
          <DialogActions>
                  <Button
                    color="error"
                    style={{ margin: "10px" }}
                    className="close-btn"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button
                    className="save-btn btnDialog-Fill"
                    variant="contained"
                    color="success"
                    style={{ margin: "10px" }}
                    disabled={!foodName}
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                  </DialogActions>
        </Dialog>

        {openDeleteDialog === true ? (
          <DeleteDiaologue
            open={openDeleteDialog}
            onClose={handleDeleteClose}
            onConfirm={handleConfirmDelete}
            itemName={deleteItemName}
          />
        ) : (
          <div />
        )}

        <Dialog
          onClose={() => setShowGallery(false)}
          open={showGallery}
          fullWidth={true}
          style={{ width: "600px", margin: "auto" }}
        >

          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div
              className="header"
              style={{
                flex: "0 0 auto",
                padding: "8px",
                borderBottom: "1px solid #ccc",
                position: "sticky",
                top: "0",
                backgroundColor: "#fff",
                zIndex: "1",
                justifyContent: "space-evenly",
              }}
            >
              <div
                className="search"
                style={{ display: "flex", alignItems: "center" }}
              >
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search item image"
                  onChange={handleSearch}
                  style={{
                    border: "none",
                    outline: "none",
                    width: "100%",
                    backgroundColor: "transparent",
                    marginLeft: "8px",
                  }}
                  value={searchQuery}
                />
              </div>
              {<input
                type="button"
                value="Search"
                style={{
                  border: "1px solid black",
                  borderRadius: "15px",
                  marginLeft: "5px",
                  padding: "5px 15px",
                  cursor: "pointer",
                  backgroundColor: "#000",
                  color: "#fff",
                }}
                onClick={handleSearch}
              />}
            </div>

            <div
              className="content"
              style={{ flex: "1 1 auto", overflowY: "auto", padding: "8px" }}
            >
              <Gallery
                onSelectImage={handleSelectedImage}
                searchQuery={searchQuery}
              />
            </div>

            <div
              className="footer"
              style={{
                flex: "0 0 auto",
                padding: "8px",
                borderTop: "1px solid #ccc",
                position: "sticky",
                bottom: "0",
                backgroundColor: "#fff",
                zIndex: "1",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                variant="outlined"
                color="warning"
                onClick={() => setShowGallery(false)}
              >
                Cancel
              </Button>
              <Button
                style={{ background: "#f7c919" }}
                variant="contained"
                onClick={handleSubmitImage}
              >
                SELECT
              </Button>
            </div>
          </div>
        </Dialog>

        <div className="product-list">
          <Table width="100%" cellPadding="4px">
            <Thead>
              <Tr>
                <Th>Name</Th>
                {/* <th>Description</th> */}
                <Th>Images</Th>
                <Th>Price</Th>
                <Th>Calorie</Th>

                <Th>Veg/Non-Veg</Th>
                <Th>Category</Th>
                {/* <th>Tags</th> */}
                <Th>Instock</Th>

                <Th>Action</Th>
              </Tr>
            </Thead>

            <Tbody>
              {prod.length
                ? prod
                    .filter((p) => {
                      if (!selectedCategory) return true; // Show all products if no category is selected
                      const categoryMatch = catAddon.find(
                        (cat) =>
                          (p.category.id || p.category) === (cat._id || cat.id)
                      );
                      return (
                        categoryMatch && categoryMatch.name === selectedCategory
                      );
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((p) => {
                      let cat_name =
                        catAddon && catAddon.length
                          ? catAddon.filter(
                              (cat) =>
                                (p.category.id ? p.category.id : p.category) ===
                                (cat._id ? cat._id : cat.id)
                            )
                          : [];
                      cat_name = cat_name.length ? cat_name[0].name : "";

                      return (
                        <Tr
                          style={{
                            borderBottom: "1px solid #f0eeee",
                            margin: "5px",
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
                          {/* <Td style={{maxWidth:"100px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace: "nowrap"}}>{p.description}</Td> */}
                          <Td style={{ padding: "10px 0px" }}>
                            <img
                              src={
                                p.image === "" ? "./images/blank.jpg" : p.image
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
                            {selectedCurrency}{" "}
                            {p.isPriceVariety && p.varietyPrices
                              ? Object.values(JSON.parse(p.varietyPrices)).join(
                                  '/'
                                )
                              : p.price}
                          </Td>

                          <Td>{p.calorie}</Td>

                          <Td>
                            {p.cat_type.toLowerCase() ===
                            "Non-Veg".toLocaleLowerCase() ? (
                              <img
                                src="./images/Non-veg.png"
                                height="30px"
                                style={{ marginLeft: "20px" }}
                              />
                            ) : (
                              <img
                                src="./images/veg.png"
                                height="30px"
                                style={{ marginLeft: "20px" }}
                              />
                            )}
                          </Td>
                          <Td>{cat_name}</Td>
                          <Td>
                            <input
                              type="checkbox"
                              checked={p.inStock}
                              onChange={() => handleStocks(p)}
                              style={{
                                width: "40px",
                                height: "20px",
                                accentColor: "#31e631",
                                cursor: "pointer",
                              }}
                            />
                          </Td>
                          <Td>
                            {
                              !merchCode.activeProviderId &&   <div><Button
        aria-controls={openActions ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openActions ? 'true' : undefined}
        variant="outlined"
        disableElevation
        onClick={()=>handleActionsClick(p.id)}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Actions
      </Button>
      {openActions && p.id==selectProductId  && <Paper style={{position:'absolute',zIndex:"99"}}><MenuList  open={false} onClose={handleActionsClose}>
        <MenuItem onClick={()=>(handleActionsClose(),
                                    handleEdit(
                                      p.id,
                                      p.image,
                                      p.category,
                                      p.cat_type,
                                      p.inStock
                                    ))
                                  } >
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={()=>(showInventoryDialog(p),handleActionsClose())} >
          <AddLinkIcon />
          Link Inventory
        </MenuItem>
        <MenuItem onClick={()=>handleActionsClose()} >
          <FileCopyIcon />
          Duplicate
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={()=>(setDeleteItemId(p.id), setDeleteItemName(p.name),handleActionsClose(),setOpenDeleteDialog(true))} >
          <DeleteIcon />
          Delete
        </MenuItem>
         </MenuList></Paper>}
       </div>                 }
                          </Td>
                        </Tr>
                      );
                    })
                : ""}
            </Tbody>
          </Table>
          {prod && prod.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={prod.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </div>

         {showInventory && <InventoryProLink product={showInventory} 
          variety={option} 
          getVarietyOptions={getVarietyOptions} 
          setShowInventory={setShowInventory} 
          showSucMessg={()=>toast.success("Saved successfully!")}
          showErrMessg={()=>toast.error("Save failed!")}
          />}
          }
      </div>
       <ToastContainer />
    </>
  );
}

export default FoodDescription;
