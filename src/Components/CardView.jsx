import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Switch, FormControlLabel, Dialog, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon
import configs from "../Constants";
import { styled } from "@mui/material/styles";

export default function MediaCard(props) {
  const ColorSwitch = styled(Switch)(({ theme }) => ({
    width: 70,
    height: 40,
    padding: 8,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 3,
      "&.Mui-checked": {
        transform: "translateX(32px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#00cc66",
          opacity: 1,
          border: "none",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      width: 34,
      height: 34,
      backgroundColor: "#ffffff",
      boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.5)",
    },
    "& .MuiSwitch-track": {
      borderRadius: 20,
      backgroundColor: "#ff0000",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], { duration: 500 }),
    },
  }));

  const [checked, setChecked] = useState(props.available);
  const [openModal, setOpenModal] = useState(false);
  const [orderUrl, setOrderUrl] = useState("");

  const handleChange = (event) => {
    props.onToggle();
    setChecked(event.target.checked);
  };

  const handleNewOrder = () => {
    const url = `https://tto.menulive.in/order?merchantCode=${props.merchantCode}&isScan=true&tableNumber=${props.table}`;
    setOrderUrl(url);
    setOpenModal(true);
  };

  return (
    <>
      <Card
        sx={{
          margin: "20px",
          width: 230,
          maxWidth: 345,
          backgroundColor: props.available ? "#4caf50" : "#ef4444",
        }}
      >
        <CardMedia
          sx={{ height: 140 }}
          image={props.available ? "./free.png" : "./occupied.png"}
          title="Table Status"
        />
        <CardContent sx={{ backgroundColor: "white" }}>
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography gutterBottom variant="h5">
                Table {props.table}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={1}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Capacity: {props.capacity}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ backgroundColor: "white", padding: "8px", justifyContent: "space-between" }}>
          <FormControlLabel
            style={{ margin: 0, fontWeight: "bold", transform: "scale(1.2)" }}
            control={<ColorSwitch checked={checked} onChange={handleChange} />}
          />
          {props.available ? (
            <Button size="small" variant="contained" onClick={handleNewOrder}>
              New Order
            </Button>
          ) : (
            <Button size="small" variant="outlined" onClick={handleNewOrder}>
              Open Order
            </Button>
          )}
        </CardActions>
      </Card>

  
      {/* <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, position: "relative" }}>
        </DialogTitle>

        <iframe
          src={orderUrl}
          width="100%"
          height="600px"
          style={{ border: "none" }}
        />
      </Dialog> */}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullScreen={true}>
              <Button
                variant="contained"
                color="error"
                style={{ float: "right", marginTop: "5px" }}
                className="btn btn-danger m-2 btn-small"
                onClick={() => setOpenModal(false)}
              >
                Close
              </Button>
      
              <iframe
                src={orderUrl}
                style={{ width: "100%", height: "100%", border: "none", zIndex: 1 }}
                title="Waiter Token"
              />
      </Dialog>
      
    </>
  );
}
