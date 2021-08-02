import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import StorageProduct from './pages/StorageProduct';
import ProductsList from './pages/ProductsList';
import OrdersList from './pages/OrdersList';
import UserOrdersList from './pages/UserOrdersList';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={StorageProduct} />
        <Route path="/products-list"  component={ProductsList} />
        <Route path="/orders-list"  component={OrdersList} />
        <Route path="/users-orders-list"  component={UserOrdersList} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;