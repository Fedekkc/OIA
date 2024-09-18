import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../Hook/useForm';
import axios from 'axios';
import styled from 'styled-components';

// Estilos para el contenedor del formulario
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
`;

// Estilos del formulario
const Form = styled.form`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;

  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    &:focus {
      border-color: #007bff;
    }
  }

  label {
    position: absolute;
    top: -8px;
    left: 12px;
    background: white;
    padding: 0 5px;
    font-size: 14px;
    color: #888;
  }
`;

// Botón estilizado
const Button = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { name, email, password, onInputChange, onResetForm } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      // Enviar la solicitud de inicio de sesión al servidor
      const response = await axios.post('http://127.0.0.1:5000/login', {
        name,
        email,
        password,
      })

      if (response.status === 200 || response.status === 201) {
        console.log(response)
        navigate('/', {
          replace: true,
          state: {
            logged: true,
            name: response.data.name,
            token: response.data.token,
            rol: response.data.rol,
          },
        });
      } else {
        // Manejar el caso en que la autenticación falle
        alert('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un problema al intentar iniciar sesión');
    }

    onResetForm();
  };

  return (
    <Wrapper>
      <Form onSubmit={onLogin}>
        <h1>Iniciar Sesión</h1>

        <InputGroup>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={onInputChange}
            required
            autoComplete="off"
          />
          <label htmlFor="name">Nombre:</label>
        </InputGroup>

        <InputGroup>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onInputChange}
            required
            autoComplete="off"
          />
          <label htmlFor="email">Email:</label>
        </InputGroup>

        <InputGroup>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onInputChange}
            required
            autoComplete="off"
          />
          <label htmlFor="password">Contraseña:</label>
        </InputGroup>

        <Button type="submit">Entrar</Button>
      </Form>
    </Wrapper>
  );
};
