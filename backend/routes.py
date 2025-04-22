from flask import Blueprint, request, jsonify
from models import db, Item

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/items', methods=['GET'])
def listar_items():
    items = Item.query.all()
    return jsonify([{
        'id': i.id,
        'nombre': i.nombre,
        'descripcion': i.descripcion
    } for i in items]), 200

@bp.route('/items', methods=['POST'])
def crear_item():
    data = request.get_json()
    if not data or 'nombre' not in data:
        return jsonify({'error': 'Campo nombre requerido'}), 400
    
    nuevo = Item(
        nombre=data['nombre'].strip(),
        descripcion=data.get('descripcion', '').strip()
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify({'id': nuevo.id}), 201

@bp.route('/items/<int:item_id>', methods=['PUT'])
def actualizar_item(item_id):
    item = Item.query.get_or_404(item_id)
    data = request.get_json()
    
    if 'nombre' in data and not data['nombre'].strip():
        return jsonify({'error': 'El nombre no puede estar vacío'}), 400
    
    item.nombre = data.get('nombre', item.nombre).strip()
    item.descripcion = data.get('descripcion', item.descripcion).strip()
    db.session.commit()
    return jsonify({'message': 'Item actualizado'}), 200

@bp.route('/items/<int:item_id>', methods=['DELETE'])
def borrar_item(item_id):
    item = Item.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item eliminado'}), 200