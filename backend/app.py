from flask import Flask
from flask_cors import CORS
from models import db   # Importamos la instancia de SQLAlchemy
import routes            # Blueprint con rutas CRUD

# 1. Inicializamos Flask
app = Flask(__name__)

# 2. Configuración de la base de datos: SQLite en archivo local data.db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desactivar avisos innecesarios

# 3. Inicializar extensiones
db.init_app(app)  # Conecta SQLAlchemy con la app
CORS(app)         # Permite llamadas cross-origin desde el frontend

# 4. Crear las tablas definidas en models.py si no existen
with app.app_context():
    db.create_all()

# 5. Registrar el blueprint con prefijo '/api'
app.register_blueprint(routes.bp)

# 6. Ejecutar servidor en modo debug para desarrollo
if __name__ == '__main__':
    app.run(debug=True)