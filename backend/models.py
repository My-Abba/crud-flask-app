from flask_sqlalchemy import SQLAlchemy

# Instancia global de SQLAlchemy para usar en app.py y routes.py
db = SQLAlchemy()

class Item(db.Model):
    """
    Modelo 'Item' para la tabla 'item'.
    Atributos:
      - id: clave primaria entera autoincremental.
      - nombre: cadena, requerido.
      - descripcion: cadena, opcional.
    """
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(200), nullable=True)