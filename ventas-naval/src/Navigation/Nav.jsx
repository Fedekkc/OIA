import React from 'react';
import styled from 'styled-components';
import { FiHeart } from 'react-icons/fi';
import { AiOutlineShoppingCart, AiOutlineUserAdd } from 'react-icons/ai';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f8f8;
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.5rem;

  a {
    text-decoration: none;
    color: black;
  }
`;

const SearchInput = styled.input`
  margin-left: 20px;
  padding: 5px 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;

  &:focus {
    outline: none;
    border-color: #999;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;

  a {
    margin-right: 15px;
    text-decoration: none;
    color: black;
  }
`;

const Username = styled.span`
  margin-right: 10px;
  font-weight: bold;
`;

const NavIcons = styled.div`
  margin-right: 10px;
  font-size: 1.5rem;
  cursor: pointer;
`;

const LogoutButton = styled.button`
  padding: 5px 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #ff4d4f;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #ff7875;
  }
`;

const LogoImg = styled.img`
  width: 50px;
  height: 50px;
`;

const AdminPanelButton = styled.button`
  padding: 5px 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;


const Nav = ({ handleInputChange, query }) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    navigate('/login', { replace: true });
  };

  const handleAdminPanelClick = () => {
    const token = state?.token;
    console.log(token)
    if (token) {
      navigate('/personal_ventas', {
        state: { token },
      });
    } else {
      navigate('/login');
    }
  };
  

  return (
    <>
      <Header>
        <NavContainer>
          <Logo>
            <Link to="/"> <LogoImg src='escudo naval.jpeg' alt='logo'></LogoImg> </Link>
          </Logo>
          <SearchInput
            type="text"
            onChange={handleInputChange}
            value={query}
            placeholder="Buscar"
          />
        </NavContainer>

        {state?.logged ? (
          <ProfileContainer>
            <Username>{state?.name}</Username>
            <NavIcons as={FiHeart} />
            <NavIcons as={AiOutlineShoppingCart} />
            <NavIcons as={AiOutlineUserAdd} />
            <AdminPanelButton onClick={ handleAdminPanelClick }>
              Panel de administrador
            </AdminPanelButton>

            <LogoutButton onClick={onLogout}>Cerrar sesión</LogoutButton>
          </ProfileContainer>
        ) : (
          <ProfileContainer>
            <Link to="/login">
              <NavIcons as={FiHeart} />
            </Link>
            <Link to="/cart">
              <NavIcons as={AiOutlineShoppingCart} />
            </Link>
            <Link to="/register">
              <NavIcons as={AiOutlineUserAdd} />
            </Link>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </ProfileContainer>
        )}
      </Header>

      <Outlet />
    </>
  );
};

export default Nav;
