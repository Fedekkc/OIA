import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Header = styled.header`
  background-color: #333;
  color: #fff;
  padding: 1em;
  text-align: center;
`;

const Container = styled.div`
  width: 80%;
  margin: auto;
  overflow: hidden;
`;

const Section = styled.section`
  margin: 20px 0;
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  display: ${props => (props.visible ? 'block' : 'none')};
`;

const Button = styled.button`
  background: ${props => (props.danger ? '#dc3545' : props.confirm ? '#007bff' : '#28a745')};
  color: #fff;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
`;

const Panel = () => {
  const [sectionVisible, setSectionVisible] = useState({
    login: true,
    manageProducts: false,
    pendingOrders: false,
    deliveredOrders: false,
    sales: false,
  });

  const [loginMessage, setLoginMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchPendingOrders();
    fetchDeliveredOrders();
    fetchSales();
  }, []);

  const fetchProducts = async () => {
    const response = await axios.get('/products');
    setProducts(response.data);
  };

  const fetchPendingOrders = async () => {
    const response = await axios.get('/orders/pending');
    setPendingOrders(response.data);
  };

  const fetchDeliveredOrders = async () => {
    const response = await axios.get('/orders/delivered');
    setDeliveredOrders(response.data);
  };

  const fetchSales = async () => {
    const response = await axios.get('/sales');
    setSales(response.data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post('/login', { username, password });
      if (response.data.success) {
        setSectionVisible({
          login: false,
          manageProducts: true,
          pendingOrders: true,
          deliveredOrders: true,
          sales: true,
        });
        fetchProducts();
        fetchPendingOrders();
        fetchDeliveredOrders();
        fetchSales();
      } else {
        setLoginMessage('Nombre de usuario o contraseña incorrectos');
      }
    } catch (error) {
      setLoginMessage('Error al iniciar sesión');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const product = {
      code: e.target.productCode.value,
      description: e.target.productDesc.value,
      price: parseFloat(e.target.productPrice.value),
    };
    await axios.post('/api/products', product);
    fetchProducts();
  };

  const handleDeleteProduct = async (code) => {
    await axios.delete(`/api/products/${code}`);
    fetchProducts();
  };

  const handleFinalizeOrder = async (orderId) => {
    await axios.post(`/api/orders/${orderId}/finalize`);
    fetchPendingOrders();
    fetchDeliveredOrders();
    fetchSales();
  };

  return (
    <Container>
      <Header>
        <h1>Panel del Personal de Ventas</h1>
      </Header>

      <Section id="login-section" visible={sectionVisible.login}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input type="text" name="username" placeholder="Nombre de usuario" required />
          <input type="password" name="password" placeholder="Contraseña" required />
          <Button type="submit">Iniciar Sesión</Button>
        </form>
        <p style={{ color: 'red' }}>{loginMessage}</p>
      </Section>

      <Section id="manage-products-section" visible={sectionVisible.manageProducts}>
        <h2>Gestión de Productos</h2>
        <form onSubmit={handleAddProduct}>
          <input type="text" name="productCode" placeholder="Código de Producto" required />
          <input type="text" name="productDesc" placeholder="Descripción" required />
          <input type="number" name="productPrice" placeholder="Precio" required />
          <Button type="submit">Agregar Producto</Button>
        </form>
        <h3>Lista de Productos</h3>
        <Table>
          <thead>
            <tr>
              <Th>Código</Th>
              <Th>Descripción</Th>
              <Th>Precio</Th>
              <Th>Acción</Th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.code}>
                <Td>{product.code}</Td>
                <Td>{product.description}</Td>
                <Td>${product.price}</Td>
                <Td>
                  <Button danger onClick={() => handleDeleteProduct(product.code)}>Eliminar</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section id="pending-orders-section" visible={sectionVisible.pendingOrders}>
        <h2>Pedidos Pendientes</h2>
        <Table>
          <thead>
            <tr>
              <Th>ID Pedido</Th>
              <Th>Cliente</Th>
              <Th>Productos</Th>
              <Th>Total</Th>
              <Th>Estado</Th>
              <Th>Método de Pago</Th>
              <Th>Acción</Th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map(order => (
              <tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.clientName}</Td>
                <Td>{order.products.join(', ')}</Td>
                <Td>${order.total}</Td>
                <Td>{order.status}</Td>
                <Td>{order.paymentMethod}</Td>
                <Td>
                  <Button confirm onClick={() => handleFinalizeOrder(order.id)}>Finalizar Compra</Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section id="delivered-orders-section" visible={sectionVisible.deliveredOrders}>
        <h2>Pedidos Entregados</h2>
        <Table>
          <thead>
            <tr>
              <Th>ID Pedido</Th>
              <Th>Cliente</Th>
              <Th>Productos</Th>
              <Th>Total</Th>
              <Th>Fecha de Entrega</Th>
              <Th>Método de Pago</Th>
            </tr>
          </thead>
          <tbody>
            {deliveredOrders.map(order => (
              <tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.clientName}</Td>
                <Td>{order.products.join(', ')}</Td>
                <Td>${order.total}</Td>
                <Td>{order.deliveryDate}</Td>
                <Td>{order.paymentMethod}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section id="sales-section" visible={sectionVisible.sales}>
        <h2>Registro de Ventas</h2>
        <Table>
          <thead>
            <tr>
              <Th>ID Venta</Th>
              <Th>Cliente</Th>
              <Th>Productos</Th>
              <Th>Total</Th>
              <Th>Fecha</Th>
              <Th>Método de Pago</Th>
              <Th>Estado</Th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <Td>{sale.id}</Td>
                <Td>{sale.clientName}</Td>
                <Td>{sale.products.join(', ')}</Td>
                <Td>${sale.total}</Td>
                <Td>{sale.date}</Td>
                <Td>{sale.paymentMethod}</Td>
                <Td>{sale.status}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default Panel;
