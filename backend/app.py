from flask import Flask, send_from_directory  # <-- Añade send_from_directory aquí
from flask_cors import CORS
from models import db
import routes

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar extensiones
db.init_app(app)
CORS(app)

# Registrar blueprint
app.register_blueprint(routes.bp)

# Servir frontend (añade estas rutas)
@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../frontend', path)

def setup_database():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    setup_database()
    app.run(debug=True)