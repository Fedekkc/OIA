import { useState } from "react";
import { AppRouter } from "./router/AppRouter";
import products from "./db/data";
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

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredItems = products.filter(
    (product) => product.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
  };

  function filteredData(products, selected, query) {
    let filteredProducts = products;

    if (query) {
      filteredProducts = filteredItems;
    }

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

    return filteredProducts.map(
      ({ img, title, star, reviews, prevPrice, newPrice }) => (
        <Card
          key={Math.random()}
          img={img}
          title={title}
          star={star}
          reviews={reviews}
          prevPrice={prevPrice}
          newPrice={newPrice}
        />
      )
    );
  }

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
