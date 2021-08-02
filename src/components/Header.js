import React from 'react';
import { Header as GrommetHeader, Nav, Anchor, grommet } from 'grommet'
import { Link } from "react-router-dom";

const Header = () => {
  return(
    <GrommetHeader background="light-4" pad="small"
      theme={grommet.heading}
    >
      <Nav direction="row">
        <Link to="/">
          <Anchor label="Storage Product"/>
        </Link>
        <Link to="/products-list">
          <Anchor label="Products"/>
        </Link>
        <Link to="/orders-list">
          <Anchor label="Orders"/>
        </Link>
        <Link to="/users-orders-list">
          <Anchor label="User Orders"/>
        </Link>
      </Nav>
    </GrommetHeader>
  );
}

export { Header };
