// PaymentDialog.js
import React from 'react';
import { useEffect, useState } from "react";
import { Box, TextField, Button, ButtonGroup } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useIntl } from "react-intl";

const PriceUpdateDialog = (props) => {
console.log(props);
  const [newPrice, setNewPrice] = useState(props.oItemIndx?props.orderItems[props.oItemIndx-1].price:0);
 const { formatMessage: t, locale, setLocale } = useIntl();
 

const updateOrderItem = () => {
      let oItem = props.orderItems[props.oItemIndx-1];
      oItem.price = parseFloat(newPrice);
      props.updateOrder([oItem]);
      props.closeDialog(null);
  };

  return (
      <div p={3}  >
      <DialogTitle sx={{ m: 0, p: 2 }}><b>{t({ id: "update_price" })}</b></DialogTitle>
        <IconButton
          aria-label="close"
          onClick={()=>props.closeDialog(null)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent style={{borderTop:'1px solid #ccc', borderBottom:'1px solid #ccc',padding:'0px 20px'}}>
        <div className={'dialog-row'} style={{padding:"20px"}}>
        <label style={{marginRight:"10px"}}>
          {t({ id: "price" })}:  
        </label>
         <TextField
          variant="outlined"
          type="number"
          value={newPrice}
          onChange={(e)=>setNewPrice(e.target.value)}
          style={{fontSize:'1.5em',width:"150px",padding:'5px!important',textAlign:'right'}}
        />
        </div>
        </DialogContent>
          <DialogActions>
        <div display="flex" justifyContent="space-between" mt={2} width="100%">
          <Button variant="outlined" color="error" onClick={()=>props.closeDialog(null)} style={{ flex: 1, marginRight: '30px' }}>
            Cancel
          </Button>
          <Button onClick={updateOrderItem} className='btnDialog-Fill' variant="contained"  style={{ flex: 1 }}>
            UPDATE
          </Button>
        </div>
          </DialogActions>
      </div>
  );
};

export default PriceUpdateDialog;
