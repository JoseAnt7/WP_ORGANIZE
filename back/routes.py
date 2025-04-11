import requests
from flask import render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, login_required, logout_user
from models import db, User, Wordpress_sites
import os
import subprocess
import base64


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
            # Ajustamos el comando para incluir todos los campos necesarios
            comando = [
                "php", 
                "wp-cli.phar", 
                f"--path={ruta_completa}", 
                "plugin", 
                "list", 
                "--format=csv", 
                "--fields=name,status,version,update_version,update"
            ]
            
            try:
                resultado = subprocess.run(comando, capture_output=True, text=True, check=True)
                lines = resultado.stdout.strip().split("\n")[1:]  # Saltar encabezado
                for line in lines:
                    # Dividimos la línea CSV en los campos correspondientes
                    name, status, version, update_version, update = line.strip().split(",")
                    plugins_data.append({
                        "site": carpeta,
                        "name": name,
                        "status": status,
                        "version": version if version else "N/A",  # Si no hay versión, usamos "N/A"
                        "latestVersion": update_version if update_version else "N/A",  # Última versión disponible
                        "needsUpdate": update == "available"  # True si hay actualización disponible
                    })
            except subprocess.CalledProcessError as e:
                print(f"Error en {carpeta}: {e.stderr}")

        return jsonify(plugins_data)
    
    @app.route('/wp/add', methods=['POST'])
    def create_wordpress_conection():
        data = request.get_json()
        print("Datos recibidos:", data)  # Para depuración
        wp_url = data.get('wp_url')
        username = data.get('username')
        app_password = data.get('app_password')
        api_endpoint = f"{wp_url}/wp-json/wp/v2/plugins"

        if not wp_url or not username or not app_password:
            return jsonify({'error': "Faltan datos en tu operación"}), 400

        new_wordpress = Wordpress_sites(
            wp_url=wp_url,
            username=username,
            app_password=app_password,
            api_endpoint=api_endpoint
        )
        db.session.add(new_wordpress)
        db.session.commit()

        return jsonify({'message': 'Wordpress registrado correctamente'}), 201
    
    
    @app.route('/plugins/api', methods=['GET'])
    def get_plugins_api():
        # Obtener todos los sitios WordPress registrados en la BBDD
        sites = Wordpress_sites.query.all()
        plugins_data = []

        for site in sites:
            # Configuración para la solicitud a la API REST
            credentials = base64.b64encode(f"{site.username}:{site.app_password}".encode()).decode("utf-8")
            headers = {
                "Authorization": f"Basic {credentials}",
                "Content-Type": "application/json"
            }

            try:
                # Hacer la solicitud GET al endpoint de plugins
                response = requests.get(site.api_endpoint, headers=headers, timeout=10)
                response.raise_for_status()  # Lanza excepción si hay error HTTP

                # Procesar los datos de los plugins
                plugins = response.json()
                for plugin in plugins:
                    name = plugin.get("plugin", "Sin nombre")  # Nota: El campo puede ser "plugin" en lugar de "name"
                    status = plugin.get("status", "inactive")
                    version = plugin.get("version", "Desconocida")
                    update_version = plugin.get("update_version", version)  # Si no hay dato, usa la versión actual
                    needs_update = update_version != version and update_version != ""  # Determina si necesita actualización

                    plugins_data.append({
                        "site": site.wp_url,
                        "name": name,
                        "status": status,
                        "version": version,
                        "latestVersion": update_version if update_version else "N/A",
                        "needsUpdate": needs_update
                    })

            except requests.exceptions.RequestException as e:
                print(f"Error al conectar con {site.wp_url}: {e}")
                continue  # Continúa con el siguiente sitio si falla uno

        return jsonify(plugins_data)
