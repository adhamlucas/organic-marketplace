// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22;
pragma experimental ABIEncoderV2;
/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Storage {

    uint productId = 0;
    uint orderId = 0;
    uint public mostSent;

    constructor () payable {
        mostSent = msg.value;
    }
    
    struct User{
        uint[] orders;
    }
    
    struct Product {
        uint id;
        string name;
        string productType;
        uint price;
        address owner;
        address farmer;
        string plantingLocation;
        string plantingMethod;
        string plantingDate;
        string harvestDate;
    }
    
    struct Order {
        uint id;
        uint productId;
        address buyer;
        bool delivered;
    }
    
    Product[] products;
    Order[] orders;
    mapping(address => User) users;
    
    
    event OrderSent(string message);
    
    error OrderNotFound(uint id);
    error ProductNotFound(uint id);


    function storageProduct(   
        string memory name,
        string memory productType,
        uint price,
        string memory plantingLocation,
        string memory plantingMethod,
        string memory plantingDate,
        string memory harvestDate
    ) public {
        Product memory product = Product(
            productId,
            name,
            productType,
            price,
            msg.sender,
            msg.sender,
            plantingLocation,
            plantingMethod,
            plantingDate,
            harvestDate
        );
        products.push(product);
        productId++;
    }
    
    function getProducts() public view returns(Product[] memory){
        return products;
    }
    
    function getProduct(uint productId) public view returns(Product memory product) {
        for (uint index = 0; index < products.length; index++){
            if (products[index].id == productId) {
                return products[index];
            }
        }
    }

    function searchProduct(uint productId) public view returns(int index){
        for (uint index = 0; index < products.length; index++){
            if (products[index].id == productId) {
                return int(index);
            }
        }
        return -1;
    }
    
    function setProductOwner(address newOwner, uint index) private {
        products[index].owner = newOwner;
    }
    
    function storageOrder(uint productId, address buyer, bool delivered) public {
        Order memory order = Order(
            orderId,
            productId,
            buyer,
            delivered
        );
        orders.push(order);
        orderId++;
    }
    
    function getOrders() public view returns(Order[] memory){
        return orders;
    }
    
    function getOrder(uint orderId) public view returns(Order memory order) {
        for (uint index = 0; index < orders.length; index++){
            if (orders[index].id == orderId) {
                return orders[index];
            }
        }
    }
    
    function searchOrder(uint orderId) public view returns(int index){
        for (uint index = 0; index < orders.length; index++){
            if (orders[index].id == orderId) {
                return int(index);
            }
        }
        return -1;
    }
    
    function setOrderDelivered(bool delivered, uint index) private {
        orders[index].delivered = delivered;
    }
    
    function sendOrder(uint productId) public payable {
        Product memory product = getProduct(productId);
        require(product.price == msg.value);
        mostSent += msg.value;
        storageOrder(productId, msg.sender, false);
        emit OrderSent("Order was sent successfuly");
    }
    
    function delivery(uint orderId) public {
        int orderIndex = searchOrder(orderId);
        if (orderIndex == -1) {
            revert OrderNotFound(orderId);
        }
        Order memory order = orders[uint(orderIndex)];
        
        int productIndex = searchProduct(order.productId);
        if (productIndex == -1) {
            revert ProductNotFound(order.productId);
        }
        Product memory product = products[uint(productIndex)];
        require(msg.sender == product.owner);
        
        setOrderDelivered(true, uint(orderIndex));
        setProductOwner(order.buyer, uint(productIndex));
        mostSent = mostSent - product.price;
        payable(product.owner).transfer(product.price);
    }
    

    function getContractBalance() public view returns (uint256) {
       return address(this).balance;
    }
}