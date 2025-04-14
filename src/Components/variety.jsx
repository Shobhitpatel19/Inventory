import axios from "axios";
import React, { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import configs, { getParameterByName } from "../Constants";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteDiaologue from "./sub_comp/Delete";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";

function Variety(props) {
  const [groupName, setgroupName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [varieties, setVarieties] = useState([]);

  const [selectedOption, setSelectedOption] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [filterCat, setFilterCat] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [catId, setCatId] = useState("");
  const [addonsGroup, setAddonsGroup] = useState([]);
  const [tags, setTags] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addOn, setAddOn] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  let baseURL = configs.baseURL;
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  console.log(userData);

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "";
  // const baseURL = 'https://api.menulive.in';
  //  const userId=userData?userData._id:"";
  const userId = userData ? userData.sub : " ";
  console.log(userId);
  // const getCatByUser = baseURL+'/api/varieties?userId='+userData.sub;

  const getCatByUser = `${baseURL}/api/varieties?merchantCode=${merchCode}`;

  // https://api.menulive.in/api/varieties?merchantCode=USPIZZA-KEMP

  const handleGroupNameChange = (event) => {
    setgroupName(event.target.value);
  };

  useEffect(() => {
    axios.get(baseURL + "/api/settings/" + userId).then((res) => {
      console.log(res.data);
      setUserInfo(res.data);
    });
  }, []);

  const handleSubmit = () => {
    //event.preventDefault();
    console.log(
      `Variety name: ${groupName} name: ${selectedOption}, isAddOn:${addOn}`
    );
    if (!groupName) {
      console.log("All feilds are mandatory");
    } else if (catId) {
      axios
        .put(
          baseURL + "/api/varieties/" + catId + `?merchantCode=${merchCode}`,
          {
            name: groupName,
            items: tags.length ? tags.join(",") : "",
            userId: userId,
          }
        )
        .then((response) => {
          console.log(response.data);
          axios.get(getCatByUser).then((response) => {
            console.log(response.data);
            setVarieties(response.data);
          });
          setDialogOpen(false);
          setAddOn(false);
          setTags("");
          setgroupName("");
          setCatId("");
        });
    } else {
      axios
        .post(`${baseURL}/api/varieties?merchantCode=${merchCode}`, {
          name: groupName,
          items: tags.length ? tags.join(",") : "",
          userId: userId,
        })
        .then((response) => {
          console.log(response.data);
          axios.get(getCatByUser).then((response) => {
            console.log(response.data);
            setVarieties(response.data);
          });
          setDialogOpen(false);
          setAddOn(false);
          setTags("");
          setgroupName("");
          setSelectedOption("");
        });
    }
  };

  const handleDelete = (id) => {
    // console.log(id);
    // axios.delete(baseURL + "/api/varieties/" + id).then((response) => {
    //   console.log(response.data);

    //   axios.get(getCatByUser).then((response) => {
    //     console.log(response.data);
    //     setVarieties(response.data);
    //   });
    // });
    setDeleteItemId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteItemId) {
      return;
    }
    console.log(deleteItemId);
    axios
      .delete(baseURL + "/api/varieties/" + deleteItemId)
      .then((response) => {
        console.log(response.data);

        axios.get(getCatByUser).then((response) => {
          console.log(response.data);
          setVarieties(response.data);
        });
      });
    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    console.log(varieties);
    console.log(JSON.parse(window.sessionStorage.getItem("userData")));
    if (!varieties.length) {
      axios.get(getCatByUser).then((response) => {
        console.log(response.data);
        setVarieties(response.data);
      });
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
    let fltDAta = varieties.filter(
      (cat) => cat.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
    );
    console.log(fltDAta);
    setFilterCat(fltDAta);
    setIsSearch(val ? true : false);
  };

  const handleEdit = (cat) => {
    console.log(cat.items);
    console.log(cat);
    setAddOn(cat.isAddOn);
    setTags(cat.items.split(","));
    setgroupName(cat.name);
    setImageURL(cat.image);
    setCatId(cat.id);
    setDialogOpen(true);
  };
  const categorieItems = isSearch ? filterCat : varieties;
  return (
    <>
      <Dialog open={dialogOpen} maxWidth="md" >
        <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
          {catId ? "Edit Variety" : "Add Variety"}
        </DialogTitle>
          <IconButton
          aria-label="close"
          onClick={() =>{
              setDialogOpen(false);
              setAddOn(false);
              setTags("");
              setgroupName("");
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
        <div
          className="container"
          style={{minWidth:"400px", padding: "20px 40px", borderRadius: "10px", margin: "20px" }}
        >
          <div>
         
          <TextField
                size="small"
                 className="input_cls"
                 type="text"
                placeholder={'Enter Group Name'}
                label={`Group Name`}
                style={{minWidth:"300px"}}
                value={groupName}
                 onChange={handleGroupNameChange}
            />
         
          </div>
         
          <div className="tags-input-variety">
           <label>Group Items</label>
            <ul id="tags"  style={{minWidth:"300px"}}>
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
              placeholder="Press enter to add Items"
            />
          </div>
        </div>
        <DialogActions>
                  <Button
                    color="error"
                    style={{ margin: "10px" }}
                    className="close-btn"
                    onClick={()=>{
              setDialogOpen(false);
              setAddOn(false);
              setTags("");
              setgroupName("");
              setImageURL("");
              setCatId("");
            }}
                  >
                    Close
                  </Button>
                  <Button
                    className="save-btn btnDialog-Fill"
                    variant="contained"
                    color="success"
                    style={{ margin: "10px" }}
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
        />
      ) : (
        <div />
      )}

      <div className="header">
        <h4>Varieties</h4>
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
              <th style={{ width: "25%" }}>Varieties</th>
              <th style={{ width: "25%" }}>Items</th>
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
                    <td style={{ width: "25%" }}>{category.items}</td>
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

export default Variety;
