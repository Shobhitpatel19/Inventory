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
import DragHandleIcon from "@mui/icons-material/DragHandle";

function Categories(props) {
  const [foodName, setFoodName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [filterCat, setFilterCat] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [catId, setCatId] = useState("");
  const [addonsGroup, setAddonsGroup] = useState([]);
  const [tags, setTags] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addOn, setAddOn] = useState(false);

  let baseURL = configs.baseURL;
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : [];
  let originURL =
    window.location.href.indexOf("localhost") > 0
      ? "https://pos.menulive.in"
      : window.location.origin;

  console.log(merchantData);
  // const baseURL = 'https://api.menulive.in';
  //  const userId=userData?userData._id:"";
  const userId = userData ? userData.sub : " ";
  console.log(userId);
  // const getCatByUser = baseURL+'/api/categories?userId='+userData.sub;

  const getCatByUser = `${baseURL}/api/clover/categories? =${
    merchantData.length ? merchantData.merchantCode : " "
  }`;

  // https://api.menulive.in/api/categories?merchantCode=USPIZZA-KEMP

  console.log(getCatByUser);
  let catAddon;
  if (categories.length && addonsGroup.length) {
    catAddon = [...categories, ...addonsGroup];
  }
  console.log(catAddon);

  const handleFoodNameChange = (event) => {
    setFoodName(event.target.value);
  };

  useEffect(() => {
    axios.get(baseURL + "/api/settings/" + userId).then((res) => {
      console.log(res.data);
      setUserInfo(res.data);
    });
  }, []);

  const handleImageURLChange = (e) => {
    var formData = new FormData();
    let file = e.target.files[0];
    console.log(e.target);
    console.log(file);
    let fileName = "cat_" + new Date().getTime() + file.name;
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      `Food name: ${foodName}, Image URL: ${imageURL}, name: ${selectedOption}, isAddOn:${addOn}`
    );
    if (!foodName) {
      console.log("All feilds are mandatry");
    } else if (catId) {
      axios
        .put(
          baseURL +
            "/api/clover/categories/" +
            catId +
            `?merchantCode=${merchantData ? merchantData.merchantCode : " "}`,
          {
            name: foodName,
            image: imageURL,
            tags: tags.length ? tags.join("~") : "",
            isAddOn: addOn,
            userId: userId,
          }
        )
        .then((response) => {
          console.log(response.data);
          axios
            .get(
              `${baseURL}/api/clover/modifiers?merchantCode=${
                merchantData ? merchantData.merchantCode : " "
              }`
            )
            .then((res) => setAddonsGroup(res.data));

          axios.get(getCatByUser).then((response) => {
            console.log(response.data);
            setCategories(response.data);
          });
          setDialogOpen(false);
          setAddOn(false);
          setTags("");
          setFoodName("");
          setImageURL("");
          setCatId("");
        });
    } else {
      axios
        .post(
          `${baseURL}/api/clover/categories?merchantCode=${
            merchantData ? merchantData.merchantCode : " "
          }`,
          {
            name: foodName,
            image: imageURL,
            tags: tags.length ? tags.join("~") : "",
            isAddOn: addOn,
            userId: userId,
          }
        )
        .then((response) => {
          console.log(response.data);
          axios.get(getCatByUser).then((response) => {
            console.log(response.data);
            setCategories(response.data);
          });

          axios
            .get(
              `${baseURL}/api/clover/modifiers?merchantCode=${
                merchantData.length ? merchantData.merchantCode : " "
              }`
            )
            .then((res) => setAddonsGroup(res.data));
          setDialogOpen(false);
          setAddOn(false);
          setTags("");
          setFoodName("");
          setImageURL("");
          setSelectedOption("");
        });
    }
  };

  const handleDelete = (id) => {
    console.log(id);
    axios.delete(baseURL + "/api/clover/categories/" + id).then((response) => {
      console.log(response.data);

      axios.get(getCatByUser).then((response) => {
        console.log(response.data);
        setCategories(response.data);
      });

      axios
        .get(
          `${baseURL}/api/clover/modifiers?merchantCode=${
            merchantData.length ? merchantData[0].merchantCode : " "
          }`
        )
        .then((res) => setAddonsGroup(res.data));
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    console.log(categories);
    console.log(JSON.parse(window.sessionStorage.getItem("userData")));
    if (!categories.length) {
      axios.get(getCatByUser).then((response) => {
        console.log(response.data);
        setCategories(response.data);
      });
    }

    if (!addonsGroup.length) {
      axios
        .get(
          `${baseURL}/api/clover/modifiers?merchantCode=${
            merchantData.length ? merchantData[0].merchantCode : " "
          }`
        )
        .then((res) => setAddonsGroup(res.data));
    }
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

  const handleAddon = () => {
    setAddOn(!addOn);
  };

  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpg";
  };

  const handleSearch = (e) => {
    let val = e.target.value;
    let fltDAta = catAddon.filter(
      (cat) => cat.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
    );
    console.log(fltDAta);
    setFilterCat(fltDAta);
    setIsSearch(val ? true : false);
  };

  const handleEdit = (cat) => {
    console.log(cat);
    setAddOn(cat.isAddOn);
    setTags(cat.tags.split("~"));
    setFoodName(cat.name);
    setImageURL(cat.image);
    setCatId(cat.id);
    setDialogOpen(true);
  };
  const categorieItems = isSearch
    ? filterCat
    : catAddon && catAddon.length
    ? catAddon
    : categories;

  return (
    <>
      <Dialog open={dialogOpen} maxWidth="mb" fullWidth={true}>
        <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
          {catId ? "Edit Category" : "Add Category"}
        </DialogTitle>

        <div
          className="container"
          style={{ padding: "20px 40px", borderRadius: "10px", margin: "20px" }}
        >
          <label>
            Category name <span className="text-danger">*</span>
          </label>
          <input
            className="input_cls"
            type="text"
            defaultValue={foodName}
            value={foodName}
            onChange={handleFoodNameChange}
          />

          <label>Category Image</label>
          <form encType="multipart/form/data">
            <input
              className="input_cls"
              type="file"
              id="item_img"
              onChange={handleImageURLChange}
            />
          </form>
          <br />
          <span
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            Add-on:
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
          </span>
          <label>Tags</label>
          <div className="tags-input">
            <ul id="tags">
              {tags.length ? (
                tags.length &&
                tags.map((tag, index) => (
                  <li key={index} className="tag">
                    <span className="tag-title">{tag}</span>
                    <span className="btn" onClick={() => removeTags(index)}>
                      x
                    </span>
                  </li>
                ))
              ) : (
                <span className="tag-title"></span>
              )}{" "}
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
          <Button
            variant="contained"
            color="error"
            style={{ margin: "20px" }}
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
            style={{ margin: "20px" }}
            onClick={(e) => handleSubmit(e)}
          >
            Save
          </Button>
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
        {userInfo.length && userInfo[0].activeProviderId === "" ? (
          <button className="add_btn" onClick={() => setDialogOpen(true)}>
            <AddIcon /> Add New
          </button>
        ) : (
          <span></span>
        )}
      </div>
      <div className="category-list" style={{ padding: "20px" }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Categories</th>
              <th style={{ width: "25%" }}>Images</th>
              <th></th>
              <th style={{ width: "25%" }}>Tags</th>
              {userInfo.length && userInfo[0].activeProviderId === "" ? (
                <th>Action</th>
              ) : (
                ""
              )}
            </tr>
          </thead>
          <tbody>
            {categorieItems && categorieItems.length
              ? categorieItems.map((category, k) => (
                  <tr
                    key={category.id}
                    style={{ borderBottom: "1px solid #f0eeee", margin: "5px" }}
                  >
                    <td
                      style={{ fontWeight: "bold", width: "25%" }}
                      align="start"
                    >
                      {category.name}
                    </td>
                    <td style={{ width: "25%" }}>
                      <img
                        alt="cat"
                        src={
                          category.image === ""
                            ? "./images/blank.jpeg"
                            : baseURL + "/" + category.image
                        }
                        onError={imageOnErrorHandler}
                        style={{
                          width: "100px",
                          height: "60px",
                          borderRadius: "5px",
                        }}
                      />
                    </td>
                    <td style={{ fontSize: "13px", width: "6%" }}>
                      {category.isAddOn ? "ADD-ON" : ""}
                    </td>
                    <td style={{ width: "25%" }}>{category.tags}</td>
                    {userInfo.length && userInfo[0].activeProviderId === "" ? (
                      <td style={{ width: "30%" }}>
                        <IconButton
                          aria-label="edit"
                          size="large"
                          color="info"
                          onClick={() => handleEdit(category)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          size="large"
                          color="error"
                          onClick={() => handleDelete(category.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    ) : (
                      ""
                    )}
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Categories;
