import React from "react";
import configs, {getParameterByName} from '../Constants';


const Members =()=>{
    
let token= sessionStorage.getItem("token");
console.log(token);
    let iframeURl=configs.authUrl+"/profile/user-profile?token="+token;
    // let iframeURl="http://localhost:8080/profile/user-profile?token="+token;
    return(
        <div style={{width:"100%",height:"100vh"}}>
             <h1>Members</h1>
             <iframe src={iframeURl} style={{width:"100%",height:"100%",border:"none"}} />
        </div>  
    )
}

export default Members;