import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const DeleteDiaologue = ({ msg, open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.2)" }, // Adjust transparency
      }}
    >
      <DialogTitle>Confirm!!</DialogTitle>
      <IconButton
          aria-label="close"
          onClick={() => onClose()}
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
        <DialogContentText>
          Are you sure you want to {msg === "cancel" ? <span>Cancel</span> : <span>delete</span>} this item?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
        {msg === "cancel" ? <span>Cancel</span> : <span>Delete</span>}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDiaologue;