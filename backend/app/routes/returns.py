from flask import Blueprint, jsonify, request
from models import Devolucion, Pedido
from extensions import db
from data_structures import pila_devoluciones

devoluciones_bp = Blueprint('devoluciones', __name__)

@devoluciones_bp.route('/', methods=['POST'])
def registrar_devolucion():
    data = request.get_json()
    pedido = Pedido.query.get_or_404(data['pedido_id'])

    devolucion = Devolucion(
        pedido_id = data['pedido_id'],
        motivo    = data.get('motivo', '')
    )
    db.session.add(devolucion)
    pedido.estado = 'cancelado'
    db.session.commit()

    # Apilar en la estructura de datos
    pila_devoluciones.apilar(devolucion.to_dict())

    return jsonify({
        "devolucion":    devolucion.to_dict(),
        "pila_tamanio":  pila_devoluciones.tamanio()
    }), 201

@devoluciones_bp.route('/pila', methods=['GET'])
def ver_pila():
    """Muestra el estado actual de la pila de devoluciones en memoria."""
    return jsonify({
        "tamanio":      pila_devoluciones.tamanio(),
        "tope":         pila_devoluciones.ver_tope(),
        "devoluciones": pila_devoluciones.to_list()
    })

@devoluciones_bp.route('/atender', methods=['POST'])
def atender_devolucion():
    """Desapila y atiende la devolución más reciente."""
    dev_data = pila_devoluciones.desapilar()
    if not dev_data:
        return jsonify({"mensaje": "No hay devoluciones pendientes"}), 200

    return jsonify({
        "atendida":       dev_data,
        "pila_restante":  pila_devoluciones.tamanio()
    })