import { useState, useEffect } from "react";
import { AppRouter } from "./router/AppRouter";
import axios from "axios";
import Products from "./Products/Product";
import Sidebar from "./Sidebar/Sidebar";
import Card from "./components/Card";
import styled from "styled-components";
import "./index.css";
import { useLocation } from "react-router-dom";
import Nav from "./Navigation/Nav";

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
  const state = useLocation();
  //detectar el rol del usuario y si no esta logeado
  const userRole = state.state ? state.state.userRole : null;



  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };


  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
  };
  console.log("productos de app: " + products);
  return (
    <>
      <Nav handleInputChange={handleInputChange} query={query} /> {/* Pasamos las funciones de búsqueda como props a Nav */}
    <AppContainer>
    
      <Content>        
        <AppRouter query={query} handleInputChange={handleInputChange} userRole={userRole} />
      </Content>
    </AppContainer>
    </>
    
  );
}

export default App;
