import axios from "axios";
import React, { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import configs from "../Constants";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteDiaologue from "./sub_comp/Delete";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Variety() {
  const [groupName, setgroupName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [varieties, setVarieties] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [filterCat, setFilterCat] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [catId, setCatId] = useState("");
  const [addOn, setAddOn] = useState(false);
  const [tags, setTags] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteitemName, setDeleteItemName] = useState("");

  const userToken = sessionStorage.getItem("token") || "";
  const baseURL = configs.baseURL;
  const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
  const merchantData = JSON.parse(sessionStorage.getItem("merchantData") || "{}");
  const merchCode = merchantData?.merchantCode || "";
  const userId = userData?.sub || "";

  const getCatByUser = `${baseURL}/api/varieties?merchantCode=${merchCode}`;

  useEffect(() => {
    axios
      .get(`${baseURL}/api/settings/${userId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => setUserInfo(res.data));
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (!varieties.length) {
      axios.get(getCatByUser).then((response) => setVarieties(response.data));
    }
  };

  const handleGroupNameChange = (event) => setgroupName(event.target.value);

  const handleSubmit = () => {
    console.log(`Variety name: ${groupName}, name: ${selectedOption}, isAddOn: ${addOn}`);
    if (!groupName) {
      toast.error("All fields are mandatory");
      return;
    }

    // Check for duplicate variety name
    const isDuplicate = varieties.some(
      (variety) => variety.name.toLowerCase() === groupName.toLowerCase() && variety.id !== catId
    );

    if (isDuplicate) {
      toast.error("A variety with this name already exists!");
      return;
    }

    const payload = {
      name: groupName,
      items: tags.length ? tags.join(",") : "",
      userId: userId,
    };

    const config = { headers: { Authorization: `Bearer ${userToken}` } };

    if (catId) {
      axios
        .put(`${baseURL}/api/varieties/${catId}?merchantCode=${merchCode}`, payload, config)
        .then(() => {
          axios.get(getCatByUser).then((res) => setVarieties(res.data));
          setDialogOpen(false);
          resetForm();
        });
    } else {
      axios
        .post(`${baseURL}/api/varieties?merchantCode=${merchCode}`, payload, config)
        .then(() => {
          axios.get(getCatByUser).then((res) => setVarieties(res.data));
          setDialogOpen(false);
          resetForm();
        });
    }
  };

  const resetForm = () => {
    setAddOn(false);
    setTags([]);
    setgroupName("");
    setImageURL("");
    setCatId("");
    setSelectedOption("");
  };

  const handleDelete = (id, name) => {
    setDeleteItemId(id);
    setDeleteItemName(name);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteItemId) return;
    axios
      .delete(`${baseURL}/api/varieties/${deleteItemId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then(() => {
        axios.get(getCatByUser).then((res) => setVarieties(res.data));
        setOpenDeleteDialog(false);
        setDeleteItemId(null);
      });
  };

  const removeTags = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const addTags = (event) => {
    if (event.target.value !== "") {
      setTags([...tags, event.target.value]);
      event.target.value = "";
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    const fltDAta = varieties.filter((cat) =>
      cat.name.toLowerCase().includes(val.toLowerCase())
    );
    setFilterCat(fltDAta);
    setIsSearch(!!val);
  };

  const handleEdit = (cat) => {
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
      <Dialog open={dialogOpen} maxWidth="md">
        <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
          {catId ? "Edit Variety" : "Add Variety"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setDialogOpen(false);
            resetForm();
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
        <div className="container" style={{ minWidth: "400px", padding: "20px 40px", borderRadius: "10px", margin: "20px" }}>
          <TextField
            size="small"
            className="input_cls"
            type="text"
            placeholder="Enter Group Name"
            label="Group Name"
            style={{ minWidth: "300px" }}
            value={groupName}
            onChange={handleGroupNameChange}
          />
          <div className="tags-input-variety">
            <label>Group Items</label>
            <ul id="tags" style={{ minWidth: "300px" }}>
              {tags.map((tag, index) => (
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
              onKeyUp={(event) => event.key === "Enter" && addTags(event)}
              placeholder="Press enter to add Items"
            />
          </div>
        </div>
        <DialogActions>
          <Button color="error" style={{ margin: "10px" }} onClick={() => { setDialogOpen(false); resetForm(); }}>
            Close
          </Button>
          <Button variant="contained" color="success" style={{ margin: "10px" }} onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {openDeleteDialog && deleteitemName && (
        <DeleteDiaologue
          open={true}
          onClose={handleDeleteClose}
          onConfirm={handleConfirmDelete}
          itemName={deleteitemName}
          msg="delete"
        />
      )}

      <div className="header">
        <h4>Varieties</h4>
        <div className="search">
          <SearchIcon />
          <input type="text" className="search_input" placeholder="Search" onChange={handleSearch} />
        </div>
        {userInfo.length &&
        (!userInfo[0].activeProviderId ||
          userInfo[0].activeProviderId.toUpperCase() === "CUSTOM") ? (
          <button className="add_btn" onClick={() => setDialogOpen(true)}>
            <AddIcon /> Add New
          </button>
        ) : null}
      </div>

      <div className="category-list" style={{ padding: "20px" }}>
        <Table style={{ width: "100%" }}>
          <Thead>
            <Tr>
              <Th style={{ width: "25%" }}>Varieties</Th>
              <Th style={{ width: "25%" }}>Items</Th>
              <Th style={{ width: "30%" }}>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categorieItems.map((category) => (
              <Tr key={category.id} style={{ borderBottom: "1px solid #f0eeee", margin: "5px" }}>
                <Td style={{ fontWeight: "bold", width: "25%" }} align="start">
                  {category.name}
                </Td>
                <Td style={{ width: "25%" }}>{category.items}</Td>
                <Td style={{ width: "30%" }}>
                  {userInfo.length &&
                  (!userInfo[0].activeProviderId ||
                    userInfo[0].activeProviderId.toUpperCase() === "CUSTOM") ? (
                    <>
                      <IconButton aria-label="edit" size="large" color="info" onClick={() => handleEdit(category)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" size="large" color="error" onClick={() => handleDelete(category.id, category.name)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <ToastContainer />
    </>
  );
}

export default Variety;
