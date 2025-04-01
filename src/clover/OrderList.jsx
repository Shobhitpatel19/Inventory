import React, { useState,useEffect } from 'react';
import axios from "axios";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import moment from 'moment';
import RefreshIcon from '@mui/icons-material/Refresh';
import configs, {getParameterByName} from "../Constants"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const OrderList = (props) => {
  const[totalOrders,setTotalOrders]=useState([]);
  const[orderList,setOrderList]=useState([]);
  const[isOpen,setIsOpen]=useState(false);
  const[orderItemsList,setOrderItemsList]=useState([]);
  const[token,setToken]=useState(0);
  const[edit,setEdit]=useState(false);
  const[editQuantity,setEditQuntity]=useState(0);
  const [orderListId,setOrderListId]=useState();
  const[itemName,setItemName]=useState("");
  const[itemId,setItemId]=useState();
  const [alertOpen,setAlertOpen]=useState(false);
  const [notifiData,setNotifiData]=useState([]);
  const[openNotifi,setOpenNotifi]=useState(false);
  const[tabView,setTabView]=useState(false)
  const [tableData, setTableData] = useState(null);
  const[isSearch,setIsSearch]=useState(false);
  let timeOt= null;
  const[orderFilter,setOrderFilter] =useState([]);
  

  const [products, setProducts] = useState([]); 
let baseURL = configs.baseURL;

  let userData =sessionStorage.getItem("userData")?JSON.parse(sessionStorage.getItem("userData")):"";
  console.log(userData);
  let originURL = window.location.href.indexOf('localhost') > 0 ?'https://pos.menulive.in':window.location.origin;
  let merchantData = sessionStorage.getItem("merchantData") ?JSON.parse( sessionStorage.getItem("merchantData")) :[];
const userId=userData?userData.sub:" ";
const getOrderList = `${baseURL}/api/orders?merchantCode=${merchantData.length ? merchantData[0].merchantCode:" "}`;
const  notificationURL =`${baseURL}/menu/notification/${userId}`;
const deleteNOtificationUrl=`${baseURL}/menu/notifications/${userId}`;
const getTabByUser = baseURL+'/api/tables?userId='+userId;
const getProductByUser = baseURL+`/api/products?merchantCode=${merchantData.length ? merchantData[0].merchantCode:" "}`;
let cur=userData?userData.currency:"";
let SelectCurrency = cur&&cur.toUpperCase()=== "INR"?"₹":"$";


console.log(getOrderList);



useEffect(()=>{
  if(!products.length){
  axios.get(getProductByUser).then((response)=>{
    if(response.data.length !== products.length){
    setProducts(response.data)
    console.log(response.data);
    }
  })
}
 },[])


 const orderListHandler =(orderId)=>{
  console.log(orderId);
       setIsOpen(true);
       const orderItem=orderList.length?orderList.filter((order)=> (order.id=== orderId && setOrderListId(orderId)   & setToken(order.number))):[];
       axios.get(`${baseURL}/api/orders/${orderId}?merchantCode=${merchantData.length ? merchantData[0].merchantCode:" "}`)
       .then(res=>{
        console.log(res.data);
              if(res.data.orderItems){
                setOrderItemsList(res.data.orderItems);
              }else{
                setOrderItemsList(res.data);
              }
      
       })
       console.log(orderItem);
       
 }

 const handleClose = ()=>{
  setOrderItemsList([]);
  setIsOpen(false);
 }

 const handleOrderStatus = (orderStatus,order_id,order_payment)=>{
    console.log(order_id,order_payment);
    // const orderStatus = event.target.value;
 
    if(orderStatus==="ready"||orderStatus==="deliver"){
          if(order_payment){
            console.log(order_payment);
            axios.put(`${baseURL}/api/orders/${order_id}?merchantCode=${merchantData.length ? merchantData[0].merchantCode:" "}`,{action:orderStatus}).then((response) => {
              console.log(response.data);
              let today = new Date()
        console.log(moment(today).format("DD/MMM/YYYY"));
      axios.get(getOrderList).then((response) => {
        setTotalOrders(response.data);
        let todayOrder=response.data.filter(or=>moment(or.createdAt).format("DD/MMM/YYYY")===moment(today).format("DD/MMM/YYYY"));
        console.log(todayOrder);
          setOrderList(todayOrder);
      });
            });
          }
          else{
            setAlertOpen(true);
          }
    }else{

        axios.put(`${baseURL}/api/orders/${order_id}?merchantCode=${merchantData.length ? merchantData[0].merchantCode:" "}`,{action:orderStatus}).then((response) => {
          console.log(response.data);
          let today = new Date()
          console.log(moment(today).format("DD/MMM/YYYY"));
        axios.get(getOrderList).then((response) => {
          setTotalOrders(response.data);
          let todayOrder=response.data.filter(or=>moment(or.createdAt).format("DD/MMM/YYYY")===moment(today).format("DD/MMM/YYYY"));
          console.log(todayOrder);
            setOrderList(todayOrder);
        });
        });
       console.log(orderStatus);
    }
    
    
    
  }
  const handlePayment=(order_id,event)=>{
    console.log(event.target.checked);
    const paymentStatus=event.target.checked;
    if(order_id){
    axios.put(`${baseURL}/api/orders/${order_id}?merchantCode=${merchantData.length ? merchantData[0].merchantCode:" "}`,
    {paymentState:"PAID",
    isPaid: true,}
    )
    .then((response) => {
      console.log(response.data);
      let today = new Date()
        console.log(moment(today).format("DD/MMM/YYYY"));
      axios.get(getOrderList).then((response) => {
        setTotalOrders(response.data);
        let todayOrder=response.data.filter(or=>moment(or.createdAt).format("DD/MMM/YYYY")===moment(today).format("DD/MMM/YYYY"));
        console.log(todayOrder);
          setOrderList(todayOrder);
      });
    });;

    }
  }


  const handleEdit = (itemId)=>{
        console.log(itemId);
      const itmName = orderItemsList.length &&orderItemsList.map(o=>o._id===itemId && setItemName(o.name)&setEditQuntity(o.quantity)&setItemId(o._id));
      console.log(itmName);
      setEdit(true);
    
  }

   const handleInput=(event)=>{
        console.log(event.target.value);
        setEditQuntity(event.target.value);
   }


const habdleSubmit=(event)=>{
              event.preventDefault();
              console.log(editQuantity);

            const updateItems=orderItemsList.map(ordListItem=>{  
                                          if(ordListItem._id===itemId){
                                            ordListItem.quantity = editQuantity; 
                                            //ordListItem.price= ordListItem
                                          }
                                          return ordListItem;
                              });
           console.log(updateItems);
    
           axios.put(baseURL+'/api/orders/'+orderListId,{orderItems:updateItems }).then((res)=>{
                    console.log(res.data);
                    let today = new Date()
                    console.log(moment(today).format("DD/MMM/YYYY"));
                  axios.get(getOrderList).then((response) => {
                    setTotalOrders(response.data);
                    let todayOrder=response.data.filter(or=>moment(or.createdAt).format("DD/MMM/YYYY")===moment(today).format("DD/MMM/YYYY"));
                    console.log(todayOrder);
                      setOrderList(todayOrder);
                  });
           });
            const updatePrice = orderItemsList.filter(oli=> oli._id===itemId)
            const ordPrice =orderList.filter(ol=>ol._id===orderListId)
         console.log(updatePrice[0].price,editQuantity,ordPrice[0].totalPrice );
         setEdit(false);

 }


       
      const handleDelete=(name,price,quantity,itemId)=>{
        console.log(itemId);
           }

    const fetchOrdersAndNoti = () =>{
      if(!orderList.length){
        let today = new Date()
        console.log(moment(today).format("DD/MMM/YYYY"));
      axios.get(getOrderList).then((response) => {
        setTotalOrders(response.data);
        let todayOrder=response.data.filter(or=>moment(or.createdAt).format("DD/MMM/YYYY")===moment(today).format("DD/MMM/YYYY"));
        console.log(todayOrder);
          setOrderList(todayOrder);
      });
    
            // axios.get(notificationURL).then((response)=>{
            //     setNotifiData(response.data);
            // });
          }
          console.log(props.refesh);

          axios.get(getTabByUser).then((response) => {
            console.log(response.data);
            setTableData(response.data);
          });
    }

    useEffect(() => {
      fetchOrdersAndNoti();
    },[props.refesh]);
   
      useEffect(() => {
          // const interval = setInterval(() => fetchOrdersAndNoti(), 10*1000);

          // return () => clearInterval(interval);
        }, []);
  

    const handleRefresh=()=>{
      console.log("API CALLED");
      fetchOrdersAndNoti();
    }
    

    

   const handleNotification =()=>{
        axios.get(notificationURL).then((response)=>{
          console.log(response.data);
            setNotifiData(response.data);
        });
           setOpenNotifi(true);
   }

const handleClear =()=>{
  console.log("Clear All Data");
  axios.delete(deleteNOtificationUrl).then((response)=>{
    console.log(response.data);
      // setNotifiData(response.data);
      setOpenNotifi(false);
      props.setNotification(false)
  });
}

  const handleTableOrders =()=>{
           setTabView(tabView?false:true);
  }


  const handleTypeOrder=(e)=>{
        let val = e.target.value;
        console.log(val);
        let fltOrder = orderList.filter(ord=>ord.orderSource === val);
        console.log(fltOrder);
        setOrderFilter(fltOrder)
        setIsSearch(val?true:false);
  }

 const handleNumberSearch=(e)=>{
      let val = e.target.value;
      console.log(val);
      let fltOrder = orderList.filter(ord=>ord.number === parseInt(val));
      console.log(fltOrder);
      setOrderFilter(fltOrder)
  setIsSearch(val?true:false);
  }

  const handleDate =(e)=>{
    let val = e.target.value;
    console.log(val);
    let fltOrder = orderList.filter(ord=>moment(ord.createdAt).format("DD/MMM/YYYY")===moment(val).format("DD/MMM/YYYY"));
    console.log(fltOrder);
    setOrderFilter(fltOrder)
setIsSearch(val?true:false);
  }

  const ListOrders =isSearch?orderFilter:orderList;
  return (
    <div  className="container">
    { false&& <div className='refresh'>
      <IconButton variant="contained" color="success"  className="refresh_btn" onClick={handleRefresh}><RefreshIcon /></IconButton> 
     </div>}
     <div className='header'>
          <h4 >Orders</h4>
         
                <div style={{display:"flex",justifyContent:"space-between",alignItems:'center',width:"600px"}}>
                    <div className="search">
                                    <SearchIcon/>
                                    <input type="text"  className="search_input" onChange={handleNumberSearch} placeholder="Search"/>
                        </div>
                 
                        <div>
                          <label>Group By: </label>
                            <select onChange={handleTypeOrder} style={{outline:"none", borderRadius:"5px",background:"transparent"}}>
                                <option value=''>ALL</option>
                                <option value="Self Order">Self Orders</option>
                                <option value="EPOS">EPOS Orders</option>
                                <option value="Online Order">Online Orders</option>
                                <option value="Table Order">Table Orders</option>
                              </select>
                        </div>
                        <div>
                          <label htmlFor="">Date: </label>
                          <input type='date' onChange={handleDate}   style={{outline:"none", borderRadius:"5px",background:"transparent"}}/>
                        </div>
                </div>


           <div>
        <span>Table orders  &nbsp;&nbsp;<FormControlLabel control={<Switch   color='info' />} onChange={handleTableOrders}/> </span>
        <IconButton variant="contained" color="success"  className="refresh_btn" onClick={handleRefresh}><RefreshIcon /></IconButton> 
      </div>
      </div> 

      <Dialog 
        open={alertOpen}
        maxWidth="xs"
        fullWidth={true} 
      >
        <div className='alert-dialog' >
         <h3 className=''>{"Payment Pending"}</h3>
        <button onClick={()=>setAlertOpen(false)} className="btn btn-sm btn-primary" 
          style={{width:"60px",padding:"10px 5px",margin:"auto",height:"40px"}}
         >OK</button>
        </div>
      </Dialog>

      <Dialog 
        open={openNotifi||props.notification}
        maxWidth="md"
        fullWidth={true} 
      >
        <div className='alert-dialog' >
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span></span>
         <h3 className=''>{"Notification"}</h3>
        
          <button style={{border:"none",color:"red"}}  onClick={handleClear}>Clear All </button>
          </div>
          <div style={{overflowY:'scroll',height:"400px"}}>{
            notifiData.length ? notifiData.map(noti=>{
              return (
                <div>
                <p>{noti.msg} on  {moment(`${noti.createdAt}`).format("DD MMM h:mm a")} </p>
                </div>
              )
            })
           :"" }
          </div>

          <Button variant="contained" color="error" style={{float:"right",right:"10px"}}
         onClick={()=>{
          setOpenNotifi(false)
          props.setNotification(false)
        }}>Close </Button>
        
        </div>
      </Dialog>


      <div className="category-list" style={{padding:'20px'}}>
       {!tabView? <table style={{width:'100%'}}  >
          <thead >
              <th>#Token</th>
              <th>Source</th>
              <th></th>
              <th>
              Price(Inc Tax)
              </th>
              <th>Time</th>
              <th>Payment</th>
              <th>Paid?</th> 
              {/* <th>Details</th> */}
              <th  colSpan={3}  align='center'>Action</th>
              
              
          </thead>
          <tbody>
            {
              ListOrders.length ? ListOrders.map((orderLists)=>{
                let paidStaus=notifiData.filter(nof=>orderLists.number=== nof.token);
                let payStatus =paidStaus.length?true:false;
                // console.log(payStatus);
                return(
                <tr style={{borderBottom:'1px solid #f0eeee',margin:'5px'}}>
                  <td style={{fontSize:"25px"}}>{orderLists.number}</td>
                  <td>{orderLists.orderSource}</td>
                  <td  >{
                  orderLists.orderType==="Eat in"?
                  <img hight="20px"alt='' width="20px"  src="./images/eat_in.png"/>
                  : <img hight="20px" width="20px" alt='' src="./images/take-out-2.png"/>
                  }</td>
                  
                  <td>{SelectCurrency} {(orderLists.totalPrice+orderLists.taxPrice)%100}</td>
                  <td style={{fontSize:"12px"}} >
                        {
                          moment(orderLists.createdAt).format("h:mm a  DD MMM")
                      }
                  </td>
                 
                  <td align='center'>{orderLists.paymentType==="Pay here" ?<div className='payment-type '>SCANNED</div>:orderLists.isPaid ? <div  className='payment-type1'>{orderLists.paymentType.toUpperCase()}</div>:payStatus?<div className='paystatus_blink'>VERIFY</div>:<div  className='payment-type2 bg-warning'>WAITING</div>}</td>

                  <td align='center'>
                    {orderLists.isPaid ? 
                    <Checkbox defaultChecked disabled color='success'/>
                     :
                     <Checkbox onChange={(e)=>handlePayment(orderLists.id,e)}/>
                    }
                  </td>
                  <td style={{display:"flex",justifyContent:"space-evenly",padding:"4px"}}>
                    <button className='btn' id='show_btn' onClick={()=>orderListHandler(orderLists.id)} ><ReceiptLongOutlinedIcon/></button>
                    <div>
                     {orderLists.isReady?<Button variant="contained" color="info" onClick={()=>handleOrderStatus("deliver",orderLists.id,orderLists.isPaid)} >Deliver</Button>
                     : <Button variant="contained" color="success"  onClick={()=>handleOrderStatus("ready",orderLists.id,orderLists.isPaid)}>Ready</Button>}

                      <Button variant="text" style={{marginLeft:"15px"}} color="error"  onClick={()=>handleOrderStatus("cancel",orderLists.id,orderLists.isPaid)}><DeleteIcon/></Button>
                    </div>

                  </td>

                </tr>
              )}
              )
           :"" }
          </tbody>
        </table>:
            <div>
              <h3 align="center">Table Details</h3>
                    <div className='mainTab'>
                       
                      {
                        tableData&&tableData.map(tab=>{
                          return(
                            <div className='tab_1 col-lg-2 clo-md-2 col-sm-3' style={{backgroundColor:tab.isAvailable?"#12cf12":"orange",}}>
                            <h2>#{tab.number}</h2>
                            <h6>Capacity:{tab.capacity}</h6>
                            {tab.isAvailable === false?<h6>Serving By:DL 24</h6>:""}
                          </div>
                          )
                        })
                      }
                    </div>

            </div>
        }
    </div>
    <Dialog className='dialog-box'
    maxWidth="md"
    fullWidth={true}
      open={isOpen}
      >
      <div  style={{padding:'20px' }} className='order-tab'>
            <h5 align='center'>Order summary token : #<span style={{fontSize:"35px",}}>{token}</span></h5>

        <table style={{width:'100%',textAlign:'center'}} border='1'  >
          <thead>
            <tr>
              <th>Name</th>
               <th>Quantity</th>
               {/* <th>Action</th> */}
             
            </tr>
          </thead>
          <tbody>
           {
           orderItemsList.length?orderItemsList.map((orderItems)=>{
            console.log(orderItems.id);
            let item =orderItems.item&&products.filter(p=>p._id===orderItems.item&&orderItems.item.id);
            console.log(item);
          return (
              <tr >
                <td>{item&&item.length?item[0].name:orderItems.name}</td>
                <td>{orderItems.unitQty?orderItems.unitQty:orderItems.quantity}</td>
                {/* <td>
                <IconButton variant="contained" color="info" onClick={()=>handleEdit(orderItems._id)} ><EditIcon/></IconButton>
                </td>
                <td>
                <IconButton variant="contained" color="error"  onClick={()=>handleDelete(orderItems.name,orderItems.price,orderItems.quantity,orderItems.id)}><DeleteIcon/></IconButton>
                </td>  */}
              </tr>
            )})
           :""}
          </tbody>

        </table>
        <Button variant="contained" color="error" style={{float:"right",top:"8px"}} className='btn btn-danger m-2 btn-small' onClick={handleClose}>Close</Button>
      </div>
    </Dialog>

    <Dialog 
        open={edit}
        maxWidth="xs"
        className='pd-2'
        fullWidth={true} 
        >
           <DialogTitle className="text-center  fw-bold" >{itemName}</DialogTitle>
                <form onSubmit={(e)=>habdleSubmit(e)} className='p-2'>
                  
                 <label className='fw-bold mx-2'>Item quantity</label>
                  <input type='number'onChange={handleInput}value={editQuantity} height="20px" width="20px" className='form-control w-50 mx-2 '/>
                 
                  <button type="submit" className='btn btn-success m-2 save-btn'>Save</button>
                 
                <button onClick={()=>setEdit(false)}  className='btn btn-danger btn-xs m-2 '>Close</button>
                </form> 
  </Dialog>


    </div>
  )
}

export default OrderList ;