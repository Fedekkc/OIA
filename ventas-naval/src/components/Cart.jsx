
import React, { useState } from 'react';
import styled from 'styled-components';

const CartContainer = styled.div`
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 8px;
    width: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CartItem = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ItemName = styled.span`
    font-weight: bold;
`;

const ItemPrice = styled.span`
    color: #888;
`;

const Total = styled.div`
    margin-top: 20px;
    font-size: 18px;
    font-weight: bold;
    text-align: right;
`;

const Cart = () => {
    const [items, setItems] = useState([
        { id: 1, name: 'Item 1', price: 29.99 },
        { id: 2, name: 'Item 2', price: 49.99 },
        { id: 3, name: 'Item 3', price: 19.99 },
    ]);

    const total = items.reduce((acc, item) => acc + item.price, 0);

    return (
        <CartContainer>
            {items.map(item => (
                <CartItem key={item.id}>
                    <ItemName>{item.name}</ItemName>
                    <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                </CartItem>
            ))}
            <Total>Total: ${total.toFixed(2)}</Total>
        </CartContainer>
    );
};

export default Cart;