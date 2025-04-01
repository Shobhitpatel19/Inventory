 export  function getParameterByName(e,t=window.location.href){
    e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);
  return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null;
  };

// export  const baseURL = 'https://api.menulive.in';
// export const authapi="https://authapi.digitallive24.com";
// export const  authUrl="https://auth.digitallive24.com";
// export  const cmsUrl = 'https://cms.digitallive24.com';


export  const baseURL = 'https://menuapi.merchantnations.com';

export const authapi ="https://authapi.merchantnations.com";

export const  authUrl="https://auth.merchantnations.com";


