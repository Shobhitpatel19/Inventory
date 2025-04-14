import React, { useState, useEffect } from "react";
import {
  MenuItem,
  InputAdornment,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
 DialogTitle,
} from "@mui/material";
import { Close, Check, Clear } from "@mui/icons-material";
import axios from "axios";
import configs from "../../Constants";
import Currencies from "../Currencies";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";


const InventoryProLink = (props) => {

  let product = props.product; 
  let varieties=  product.varietyPrices?JSON.parse(product.varietyPrices):null;
   console.log(product);
  const [invenOpen, setInvenOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);

  let baseURL = configs.baseURL;
  let userData = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : "";

  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const userToken = sessionStorage.getItem("token") || "";
  const merchCode = merchantData ? merchantData.merchantCode : "";

  let currency = Currencies.filter(
    (curen) => curen.abbreviation == merchantData.currency
  );
  const [recipeName, setRecipeName] = useState("");
  const [recipeQuantity, setRecipeQuantity] = useState("");
  const [recipeUnit, setRecipeUnit] = useState("kg");
  const [recipeItems, setRecipeItems] = useState([]);
  const [recipePlateType, setRecipePlateType] = useState("Full Plate");
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [recipeQuantities, setRecipeQuantities] = useState({});
  const [selectedInventoryItems, setSelectedInventoryItems] = useState([]);
  const [select, setSelect] = useState("");
 
 useEffect(() => {
    fetchInvProdData();
  }, []);


  if(!props.product || !props.product.id){
    return false;
  }


 const handleInvenClose = () => {
    setInvenOpen(false);
  };

  const handleInventory = async () => {
    console.log("user", userToken);
    try {
      const response = await axios.get(
        `${baseURL}/api/inventories?merchantCode=${merchCode}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      console.log(response.data);
      setInventoryData(response.data); // Store the data in state
      setInvenOpen(true); // Open the popup
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  const handleInventorySelection = (index, newValue) => {
    // If no value is selected, just update normally
    if (!newValue) {
      const updatedItems = [...recipeItems];
      updatedItems[index] = {
        ...updatedItems[index],
        inventoryId: "",
        name: "",
      };
      setRecipeItems(updatedItems);
      return;
    }

    // Check if this inventory item is already selected in another recipe item
    const inventoryId = newValue.id;
    const isDuplicate = recipeItems.some((item, idx) => 
      idx !== index && item.inventoryId === inventoryId
    );

    if (isDuplicate) {
      alert(`This inventory item "${newValue.name}" is already selected in another recipe field.`);
      return;
    }

    // Update the recipe item normally
    const updatedItems = [...recipeItems];
    updatedItems[index] = {
      ...updatedItems[index],
      inventoryId: newValue.id,
      name: newValue.name,
    };
    setRecipeItems(updatedItems);
  };

const getProductSavedInv = () => {

axios.get(`${baseURL}/api/product-inventories/products/${product.id}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      })
      .then(response => {
        console.log(response);
       let savedInvProd= response.data.map(prodInv => 
          {
            if(product.isPriceVariety){
             prodInv.quantity_per_variety= JSON.parse(prodInv.quantity_per_variety);
            }
            delete prodInv.__v;
            return prodInv
        });
        if(savedInvProd.length>0){
        console.log(savedInvProd);
        setRecipeItems(savedInvProd);
        }else{
          setRecipeItems([{productId:props.product.id,inventoryId:"",quantity_per_variety:product.varietyGroupId? JSON.parse(product.varietyPrices) : 0,notes:""}]);
        }
      }) .catch(error => {
            console.error(error);
          });


}

const isInventoryItemAlreadySelected = (inventoryId, currentIndex) => {
    return recipeItems.some((item, idx) => 
      idx !== currentIndex && item.inventoryId === inventoryId
    );
  };

const handleDeleteRecipeItem = (index) => {
    const deletedItem = recipeItems[index];
    console.log(deletedItem);
    if (deletedItem && deletedItem._id) {
      axios.delete(`${baseURL}/api/product-inventories/${deletedItem._id}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      })
      .then(response => {
        getProductSavedInv();
      })
      .catch(error => {
        console.error("Error:", error);
      });
    }else{
      let newRec = [...recipeItems];
       newRec.splice(index,1);
       setRecipeItems(newRec);
    }
  };

  const fetchInvProdData = async () => {
    try {
      const merchCode = merchantData ? merchantData.merchantCode : "";
      const inventoryResponse = await axios.get(
        `${baseURL}/api/inventories?merchantCode=${merchCode}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      const inventoryList = inventoryResponse.data;
      setInventoryData(inventoryList); // Store the data in state
      console.log("Inventory List:", inventoryList);

      if (product.id) {
        getProductSavedInv();
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  

  const saveInvItems = () => {
     console.log(recipeItems);
     let tobeSavedItems = recipeItems.filter(it => !it._id);
      tobeSavedItems =tobeSavedItems.map( itm => {
      if(typeof itm.quantity_per_variety == 'object'){
        itm.quantity_per_variety= JSON.stringify(itm.quantity_per_variety);
      }
      return itm;
    });


      axios
        .post(
          baseURL +
            "/api/product-inventories?merchantCode=" +
            merchCode,
          tobeSavedItems,
          {
            headers: {
              Authorization:
                "Bearer " + sessionStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          props.showSucMessg();
          props.setShowInventory(false);
        })
        .catch((error) => {
          console.error("Error saving product inventory:", error);
          props.showErrMessg();
        });

   }
  ;

const handleAddInvItem = () => {
   let invLinks = JSON.parse(JSON.stringify(recipeItems));
   invLinks.push({productId:props.product.id,inventoryId:"",quantity_per_variety:product.varietyGroupId? JSON.parse(product.varietyPrices) : 0,notes:""});
   return setRecipeItems(invLinks);
  };
 
  const handleChange = (val, indx, key, subQntyKey) => {
    console.log(indx);
    console.log(key);
    console.log(val);
    let newRecItems = [...recipeItems];
    if(subQntyKey){
      newRecItems[indx][key][subQntyKey] = val;
    }else{
      newRecItems[indx][key] = val;
    }
    
    setRecipeItems(newRecItems);
  }
  
  
  return (
    <Dialog
          open={true}
          maxWidth="lg"
          onClose={() => props.setShowInventory(false)}
          fullWidth={true}
        > 
         <DialogTitle style={{ fontWeight: "bold" }}>
          {product.name+ "'s Inventories link"}
          <br/><span style={{fontSize:"0.7em",fontWeight:"normal",color:"#908b8b"}}>Add quantity in grams/numbers/milli-liter</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => props.setShowInventory(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
          <div><Button 
        variant="outlined" 
        size="small"
        style={{right: "25px",position:"absolute",marginTop:"10px",maxWidth:"200px"}}
        startIcon={<AddIcon />}
        onClick={handleAddInvItem}
      >
        Link Inventory
      </Button></div>
        <DialogContent dividers>
          <div style={{  padding: "10px" }}>
    
    
  
    {recipeItems.length > 0 ? (
  <div>
    {recipeItems.map((item, index) => (
      <div key={index} style={{ display:"flex",flexDirection:"row"}}>

        <div style={{marginRight:"20px"}}>
          <Autocomplete
            size="small"
            options={inventoryData.filter(inv => recipeItems.filter(rec=> rec.inventoryId == inv.id).length == 0 )}
            disabled={item._id?true:false}
            getOptionLabel={(option) => option.name || ""}
            value={inventoryData.find((inv) => inv.id === item.inventoryId) || null}
            onChange={(event, newValue) => handleChange(newValue.id, index, 'inventoryId')}
            renderInput={(params) => (
              <TextField 
                {...params} 
                placeholder="Select inventory item" 
                 label="Inventory item" 
                 disabled={item._id?true:false}
                style={{
                  height: "50px",
                  width:"200px",
                  maxWidth: "200px",
                }}
              />
            )}
          />
        </div>

        <div style={{marginRight:"20px"}}>
          {varieties && Object.keys(varieties).length > 0 ? (
            Object.keys(varieties).map((variant) => (
              <TextField
                key={variant}
                size="small"
                className="small_row_inputs"
                type="number"
                disabled={item._id?true:false}
                placeholder={`${variant} quantity`}
                label={`${variant} quantity`}
                value={item.quantity_per_variety[variant] || 0}
                onChange={(e) => 
                  handleChange(e.target.value,index, 'quantity_per_variety',variant)
                }
               
              />
            ))
          ) : (
            <TextField
              size="small"
              label="Quantity"
              disabled={item._id?true:false}
              value={parseFloat(item.quantity_per_variety)}
              onChange={(e) => 
                handleChange(e.target.value,index, 'quantity_per_variety')
              }
              placeholder="Quantity"
              type="number"
              style={{ width: "150px" }}
            />
          )}
        </div>

     
        <div style={{cursor:"pointer",marginTop:"10px"}}>
         <DeleteIcon  onClick={() => handleDeleteRecipeItem(index)} />
        </div>
      </div>
    ))}
  </div>
) : 
  <div>Loading...Please wait!</div>
}


</div>
           </DialogContent>
             <DialogActions>
                  <Button
                    color="error"
                    style={{ margin: "10px" }}
                    className="close-btn"
                    onClick={()=>props.setShowInventory(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="save-btn btnDialog-Fill"
                    variant="contained"
                    color="success"
                    style={{ margin: "10px" }}
                    disabled={!recipeItems.length || !recipeItems.filter(it=> !it._id).length}
                    onClick={saveInvItems}
                  >
                    Save
                  </Button>
                  </DialogActions>
        </Dialog>
    


)
};

export default InventoryProLink;
