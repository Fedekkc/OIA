from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from flask_cors import CORS



app = Flask(__name__)
CORS(app)

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
            if not current_user:
                return jsonify({'message': 'User not found!'}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Rutas para clientes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('contraseña'):
        return jsonify({'message': 'Invalid input!'}), 400
    hashed_password = generate_password_hash(data['contraseña'], method='sha256')
    try:
        new_user = Usuario(nombre=data['nombre'], email=data['email'], contraseña=hashed_password, rol='cliente')
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Nuevo usuario registrado.'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error al registrar usuario.', 'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    if not data or not data.get('email') or not data.get('contraseña'):
        return jsonify({'message': 'Invalid input!'}), 400
    user = Usuario.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.contraseña, data['contraseña']):
        return jsonify({'message': 'Login failed! Check your credentials.'}), 401
    try:
        token = jwt.encode({'id_usuario': user.id_usuario, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token}), 201
    except Exception as e:
        return jsonify({'message': 'Error generating token.', 'error': str(e)}), 500

@app.route('/productos', methods=['GET'])
@token_required
def get_productos(current_user):
    try:
        productos = Producto.query.all()
        output = [{'codigo_producto': producto.codigo_producto, 'descripcion': producto.descripcion, 'precio_unitario': str(producto.precio_unitario)} for producto in productos]
        return jsonify({'productos': output}), 200
    except Exception as e:
        return jsonify({'message': 'Error retrieving products.', 'error': str(e)}), 500

@app.route('/carrito', methods=['POST'])
@token_required
def add_to_carrito(current_user):
    data = request.get_json()
    if not data or not data.get('items'):
        return jsonify({'message': 'No items provided!'}), 400
    try:
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
        return jsonify({'message': 'Productos agregados al carrito.'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error al agregar productos al carrito.', 'error': str(e)}), 500

@app.route('/pedidos/pendientes', methods=['GET'])
@token_required
def get_pedidos_pendientes(current_user):
    try:
        pedidos = PedidoPendiente.query.join(Factura).filter(Factura.id_carrito == Carrito.id_carrito, Carrito.id_usuario == current_user.id_usuario).all()
        output = [{'id_pedido': pedido.id_pedido_pendiente, 'fecha_pedido': pedido.fecha_pedido, 'total': str(pedido.factura.total)} for pedido in pedidos]
        return jsonify({'pedidos_pendientes': output}), 200
    except Exception as e:
        return jsonify({'message': 'Error retrieving pending orders.', 'error': str(e)}), 500

@app.route('/pedidos/pendientes/<int:id>', methods=['PUT'])
@token_required
def update_pedido_pendiente(current_user, id):
    pedido = PedidoPendiente.query.get(id)
    if not pedido:
        return jsonify({'message': 'Pedido no encontrado.'}), 404
    data = request.get_json()
    try:
        # Actualizar el pedido con los datos proporcionados
        db.session.commit()
        return jsonify({'message': 'Pedido actualizado.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating order.', 'error': str(e)}), 500

@app.route('/pedidos/pendientes/<int:id>', methods=['DELETE'])
@token_required
def delete_pedido_pendiente(current_user, id):
    pedido = PedidoPendiente.query.get(id)
    if not pedido:
        return jsonify({'message': 'Pedido no encontrado.'}), 404
    try:
        db.session.delete(pedido)
        db.session.commit()
        return jsonify({'message': 'Pedido eliminado.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting order.', 'error': str(e)}), 500

@app.route('/factura', methods=['POST'])
@token_required
def crear_factura(current_user):
    data = request.get_json()
    if not data or not data.get('id_carrito'):
        return jsonify({'message': 'Invalid input!'}), 400
    carrito = Carrito.query.get(data['id_carrito'])
    if not carrito:
        return jsonify({'message': 'Carrito no encontrado!'}), 404
    try:
        nueva_factura = Factura(id_carrito=carrito.id_carrito, total=carrito.precio_total)
        db.session.add(nueva_factura)
        db.session.commit()
        return jsonify({'message': 'Factura creada.', 'id_factura': nueva_factura.id_factura}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error al crear factura.', 'error': str(e)}), 500

@app.route('/factura/<int:id>', methods=['GET'])
@token_required
def get_factura(current_user, id):
    factura = Factura.query.get(id)
    if not factura:
        return jsonify({'message': 'Factura no encontrada.'}), 404
    try:
        return jsonify({'id_factura': factura.id_factura, 'total': str(factura.total), 'estado': factura.estado}), 200
    except Exception as e:
        return jsonify({'message': 'Error retrieving invoice.', 'error': str(e)}), 500

@app.route('/factura/<int:id>', methods=['PUT'])
@token_required
def update_factura(current_user, id):
    data = request.get_json()
    factura = Factura.query.get(id)
    if not factura:
        return jsonify({'message': 'Factura no encontrada.'}), 404
    try:
        factura.estado = data.get('estado', factura.estado)
        db.session.commit()
        return jsonify({'message': 'Factura actualizada.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating invoice.', 'error': str(e)}), 500

@app.route('/factura/<int:id>', methods=['DELETE'])
@token_required
def delete_factura(current_user, id):
    factura = Factura.query.get(id)
    if not factura:
        return jsonify({'message': 'Factura no encontrada.'}), 404
    try:
        db.session.delete(factura)
        db.session.commit()
        return jsonify({'message': 'Factura eliminada.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting invoice.', 'error': str(e)}), 500

# Ejecutar la aplicación
if __name__ == '__main__':
    app.run(debug=True)
