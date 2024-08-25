from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

app = Flask(__name__)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/negociodigital'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'Rodrigo'

db = SQLAlchemy(app)

# Modelos de la base de datos
class Usuario(db.Model):
    __tablename__ = 'usuario'
    id_usuario = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    contraseña = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.Enum('cliente', 'personal_ventas'), nullable=False)
    fecha_creacion = db.Column(db.TIMESTAMP, nullable=True, default=datetime.datetime.utcnow)

class Producto(db.Model):
    __tablename__ = 'listaproductos'
    id_producto = db.Column(db.Integer, primary_key=True)
    codigo_producto = db.Column(db.String(50), unique=True, nullable=False)
    descripcion = db.Column(db.String(255), nullable=False)
    precio_unitario = db.Column(db.Numeric(10, 2), nullable=False)

class Carrito(db.Model):
    __tablename__ = 'carrito'
    id_carrito = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario'), nullable=False)
    fecha_creacion = db.Column(db.TIMESTAMP, nullable=True, default=datetime.datetime.utcnow)
    precio_total = db.Column(db.Numeric(10, 2), default=0.00)

class CarritoProducto(db.Model):
    __tablename__ = 'carritoproducto'
    id_carrito_producto = db.Column(db.Integer, primary_key=True)
    id_carrito = db.Column(db.Integer, db.ForeignKey('carrito.id_carrito', ondelete='CASCADE'), nullable=False)
    id_producto = db.Column(db.Integer, db.ForeignKey('listaproductos.id_producto'), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    precio_subtotal = db.Column(db.Numeric(10, 2), nullable=False)

class Factura(db.Model):
    __tablename__ = 'factura'
    id_factura = db.Column(db.Integer, primary_key=True)
    id_carrito = db.Column(db.Integer, db.ForeignKey('carrito.id_carrito'), nullable=False)
    fecha_factura = db.Column(db.TIMESTAMP, nullable=True, default=datetime.datetime.utcnow)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    estado = db.Column(db.Enum('pendiente', 'entregada'), default='pendiente')

class PedidoEntregado(db.Model):
    __tablename__ = 'pedidosentregados'
    id_pedido_entregado = db.Column(db.Integer, primary_key=True)
    id_factura = db.Column(db.Integer, db.ForeignKey('factura.id_factura'), nullable=False)
    fecha_entrega = db.Column(db.TIMESTAMP, nullable=True, default=datetime.datetime.utcnow)

class PedidoPendiente(db.Model):
    __tablename__ = 'pedidospendientes'
    id_pedido_pendiente = db.Column(db.Integer, primary_key=True)
    id_factura = db.Column(db.Integer, db.ForeignKey('factura.id_factura'), nullable=False)
    fecha_pedido = db.Column(db.TIMESTAMP, nullable=True, default=datetime.datetime.utcnow)

class Venta(db.Model):
    __tablename__ = 'ventas'
    id_venta = db.Column(db.Integer, primary_key=True)
    id_factura = db.Column(db.Integer, db.ForeignKey('factura.id_factura'), nullable=False)
    fecha_venta = db.Column(db.TIMESTAMP, nullable=True, default=datetime.datetime.utcnow)
    total = db.Column(db.Numeric(10, 2), nullable=False)

# Decorador para rutas protegidas
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-tokens')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = Usuario.query.filter_by(id_usuario=data['id_usuario']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

# Rutas para clientes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['contraseña'], method='sha256')
    new_user = Usuario(nombre=data['nombre'], email=data['email'], contraseña=hashed_password, rol='cliente')
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Nuevo usuario registrado.'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Usuario.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.contraseña, data['contraseña']):
        return jsonify({'message': 'Login failed! Check your credentials.'}), 401
    token = jwt.encode({'id_usuario': user.id_usuario, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({'token': token})

@app.route('/productos', methods=['GET'])
@token_required
def get_productos(current_user):
    productos = Producto.query.all()
    output = []
    for producto in productos:
        producto_data = {'codigo_producto': producto.codigo_producto, 'descripcion': producto.descripcion, 'precio_unitario': str(producto.precio_unitario)}
        output.append(producto_data)
    return jsonify({'productos': output})

@app.route('/carrito', methods=['POST'])
@token_required
def add_to_carrito(current_user):
    data = request.get_json()
    new_carrito = Carrito(id_usuario=current_user.id_usuario)
    db.session.add(new_carrito)
    db.session.commit()
    for item in data['items']:
        producto = Producto.query.filter_by(id_producto=item['id_producto']).first()
        if producto:
            subtotal = producto.precio_unitario * item['cantidad']
            carrito_producto = CarritoProducto(id_carrito=new_carrito.id_carrito, id_producto=item['id_producto'], cantidad=item['cantidad'], precio_subtotal=subtotal)
            db.session.add(carrito_producto)
            new_carrito.precio_total += subtotal
    db.session.commit()
    return jsonify({'message': 'Productos agregados al carrito.'})

@app.route('/pedidos/pendientes', methods=['GET'])
@token_required
def get_pedidos_pendientes(current_user):
    pedidos = PedidoPendiente.query.join(Factura).filter(Factura.id_carrito == Carrito.id_carrito, Carrito.id_usuario == current_user.id_usuario).all()
    output = []
    for pedido in pedidos:
        pedido_data = {'id_pedido': pedido.id_pedido_pendiente, 'fecha_pedido': pedido.fecha_pedido, 'total': str(pedido.factura.total)}
        output.append(pedido_data)
    return jsonify({'pedidos_pendientes': output})

@app.route('/pedidos/pendientes/<int:id>', methods=['PUT'])
@token_required
def update_pedido_pendiente(current_user, id):
    pedido = PedidoPendiente.query.get(id)
    if not pedido:
        return jsonify({'message': 'Pedido no encontrado.'})
    data = request.get_json()
    # Actualizar el pedido con los datos proporcionados
    db.session.commit()
    return jsonify({'message': 'Pedido actualizado.'})

@app.route('/pedidos/pendientes/<int:id>', methods=['DELETE'])
@token_required
def delete_pedido_pendiente(current_user, id):
    pedido = PedidoPendiente.query.get(id)
    if not pedido:
        return jsonify({'message': 'Pedido no encontrado.'})
    db.session.delete(pedido)
    db.session.commit()
    return jsonify({'message': 'Pedido eliminado.'})

# Rutas para personal de ventas
@app.route('/productos', methods=['POST'])
@token_required
def create_producto(current_user):
    if current_user.rol != 'personal_ventas':
        return jsonify({'message': 'No autorizado.'})
    data = request.get_json()
    new_producto = Producto(codigo_producto=data['codigo_producto'], descripcion=data['descripcion'], precio_unitario=data['precio_unitario'])
    db.session.add(new_producto)
    db.session.commit()
    return jsonify({'message': 'Producto creado.'})

@app.route('/pedidos/pendientes', methods=['GET'])
@token_required
def get_all_pedidos_pendientes(current_user):
    if current_user.rol != 'personal_ventas':
        return jsonify({'message': 'No autorizado.'})
    pedidos = PedidoPendiente.query.all()
    output = []
    for pedido in pedidos:
        pedido_data = {'id_pedido': pedido.id_pedido_pendiente, 'fecha_pedido': pedido.fecha_pedido, 'total': str(pedido.factura.total)}
        output.append(pedido_data)
    return jsonify({'pedidos_pendientes': output})

@app.route('/pedidos/entregar/<int:id>', methods=['POST'])
@token_required
def entregar_pedido(current_user, id):
    if current_user.rol != 'personal_ventas':
        return jsonify({'message': 'No autorizado.'})
    pedido = PedidoPendiente.query.get(id)
    if not pedido:
        return jsonify({'message': 'Pedido no encontrado.'})
    factura = Factura.query.get(pedido.id_factura)
    new_entrega = PedidoEntregado(id_factura=factura.id_factura)
    db.session.add(new_entrega)
    db.session.delete(pedido)
    db.session.commit()
    return jsonify({'message': 'Pedido entregado.'})

@app.route('/ventas', methods=['GET'])
@token_required
def get_ventas(current_user):
    if current_user.rol != 'personal_ventas':
        return jsonify({'message': 'No autorizado.'})
    ventas = Venta.query.all()
    output = []
    for venta in ventas:
        venta_data = {'id_venta': venta.id_venta, 'fecha_venta': venta.fecha_venta, 'total': str(venta.total)}
        output.append(venta_data)
    return jsonify({'ventas': output})

if __name__ == '__main__':
    app.run(debug=True)
