import { useState, useEffect } from "react";
import { AppRouter } from "./router/AppRouter";
import axios from "axios";
import Products from "./Products/Product";
import Sidebar from "./Sidebar/Sidebar";
import Recommended from "./Recommended/Recommended";
import Card from "./components/Card";
import styled from "styled-components";
import "./index.css";

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const Loading = styled.div`
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
`;

const Error = styled.div`
  color: red;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
`;

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        setError("Hubo un problema al cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredData = (products, selected, query) => {
    let filteredProducts = products;

    // Filtrado por búsqueda
    if (query) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filtrado por categoría, color, empresa, etc.
    if (selected) {
      filteredProducts = filteredProducts.filter(
        ({ category, color, company, newPrice, title }) =>
          category === selected ||
          color === selected ||
          company === selected ||
          newPrice === selected ||
          title === selected
      );
    }

    // Retornar los productos filtrados en un componente visual
    return filteredProducts.map(
      ({ id, img, title, star, reviews, prevPrice, newPrice }) => (
        <Card
          key={id}
          img={img}
          title={title}
          star={star}
          reviews={reviews}
          prevPrice={prevPrice}
          newPrice={newPrice}
        />
      )
    );
  };



  const result = filteredData(products, selectedCategory, query);

  return (
    <AppContainer>
      <Sidebar handleChange={handleChange} />
      <Content>
        <AppRouter query={query} handleInputChange={handleInputChange} result={result} />
        <Recommended handleClick={handleClick} />
        <Products result={result} />
      </Content>
    </AppContainer>
  );
}

export default App;
