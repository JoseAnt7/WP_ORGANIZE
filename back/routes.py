from flask import render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, login_required, logout_user
from models import db, User
import os
import subprocess


def init_routes(app, db, bcrypt):
    @app.route('/')
    @login_required
    def home():
        return render_template('home.html')
    
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            # Verificar si el contenido es JSON
            if request.is_json:
                data = request.get_json()
                username = data.get('username')
                password = data.get('password')
            else:
                # Mantener compatibilidad con formularios si es necesario
                username = request.form.get('username')
                password = request.form.get('password')
            
            if not username or not password:
                return jsonify({'error': 'Faltan username o password'}), 400
            
            user = User.query.filter_by(username=username).first()
            
            if user and bcrypt.check_password_hash(user.password, password):
                login_user(user)
                return jsonify({'message': 'Inicio de sesión exitoso'}), 200
            else:
                return jsonify({'error': 'Usuario o contraseña incorrectos'}), 401
        
        # Si es GET, mostrar el formulario HTML
        return render_template('login.html')
    
    @app.route('/register', methods=['GET', 'POST'])
    def register():
        if request.method == 'POST':
            if request.is_json:
                data = request.get_json()
                username = data.get('username')
                email = data.get('email')
                password = data.get('password')
            else:
                username = request.form.get('username')
                email = request.form.get('email')
                password = request.form.get('password')
            
            if not username or not email or not password:
                return jsonify({'error': 'Faltan username, email o password'}), 400
            
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            new_user = User(username=username, email=email, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'message': 'Usuario registrado con éxito'}), 201
        
        return render_template('register.html')
    
    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('login'))
    
    @app.route('/plugins', methods=['GET'])
    def get_plugins():
        ruta_base = r"C:\wamp64\www"
        carpetas = [nombre for nombre in os.listdir(ruta_base) if os.path.isdir(os.path.join(ruta_base, nombre))]
        plugins_data = []

        for carpeta in carpetas:
            ruta_completa = os.path.join(ruta_base, carpeta)
            comando = ["php", "wp-cli.phar", f"--path={ruta_completa}", "plugin", "list", "--format=csv", "--fields=name,status"]
            
            try:
                resultado = subprocess.run(comando, capture_output=True, text=True, check=True)
                lines = resultado.stdout.strip().split("\n")[1:]  # Saltar encabezado
                for line in lines:
                    name, status = line.split(",")
                    # Simulación de versión y actualización (ajusta según datos reales)
                    plugins_data.append({
                        "site": carpeta,
                        "name": name,
                        "status": status,
                        "version": "1.0.0",  # Placeholder, obtén esto si WP-CLI lo soporta
                        "latestVersion": "1.1.0",  # Placeholder
                        "needsUpdate": True if "1.0.0" < "1.1.0" else False  # Lógica simulada
                    })
            except subprocess.CalledProcessError as e:
                print(f"Error en {carpeta}: {e.stderr}")

        return jsonify(plugins_data)