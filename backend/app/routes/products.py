from flask import Blueprint, jsonify, request
from extensions import db
from models import Producto

productos_bp = Blueprint('productos', __name__)

@productos_bp.route('/', methods=['GET'])
def listar_productos():
    categoria = request.args.get('categoria')
    query = Producto.query
    if categoria:
        query = query.filter_by(categoria=categoria)
    productos = query.all()
    return jsonify([p.to_dict() for p in productos])

@productos_bp.route('/<int:id>', methods=['GET'])
def obtener_producto(id):
    producto = Producto.query.get_or_404(id)
    return jsonify(producto.to_dict())

@productos_bp.route('/', methods=['POST'])
def crear_producto():
    data = request.get_json()
    producto = Producto(
        nombre      = data['nombre'],
        descripcion = data.get('descripcion', ''),
        precio      = data['precio'],
        stock       = data.get('stock', 0),
        categoria   = data.get('categoria', '')
    )
    db.session.add(producto)
    db.session.commit()
    return jsonify(producto.to_dict()), 201

@productos_bp.route('/<int:id>', methods=['PUT'])
def actualizar_producto(id):
    producto = Producto.query.get_or_404(id)
    data = request.get_json()
    for campo in ['nombre', 'descripcion', 'precio', 'stock', 'categoria']:
        if campo in data:
            setattr(producto, campo, data[campo])
    db.session.commit()
    return jsonify(producto.to_dict())

@productos_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_producto(id):
    producto = Producto.query.get_or_404(id)
    db.session.delete(producto)
    db.session.commit()
    return jsonify({"mensaje": "Producto eliminado"})