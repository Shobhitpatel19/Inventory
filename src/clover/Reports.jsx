import { CloudDone, Spa } from '@mui/icons-material'
import axios from 'axios';
import moment from 'moment';
import html2pdf from 'html2pdf.js';
import { useEffect, useState } from 'react';
import configs, {getParameterByName} from "../Constants"
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
const Reports = () => {
const[statusType,setStatusType]=useState("inProgressOrders")
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
 
  const [handleDate, setHandleDate] = useState([]);
  const [fliterData, setFilterData] = useState([]);
  const[isSearch,setIsSearch]=useState(false);
  const [report,setReport]=useState();

  console.log(fromDate)
  console.log(toDate)
  console.log(handleDate)
  console.log(fliterData)
  const [orderDetails, setOrderDetails] = useState();
  const[isOpen,setIsOpen]=useState(false);
let baseURL=configs.baseURL;
  let userData =sessionStorage.getItem("userData")?JSON.parse(sessionStorage.getItem("userData")):"";
  console.log(userData);
  let originURL = window.location.href.indexOf('localhost') > 0 ?'https://pos.menulive.in':window.location.origin;
  const userId=userData?userData.sub:" ";
console.log(baseURL+'/api/orders/report/'+userId);

let merchantData = sessionStorage.getItem("merchantData") ?JSON.parse( sessionStorage.getItem("merchantData")) :[];
  useEffect(() => {
    // axios.get(baseURL+"/api/orders?userid="+userId)
    //   // .then(response => setOrderDetails(response.data))

  }, [])
  console.log(orderDetails)

  let handleData = () => {
    if (fromDate && toDate) {
              axios.get(`${baseURL}/api/orders/report/${merchantData.length ? merchantData[0].merchantCode:" "}?start_date=${fromDate}&end_date=${toDate}`,)
              .then(response => {
                console.log(response.data)
                setReport(response.data)
                setFromDate();
                setToDate();
              });
               

        }  
  } 

  const orderStatus1 =(e)=>{
    let status=e.target.value
          if(status === "pending"){
            let orderItems =report.length&&report.filter(item=>item.inProgress);
            setFilterData(orderItems);
            setIsSearch(true)
          }else if(status==="deliver"){
            let orderItems =report.length&&report.filter(item=>item.isDelivered);
            setFilterData(orderItems);
            setIsSearch(true)
          }else if(status==="serving"){
            let orderItems =report.length&&report.filter(item=>item.isReady);
            setFilterData(orderItems);
            setIsSearch(true)
          }else if(status==="cancel"){
            let orderItems =report.length&&report.filter(item=>item.isCanceled);
            setFilterData(orderItems);
            setIsSearch(true)
          }else{
            setIsSearch(false)
           }
  }
 
  // downloading in the pdf format
    const downloadAsPDF = () => {
      const element = document.getElementById('your-html-element-id');
      const opt = {
        margin: 1,
        filename: 'Order-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
      };

      html2pdf().set(opt).from(element).save();
    };

    // console.log(report&&report.report[statusType]);
  const orderListHandler=(itemId)=>{
    let orderItems =report.filter(item=>item.id===itemId);
    setOrderDetails(orderItems[0]);
    setIsOpen(true);
  }
  
  let fullReports=isSearch?fliterData:report;
    return (
      <div className="container bg-light">
            <div className='header'>
              <h4 align="center">Reports</h4>
              </div>
        <div className='sub-container'>
          <span className='m-3'>
            <h6 style={{margin:"7px"}}>Order Date</h6  >
            <label htmlFor="" >From:</label>
            <input type="date" className='mx-3' onChange={(e) => setFromDate(e.target.value)} style={{ border: "none", outline: "none" }} />&nbsp;&nbsp;
            <label htmlFor="">To:</label>
            <input type="date" className='mx-3' onChange={(e) => setToDate(e.target.value)} style={{ border: "none", outline: "none" }} />
          </span>

          <span className='m-3 '>
            <label htmlFor="">Order Status</label><br />
            <select onChange={orderStatus1} style={{ border: "none", outline: "none", height: "25px", width: "120px", borderRadius: "5px" }}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="deliver">Delivered</option>
              <option value="serving">Serving</option>
              <option value="cancel">Cancelled</option>
            </select>
          </span>

          <span >
            <label htmlFor="">Restaurants</label><br />
            <input type="text" className='form-control' />
          </span>
          <Button variant="contained" color="success" onClick={handleData} style={{ marginTop: "26px" }}>Search</Button>
        </div>
        <div className='button-container'>
          <select name="" id="" className='bg-danger text-light border border-0 rounded-2' style={{ height: "35px", width: "75px" }}>
            <option>select</option>
            <option>5</option>
            <option>10</option>
          </select>
          <span>
          <Button variant="contained" color="info" style={{margin:"8px"}}>Excel</Button>
          <Button variant="contained" color="warning"  style={{margin:"8px"}} onClick={downloadAsPDF}>Pdf</Button>
          </span>
        </div>

        <div id="your-html-element-id">
          <table style={{width:'100%'}}>
           
             <thead style={{background:"#f1f1f1"}}>
              <th>#Token</th>
              <th></th>
              <th>
              Price(Inc Tax)
              </th>
              <th>Time</th>
              <th>Payment</th>
              {/* <th>Paid?</th>  */}
              {/* <th>Details</th> */}
              <th>More</th>
              
              
          </thead>
            <tbody>
              {
                
                fullReports&&fullReports.length?fullReports.map((items,key) => {
                  return (
                    <>
                      <tr key={key}>
                        <td># {items.number}</td>
                        <td>
                        {
                          items.orderType==="Eat in"?
                          <img hight="20px"alt='' width="20px"  src="./images/eat_in.png"/>
                          : <img hight="20px" width="20px" alt='' src="./images/take-out-2.png"/>
                          }
                        </td>
                        <td>{items.totalPrice}</td>
                        <td style={{fontSize:"12px"}}>{moment(`${items.createdAt}`).format("DD-MM-YYYY h:m a")}</td>
                        <td>{items.paymentType==="Pay here" ?"Online":"Cash"}</td>
                        {/* <td>{items.orderItems.length}</td> */}
                        {/* <td>{items.taxPrice}</td>
                        <td>{items.orderItems.length}</td> */}
                        <td>
                    <button className='btn' id='show_btn' 
                    onClick={()=>orderListHandler(items.id)}
                     ><ReceiptLongOutlinedIcon/></button>

                        </td>
                        <td></td>
                        
                      </tr>
                    </>
                  )
                })
              :""}
            </tbody>
          </table>
        </div>

                <Dialog className='dialog-box'
            maxWidth="md"
            fullWidth={true}
              open={isOpen}
              >
              <div  style={{padding:'20px' }} className='order-tab'>
                    <h5 align='center'>Order summary token : #<span style={{fontSize:"35px",}}>{orderDetails&&orderDetails.number}</span></h5>

                <table style={{width:'100%',textAlign:'center'}} border='1'  >
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                  orderDetails&& orderDetails.orderItems.map((orderItems)=>
                  
                  (
                      <tr >
                        <td>{orderItems.name}</td>
                        <td>{ orderItems.quantity }</td>
                        <td>{ orderItems.price}</td>
                      </tr>
                    ))
                  }
                  </tbody>

                </table>
                <Button variant="contained" color="error" style={{float:"right",margin:"9px"}}  onClick={()=>setIsOpen(false)}>Close</Button>
              </div>
            </Dialog>
      </div>
    )
  }

  export default Reports

 // http://localhost:3000/orderList?serve_url=https://apps.digitallive24.com&userid=625ed8a6f5b364ec758c1f0b
  {/* <thead>
              <tr>
                <th>Resturants</th>
                <th>Date</th>
                <th>Invoice No</th>
                <th>Total no of bills</th>
                <th>My Amount</th>
                <th>Total Discount</th>
                <th>Net Sales()</th>
                <th>Total tax</th>
                <th>Total Sales</th>
                <th>Cash</th>
                <th>Card</th>
              </tr>
            </thead> */}