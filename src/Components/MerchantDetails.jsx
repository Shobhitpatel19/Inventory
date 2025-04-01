import React from 'react';
import axios from "axios";
import configs, {getParameterByName} from "../Constants"
const MerchantDetails = () => {
    
let originURL = window.location.href.indexOf('localhost') > 0 ?'https://pos.menulive.in':window.location.origin;

let baseURL = configs.baseURL;

const handleImage=(e)=>{
    var formData = new FormData();
    let file = e.target.files[0];
    console.log(e.target);
    console.log(file);
    let fileName= 'mer_'+new Date().getTime()+file.name;
  
     formData.append("uploader", file, fileName);
     let postQueriesUrl = baseURL+'/upload/INVENTORY_ITEM';
     axios.post(postQueriesUrl, formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   });
//    setImageURL('app-uploads/customers/inventories/'+fileName);
   

    console.log('app-uploads/customers/inventories/'+fileName);
}
const handlePercentage=(e)=>{
    console.log(e.target.value);
}
const handleColor =(e)=>{
    console.log(e.target.value);
}
  return (
    <div className="container bg-light">
       
        <div>
            <form action="">
                <label htmlFor="">Upload Logo</label>
                <input type="file" className='form-control w-50' onChange={handleImage}/><br/>
                <label htmlFor="">Tax Price(%)</label>
                <input type="number"  className='form-control w-50' onChange={handlePercentage}/><br/>
                <label htmlFor="">Choose Color:</label>
                <input type="color" className='mx-2' onChange={handleColor} />
            </form>
        </div>
    </div>
  )
}

export default MerchantDetails