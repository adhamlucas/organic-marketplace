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
import { Header } from '../components/Header';
import { contractABI, contractAdress } from '../config/config';

function OrdersList() {
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
      console.log(orders);
      setOrders(orders);
      const products = await contract.methods.getProducts().call();
      console.log(products);
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
      <Header/>
      <Box
        full
        pad={{"horizontal": "xlarge", top: "medium", bottom: "large"}}
      >
        <Grid
          fill
          columns="small"
          gap="small"
        >
          {orders && products && orders.map((order) => {
            const product = products[order.productId]
            if (!order.delivered && accounts[0] === product.farmer){
              return (
                <Card 
                  key={product.id}
                  background="light-1"
                  width="small"
                >
                  <CardHeader pad={{"horizontal": "small", "top": "small"}}>
                    <Text weight="bold">
                      # {product.id}
                    </Text>
                  </CardHeader>
                  <CardBody align="start" pad="small">
                    <Text size="small">Name: {product.name}</Text>
                    <Text size="small">Type: {product.productType}</Text>
                    <Text size="small">Location: {product.plantingLocation}</Text>
                    <Text size="small">Method: {product.plantingMethod}</Text>
                    <Text size="small">Planting Date: {product.plantingDate}</Text>
                    <Text size="small">Harvest Date: {product.harvestDate}</Text>
                    <Text color="neutral-4" weight="450" >
                      whei {product.price} 
                    </Text>
                  </CardBody>
                  <CardFooter pad="xsmall" background="light-2">
                    <Button
                      primary
                      hoverIndicator
                      label="Delivery"
                      onClick={() => delivery(order.id)}
                    />
                  </CardFooter>
                </Card>
              )
            }
          })}
        </Grid>  
      </Box>

    </Grommet>
  );
}

export default OrdersList;
