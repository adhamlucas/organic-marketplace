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
  Text,
  Heading,
  grommet
} from 'grommet'
import { Location } from 'grommet-icons';
import { Header } from '../components/Header';
import { contractABI, contractAdress } from '../config/config';

function ProductsList() {
  const [productList, setProductList] = useState(null);
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
        console.log(error);
      }
      const contract = new web3.eth.Contract(contractABI, contractAdress);
      setContrato(contract);

      const products = await contract.methods.getProducts().call();
      console.log(products);
      setProductList(products);
    };

    loadBlockchainData();
  }, []);

  const sendOrder = async (productId, productPrice) => {
    console.log(productId);
    console.log(accounts[0]);
    try {
      await contrato.methods.sendOrder(productId).send({
        from: accounts[0],
        value: productPrice
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Grommet theme={grommet} full>
      <Header/>
      <Box
        full
        justify="center"
        pad={{"horizontal": "xlarge", top: "medium", bottom: "large"}}
      >
        <Grid
          fill
          columns="small"
          gap="small"
        >
          {productList && productList.map((product) => { 
            if (product.owner === product.farmer) {
              return (
                <Card 
                  key={product.id}
                  background="light-1"
                >
                  <CardHeader pad={{"horizontal": "small", "top": "small"}}>
                    <Text weight="bold">
                      {product.name}
                    </Text>
                  </CardHeader>
                  <CardBody align="start" pad="small">
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
                      label="Buy"
                      onClick={() => sendOrder(product.id, product.price)}
                    />
                  </CardFooter>
                </Card>
              )
            } else return null;
            })
          }
        </Grid>  
      </Box>

    </Grommet>
  );
}

export default ProductsList;
