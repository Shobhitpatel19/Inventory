import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const DeleteDiaologue = ({ msg, open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.2)" }, // Adjust transparency
      }}
    >
      <DialogTitle>Alert</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to {msg === "cancel" ? <span>Cancel</span> : <span>delete</span>} this item?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
        {msg === "cancel" ? <span>Cancel</span> : <span>Delete</span>}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDiaologue;