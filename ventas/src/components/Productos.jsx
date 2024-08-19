import React from 'react';
import styled from 'styled-components';

const ProductsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const ProductCard = styled.div`
    width: 200px;
    height: 300px;
    background-color: #f2f2f2;
    border-radius: 8px;
    margin: 16px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
`;

const ProductTitle = styled.h3`
    margin-top: 8px;
    font-size: 16px;
    font-weight: bold;
`;

const ProductPrice = styled.p`
    margin-top: 4px;
    font-size: 14px;
    color: #888888;
`;

const Products = () => {
    const products = [
        {
            id: 1,
            title: 'Product 1',
            price: 9.99,
            image: 'https://example.com/product1.jpg',
        },
        {
            id: 2,
            title: 'Product 2',
            price: 19.99,
            image: 'https://example.com/product2.jpg',
        },
        // Add more products here
    ];

    return (
        <ProductsContainer>
            {products.map((product) => (
                <ProductCard key={product.id}>
                    <ProductImage src={product.image} alt={product.title} />
                    <ProductTitle>{product.title}</ProductTitle>
                    <ProductPrice>${product.price}</ProductPrice>
                </ProductCard>
            ))}
        </ProductsContainer>
    );
};

export default Products;