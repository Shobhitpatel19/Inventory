import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from "@mui/material";

import configs from "../Constants";
import DeleteDiaologue from "./sub_comp/Delete";

const Inventories = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    unitType: "grams",
    availableQnty: "",
    minLimit: "",
    expiryDate: "",
    isOrderedNewStock: false,
    note: "",
    userId: "",
  });

  const baseURL = configs.baseURL;
  const userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";
  const userToken = sessionStorage.getItem("token") || "";
  const merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "xyz";
  const userId = userData ? userData.sub : "";

  // 1. Fetch Inventories (used in useEffect and after updates)
  const fetchInventories = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/inventories?merchantCode=${merchCode}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching inventories", error);
    }
  };

  // 2. Load data on component mount
  useEffect(() => {
    fetchInventories();
    // eslint-disable-next-line
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 3. Handle Edit: open modal and fill fields with product data
  const handleEdit = (product) => {
    // Convert expiryDate to "YYYY-MM-DD" so it works in the date input
    const formattedExpiryDate = new Date(product.expiryDate)
      .toISOString()
      .split("T")[0];

    setNewProduct({
      ...product,
      expiryDate: formattedExpiryDate,
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = (id) => {
    // try {
    //   await axios.delete(`${baseURL}/api/inventories/${id}?merchantCode=${merchCode}`, {
    //     headers: { Authorization: `Bearer ${userToken}` },
    //   });
    //   // Remove the deleted product from local state
    //   setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
    // } catch (error) {
    //   console.error("Error deleting product", error);
    // }

    setDeleteItemId(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    setDeleteItemId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItemId) {
      return;
    }
    try {
      await axios.delete(
        `${baseURL}/api/inventories/${deleteItemId}?merchantCode=${merchCode}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      // Remove the deleted product from local state
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== deleteItemId)
      );
    } catch (error) {
      console.error("Error deleting product", error);
    } finally {
      setOpenDeleteDialog(false);
      setDeleteItemId(null);
    }
  };

  // 5. Open modal for "Add New" (clear all fields)
  const handleOpen = () => {
    setNewProduct({
      id: "",
      name: "",
      unitType: "grams",
      availableQnty: "",
      minLimit: "",
      expiryDate: "",
      isOrderedNewStock: false,
      note: "",
      userId: "",
    });
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // 6. Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 7. Save a new product
  const handleSave = async () => {
    newProduct.userId = userId;
    try {
      await axios.post(`${baseURL}/api/inventories`, newProduct, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      // After saving, re-fetch the latest data to see updated list
      fetchInventories();
      handleClose();
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  // 8. Update an existing product
  const handleUpdate = async () => {
    try {
      await axios.put(
        `${baseURL}/api/inventories/${newProduct.id}`,
        newProduct,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      // After updating, re-fetch the latest data so date is properly displayed
      fetchInventories();
      setIsEditing(false);
      handleClose();
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  return (
    <div>
      <div className="header">
        <h4>Inventories</h4>
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Enter Name"
            style={{
              border: "none",
              outline: "none",
              width: "87%",
              backgroundColor: "transparent",
            }}
          />
        </div>
        <button className="add_btn" onClick={handleOpen}>
          <AddIcon /> Add New
        </button>
      </div>

      {/* Dialog for Add / Edit */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEditing ? "Edit Inventory" : "Add New Inventory"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            select
            fullWidth
            margin="dense"
            label="Unit Type"
            name="unitType"
            value={newProduct.unitType}
            onChange={handleInputChange}
          >
            <MenuItem value="grams">Grams</MenuItem>
            <MenuItem value="milliliter">Milliliter</MenuItem>
            <MenuItem value="quantity">Quantity</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="dense"
            label="Available Quantity"
            name="availableQnty"
            type="number"
            value={newProduct.availableQnty}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Minimum Limit"
            name="minLimit"
            type="number"
            value={newProduct.minLimit}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={newProduct.expiryDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isOrderedNewStock"
                checked={newProduct.isOrderedNewStock}
                onChange={handleInputChange}
              />
            }
            label="New Stock Ordered"
          />
          <TextField
            fullWidth
            margin="dense"
            label="Note"
            name="note"
            value={newProduct.note}
            onChange={handleInputChange}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button style={{marginRight:"20px"}} onClick={handleClose} color="secondary">
            Close
          </Button>
          <Button
            onClick={isEditing ? handleUpdate : handleSave}
            className={"btnDialog-Fill"}
            variant="contained"
            color="success"
          >
            {isEditing ? "Update" : "Save"}
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

      {/* Displaying the inventory list */}
      <div className="product-list">
        <Table width="100%" cellPadding="4px">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Unit Type</Th>
              <Th>Available Quantity</Th>
              <Th>Minimum Limit</Th>
              <Th>Expiry Date</Th>
              <Th>New Stock Ordered</Th>
              <Th>Note</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.length
              ? products
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((p) => (
                    <Tr
                      key={p.id}
                      style={{ borderBottom: "1px solid #f0eeee" }}
                    >
                      <Td>{p.name}</Td>
                      <Td>{p.unitType}</Td>
                      <Td>{p.availableQnty}</Td>
                      <Td>{p.minLimit}</Td>
                      <Td>
                        {p.expiryDate
                          ? new Date(p.expiryDate).toLocaleDateString()
                          : ""}
                      </Td>
                      <Td>
                        <Checkbox checked={p.isOrderedNewStock} readOnly />
                      </Td>
                      <Td>{p.note}</Td>
                      <Td>
                        <IconButton color="info" onClick={() => handleEdit(p)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(p.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Td>
                    </Tr>
                  ))
              : <Tr><Td></Td><Td style={{width:"100px"}}>No products available</Td></Tr>}
          </Tbody>
        </Table>
        {products.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </div>
    </div>
  );
};

export default Inventories;
