import { useState, useEffect } from 'react';
import { Grommet, Form, FormField, TextInput, Box, Button } from 'grommet'
import { grommet } from 'grommet/themes';
import { Header } from '../components/Header';
import Web3 from 'web3';
import { contractABI, contractAdress } from '../config/config';

const defaultProductForm = {
  name: '',
  productType: '',
  price: '',
  plantingLocation: '',
  plantingMethod: '',
  plantingDate: '',
  harvestDate: ''
}

function StorageProduct() {
  const [product, setProduct] = useState(defaultProductForm);
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
        // eslint-disable-next-line no-console
        console.log(error);
      }
      const contract = new web3.eth.Contract(contractABI, contractAdress);
      setContrato(contract);
    };

    loadBlockchainData();
  }, []);
  return (
    <Grommet 
      full
      theme={grommet}
    >
      <Header/>
      <Box align="center">
        <Box>
          <Form
            value={product}
            onChange={(nextValue, { touched }) => {
              setProduct(nextValue);
            }}
            onReset={() => setProduct(defaultProductForm)}
            onSubmit={async (event) => {
              event.preventDefault();
              const product = event.value;
              try {
                await contrato.methods.storageProduct(
                  product.name,
                  product.productType,
                  product.price,
                  product.plantingLocation,
                  product.plantingMethod,
                  product.plantingDate,
                  product.harvestDate
                ).send({ from: accounts[0]});
                console.log('success');
              } catch(error) {
                console.log(error);
              }
            }}
          >
            <FormField name="name" label="Name">
              <TextInput name="name" />
            </FormField>
            <FormField name="productType" label="Product type">
              <TextInput name="productType" />
            </FormField>
            <FormField name="price" label="Price">
              <TextInput name="price" />
            </FormField>
            <FormField name="plantingLocation" label="Planting local">
              <TextInput name="plantingLocation" />
            </FormField>
            <FormField name="plantingMethod" label="Planting Method">
              <TextInput name="plantingMethod" />
            </FormField>
            <FormField name="plantingData" label="Planting Data">
              <TextInput name="plantingDate" />
            </FormField>
            <FormField name="harvestDate" label="Harvest Date">
              <TextInput name="harvestDate" />
            </FormField>
            <Box direction="row" gap="medium">
              <Button type="submit" primary label="Submit" />
              <Button type="reset" label="Reset" />
            </Box>
          </Form>
        </Box>
      </Box>
      
    </Grommet>
  );
}

export default StorageProduct;
