import React, { useState,useEffect } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import axios from 'axios';
// import { json } from 'react-router-dom';
import MerchantDetails from "./MerchantDetails";
import configs, {getParameterByName} from "../Constants"

const MarchentInfo = () => {

    let baseURL = configs.baseURL;
    
    let userData =sessionStorage.getItem("userData")?JSON.parse(sessionStorage.getItem("userData")):"";
    console.log(userData);

const userId=userData?userData.sub:" ";


const getMarDetails=baseURL+'/fbs/locations?title=UPI&userid='+userId;
console.log(getMarDetails);
const[selectedId,setSelectedId]= useState();
const[marchentDtails,setMarchentDetails]=useState([]);
const[showUPI,setShowUPI]=useState(false);
const [shoeSwgy,setShowSwgy]=useState(false);
const[showZmta,setShowZmta]=useState(false);
const[marchentName,setMarchentName]=useState("");
const[marchentUPI,setMarchentUPI]=useState();
const handleZomataAccordian=()=>{setShowZmta(!showZmta)}
const handleSwiggyAccordian= ()=>{setShowSwgy(!shoeSwgy)}
const handleUPIAccordian=()=>{setShowUPI(!showUPI)}


console.log(marchentDtails);

const handleName= (event)=>{
    console.log(event.target.value);
    setMarchentName(event.target.value);
} 
const handleNumber= (event)=>{
    setMarchentUPI(event.target.value);
    console.log(event.target.value);
} 


const handleSubmit =(event)=>{
    event.preventDefault();
    console.log(marchentName,marchentUPI);
   
   
   if(selectedId){
    axios
    .put(baseURL+'/fbs/locations', {
            locData:{
                    _id:selectedId,
                loc_name:JSON.stringify( {name:marchentName,
                                          upid:marchentUPI,
                                        }), 
                    user_id: userId, 
                    title: "UPI",
                 }
      
    })
    .then((response) => {
      console.log(response.data);
      axios.get(`${getMarDetails}`)
      .then((response) => {
    console.log(response.data);
    setMarchentDetails(response.data);
    
    });
})

   }
  else if(!marchentName || !marchentUPI){
    console.log("error");
   }
   else {
    axios
    .post(baseURL+'/fbs/locations', {
            locData:{
                loc_name:JSON.stringify( {name:marchentName,
                                          upid:marchentUPI,
                                        }), 
                    user_id: userId, 
                    title: "UPI",
                 }
      
    })
    .then((response) => {
      console.log(response.data);
      axios.get(`${getMarDetails}`)
      .then((response) => {
    console.log(response.data);
    setMarchentDetails(response.data);
    
    });
})
   }
   setMarchentName("");
   setMarchentUPI("");
   setSelectedId("")
    
}



    useEffect(() => {
        console.log(marchentDtails);
        if(!marchentDtails.length){
        axios.get(`${getMarDetails}`).then((response) => {
        console.log(response.data);
            setMarchentDetails(response.data);
        });
    }
    } );


    const handleEdit =(marchentId)=>{
        setSelectedId(marchentId);
                console.log(marchentId);
        const mrDetils=marchentDtails.length&& marchentDtails.filter(mrList=> mrList._id===marchentId)
        console.log(mrDetils[0]);
        setMarchentName(JSON.parse(mrDetils[0].loc_name).name);
        setMarchentUPI(JSON.parse(mrDetils[0].loc_name).upid);
            
    }
    const handleDelete =(deleteId)=>{
        console.log(deleteId);
            axios.delete(baseURL+'/fbs/locations/'+deleteId)
            .then((response) => {
                console.log(response.data);
                axios.get(`${getMarDetails}`)
                .then((response) => {
              console.log(response.data);
              setMarchentDetails(response.data);
              
            });})

        }

  return (
    <div className="container bg-light">
                {/* <h4 className="text-center my-4 textColor">Marchent Details</h4>  */}
            <div className='m-2'>
                <div className='fw-bold-5 text-center text-white rounded-2  bg-secondary w-75  accordian'  onClick={handleUPIAccordian}> UPI Details <span>{ showUPI?<ArrowDropUpIcon fontSize="large"/>:<ArrowDropDownIcon fontSize="large"/>}</span></div>
                {showUPI?
                <div>
                    <form style={{padding:'10px'}} onSubmit={handleSubmit}>
                    <div style={{display:'flex'}}>
                        <div>
                            <lable>Marchent Name<span className="text-danger">*</span></lable>
                        <input type='text' className='form-control w-100' value={marchentName} onChange={handleName}/>
                        
                        </div>
                        
                        <div className='mx-5'>
                        <lable>Enter UPI adress<span className="text-danger">*</span></lable>
                        <input  type='text' className='form-control w-100' value={marchentUPI}  onChange={handleNumber}/>
                        </div>
                        <button className='btn btn-xs btn-success mt-3' type='submit' >save</button>
                    </div>
                   
                    </form>

                    <table  width='100%' cellPadding='3px' className='mx-4'>
                        <thead align='center'>
                            <tr>
                                <th>Name</th>
                                <th>UPI Adress</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody align="center">{
                           marchentDtails.length &&  marchentDtails.map((upiDetalis)=>{
                                console.log(JSON.parse(upiDetalis.loc_name).name);
                            return(
                                <tr>
                                <td>{JSON.parse(upiDetalis.loc_name).name}</td>
                                <td>{JSON.parse(upiDetalis.loc_name).upid}</td>
                                <td>
                                    <button className='btn btn-xs btn-info' onClick={()=>handleEdit(upiDetalis._id)}>Edit</button>
                                </td>
                                <td>
                                    <button className='btn btn-xs btn-danger' onClick={()=>handleDelete(upiDetalis._id)}>Delete</button>
                                </td>
                            </tr>
                            )
                            })
                }</tbody>
                    </table>
                    
                </div>:""}
            </div>


            <div className='m-2' >
                <div className='fw-bold-5 text-center text-white rounded-2 accordian   bg-secondary  w-75'   onClick={handleSwiggyAccordian}>swiggy <span>{ shoeSwgy?<ArrowDropUpIcon fontSize="large"/>:<ArrowDropDownIcon fontSize="large"/>}</span></div>
                {shoeSwgy?
                <div>
                    <h1>Coming soon........................</h1>
                </div>:""}
            </div>



            <div className='mx-2' >
                <div className='fw-bold text-center  rounded-2 accordian  text-white bg-secondary w-75  '  onClick={handleZomataAccordian}>zomato <span>{ showZmta?<ArrowDropUpIcon fontSize="large"/>:<ArrowDropDownIcon fontSize="large"/>}</span></div>
                {showZmta?
                <div>
                   <h1>Coming soon.......................</h1>
                </div>:""}
            </div>
            {/* Merchant Details */}


            <div className='my-5'>
            <MerchantDetails/>
            </div>

    </div>
  )
}

export default MarchentInfo