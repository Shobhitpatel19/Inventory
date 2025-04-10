import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import configs from "../../Constants";
import Currencies from "../Currencies";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { useIntl } from "react-intl";
import Dialog from "@mui/material/Dialog";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

const TempOrder = () => {
  const [tempOrders, setTempOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [selectedOrd, setSelectedOrd] = useState([]);
  const [orderItemsList, setOrderItemsList] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [customerorderpop, setCustomerOrderPop] = useState(false);
   const { formatMessage: t, locale, setLocale } = useIntl();

  let baseURL = configs.baseURL;
  let authApi = configs.authapi;
  let userToken = sessionStorage.getItem("token") || "";
  let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "xyz";
  const getOrderList = `${baseURL}/api/orders/recent?merchantCode=${merchCode}`;
  //currency
  let currency = Currencies.filter(
    (curen) => curen.abbreviation == merchantData.currency
  );
  console.log(currency);
  let SelectCurrency = currency && currency[0] ? currency[0].symbol : "";
  console.log(SelectCurrency);
  const selectedCurrency = (
    <span dangerouslySetInnerHTML={{ __html: SelectCurrency }} />
  );

  useEffect(() => {
    const fetchTempOrders = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/temporders`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setTempOrders(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchTempOrders();
  }, [baseURL, userToken]);

  console.log("Temp Orders:", tempOrders);



  const orderListHandler = (orderId, customerId, order) => {
    axios.get(getOrderList).then((response) => {
      console.log("order list", response.data);
      setOrderList(response.data);
  
      // Now continue with the rest of the logic
      console.log(orderId);
      console.log("order", order);
      setToken(order.number);
      setIsOpen(true);
      console.log("orderList", orderList);
  
      const SelectedorderItem = orderList.length
      ? orderList.filter((order) => order.id === orderId)
      : [];
    console.log(SelectedorderItem);
    setSelectedOrd(SelectedorderItem);
  
      axios
        .get(`${baseURL}/api/orders/${orderId}?merchantCode=${merchCode}`)
        .then((res) => {
          console.log(res.data);
          if (res.data.orderItems) {
            setOrderItemsList(res.data.orderItems);
          } else {
            setOrderItemsList(res.data);
          }
        });
  
      if (customerId) {
        console.log(customerId);
        axios
          .get(`${authApi}/customer/${customerId}`)
          .then((response) => {
            console.log(response.data);
            if (!response.data) {
              response.data = {};
            }
            setCustomerData(response.data);
            setCustomerOrderPop(true);
            console.log(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
  
      console.log(SelectedorderItem);
    });
  };

  const handleClose = () => {
    setOrderItemsList([]);
    setIsOpen(false);
    setCustomerData([]);
    setCustomerOrderPop(false);
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Table className="custom-table">
        <Thead>
          <Tr className="table-header">
            <Th>Source</Th>
            <Th>Amount(Inc tax)</Th>
            <Th>Order Items</Th>
            <Th>Actions</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tempOrders.map((order) => (
            <Tr key={order.id} className="table-body-row">
              <Td>{order.orderSource}</Td>
              <Td>
                {selectedCurrency}
                {(order.discountType
                  ? order.discountType === "discount" ||
                    order.discountType === "price"
                    ? order.totalPrice - (order.discountAmount || 0)
                    : order.totalPrice -
                      (order.totalPrice * order.discountAmount) / 100
                  : order.totalPrice
                ).toFixed(2)}
              </Td>
              <Td style={{ fontSize: "12px" }}>
                <button
                  className="btn-icon"
                  onClick={() =>
                    orderListHandler(
                      order.id,
                      order.customerId,
                      order
                    )
                  }
                >
                  <ReceiptLongOutlinedIcon />
                </button>
              </Td>
              <Td>{order.price}</Td>
              <Td>{order.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default TempOrder;
