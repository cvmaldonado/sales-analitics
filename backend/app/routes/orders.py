from flask import Blueprint, jsonify, request
from models import Pedido, Producto
from extensions import db
from data_structures import cola_pedidos

pedidos_bp = Blueprint('pedidos', __name__)

@pedidos_bp.route('/', methods=['GET'])
def listar_pedidos():
    pedidos = Pedido.query.all()
    return jsonify([p.to_dict() for p in pedidos])

@pedidos_bp.route('/', methods=['POST'])
def crear_pedido():
    data = request.get_json()
    producto = Producto.query.get_or_404(data['producto_id'])

    if producto.stock < data['cantidad']:
        return jsonify({"error": "Stock insuficiente"}), 400

    pedido = Pedido(
        producto_id = data['producto_id'],
        cantidad    = data['cantidad']
    )
    db.session.add(pedido)
    producto.stock -= data['cantidad']
    db.session.commit()

    # Encolar en la estructura de datos
    cola_pedidos.encolar(pedido.to_dict())

    return jsonify({
        "pedido":        pedido.to_dict(),
        "cola_tamanio":  cola_pedidos.tamanio()
    }), 201

@pedidos_bp.route('/cola', methods=['GET'])
def ver_cola():
    """Muestra el estado actual de la cola de pedidos en memoria."""
    return jsonify({
        "tamanio":  cola_pedidos.tamanio(),
        "frente":   cola_pedidos.ver_frente(),
        "pedidos":  cola_pedidos.to_list()
    })

@pedidos_bp.route('/procesar', methods=['POST'])
def procesar_pedido():
    """Desencola y procesa el pedido más antiguo."""
    pedido_data = cola_pedidos.desencolar()
    if not pedido_data:
        return jsonify({"mensaje": "No hay pedidos en cola"}), 200

    pedido = Pedido.query.get(pedido_data['id'])
    if pedido:
        pedido.estado = 'procesado'
        db.session.commit()

    return jsonify({
        "procesado":      pedido_data,
        "cola_restante":  cola_pedidos.tamanio()
    })