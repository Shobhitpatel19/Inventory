import axios from "axios";

//let domain = window.location.href.indexOf('localhost') > 0 ?'https://menu.merchantnations.com':window.location.origin;

let domain = window.location.href.indexOf('localhost') > 0 ?'https://menuapi.menulive.in':window.location.origin;

 export  function getParameterByName(e,t=window.location.href){
    e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);
  return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null;
  };
///let configUrl="https://menuapi.xmedia-solutions.net/api/configs";
//let configUrl="https://api.menulive.in/api/configs";

// let configUrl=`https://menuapi.${domain.split(".")[1]}.com/api/configs`


const p = new Promise((response, rej) => {
  let config =localStorage.getItem("configs") ?JSON.parse(localStorage.getItem("configs")):null;
	if(!config){
   axios.get(`https://menuapi.${domain.split(".")[1]}.${domain.split(".")[2]}/api/configs`)
  .then(res=>{
        console.log(res.data[0]);
        
        let data = res&&res.data.length?res.data[0]:null;
        data.baseURL= window.location.href.indexOf('localhost') > 0? 'https://inventory-service-gthb.onrender.com': data.baseURL;
        localStorage.setItem("configs",JSON.stringify(data));
        sessionStorage.setItem("configs",JSON.stringify(data));
        config = data;
        response(config);
    });
}else{
	response(config);
}
});

//getConfigs().then((res)=> console.log(res));


export default await p;




