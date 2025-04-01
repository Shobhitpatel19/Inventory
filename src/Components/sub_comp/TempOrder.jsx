import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td } from "react-responsive-list";
import configs from "../../Constants";

const TempOrder = () => {
  const [tempOrders, setTempOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   let baseURL = configs.baseURL;
   let userToken = sessionStorage.getItem("token") || "";
   let merchantData = sessionStorage.getItem("merchantData")
    ? JSON.parse(sessionStorage.getItem("merchantData"))
    : null;
  const merchCode = merchantData ? merchantData.merchantCode : "xyz";

  useEffect(() => {
    const fetchTempOrders = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/temporders`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        console.log(res.data);
        setTempOrders(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    console.log("temporary order" ,tempOrders);

    fetchTempOrders();
  }, [baseURL, userToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Table border="1">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Product Name</Th>
            <Th>Quantity</Th>
            <Th>Price</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tempOrders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.productName}</Td>
              <Td>{order.quantity}</Td>
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
