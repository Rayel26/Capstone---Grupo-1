from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_cors import CORS
from functools import wraps
import requests
from requests.auth import HTTPBasicAuth
from supabase import create_client  # Importar Supabase

app = Flask(__name__)
CORS(app)
app.secret_key = 'supersecretkey'  # Clave para las sesiones

# Reemplaza con tus credenciales de Cloudinary
CLOUD_NAME = 'dqeideoyd'
API_KEY = '916694628586842'
API_SECRET = '4v36fweAMrokX64C8ciboL7o_SA'

# Datos simulados para usuarios
users = {
    "user@example.com": {"password": "userpass", "role": "user"},
    "vet@example.com": {"password": "vetpass", "role": "vet"},
    "admin@example.com": {"password": "adminpass", "role": "admin"}
}

# Inicializa Supabase aquí
SUPABASE_URL = 'https://wlnahmbigsbckwbdwezo.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbmFobWJpZ3NiY2t3YmR3ZXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MDg5MzUsImV4cCI6MjA0NDA4NDkzNX0.CP-BaGcCf-fQD-lYrbH0_B-sKVOwUb9Xgy9-nzKjtLM'
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)  # Inicializar el cliente de Supabase

# Decorador para verificar si el usuario está logueado
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('is_logged_in'):
            flash('Debes iniciar sesión para acceder a esta página.', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Decorador para verificar el rol del usuario
def role_required(role):
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if session.get('role') != role:
                flash('No tienes permiso para acceder a esta página.', 'error')
                return redirect(url_for('login'))
            return f(*args, **kwargs)
        return wrapped
    return wrapper

# Ruta para la página de inicio
@app.route('/')
def home():
    return render_template('home.html')

# Ruta para la página de login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        # Verificar si el usuario está en la base de datos simulada
        user = users.get(email)
        if user and user['password'] == password:
            session['email'] = email
            session['role'] = user['role']
            session['is_logged_in'] = True  # Marca que el usuario ha iniciado sesión
            
            # Redirigir al perfil según el rol
            if user['role'] == 'user':
                return redirect(url_for('profile'))
            elif user['role'] == 'vet':
                return redirect(url_for('profile_vet'))
            elif user['role'] == 'admin':
                return redirect(url_for('admin_dashboard'))
        else:
            flash('Usuario o contraseña incorrectos', 'error')
    
    return render_template('login.html')

# Ruta para cerrar sesión
@app.route('/logout')
def logout():
    session.clear()  # Elimina toda la información de la sesión
    flash('Has cerrado sesión.', 'info')
    return redirect(url_for('login'))

# Ruta para el perfil de usuario
@app.route('/profile')
@login_required
@role_required('user')
def profile():
    return render_template('profile.html')

# Ruta para el perfil de veterinario
@app.route('/profile_vet')
@login_required
@role_required('vet')
def profile_vet():
    return render_template('profile_vet.html')

# Ruta para el panel de administrador
@app.route('/admin_dashboard')
@login_required
@role_required('admin')
def admin_dashboard():
    return render_template('admin_dashboard.html')

# Otras rutas de la aplicación
@app.route('/products')
def products():
    return render_template('products.html', show_search=True)


@app.route('/help')
def help():
    return render_template('help.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/schedule')
def schedule():
    return render_template('schedule.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/registration')
def registration():
    return render_template('registration.html')

@app.route('/donation')
def donation():
    return render_template('donation.html')

from flask import request, jsonify

@app.route('/create_product', methods=['POST'])
@login_required
@role_required('admin')
def create_product():
    # Obtener datos del formulario
    data = request.get_json()

    # Comprobar si se recibieron datos
    if not data:
        return jsonify({'error': 'No se recibió ningún dato.'}), 400

    # Verificar claves necesarias
    required_keys = ['name', 'description', 'price', 'brand', 'quantity', 'type', 'image_url']
    for key in required_keys:
        if key not in data:
            return jsonify({'error': f'Falta el campo: {key}'}), 400

    nombre_producto = data['name']
    descripcion = data['description']
    valor = data['price']
    marca = data['brand']
    stock = data['quantity']
    fecha_ingreso = data['fecha_ingreso']
    imagen_url = data['image_url']  # Obtener la URL de la imagen

    # Determinar el tipo de producto
    tipo_producto_id = 0
    if data['type'] == 'alimento_perro':
        tipo_producto_id = 1
    elif data['type'] == 'alimento_gato':
        tipo_producto_id = 2
    elif data['type'] == 'medicamento':
        tipo_producto_id = 3
    else:
        return jsonify({'error': 'Tipo de producto no válido.'}), 400

    # Crear el producto en Supabase incluyendo imagen_url
    response = supabase.table('Producto').insert({
        'nombre_producto': nombre_producto,
        'descripcion': descripcion,
        'valor': valor,
        'marca': marca,
        'stock': stock,
        'tipo_producto_id': tipo_producto_id,
        'fecha_ingreso': fecha_ingreso,
        'imagen_url': imagen_url  # Guardar la URL de la imagen
    }).execute()

    # Verificar si la inserción fue exitosa
    if response.data:  # Si hay datos en la respuesta, la inserción fue exitosa
        return jsonify({'message': 'Producto creado exitosamente.', 'data': response.data}), 201
    else:
        # Si no hay datos, verifica el error
        print('Error de Supabase:', response.error)  # Agregar esta línea
        return jsonify({'error': 'Error al crear el producto.', 'details': response.error}), 400


# Ruta para obtener los productos
@app.route('/get_products', methods=['GET'])
def get_products():
    response = supabase.table('Producto').select('*').execute()
    return jsonify(response.data), 200


@app.route('/item/<int:id_producto>', methods=['GET'])
def get_product(id_producto):
    response = supabase.table('Producto').select('*').eq('id_producto', id_producto).execute()
    
    if response.data:
        product = response.data[0]
        print(product)  # Imprime el producto en la consola del servidor
        return render_template('item.html', product=product)
    else:
        return "Producto no encontrado", 404


# Ruta para obtener imágenes de Cloudinary
@app.route('/api/cloudinary/images', methods=['GET'])
def get_cloudinary_images():
    url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/image/upload'
    response = requests.get(url, auth=HTTPBasicAuth(API_KEY, API_SECRET))

    if response.status_code == 200:
        # Obtener solo las URLs de las imágenes
        images = [resource['secure_url'] for resource in response.json().get('resources', [])]
        return jsonify(images)
    else:
        return jsonify({'error': 'Error fetching images from Cloudinary'}), response.status_code


if __name__ == '__main__':
    app.run(debug=True)
