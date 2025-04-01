import React,{useEffect,useState} from "react";
import configs from '../Constants';
import axios from "axios";

const Customers = ()=>{
    let domain = window.location.href.indexOf('localhost') > 0 ?'https://menu.merchantnations.com':window.location.origin;
    
    let merchantData = sessionStorage.getItem("merchantData") ?JSON.parse( sessionStorage.getItem("merchantData")) :[];
    let userData =sessionStorage.getItem("userData")?JSON.parse(sessionStorage.getItem("userData")):"";
    console.log(userData);
    const userId=userData?userData.sub:" ";
    let baseURL=configs.baseURL
    let authApi=configs.authapi
console.log(`${authApi}/api/customer/${userId}`);

let userToken =sessionStorage.getItem("token")?sessionStorage.getItem("token"):"";
console.log(userToken);
useEffect(()=>{
    axios({
      method: 'get',
      url:`${authApi}/customer`,
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    }).then(res=>{
        console.log(res.data);
        });
},[]);

    return(
        <div>
            <h1>coming soon....</h1>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                        </tr>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Dl24</td>
                        </tr>
                    </tbody>
                    </thead>
                </table>
            </div>
        </div>
    
    )};


export default Customers;
