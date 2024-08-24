// Datos simulados
const clientes = [{ id: 'cliente1', nombre: 'Juan Pérez' }];
let productos = [
    { codigo: '001', descripcion: 'Camiseta deportiva', precio: 20 },
    { codigo: '002', descripcion: 'Pantalones cortos', precio: 15 },
    { codigo: '003', descripcion: 'Zapatillas de running', precio: 50 }
];
let pedidosPendientes = [
    { id: 'order-abc123', clienteId: 'cliente1', productos: ['001', '002'], estado: 'pendiente', total: 35, metodoPago: 'Bankarg' }
];
let pedidosEntregados = [];
let ventas = [];

// Función para mostrar productos
function mostrarProductos() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.codigo}</td>
            <td>${producto.descripcion}</td>
            <td>$${producto.precio}</td>
            <td><button class="btn btn-danger" onclick="eliminarProducto('${producto.codigo}')">Eliminar</button></td>
        `;
        productList.appendChild(row);
    });
}

// Función para agregar un nuevo producto
document.getElementById('add-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const codigo = document.getElementById('product-code').value;
    const descripcion = document.getElementById('product-desc').value;
    const precio = parseFloat(document.getElementById('product-price').value);

    productos.push({ codigo, descripcion, precio });
    alert('Producto agregado exitosamente');
    mostrarProductos();
});

// Función para eliminar un producto
function eliminarProducto(codigo) {
    productos = productos.filter(p => p.codigo !== codigo);
    mostrarProductos();
}

// Función para mostrar pedidos pendientes
function mostrarPedidosPendientes() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    pedidosPendientes.forEach(pedido => {
        const cliente = clientes.find(c => c.id === pedido.clienteId);
        const productosPedido = pedido.productos.map(p => {
            const producto = productos.find(prod => prod.codigo === p);
            return `${producto.codigo}: ${producto.descripcion} ($${producto.precio})`;
        }).join(', ');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.id}</td>
            <td>${cliente ? cliente.nombre : 'Desconocido'}</td>
            <td>${productosPedido}</td>
            <td>$${pedido.total}</td>
            <td>${pedido.estado}</td>
            <td>${pedido.metodoPago}</td>
            <td><button class="btn btn-confirm" onclick="finalizarCompra('${pedido.id}')">Finalizar Compra</button></td>
        `;
        orderList.appendChild(row);
    });
    document.getElementById('pending-orders-section').style.display = 'block';
}

// Función para entregar un pedido
function entregarPedido(id) {
    const index = pedidosPendientes.findIndex(p => p.id === id);
    if (index > -1) {
        const pedido = pedidosPendientes.splice(index, 1)[0];
        pedido.fechaEntrega = new Date().toLocaleDateString();
        pedidosEntregados.push(pedido);

        // Registrar venta
        ventas.push({
            id: `venta-${pedido.id}`,
            clienteId: pedido.clienteId,
            clienteNombre: clientes.find(c => c.id === pedido.clienteId).nombre,
            productos: pedido.productos.map(p => {
                const prod = productos.find(prod => prod.codigo === p);
                return `${prod.codigo}: ${prod.descripcion} ($${prod.precio})`;
            }).join(', '),
            total: pedido.total,
            fecha: new Date().toLocaleDateString(),
            metodoPago: pedido.metodoPago,
            estado: 'completado'
        });

        alert('Pedido marcado como entregado');
        mostrarPedidosPendientes();
        mostrarPedidosEntregados();
        mostrarVentas();
    }
}

// Función para mostrar pedidos entregados
function mostrarPedidosEntregados() {
    const deliveredOrderList = document.getElementById('delivered-order-list');
    deliveredOrderList.innerHTML = '';
    pedidosEntregados.forEach(pedido => {
        const cliente = clientes.find(c => c.id === pedido.clienteId);
        const productosPedido = pedido.productos.map(p => {
            const producto = productos.find(prod => prod.codigo === p);
            return `${producto.codigo}: ${producto.descripcion} ($${producto.precio})`;
        }).join(', ');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.id}</td>
            <td>${cliente ? cliente.nombre : 'Desconocido'}</td>
            <td>${productosPedido}</td>
            <td>$${pedido.total}</td>
            <td>${pedido.fechaEntrega}</td>
            <td>${pedido.metodoPago}</td>
        `;
        deliveredOrderList.appendChild(row);
    });
    document.getElementById('delivered-orders-section').style.display = 'block';
}

// Función para mostrar ventas
function mostrarVentas() {
    const salesList = document.getElementById('sales-list');
    salesList.innerHTML = '';
    ventas.forEach(venta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${venta.id}</td>
            <td>${venta.clienteNombre}</td>
            <td>${venta.productos}</td>
            <td>$${venta.total}</td>
            <td>${venta.fecha}</td>
            <td>${venta.metodoPago}</td>
            <td>${venta.estado}</td>
        `;
        salesList.appendChild(row);
    });
    document.getElementById('sales-section').style.display = 'block';
}

// Función para iniciar sesión
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulación de validación de usuario
    if (username === 'admin' && password === 'admin') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('manage-products-section').style.display = 'block';
        document.getElementById('pending-orders-section').style.display = 'block';
        document.getElementById('delivered-orders-section').style.display = 'block';
        document.getElementById('sales-section').style.display = 'block';
        mostrarProductos();
        mostrarPedidosPendientes();
        mostrarPedidosEntregados();
        mostrarVentas();
    } else {
        document.getElementById('login-message').innerText = 'Nombre de usuario o contraseña incorrectos';
    }
});

// Función para simular el pago
function procesarPago(total) {
    // Simulación de pago con "Bankarg"
    alert(`El total a cobrar es $${total}. El pago ha sido procesado con tarjeta de crédito "Bankarg".`);
}

// Función para finalizar compra
function finalizarCompra(pedidoId) {
    const pedido = pedidosPendientes.find(p => p.id === pedidoId);
    if (pedido) {
        procesarPago(pedido.total);
        entregarPedido(pedidoId); // Esto también moverá el pedido a entregados y registrará la venta
    }
}
