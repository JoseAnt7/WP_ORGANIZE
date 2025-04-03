from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS
from models import db, User
from routes import init_routes
import os

def create_app():
    app = Flask(__name__)
    basedir = os.path.abspath(os.path.dirname(__file__))


    # Configuración
    app.config['SECRET_KEY'] = 'tu_clave_secreta_aqui'  # Cambia esto por algo seguro
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'database.sqlite')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Habilitar CORS
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})
    
    # Configuración de cookies para CORS (necesario para sesiones)
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Permite cookies en solicitudes cross-origin
    app.config['SESSION_COOKIE_SECURE'] = False  # Cambia a True en producción con HTTPS
    
    # Inicialización de extensiones
    db.init_app(app)
    bcrypt = Bcrypt(app)
    login_manager = LoginManager(app)
    login_manager.login_view = 'login'
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Registrar rutas
    init_routes(app, db, bcrypt)
    
    # Crear la base de datos si no existe
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)