import axios from "axios";
import React, { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import configs, { getParameterByName } from "../Constants";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";
import "react-responsive-list/assets/index.css";
import Gallery from "./Gallery";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem"; 
import Typography from "@mui/material/Typography"; 
import DeleteDiaologue from "./sub_comp/Delete";

//Added by Mojahid
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Category(props) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [catgory, setCategory] = useState("Nothing");
  const [foodName, setFoodName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [filterCat, setFilterCat] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [catId, setCatId] = useState("");
  const [addonsGroup, setAddonsGroup] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addOn, setAddOn] = useState(false);
  const [noAddOn, setNoAddOn] = useState(1);
  const [minNoAddOn, setMinNoAddOn] = useState(0);
  const [hasError, setHasError] = useState("");
  const [catIndex, setCatIndex] = useState(1);
  const [showGallery, setShowGallery] = useState(false);
  const [image, setImage] = useState(false);
  const [orderableAlone, setOrderableAlone] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyAtPos, setOnlyAtPos] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };
  let baseURL = configs.baseURL;
  let staticSer = configs.staticSer;
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;

  const merchCode = merchantData ? merchantData.merchantCode : "";

  const getCatByUserUrl = `${baseURL}/api/categories?merchantCode=${merchCode}`;

  useEffect(() => {
    fetchCatData();
  }, []);

  const handleSelectedImage = (image) => {
    setSelectedImage(image);
  };
  const handleFoodNameChange = (event) => {
    setFoodName(event.target.value);
  };
  const handleOderableCheck = (event) => {
    setOrderableAlone(!orderableAlone);
  };

  const handleImageURLChange = (e) => {
    var formData = new FormData();
    let file = e.target.files[0];
    let fileName = "cat_" + new Date().getTime() + file.name;
    formData.append("uploader", file, fileName);
    let postQueriesUrl = baseURL + "/api/upload/INVENTORY_ITEM";
    axios.post(postQueriesUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setImageURL(`${configs.staticSer}/INVENTORY_ITEM/${fileName}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!foodName) {
      setHasError("Category Name is required");
      return;
    } else if (noAddOn < minNoAddOn) {
      setHasError("Max limit can't be more than min. limit");
      return;
    } else if (catId) {
      axios
        .put(
          baseURL + "/api/categories/" + catId + `?merchantCode=${merchCode}`,
          {
            name: foodName,
            // image: imageURL ? imageURL : selectedImage.image,
            image: selectedImage ? selectedImage.image : imageURL || "",
            tags: tags.length ? tags.join("~") : "",
            isAddOn: addOn,
            serialNumber: catIndex ? catIndex : 1,
            maxAddOnAllowed: parseInt(noAddOn),
            minAddOnAllowed: parseInt(minNoAddOn),
            userId: userData.sub,
            isOrderableAlone: orderableAlone,
            onlyAtPos: onlyAtPos,
          }
        )
        .then((response) => {
          fetchCatData();
        });
    } else {
      axios
        .post(`${baseURL}/api/categories?merchantCode=${merchCode}`, {
          name: foodName,
          // image: imageURL ? imageURL : selectedImage.image,
          image: selectedImage ? selectedImage.image : imageURL || "",
          tags: tags.length ? tags.join("~") : "",
          isAddOn: addOn,
          serialNumber: catIndex ? catIndex : 1,
          maxAddOnAllowed: parseInt(noAddOn),
          minAddOnAllowed: parseInt(minNoAddOn),
          isOrderableAlone: orderableAlone,
          userId: userData.sub,
          onlyAtPos: onlyAtPos,
        })
        .then((response) => {
          fetchCatData();
        });
    }
    setHasError("");
  };

  const handleDelete = (id) => {
    // console.log(id);
    // axios.delete(baseURL + "/api/categories/" + id).then((response) => {
    //   fetchCatData();
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
      axios.delete(baseURL + "/api/categories/" + deleteItemId).then((response) => {
        fetchCatData();
      });
    }
    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };

  const fetchCatData = () => {
    axios.get(getCatByUserUrl).then((response) => {
      //  console.log("responseData", response.data);
      setCategories(response.data);
      setDialogOpen(false);
      setAddOn(false);
      setOnlyAtPos(false);
      setTags("");
      setFoodName("");
      setNoAddOn(1);
      setMinNoAddOn(0);
      setCatIndex(1);
      setImageURL("");
      setSelectedOption("");
    });
  };

  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = (event) => {
    if (event.target.value !== "") {
      setTags([...tags, event.target.value]);
      //props.selectedTags([...tags, event.target.value]);
      event.target.value = "";
    }
  };
  const handleInputChange = (e) => {
    var formData = new FormData();
    let file = e.target.files[0];
    // console.log(e.target);
    // console.log(file);
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
  const handleAddon = () => {
    setAddOn(!addOn);
  };

  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpg";
  };

  const handleSearch = (e) => {
    let val = e.target.value;
    let fltData = categories.filter(
      (cat) => cat.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
    );
    //console.log(fltData);
    setFilterCat(fltData);
    setIsSearch(val ? true : false);
  };
  const handleSearch1 = (event) => {
    setSearchQuery(event.target.value);
  };

  // Added by sk
  const handleShow = (cat) => {
    console.log("Selected Category:", cat);

    axios
      .get(`${baseURL}/api/products?merchantCode=${merchCode}`)
      .then((response) => {
        const fetchedProducts = response.data;
        setProducts(fetchedProducts);

        fetchedProducts.forEach((product) => {
          console.log("Product Category:", product.category);
          console.log("Product Name:", product.name);
          console.log("Selected Category ID:", cat.id);
        });
        const filtered = fetchedProducts.filter((product) => {
          // Compare product.category directly with cat.id since category is a string ID
          return product.category === cat.id;
        });
        console.log("Filtered Products:", filtered); // Check the filtered products
        setFilteredProducts(filtered); // Set filtered products
        setCategory(cat.name);
        setShowPopup(true); // Show popup with filtered products
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  // Close popup handler
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleEdit = (cat) => {
    // console.log(cat);
    setAddOn(cat.isAddOn);
    setTags(cat.tags.split("~"));
    setFoodName(cat.name);
    setImageURL(cat.image);
    setCatId(cat.id);
    setOnlyAtPos(cat.onlyAtPos);
    setNoAddOn(cat.maxAddOnAllowed);
    setMinNoAddOn(cat.minAddOnAllowed);
    setCatIndex(cat.serialNumber);
    setDialogOpen(true);
    setOrderableAlone(cat.isOrderableAlone);
  };
  const categorieItems = isSearch ? filterCat : categories;

  const handleGallery = () => {
    setSearchQuery(foodName);
    setShowGallery(true);
  };
  const handleUpload = () => {
    setImage(true);
  };
  const handleSubmitImage = () => {
    if (selectedImage) {
      console.log("Selected Image:", selectedImage);
    } else {
      console.error("No image selected!");
    }
    setShowGallery(false);
  };

  // ADDED by  MOJAHID ************************************
  const handleDragEnd = (results) => {
    //console.log(results);
    if (!results.destination) {
      return;
    }
    let Cats = [...categories];
    //arr.move(from, to)
    Cats.move(results.source.index, results.destination.index);
    //console.log("new TEMPUSER", Cats);
    const reorderCatIds = Cats.map((cat) => cat.id);
    updateDragAndDrop(reorderCatIds, Cats);
  };

  const updateDragAndDrop = async (reorderCatIds, Cats) => {
    try {
      axios
        .put(
          baseURL + "/api/categories/update_by_prop?propName=serialNumber",
          reorderCatIds
        )
        .then(async (response) => {
          //fetchCatData();
          setCategories(Cats);
        });
    } catch (err) {
      //console.log("Error from frag n drop URL ", err);
    }
  };

  // End Lines

  return (
    <div style={{ height: "98vh" }}>
      <Dialog open={dialogOpen} maxWidth="mb" style={{ textAlign: "left" }}>
        <DialogTitle sx={{ m: 0, p: 2 }} style={{ fontWeight: "bold" }}>
          {catId ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setDialogOpen(false);
            setAddOn(false);
            setTags("");
            setFoodName("");
            setImageURL("");
            setCatId("");
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          style={{
            borderTop: "1px solid #ccc",
            borderBottom: "1px solid #ccc",
            padding: "10px 30px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              textAlign: "left",
              margin: "10px 10px 10px 0px",
            }}
          >
            <TextField
              type="text"
              label="Category name(*)"
              variant="outlined"
              defaultValue={foodName}
              fullWidth
              size="small"
              value={foodName}
              onChange={handleFoodNameChange}
            />
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "20px",
            }}
          >
            <span>Can Be Ordered Alone?:</span>
            <input
              type="checkbox"
              defaultChecked={orderableAlone}
              style={{
                height: "25px",
                width: "25px",
                marginLeft: "5px",
                accentColor: "#3622cc",
              }}
              checked={orderableAlone}
              onChange={handleOderableCheck}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <lable>{"Category Icon: "}</lable>
            <Button variant="contained" onClick={handleGallery}>
              Choose from Gallery
            </Button>
            <Button variant="outlined" onClick={handleUpload}>
              Upload New
            </Button>
          </div>
          <span style={{ fontSize: "1rem" }}>
            {selectedImage ? selectedImage.name : ""}
          </span>
          <div
            className="colchoose"
            style={image ? { display: "block" } : { display: "none" }}
          >
            <Box
              sx={{
                maxWidth: "100%",
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                fullWidth
                id="fullWidth"
                label=""
                defaultValue=""
                onChange={handleInputChange}
                type="file"
                name="image"
              />
            </Box>
          </div>
          <br style={{ height: "20px", width: "100%", display: "block" }}></br>
          <div className={"dialog-row"}>
            <span>Add-on:</span>
            <input
              type="checkbox"
              defaultChecked={addOn}
              style={{
                height: "25px",
                width: "25px",
                marginLeft: "5px",
                accentColor: "#3622cc",
              }}
              checked={addOn}
              onChange={handleAddon}
            />
            {addOn && (
              <TextField
                type="number"
                placeholder="Min. allowed limit"
                size="small"
                value={minNoAddOn}
                InputProps={{
                  inputProps: {
                    max: 100,
                    min: 0,
                  },
                }}
                label="Min. Order:"
                variant="outlined"
                onChange={(e) => setMinNoAddOn(e.target.value)}
              />
            )}
            {addOn && (
              <TextField
                type="number"
                placeholder="Max. allowed limit"
                size="small"
                value={noAddOn}
                style={{ marginLeft: "10px" }}
                InputProps={{
                  inputProps: {
                    max: 100,
                    min: 0,
                  },
                }}
                label="Max. Order:"
                variant="outlined"
                onChange={(e) => setNoAddOn(e.target.value)}
              />
            )}

            {openDeleteDialog === true ? (
              <DeleteDiaologue
                open={openDeleteDialog}
                onClose={handleDeleteClose}
                onConfirm={handleConfirmDelete}
              />
            ) : (
              <div />
            )}
          </div>
          <br />
          <div className={"dialog-row"}>
            <span>Only At PoS:</span>
            <input
              type="checkbox"
              defaultChecked={onlyAtPos}
              style={{
                height: "25px",
                width: "25px",
                marginLeft: "5px",
                accentColor: "#3622cc",
              }}
              checked={onlyAtPos}
              onChange={() => setOnlyAtPos(!onlyAtPos)}
            />
          </div>

          

          <div style={{ marginTop: "30px" }}>
            <label>Tags</label>
            <div className="tags-input">
              <ul id="tags">
                {tags.length &&
                  tags
                    .filter((t) => t.length)
                    .map((tag, index) => (
                      <li key={index} className="tag">
                        <span className="tag-title">{tag}</span>
                        <span className="btn" onClick={() => removeTags(index)}>
                          x
                        </span>
                      </li>
                    ))}
              </ul>
              <input
                className="input_cls"
                type="text"
                onKeyUp={(event) =>
                  event.key === "Enter" ? addTags(event) : null
                }
                placeholder="Press enter to add tags"
              />
            </div>
            {hasError ? (
              <span style={{ color: "red" }}>{"* " + hasError}</span>
            ) : (
              ""
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            style={{ margin: "10px", marginRight: "30px" }}
            onClick={() => {
              setDialogOpen(false);
              setAddOn(false);
              setTags("");
              setFoodName("");
              setImageURL("");
              setCatId("");
            }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            color="success"
            className="btnDialog-Fill"
            style={{ margin: "10px" }}
            onClick={(e) => handleSubmit(e)}
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
                placeholder="Search Images"
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  backgroundColor: "transparent",
                  marginLeft: "8px",
                }}
                onChange={handleSearch1}
                value={searchQuery}
              />
            </div>
            <input
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
              // onClick={}
            />
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
              onClick={() => setShowGallery(false)}
              color="warning"
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
      <div className="header">
        <h4>Categories</h4>
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            className="search_input"
            placeholder="Search"
            onChange={handleSearch}
          />
        </div>
        {merchCode && !merchCode.activeProviderId ? (
          <button className="add_btn" onClick={() => setDialogOpen(true)}>
            <AddIcon /> Add New
          </button>
        ) : (
          <span></span>
        )}
      </div>
      <div className="category-list" style={{ padding: "20px" }}>
        <DragDropContext onDragEnd={(results) => handleDragEnd(results)}>
          <Table style={{ width: "100%" }}>
            <Thead>
              <Tr>
                <Th style={{ width: "25%" }}>Categories</Th>
                <Th style={{ width: "10%" }}>Images</Th>
                <Th style={{ width: "20%" }}>Tags</Th>
                <Th style={{ width: "35%" }}>Actions</Th>
                <Th style={{ width: "10%" }}>Rearrange</Th>
                <Th>
                  {" "}
                  {userInfo.length && userInfo[0].activeProviderId === "" ? (
                    <span>Action</span>
                  ) : (
                    ""
                  )}
                </Th>
              </Tr>
            </Thead>
            <Droppable droppableId="tbody">
              {(provided) => (
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {categorieItems && categorieItems.length
                    ? categorieItems.map((category, k) => (
                        <Draggable
                          draggableId={category.id}
                          index={k}
                          key={category.id}
                        >
                          {(provided) => (
                            <tr
                              key={category.id}
                              style={{ borderBottom: "1px solid #f0eeee" }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <td
                                style={{ fontWeight: "bold", width: "25%" }}
                                align="start"
                              >
                                {category.name}
                                {category.isAddOn ? (
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
                              </td>
                              <Td style={{ width: "10%" }}>
                                <img
                                  alt="cat"
                                  src={
                                    category.image === ""
                                      ? "./images/blank.jpeg"
                                      : category.image
                                  }
                                  onError={imageOnErrorHandler}
                                  style={{
                                    width: "100px",
                                    height: "60px",
                                    borderRadius: "5px",
                                  }}
                                />
                              </Td>

                              <Td style={{ width: "20%" }}>{category.tags}</Td>
                              {!merchCode.activeProviderId ? (
                                <Td
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "35%",
                                  }}
                                >
                                  <Button
                                    aria-label="show"
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleShow(category)}
                                    style={{
                                      fontWeight: "bold",
                                      textTransform: "none",
                                      borderRadius: "4px",
                                      padding: "6px 5px",
                                      boxShadow: "none", // No shadow for a flat design, adjust if needed
                                      display: "block", // Ensures the button is always displayed
                                      whiteSpace: "nowrap", // Prevents text wrapping
                                      textOverflow: "ellipsis", // Adds an ellipsis if the text is too long to fit
                                      width: "100px", // Adjusts width to content, ensure enough space in container
                                      minWidth: "100px",
                                    }}
                                  >
                                    Show Items
                                  </Button>

                                  <IconButton
                                    aria-label="edit"
                                    size="large"
                                    color="info"
                                    style={{ marginLeft: "10px" }}
                                    onClick={() => handleEdit(category)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    size="large"
                                    style={{ marginLeft: "10px" }}
                                    color="error"
                                    onClick={() => handleDelete(category.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Td>
                              ) : (
                                ""
                              )}
                              {/* Add new td by Mojahid */}
                              <td {...provided.dragHandleProps}>
                                <DragHandleIcon />
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))
                    : ""}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </Table>
        </DragDropContext>
      </div>

      {/* Dialog Popup to show filtered products */}
      <Dialog
        open={showPopup}
        onClose={handleClosePopup}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Items in Category <b>{catgory}</b>{" "}
        </DialogTitle>
        <DialogContent>
          {filteredProducts.length > 0 ? (
            <List>
              {filteredProducts.map((product) => (
                <ListItem
                  key={product.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body1">
                    Price: {product.price} | In Stock:{" "}
                    {product.inStock ? "Yes" : "No"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.description}
                  </Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">
              No products found for this category.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Category;
