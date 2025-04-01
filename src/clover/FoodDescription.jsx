import React, { useState,useEffect } from "react";
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle'
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import configs, {getParameterByName} from "../Constants"
import { json } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function Fooddescription() {
  const [addonsGroup,setAddonsGroup]=useState([]);
  const [categories, setCategories] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState(0);
  const [calorie, setCalorie] = useState(0);
  const [inStock, setInstock] = useState(false);
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [categoryType,setCategoryType] = useState("");
  console.log(description);
  const [hideProductList,setHideProductList]=useState(false);
  const [selectProductId,setSelectProductId]=useState(0)
 const[hideEdit,setHideEdit]=useState(false);
  console.log(selectProductId);
  const [products, setProducts] = useState([]); 
  const[catItem,setCatItem]=useState();
  const[catType,setCatType]=useState();
  const[proStack,setProStack]=useState(); 
 console.log(catItem);
    const [catId,setCatId] = useState(0);
  const [tags, setTags] = useState();
const [filterOpen,setFilterOpen]=useState(false);
  const [filterPro,setFilterPro] = useState([]);
  const[addOn,setAddOn]=useState([]);

  let baseURL=configs.baseURL;

  const [userInfo, setUserInfo] = useState([]);

  // const [catAddOn,setCatAdon]=useState([]);
  // const [merchantData,setMerchantData]=useState([]);

 
  let userData =sessionStorage.getItem("userData")?JSON.parse(sessionStorage.getItem("userData")):"";
  console.log(userData);

  let originURL = window.location.href.indexOf('localhost') > 0 ?'https://pos.menulive.in':window.location.origin;
  let merchantData = sessionStorage.getItem("merchantData") ?JSON.parse( sessionStorage.getItem("merchantData")) :[];


console.log(baseURL+'/api/products');
let cur=merchantData?merchantData.currency:"";
let SelectCurrency = cur.toUpperCase()=== "INR"?"₹":"$";
// console.log(cur);
// let SelectCurrency ="₹";
  // const userId =userData?userData._id:" ";
  const userId=userData?userData.sub:" ";
  const getCatByUser =  `${baseURL}/api/clover/categories?merchantCode=${merchantData.length ? merchantData[0].merchantCode:" "}`;
  const getProductByUser = baseURL+`/api/clover/products?merchantCode=${merchantData.length ? merchantData[0].merchantCode:" "}`;

  console.log(getProductByUser);
  console.log(merchantData.length ? merchantData[0].merchantCode:" ");

useEffect(()=>{
  axios.get(baseURL + "/api/settings/" + userId).then(res => {
    console.log(res.data);
    setUserInfo(res.data);
});

},[])

const handleCategoryType =(event)=>{
  console.log(event.target.value);    
  setCategoryType(event.target.value);
}

  const handleCategoryId =(event)=>{
    setCatId(event.target.value);
    console.log(event.target.value);
  }


  const handleFoodNameChange = (event) => {
    setFoodName(event.target.value);
  };

  const handleInputChange = (e) => {
    var formData = new FormData();
    let file = e.target.files[0];
    console.log(e.target);
    console.log(file);
    let fileName= 'pro_'+new Date().getTime()+file.name;
  
     formData.append("uploader", file, fileName);
     let postQueriesUrl = baseURL+'/api/upload/INVENTORY_ITEM';
     axios.post(postQueriesUrl, formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   });
   setImageURL('app-uploads/customers/inventories/'+fileName);
   
   //setImageURL(file);
 };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleCalorieChange = (event) => {
    setCalorie(event.target.value);
  };

  const handleInStockChange = (event) => {
    setInstock(event.target.value);
    console.log(event.target.value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handleDescriptionChange=(event)=>{
    setDescription(event.target.value);
  }

  // const handleAddOns=(event)=>{
  //   setAddOn(event.target.value);
  // }
  let catAddongrp ;
  if(categories.length&&addonsGroup.length){
    catAddongrp=[...categories,...addonsGroup];
  }
  console.log(catAddongrp);

  const handleClose =()=>{
        setHideProductList(false);
        setHideEdit(false);
        setInstock("");
        setCalorie("");
        setFoodName("");
        setDescription("");
        setPrice("");
        setInstock("");
        setTags("");
        setImageURL("");
        setAddOn([]);
        setCatType("");
        setCatItem("");
       setProStack("");
       setSelectProductId("");
      }


  const handleSubmit = (event) => {
    event.preventDefault();
    // setHideProductList(false);
    console.log(`Food name: ${foodName},image:${imageURL}, cat_type:${categoryType},category:${catId},Description: ${description}, Price: ${price}, Calorie: ${calorie}, InStock:${inStock},Tags:${tags  }`);
  
        if(!foodName||!catId){
          console.log("error");
          let cat_type=document.getElementsByClassName("category");
          cat_type[0].style.borderColor='red';

        let fname=  document.getElementsByClassName('name');
        fname[0].innerHTML="required";
        fname[1].style.borderColor='red';
        }
        else if(selectProductId){         
          axios
          .put(baseURL+'/api/clover/products/'+selectProductId,{
            cat_type: categoryType,
              category:catId,
              name: foodName,
              description: description,
              image: imageURL,
              price: price,
              calorie: calorie,
              inStock: inStock,
              id:selectProductId,
              tags:tags,
              add_ons:addOn.length?addOn.join(","):'',
              userId:userId,
          } )
          .then((response) => {
            console.log(response.data);
            axios.get(`${getProductByUser}`)
            .then((response) => {
          console.log(response.data);
            setProducts(response.data);
            })
          });
          setHideProductList(false);
          setHideEdit(false);
        
        }
        else{
                axios
                  .post(baseURL+'/api/clover/products', {
                    cat_type: categoryType,
                    category:catId,
                    name: foodName,
                    description: description,
                    image: imageURL,
                    price: price,
                    calorie: calorie,
                    inStock: inStock?inStock:false, 
                    tags:tags,
                    add_ons:addOn.length?addOn.join(","):'',
                    userId:userId,
                  })
                  .then((response) => {
                    console.log(response.data);
                    axios.get(`${getProductByUser}`)
                    .then((response) => {
                  console.log(response.data);
                    setProducts(response.data);
                  
                  });
              });
              setHideProductList(false);
              setHideEdit(false);
            }
           
          
              
              setTags("");
              setInstock("");
              setCatId("");
              setCalorie("");
              setFoodName("");
              setDescription("");
              setPrice("");
              setInstock("");
              setImageURL("");
              setAddOn([]);
              setCatType("");
              setProStack("");
              setCatItem("");
              setSelectProductId("");
  };
  


 useEffect(() => {
    console.log(categories);
    if(!categories.length){
    axios.get(getCatByUser).then((response) => {
      console.log(response.data);
        if(response.data.length !== categories.length){
        setCategories(response.data);
        }
    });
  }
},[]);

 useEffect(()=>{
  if(!products.length){
  axios.get(getProductByUser).then((response)=>{
    if(response.data.length !== products.length){
    setProducts(response.data)
    console.log(response.data);
    }
  })
}


if(!addonsGroup.length){
  axios.get(`${baseURL}/api/clover/modifiers?merchantCode=${merchantData.length ? merchantData[0].merchantCode:" "}`)
  .then(res=>setAddonsGroup(res.data))
}   
 })
 
   
const handleDelete = (id) => { 
    console.log(id);
     axios
      .delete(baseURL+'/api/clover/products/'+id)
      .then((response) => {
        console.log(response.data);
       axios.get(getProductByUser).then((response) => {
      console.log(response.data);
        setProducts(response.data);
    });
      });
  };


  const handleEdit =(pro_id,pro_image,pro_category,proCat_type,pro_stock)=>{
        
      console.log(pro_image);
      console.log(pro_id);
      setHideEdit(true);
      setCatItem(pro_category);
      setCatType(proCat_type);
      setProStack(pro_stock);
  
    setSelectProductId(pro_id);
      if(pro_image)
      {
        setImageURL(pro_image)
      }
      else{setImageURL(imageURL)};
    
      const prodata= products.filter((pro) => pro.id===pro_id)
            console.log(prodata[0].name);
            console.log(prodata[0].description);
            
            setFoodName(prodata[0].name);
            setDescription(prodata[0].description);
           
            setPrice(prodata[0].price);
            setInstock(prodata[0].inStock); 
            setCalorie(prodata[0].calorie)
            setTags(prodata[0].tags);
            console.log(prodata[0].inStock);
            setCatId(prodata[0].category);
            setAddOn(prodata[0].add_ons.split(","));
          }
         

    const handleStocks=(prod)=>{
      console.log(prod);
      axios
      .put(baseURL+'/api/clover/products/'+prod.id,{
        cat_type:prod.cat_type,
          category:prod.category,
          name: prod.name,
          description: prod.description,
          image: prod.image,
          price: prod.price,
          calorie: prod.calorie,
          inStock: prod.inStock ? false:true,
          id:prod.id,
          tags:prod.tags,
          add_ons:prod.add_ons,
          userId:prod.userId
      } )
      .then((response) => {
        console.log(response.data);
        axios.get(`${getProductByUser}`)
        .then((response) => {
      console.log(response.data);
        setProducts(response.data);
        })
      });
    }      
      const filterProducts=(event)=>{
        let fname=event.target.value;
        console.log(fname);
        let filter =products.filter(li=>li.name.toLowerCase().indexOf(fname.toLowerCase()) !== -1 );
        console.log(filter);
        setFilterOpen(fname?true:false)
        setFilterPro(fname?filter:[]);

      }

      const removeAddons = (indexToRemove) => {
        setAddOn([...addOn.filter((_, index) => index !== indexToRemove)]);
    
      };
      const handleAddOns = (event) => {

        let val=event.target.value
        if (val !== "") {
            let existItem =addOn.filter(x=>x===val);
            const items = existItem.length
            ?addOn.map((x) =>
                x === existItem[0] ? val : x
              )
            : [...addOn,val];
            console.log(event.target.value);  
          setAddOn(items);  
        }
        
      };
        let cat_ad =[];

      if(categories && products){
            console.log(categories,products);
            let adFilter =categories.filter(cat=>cat.isAddOn);
            console.log(adFilter);
            let addPro =products.filter(pro=>
                            adFilter.filter(li=>{
                          if(li.id===pro.category){
                            cat_ad.push(pro);
                          } }));
      }


      const imageOnErrorHandler = (event) => {
        event.currentTarget.src = "./images/blank.jpeg";
      };
  
      let catAddon=catAddongrp&&catAddongrp.length?catAddongrp:categories;
      let prod = filterOpen?filterPro.length?filterPro:"":products;
      console.log(catId);
  return (
    <>
      <div className="container">
           <div className="header">
           <h4 className="">Items</h4> 
                <div className="search">
                  <SearchIcon/>
                  <input type="text" onChange={filterProducts} placeholder="Enter Name" style={{border:"none",outline:"none",width:"87%",backgroundColor:"transparent"}}/>
                </div>
                {userInfo.length&&userInfo[0].activeProviderId===""?  <button className="add_btn" onClick={()=>setHideProductList(true)}><AddIcon/> Add New</button>:<span></span>}
            </div>
      
       <Dialog 
      //  style={{height:'100vh'}}
      //  close={hideProductList}
        open={hideProductList|| hideEdit}
        maxWidth="lg"
        fullWidth={true}
       >
        <DialogTitle style={{textAlign:"center",fontWeight:"bold"}} >{hideEdit ?"Edit Products":"Add Products"}</DialogTitle>
        <div>{hideProductList|| hideEdit? <>
        <form style={{padding:'8px',paddingLeft:"18px"}} >

            <label htmlFor="">Category<span className="text-danger">*</span></label>
               <select className="category" style={{marginLeft:"8px"}}  onChange={handleCategoryId}>
                          <option >select</option>
                          {/* filter(cat=>!cat.isAddOn) */}
                      {
                        catAddon&&catAddon.length?catAddon.map((cat)=>(
                          <option value={cat.id} selected={catItem===cat.id? true : false}>{cat.name} </option>
                          )):" "
                      }
                      
                    
           </select><br/>
          <label>Name <span className="text-danger">*</span></label>
          <div className="text-danger name"></div>
          <input
            onChange={handleFoodNameChange}
            className="input_cls name"
            name="foodname"
            type="text"
            placeholder="Name"
            value={foodName}
          />
          <label>Description</label>
          <input
            type="text"
            className="input_cls"
            placeholder="Description"
            onChange={handleDescriptionChange}
            name="description"
            value={description}
          />
          <label>Image </label>
          <input
            onChange={handleInputChange}
            className="input_cls"
            type="file"
            placeholder="Image"
            name="image"
            // value={imageURL}
          />
          <label style={{marginTop:'8px'}} htmlFor="">Price </label>
          <input
            onChange={handlePriceChange}
            type="text"
            className="input_cls "
            placeholder="Price"
            name="price"
             value={price}
          />
          <label style={{marginTop:'8px'}} htmlFor="">Calorie </label>
          <input
            onChange={handleCalorieChange}
            type="text"
            className="input_cls "
            placeholder="Calories"
            name="calorie"
             value={calorie}
          />
          <div style={{marginTop:'8px', display:'flex', justifyContent:'flex-start', alignItems:'center',}}>
            <div>
          <label htmlFor="">InStock</label>
          <select onChange={handleInStockChange} style={{marginLeft:'10px'}} className="select_input">
                    <option value={false}>select</option>
                    <option value={true} selected={proStack}>Yes</option>
                    <option value={false} selected={proStack===false?true:false}>No</option>
            </select>
            
            </div>
            <div className="mx-5">
            <label htmlFor="" >Food Type</label>
              <select style={{marginLeft:"10px"}} className="select_input" onChange={handleCategoryType} >
                <option >select</option>
                <option value='Veg'  selected={catType?catType.toUpperCase() ==="VEG" ? true:false:""} >Veg</option>
                <option value='Non-Veg' selected={ catType?catType.toUpperCase() ==="NON-VEG" ? true:false:''}>Non-Veg</option>
              </select>
              </div>
            </div>  
        { catId &&catAddon&&catAddon.length&&catAddon.filter(ca=>ca.id===catId).length&&!catAddon.filter(ca=>ca.id===catId)[0].isAddOn ?<><label style={{marginTop:"10px"}} htmlFor="">Add-on items</label>
         <div className="tags-input " style={{display:"block"}}>
            <ul id="tags">{addOn.length?
              addOn.length &&addOn.map((tag, index) =>{ 
                let addName =addonsGroup.filter(li=>li.id===tag);
               return (
                <li key={index} className="tag">
                  <span className="tag-title">{addName.length?addName[0].name:" "}</span>
                  <span
                    className="rmv-btn"
                    onClick={() => removeAddons(index)}
                  >
                    x
                  </span>
                </li>
              )})
              : <span className="tag-title"></span>} </ul>
           
                <select name="" id=""   className="select_input" onChange={handleAddOns}>
                  <option>Select</option>
                  {
                    addonsGroup.length?addonsGroup.filter(cat=>cat.isAddOn).map(li=>
                         <option value={li.id}>{li.name}</option>
                      ) :""
                  }
                </select>
          </div> </>:" "}
          <label style={{marginTop:'10px'}} htmlFor="">Tags </label>
          <input
            onChange={handleTagsChange}
            type="text"
            className="input_cls"
            placeholder="Enter tags by comma(,) seprate"
            name="tags"
           value={tags}
          />
        </form>

          <Button
           className="save-btn"
           variant="contained"
            color="success" 
            style={{margin:"20px"}}
           onClick={handleSubmit}>
              Save
            </Button>

          <Button
          variant="contained"
           color="error"
           style={{margin:"20px"}}
           className="close-btn" 
          onClick={handleClose}>Close</Button>

        </>:""  }

        </div>
       
        </Dialog >
      
        <div className="product-list">
            <table width='100%'   cellPadding="4px" >
               <thead >
               <tr>
                 
                
                 <th>Name</th>
                 {/* <th>Description</th> */}
                 <th>Images</th>
                 <th>Price</th>
                 <th>Calorie</th>
                
                 <th>Veg/Non-Veg</th>
                 <th>Category</th>
                 {/* <th>Tags</th> */}
                 <th>Instock</th>
                {userInfo.length&&userInfo[0].activeProviderId===""?<th>Update</th>:""}
                {userInfo.length&&userInfo[0].activeProviderId===""? <th>Action</th>:""}
               </tr>
              </thead>
              <tbody>
                { prod.length ?prod.map((p)=>{
                  let cat_name=catAddon&&catAddon.length?catAddon.filter((cat)=>(p.category.id?p.category.id:p.category)===(cat._id?cat._id:cat.id)):[];
                  // console.log(cat_name,p);
                  cat_name = cat_name.length?cat_name[0].name:"";
                 
                 return  (
                  <tr style={{borderBottom:'1px solid #f0eeee',margin:'5px'}} >
                    <td  style={{maxWidth:"100px",overflow:"hidden",whiteSpace: "wrap",fontWeight:"bold"}}>{p.name}</td>
                    {/* <td style={{maxWidth:"100px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace: "nowrap"}}>{p.description}</td> */}
                    <td style={{padding:'10px 0px',}}><img src={p.image===""?"./images/blank.jpg":baseURL+'/'+p.image} alt={p.name} 
                    onError={imageOnErrorHandler}
                     style={{width:'80px',height:'40px',borderRadius:"5px"}}  /></td>
                    <td>{SelectCurrency} {p.price}</td>
                    <td>{p.calorie}</td>
                   
                    <td >{p.cat_type.toLowerCase()==="Non-Veg".toLocaleLowerCase()?<img src="./images/Non-veg.png" height="30px" style={{marginLeft:"20px"}}/>:<img src="./images/veg.png" height="30px"  style={{marginLeft:"20px"}}/>}</td>
                    <td>{cat_name}</td>
                    {/* <td>{p.tags}</td> */}
                    <td>
                           <input type="checkbox" checked={p.inStock} onChange={()=>handleStocks(p)}  style={{width:"40px",height:"20px",accentColor:"#31e631",cursor:"pointer"}}/>
                    </td>
                   { userInfo.length&&userInfo[0].activeProviderId===""?<td align="center">
                      {/* <button className="btn" style={{outline:"none !important"}} onClick={()=> handleEdit(p.id,p.image ,p.category,p.cat_type,p.inStock)}><EditIcon/></button> */}
                      <IconButton aria-label="delete" size="large" color="info" onClick={()=> handleEdit(p.id,p.image ,p.category,p.cat_type,p.inStock)}>
                                <EditIcon />
                        </IconButton>
                    </td>:""}
                    {userInfo.length&&userInfo[0].activeProviderId===""?<td align="center">
                      {/* <button className='btn btn-danger' onClick={()=> handleDelete(p.id)}><DeleteIcon/></button> */}
                      <IconButton aria-label="delete" size="large" color="error" onClick={()=> handleDelete(p.id)}>
                                <DeleteIcon />
                        </IconButton>
                    </td>:""}
                    
                  </tr>

                )}):""}
              </tbody>
          </table>
       </div>

      </div>
    </>
  );
 }



export default Fooddescription;
