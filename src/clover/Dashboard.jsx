import React,{useEffect,useState} from "react";
import configs, {getParameterByName} from "../Constants"
import axios from "axios";

const DashBoard =()=>{
    const[orderList,setOrderList]=useState([]);
    const [products, setProducts] = useState([]); 
    const [categories, setCategories] = useState([]);

    let baseURL=configs.baseURL;

    let userData =sessionStorage.getItem("userData")?JSON.parse(sessionStorage.getItem("userData")):"";
    console.log(userData);
    let originURL = window.location.href.indexOf('localhost') > 0 ?'https://pos.menulive.in':window.location.origin;
    let merchantData = sessionStorage.getItem("merchantData") ?JSON.parse( sessionStorage.getItem("merchantData")) :[];
    console.log(merchantData)
  const userId=userData?userData.sub:" ";
  const getOrderList = `${baseURL}/api/clover/orders?merchantCode=${merchantData ? merchantData.merchantCode:" "}`;
  const getProductByUser = baseURL+`/api/clover/products?merchantCode=${merchantData ? merchantData.merchantCode:" "}`;
  const getCatByUser = `${baseURL}/api/clover/categories?merchantCode=${merchantData ? merchantData.merchantCode:" "}`;
  let cur=userData?userData.currency:"";
  let SelectCurrency = cur&&cur.toUpperCase()=== "INR"?"₹":"$";


  useEffect(()=>{
    axios.get(getOrderList).then((response) => {
        setOrderList(response.data);
    });

    axios.get(getProductByUser).then((response)=>{
        if(response.data.length !== products.length){
        setProducts(response.data)
        console.log(response.data);
        }
    });


    axios.get(getCatByUser).then((response) => {
        console.log(response.data);
          setCategories(response.data);
      });
  },[])

  const imageOnErrorHandler = (event) => {
    event.currentTarget.src = "./images/blank.jpg";
  };


    return(
        
        <div className="main_dash">
        <h4 style={{marginBottom:"0px",fontSize:"25px",fontWeight:"bolder",letterSpacing:'2px'}} >Welcome!</h4>
                <div className="list_container">
                    <div className="list">
                        <div className="cat_logo"></div>
                        <div style={{textAlign:"start"}}>
                        <h5  style={{fontSize: "15px",color: "grey",lineHeight: "0px"}}>Total Categories</h5>
                        <p style={{fontSize: "44px"}}>{categories.length}</p>
                        </div>
                    </div>
                    <div className="list">
                    <div className="item_logo"></div>
                       <div style={{textAlign:"start"}}>
                       <h5 style={{fontSize: "15px",color: "grey",lineHeight: "0px"}}>Total Products</h5>
                        <p style={{fontSize: "44px",lineHeight: "0px"}}>{products.length}</p>
                       </div>
                    </div>
                    <div  className="list">
                    <div className="order_logo"></div>
                       <div style={{textAlign:"start"}}>
                       <h5 style={{fontSize: "15px",color: "grey",lineHeight: "0px"}}>Total Orders</h5>
                        <p style={{fontSize: "44px",lineHeight: "0px"}}>{orderList.length}</p>
                       </div>
                    </div>
                </div>

                <div className="item_list">
                    <h3 >MOST POPULAR ITEMS</h3>

                        <div style={{width:"100%",display:"flex",justifyContent:"space-evenly",alignItems:"center",padding:"0px 30px",overflowX:"auto",flexWrap:"nowrap",height:"220px"}}>
                            {
                               products.length?
                               products.slice(0,5).map(pro=>{
                                return(
                                    <div className="item-img-name">
                                        <img src={baseURL+'/'+pro.image} onError={imageOnErrorHandler} style={{height:"120px",width:"100%"}} />
                                        <span className="title-ellipsis" style={{fontWeight:'bold',width:'180px'}}>{pro.name}</span>
                                    </div>
                                )
                               })

                               
                               :" " 
                            }
                        </div>
                </div>
        
        </div>

    )
};

export default DashBoard;