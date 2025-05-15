import React from "react";
import configs, {getParameterByName} from '../Constants';


const Members =()=>{
    
let token= sessionStorage.getItem("token");
console.log(token);
    let iframeURl=configs.authUrl+"/profile/user-profile?token="+token;

    // let iframeURl="http://localhost:8080/profile/user-profile?token="+token;
    return(
        <div style={{padding:"0px 20px",width:"100%",height:"calc(100vh - 80px)"}}>
             <h1 style={{paddingLeft:"20px" }}>User Profile</h1>
             <iframe src={iframeURl} style={{width:"100%",height:"calc(100% - 79px)",border:"none"}} />
        </div>  
    )
}

export default Members;