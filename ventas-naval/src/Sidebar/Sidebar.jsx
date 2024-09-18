import Category from "./Category/Category";
import Price from "./Price/Price";
import Colors from "./Colors/Colors";
import "./Sidebar.css";

import styled from 'styled-components';

const SidebarContainer = styled.section`
  padding: 20px;
  background-color: #f4f4f4;
  border-right: 1px solid #ddd;
  height: 100vh;
  width: 300px;
  border-radius: 20px;
  box-sizing: border-box;
`;

const Sidebar = ({ handleChange }) => {
  return (
    <SidebarContainer>
      <Category handleChange={handleChange} />
      <Price handleChange={handleChange} />
      <Colors handleChange={handleChange} />
    </SidebarContainer>
  );
};

export default Sidebar;