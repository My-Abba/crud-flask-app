from flask import Blueprint, request, jsonify
from models import db, Item

# Creamos un blueprint llamado 'api' y prefijamos con '/api'
bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/items', methods=['GET'])
def listar_items():
    """GET /api/items: devuelve lista de todos los items en formato JSON"""
    items = Item.query.all()  # SELECT * FROM item;
    resultado = [
        {'id': i.id, 'nombre': i.nombre, 'descripcion': i.descripcion}
        for i in items
    ]
    return jsonify(resultado), 200

@bp.route('/items', methods=['POST'])
def crear_item():
    """POST /api/items: crea un nuevo item con JSON en el body"""
    data = request.get_json()  # Lee el JSON enviado
    if not data or 'nombre' not in data:
        return jsonify({'error': 'Falta el campo nombre.'}), 400

    nuevo = Item(nombre=data['nombre'], descripcion=data.get('descripcion', ''))
    db.session.add(nuevo)      # INSERT
    db.session.commit()        # Guarda en la base de datos
    return jsonify({'id': nuevo.id}), 201

@bp.route('/items/<int:id>', methods=['PUT'])
def actualizar_item(id):
    """PUT /api/items/<id>: actualiza nombre y descripción"""
    data = request.get_json()
    item = Item.query.get_or_404(id)  # 404 si no existe
    item.nombre = data.get('nombre', item.nombre)
    item.descripcion = data.get('descripcion', item.descripcion)
    db.session.commit()                # UPDATE
    return '', 204

@bp.route('/items/<int:id>', methods=['DELETE'])
def borrar_item(id):
    """DELETE /api/items/<id>: elimina el registro"""
    item = Item.query.get_or_404(id)
    db.session.delete(item)  # DELETE
    db.session.commit()
    return '', 204