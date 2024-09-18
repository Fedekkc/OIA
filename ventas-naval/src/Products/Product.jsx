import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const CrudControls = styled.div`
  margin-bottom: 20px;
  button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #45a049;
    }
  }
`;

const CardContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const ProductCard = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  h3 {
    margin-top: 0;
  }
  p {
    margin: 5px 0;
  }
`;

const CrudActions = styled.div`
  margin-top: 10px;
  button {
    margin-right: 10px;
    padding: 5px 10px;
    background-color: #008cba;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: #007bb5;
    }
  }
`;

const ProductsContainer = styled.div`
  padding: 20px;
`;

const AddToCartButton = styled.button`
  padding: 5px 10px;
  background-color: #008cba;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #007bb5;
  }
`;

const Products = ({ userRole }) => {
  const [products, setProducts] = useState([]);
  const state = useLocation();
  const navigate = useNavigate();
  const token = state?.state?.token;

  useEffect(() => {
    if (!token) {
      alert("No estás logueado. Redirigiendo a la página de inicio de sesión.");
      navigate("/login");
      return;
    }
    
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/productos");
        setProducts(response.data.productos);
        console.log("productos de product: " + products);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        alert("Hubo un problema al intentar obtener los productos");
      }
    };
    
    fetchProducts();
  }, [token, navigate]);

  const handleDelete = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
    // Aquí deberías hacer una solicitud a la API para eliminar el producto en el backend
  };

  const handleEdit = (productId) => {
    console.log(`Editar producto con ID: ${productId}`);
  };

  const handleAdd = () => {
    console.log("Agregar nuevo producto");
  };

  const handleAddToCart = async (productId) => {
    console.log("toKEN" + token)
    try {
      const cartItem = {
        items: [
          {
            id_producto: productId,
            cantidad: 1, // Aquí puedes ajustar la cantidad según lo que el usuario elija
          },
        ],
      };

      const response = await axios.post(
        "http://localhost:5000/carrito",
        cartItem,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Producto agregado al carrito.");
      }
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      alert("Hubo un problema al intentar agregar el producto al carrito");
    }
  };

  return (
    
    <ProductsContainer>
      {userRole === "personal_ventas" && (
        <CrudControls>
          <button onClick={handleAdd}>Agregar Producto</button>
        </CrudControls>
      )}

      <CardContainer>
        {products.map((product) => (
          <ProductCard key={product.codigo_producto}>
            <h3>{product.codigo_producto}</h3>
            <p>{product.descripcion}</p>
            <p>Precio: ${product.precio_unitario}</p>
            <AddToCartButton onClick={() => handleAddToCart(product.codigo_producto)}>Agregar al carrito</AddToCartButton>

            {userRole === "personal_ventas" && (
              <CrudActions>
                <button onClick={() => handleEdit(product.id)}>Editar</button>
                <button onClick={() => handleDelete(product.id)}>Eliminar</button>
              </CrudActions>
            )}
          </ProductCard>
        ))}
      </CardContainer>
    </ProductsContainer>
  );
};

export default Products;
