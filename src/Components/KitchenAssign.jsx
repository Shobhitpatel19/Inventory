import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import configs from "../Constants";
import DeleteDiaologue from "./sub_comp/Delete";

const KitchenAssign = () => {
  let baseURL = configs.baseURL;
  let userToken = sessionStorage.getItem("token") || "";
  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "xyz";
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  const userId = userData ? userData.sub : " ";

  const [kitchens, setKitchens] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", notes: "" });
  const [editId, setEditId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState("");

  useEffect(() => {
    fetchKitchens();
  }, []);

  const fetchKitchens = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/kitchens?merchantCode=${merchCode}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      console.log("getting", res.data);
      setKitchens(res.data);
    } catch (err) {
      console.error("Error fetching kitchens:", err);
    }
  };

  const handleOpenPopup = (kitchen = null) => {
    if (kitchen) {
      setFormData({ name: kitchen.name, notes: kitchen.notes });
      setEditId(kitchen.id);
      setEditMode(true);
    } else {
      setFormData({ name: "", notes: "" });
      setEditId(null);
      setEditMode(false);
    }
    setOpenPopup(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await axios.put(`${baseURL}/api/kitchens/${editId}`, formData, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
      } else {
        await axios.post(
          `${baseURL}/api/kitchen`,
          { ...formData, userId },
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
      }
      fetchKitchens();
      setOpenPopup(false);
    } catch (err) {
      console.error("Error saving kitchen:", err);
    }
  };

  const handleDelete = async (kitchen) => {
    // console.log("for id" ,kitchen.id);
    // try {
    //     await axios.delete(`${baseURL}/api/kitchen/${kitchen.id}`, {
    //       headers: { Authorization: `Bearer ${userToken}` },
    //     });
    //     fetchKitchens();
    //   } catch (err) {
    //     console.error("Error deleting kitchen:", err);
    //   }
    setDeleteItem(kitchen);
    setDeleteItemName(kitchen?.name || "this kitchen");
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setDeleteItem(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) {
      return;
    }

    try {
      await axios.delete(`${baseURL}/api/kitchen/${deleteItem.id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      fetchKitchens();
    } catch (err) {
      console.error("Error deleting kitchen:", err);
    } finally {
      setOpenDeleteDialog(false);
      setDeleteItem(null);
    }
  };

  return (
    <div>
      <div className="header">
        <h4>Kitchen</h4>
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            className="search_input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add_btn" onClick={() => handleOpenPopup()}>
          <AddIcon /> Add New
        </button>
      </div>

      <div className="category-list" style={{ padding: "20px" }}>
        <Table className="category-table" style={{ width: "100%" }}>
          <Thead>
            <Tr>
              <Th>Varieties</Th>
              <Th>Notes</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {kitchens
              .filter((kitchen) =>
                kitchen.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((kitchen, index) => (
                <Tr key={index}>
                  <Td>{kitchen.name}</Td>
                  <Td>{kitchen.notes}</Td>
                  <Td>
                    <IconButton
                      aria-label="edit"
                      size="large"
                      color="info"
                      onClick={() => handleOpenPopup(kitchen)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      size="large"
                      color="error"
                      onClick={() => handleDelete(kitchen)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </div>

      {/* Popup Dialog */}
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>
          {editMode ? "Edit Kitchen" : "Add New Kitchen"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            margin="dense"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPopup(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {editMode ? "Update" : "Save"}
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
    </div>
  );
};

export default KitchenAssign;
