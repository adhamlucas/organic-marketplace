import { useState, useEffect } from 'react';
import Web3 from 'web3';
import {
  Grommet,
  Grid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Box,
  Button,
  Text
} from 'grommet'
import { contractABI, contractAdress } from '../config/config';
import { grommet } from 'grommet/themes';
import { Header } from '../components/Header';


function UserOrdersList() {
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState(null);
  const [contrato, setContrato] = useState('');
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');
      setContrato(web3);

      try {
        const newAccounts = await web3.eth.requestAccounts();
        setAccounts(newAccounts);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
      const contract = new web3.eth.Contract(contractABI, contractAdress);
      setContrato(contract);

      const orders = await contract.methods.getOrders().call();
      setOrders(orders);
      const products = await contract.methods.getProducts().call();
      setProducts(products);
    };

    loadBlockchainData();
  }, []);

  const delivery = async (orderId) => {
    console.log(accounts[0]);
    console.log(orderId);
    try {
      await contrato.methods.delivery(orderId).send({
        from: accounts[0],
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Grommet full>
      <Header />
      <Box
        full
        pad={{"horizontal": "xlarge", top: "medium", bottom: "large"}}
      >
        <Grid
          columns="small"
          gap="small"
        >
          {products && orders.map((order) => {
            const product = products[order.productId];
            if (order.buyer === accounts[0]){
              return (
                <Card 
                  key={product.id}
                  background={{"color": order.delivered ? "status-ok" : "status-warning"}}
                  width="small"
                >
                  <CardHeader pad={{"horizontal": "small", "top": "small"}}>
                    <Text weight="bold">
                      #{product.id}
                    </Text>
                  </CardHeader>
                  <CardBody align="start" pad="small">
                    <Text size="small">Name: {product.name}</Text>
                    <Text size="small">Type: {product.productType}</Text>
                    <Text size="small">Location: {product.plantingLocation}</Text>
                    <Text size="small">Method: {product.plantingMethod}</Text>
                    <Text size="small">Planting Date: {product.plantingDate}</Text>
                    <Text size="small">Harvest Date: {product.harvestDate}</Text>
                    <Text color="neutral-4" weight="bold" >
                      whei {product.price} 
                    </Text>
                  </CardBody>
                  <CardFooter pad="xsmall" background="light-2">
                  </CardFooter>
                </Card>
              )
            } else {
              return null;
            }
          })}
        </Grid>  
      </Box>

    </Grommet>
  );
}

export default UserOrdersList;
