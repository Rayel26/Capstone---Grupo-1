from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_cors import CORS
from functools import wraps
import requests
from requests.auth import HTTPBasicAuth
from supabase import create_client

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
        
        # Consultar la base de datos de Supabase
        user_data = supabase.table('Usuario').select('id_usuario, correo, contraseña').eq('correo', email).execute()

        if user_data.data:
            user = user_data.data[0]  # Obtener el primer usuario encontrado

            # Verifica la contraseña (ajusta esto si usas un método de hash)
            if user['contraseña'] == password:  # Cambia esto por la verificación de hash si es necesario
                session['email'] = user['correo']
                session['is_logged_in'] = True  # Marca que el usuario ha iniciado sesión
                
                # Redirigir a la página principal o un dashboard
                return redirect(url_for('home'))  # Asegúrate de tener una vista 'home'
            else:
                flash('Usuario o contraseña incorrectos', 'error')
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
@app.route('/profile', methods=['GET'])
@login_required
def profile():
    # Asumiendo que el usuario ha iniciado sesión y su correo está almacenado en la sesión
    email = session.get('correo')  # Reemplaza esto con la forma en que guardas el email
    password = request.form.get('contraseña')  # Obtén la contraseña del formulario (asegúrate de que sea seguro)

    # Obtener los datos del usuario de Supabase
    user_data = supabase.table('Usuario').select('*').eq('correo', email).eq('contraseña', password).execute()
    
    # Asumiendo que solo hay un usuario o que deseas el primero
    user = user_data.data[0] if user_data.data else {}
    
    return render_template('profile.html', user=user)


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
    # Verificar si el usuario está logueado
    if not session.get('is_logged_in'):
        session['cart'] = []  # Vaciar el carrito si no está logueado
    return render_template('cart.html')

@app.route('/registration')
def registration():
    return render_template('registration.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Log para ver los datos recibidos
    print("Datos recibidos:", data)

    # Extraer los datos del JSON
    rut = data['id_usuario']
    nombre = data['nombre']
    appaterno = data['appaterno']
    apmaterno = data['apmaterno']
    correo = data['correo']
    contraseña = data['contraseña']
    celular = data['celular']

    # Inserta los datos en Supabase
    response = supabase.table('Usuario').insert({
        'id_usuario': rut,
        'nombre': nombre,
        'appaterno': appaterno,
        'apmaterno': apmaterno,
        'correo': correo,
        'contraseña': contraseña,
        'celular': celular
    }).execute()

    # Log para ver la respuesta de Supabase
    print("Respuesta de Supabase:", response)

    if response.status_code == 201:  # Si la inserción fue exitosa
        return jsonify({"message": "Usuario creado exitosamente", "data": response.data}), 201
    else:
        return jsonify({"error": "Error al crear el usuario", "details": response.json()}), 400





@app.route('/donation')
def donation():
    return render_template('donation.html')

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
    required_keys = ['name', 'description', 'price', 'brand', 'quantity', 'type', 'image_url', 'fecha_ingreso']
    for key in required_keys:
        if key not in data:
            return jsonify({'error': f'Falta el campo: {key}'}), 400

    # Determinar el tipo de producto
    tipo_producto_id = {
        'alimento_perro': 1,
        'alimento_gato': 2,
        'medicamento': 3
    }.get(data['type'])

    if tipo_producto_id is None:
        return jsonify({'error': 'Tipo de producto no válido.'}), 400

    # Crear el producto en Supabase
    response = supabase.table('Producto').insert({
        'nombre_producto': data['name'],
        'descripcion': data['description'],
        'valor': data['price'],
        'marca': data['brand'],
        'stock': data['quantity'],
        'tipo_producto_id': tipo_producto_id,
        'fecha_ingreso': data['fecha_ingreso'],
        'imagen_url': data['image_url']
    }).execute()

    # Verificar si la inserción fue exitosa
    if response.data:
        return jsonify({'message': 'Producto creado exitosamente.', 'data': response.data}), 201
    else:
        print('Error de Supabase:', response.error)
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
        return render_template('item.html', product=product)
    else:
        return "Producto no encontrado", 404

# Ruta para obtener imágenes de Cloudinary
@app.route('/api/cloudinary/images', methods=['GET'])
def get_cloudinary_images():
    url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/image/upload'
    response = requests.get(url, auth=HTTPBasicAuth(API_KEY, API_SECRET))

    if response.status_code == 200:
        images = [resource['secure_url'] for resource in response.json().get('resources', [])]
        return jsonify(images)
    else:
        return jsonify({'error': 'Error fetching images from Cloudinary'}), response.status_code

# Ruta para obtener la cantidad de productos en el carrito
@app.route('/cart_count', methods=['GET'])
def cart_count():
    cart_items = session.get('cart', [])
    return jsonify({'count': len(cart_items)}), 200

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    product_id = request.json.get('id')
    cart = session.get('cart', [])
    cart.append(product_id)  # Agregar el producto al carrito
    session['cart'] = cart  # Guardar el carrito en la sesión
    return jsonify({'message': 'Producto agregado al carrito.'}), 200

# Ruta para actualizar el stock
@app.route('/update_stock/<int:product_id>', methods=['POST'])
def update_stock(product_id):
    try:
        data = request.get_json()

        # Verificar si los datos tienen el campo 'quantity'
        if 'quantity' not in data:
            return jsonify({"success": False, "message": "Cantidad no proporcionada"}), 400
        
        quantity = data['quantity']

        # Verificar si el producto existe en la base de datos
        response = supabase.table('Producto').select('*').eq('id_producto', product_id).execute()

        if not response.data:
            return jsonify({"success": False, "message": "Producto no encontrado"}), 404

        # Obtener el producto y actualizar su stock
        producto = response.data[0]
        nuevo_stock = producto['stock'] - quantity

        if nuevo_stock < 0:
            return jsonify({"success": False, "message": "Stock insuficiente"}), 400

        # Actualizar el stock en la base de datos
        update_response = supabase.table('Producto').update({'stock': nuevo_stock}).eq('id_producto', product_id).execute()

        if update_response.data:
            return jsonify({"success": True, "message": f"Stock actualizado correctamente para el producto {product_id}"}), 200
        else:
            return jsonify({"success": False, "message": "Error al actualizar el stock"}), 500

    except Exception as e:
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500



if __name__ == '__main__':
    app.run(debug=True)  # Ejecuta la aplicación en modo depuración
