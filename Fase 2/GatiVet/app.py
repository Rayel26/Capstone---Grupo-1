from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_cors import CORS
from functools import wraps
import requests
from requests.auth import HTTPBasicAuth
from supabase import create_client
from datetime import datetime
import cloudinary
import cloudinary.uploader  # Asegúrate de importar esto

app = Flask(__name__)
CORS(app)
app.secret_key = 'supersecretkey'  # Clave para las sesiones

# Reemplaza con tus credenciales de Cloudinary
CLOUD_NAME = 'dqeideoyd'
API_KEY = '916694628586842'
API_SECRET = '4v36fweAMrokX64C8ciboL7o_SA'

# Configurar las credenciales de Cloudinary
cloudinary.config(
    cloud_name=CLOUD_NAME,  # Tu nombre de nube
    api_key=API_KEY,        # Tu API Key
    api_secret=API_SECRET   # Tu API Secret
)

# Datos simulados para usuarios
users = {
    "user@example.com": {"password": "userpass", "role": "user"},
    "vet@example.com": {"password": "vetpass", "role": "vet"},
    "admin@example.com": {"password": "adminpass", "role": "admin"}
}

##RAZAS

# Lista de razas de gatos
razas_gatos = [
    {"id": 1, "nombre": "Persa"},
    {"id": 2, "nombre": "Siames"},
    {"id": 3, "nombre": "Maine Coon"},
    {"id": 4, "nombre": "Bengala"},
    {"id": 5, "nombre": "Sphynx"},
    {"id": 6, "nombre": "Ragdoll"},
    {"id": 7, "nombre": "British Shorthair"},
    {"id": 8, "nombre": "Scottish Fold"},
    {"id": 9, "nombre": "Noruego de Bosque"},
    {"id": 10, "nombre": "Abisinio"},
    {"id": 11, "nombre": "Burmés"},
    {"id": 12, "nombre": "Himalayo"},
    {"id": 13, "nombre": "American Shorthair"},
    {"id": 14, "nombre": "Oriental Shorthair"},
    {"id": 15, "nombre": "Devon Rex"},
    {"id": 16, "nombre": "Cornish Rex"},
    {"id": 17, "nombre": "Savannah"},
    {"id": 18, "nombre": "Chartreux"},
    {"id": 19, "nombre": "Siamés de color punto"},
    {"id": 20, "nombre": "Bengalí"},
]

# Lista de razas de perros (solo nombres)
razas_perros = [
    {"id": 1, "nombre": "Labrador Retriever"},
    {"id": 2, "nombre": "German Shepherd"},
    {"id": 3, "nombre": "Golden Retriever"},
    {"id": 4, "nombre": "Bulldog"},
    {"id": 5, "nombre": "Beagle"},
    {"id": 6, "nombre": "Poodle"},
    {"id": 7, "nombre": "Rottweiler"},
    {"id": 8, "nombre": "Yorkshire Terrier"},
    {"id": 9, "nombre": "Boxer"},
    {"id": 10, "nombre": "Dachshund"},
    {"id": 11, "nombre": "Siberian Husky"},
    {"id": 12, "nombre": "Pembroke Welsh Corgi"},
    {"id": 13, "nombre": "Doberman Pinscher"},
    {"id": 14, "nombre": "Shih Tzu"},
    {"id": 15, "nombre": "Great Dane"},
    {"id": 16, "nombre": "Chihuahua"},
    {"id": 17, "nombre": "Australian Shepherd"},
    {"id": 18, "nombre": "Miniature Schnauzer"},
    {"id": 19, "nombre": "Border Collie"},
    {"id": 20, "nombre": "Cavalier King Charles Spaniel"},
    {"id": 21, "nombre": "Pug"},
    {"id": 22, "nombre": "Boston Terrier"},
    {"id": 23, "nombre": "Havanese"},
    {"id": 24, "nombre": "Akita"},
    {"id": 25, "nombre": "Maltese"},
    {"id": 26, "nombre": "Bichon Frise"},
    {"id": 27, "nombre": "Pekingese"},
    {"id": 28, "nombre": "Staffordshire Bull Terrier"},
    {"id": 29, "nombre": "Cocker Spaniel"},
    {"id": 30, "nombre": "Newfoundland"},
    {"id": 31, "nombre": "Saint Bernard"},
    {"id": 32, "nombre": "Weimaraner"},
    {"id": 33, "nombre": "Irish Setter"},
    {"id": 34, "nombre": "Scottish Terrier"},
    {"id": 35, "nombre": "Whippet"},
    {"id": 36, "nombre": "Basenji"},
    {"id": 37, "nombre": "Bull Terrier"},
    {"id": 38, "nombre": "American Pit Bull Terrier"},
    {"id": 39, "nombre": "Fox Terrier"},
    {"id": 40, "nombre": "Samoyed"},
    {"id": 41, "nombre": "Bernese Mountain Dog"},
    {"id": 42, "nombre": "Belgian Malinois"},
    {"id": 43, "nombre": "Chinese Shar-Pei"},
    {"id": 44, "nombre": "Borzoi"},
    {"id": 45, "nombre": "Alaskan Malamute"},
    {"id": 46, "nombre": "Old English Sheepdog"},
    {"id": 47, "nombre": "Lhasa Apso"},
    {"id": 48, "nombre": "Flat-Coated Retriever"},
    {"id": 49, "nombre": "English Springer Spaniel"},
    {"id": 50, "nombre": "Vizsla"},
]
##FIN RAZAS

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
        user_data = supabase.table('Usuario').select('id_usuario, correo, contraseña, tipousuarioid').eq('correo', email).execute()

        if user_data.data:
            user = user_data.data[0]  # Obtener el primer usuario encontrado

            # Verifica la contraseña (ajusta esto si usas un método de hash)
            if user['contraseña'] == password:  # Cambia esto por la verificación de hash si es necesario
                session['email'] = user['correo']
                session['id_usuario'] = user['id_usuario']  # Almacena el id_usuario en la sesión
                session['is_logged_in'] = True  # Marca que el usuario ha iniciado sesión
                
                # Determinar el rol basado en tipousuarioid
                if user['tipousuarioid'] == 1:
                    session['role'] = 'user'
                elif user['tipousuarioid'] == 2:
                    session['role'] = 'vet'
                elif user['tipousuarioid'] == 3:
                    session['role'] = 'admin'
                else:
                    flash('Rol de usuario desconocido', 'error')
                    return redirect(url_for('login'))

                # Redirigir a la página de perfil
                return redirect(url_for('home'))  # Cambiado a 'profile' para ir directamente a la vista de perfil
            else:
                flash('Usuario o contraseña incorrectos', 'error')
        else:
            flash('Usuario o contraseña incorrectos', 'error')

    return render_template('login.html')

# Ruta para la registrar veterinario
@app.route('/register_vet', methods=['POST'])
def register_vet():
    data = request.get_json()

    # Log para ver los datos recibidos
    print("Datos recibidos:", data)

    try:
        # Extraer los datos del JSON
        rut = data['id_usuario']
        nombre = data['nombre']
        appaterno = data['appaterno']
        apmaterno = data['apmaterno']
        correo = data['correo']
        contraseña = data['contraseña']
        celular = data['celular']
        especialidad = data['especialidad']  # Nuevo campo
        tipo_usuario = data['tipousuarioid']  # Permitir diferentes tipos de usuario

        # Validaciones adicionales (si es necesario)
        if not (rut and nombre and correo and contraseña and celular and especialidad):
            return jsonify({"error": "Faltan campos requeridos."}), 400

        # Obtener la fecha actual en el formato "YYYY-MM-DD"
        fecha_creacion = datetime.now().strftime("%Y-%m-%d")  # Formatear la fecha


        # Inserta los datos en Supabase
        response = supabase.table('Usuario').insert({
            'id_usuario': rut,
            'nombre': nombre,
            'appaterno': appaterno,
            'apmaterno': apmaterno,
            'correo': correo,
            'contraseña': contraseña,
            'celular': celular,
            'especialidad': especialidad,  # Agregar especialidad
            'tipousuarioid': tipo_usuario,  # Usar el tipo de usuario proporcionado
            'fecha_creacion': fecha_creacion  # Agregar la fecha de creación
        }).execute()

        # Log para ver la respuesta de Supabase
        print("Respuesta de Supabase:", response)

        # Verificar la respuesta de Supabase
        if response.data:  # Verificar si hay datos en la respuesta
            return jsonify({"message": "Veterinario creado exitosamente", "data": response.data}), 201
        else:
            return jsonify({"error": "Error al crear el veterinario", "details": response.error}), 400

    except KeyError as e:
        print(f"Error: Faltando campo en los datos recibidos: {e}")
        return jsonify({"error": f"Campo faltante: {str(e)}"}), 400
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")
        return jsonify({"error": "Error inesperado", "details": str(e)}), 500

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
    # Asumiendo que el usuario ha iniciado sesión y su id_usuario está almacenado en la sesión
    user_id = session.get('id_usuario')  # Cambia 'correo' por 'id_usuario'
    
    # Registro para depuración
    print(f"User ID from session: {user_id}")  # Verifica el valor de user_id

    # Comprobar si user_id es None
    if user_id is None:
        return "No se encontró el ID de usuario en la sesión."

    # Obtener los datos del usuario de Supabase, incluyendo la dirección y numeración
    user_data = supabase.table('Usuario').select('*, Domicilio(direccion, numeracion)').eq('id_usuario', user_id).execute()
    
    # Registro de la respuesta de Supabase
    print(f"User data from Supabase: {user_data.data}")  # Verifica lo que devuelve Supabase

    # Asumiendo que solo hay un usuario o que deseas el primero
    user = user_data.data[0] if user_data.data else {}

    # Comprobar si se obtuvo algún usuario
    if not user:
        return "No se encontraron datos para este usuario."

    # Asegúrate de incluir la dirección y numeración en el contexto
    domicilio_info = user.get('Domicilio', {})

    # Comprobar si 'Domicilio' es None
    if domicilio_info is None:
        domicilio_info = {}  # Asignar un diccionario vacío si 'Domicilio' es None

    user['direccion'] = domicilio_info.get('direccion', '')  # Obtener dirección
    user['numeracion'] = domicilio_info.get('numeracion', '')  # Obtener numeración


    return render_template('profile.html', user=user)

# Ruta para guardar perfil de usuario
@app.route('/guardar-perfil', methods=['POST'])
def update_profile():
    user_id = session.get('id_usuario')

    if not user_id:
        return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

    # Obtener los datos del formulario
    nombre = request.form.get('first-name')
    appaterno = request.form.get('last-name')
    apmaterno = request.form.get('maternal-last-name')
    celular = request.form.get('phone')
    correo = request.form.get('email')
    direccion = request.form.get('address')
    numeracion = request.form.get('numeration')

    print("Datos recibidos:", {
        'nombre': nombre,
        'appaterno': appaterno,
        'apmaterno': apmaterno,
        'celular': celular,
        'correo': correo,
        'direccion': direccion,
        'numeracion': numeracion
    })

    # Actualizar los datos en Supabase para el usuario
    response_usuario = supabase.table('Usuario').update({
        'nombre': nombre,
        'appaterno': appaterno,
        'apmaterno': apmaterno,
        'celular': celular,
        'correo': correo
    }).eq('id_usuario', user_id).execute()

    print("Respuesta de Supabase para usuario:", response_usuario)

    # Comprobar si la respuesta fue exitosa
    if not response_usuario.data:
        error_message = response_usuario.error or 'Error desconocido al actualizar el usuario'
        print("Error al actualizar los datos del usuario:", error_message)
        return jsonify({'success': False, 'message': error_message}), 500

    # Obtener el id_domicilio del usuario
    response_domicilio_id = supabase.table('Usuario').select('id_domicilio').eq('id_usuario', user_id).execute()

    # Si no existe un domicilio asociado, crear uno nuevo
    if not response_domicilio_id.data or response_domicilio_id.data[0].get('id_domicilio') is None:
        # Crear un nuevo registro en la tabla Domicilio
        response_new_domicilio = supabase.table('Domicilio').insert({
            'direccion': direccion,
            'numeracion': numeracion
        }).execute()

        # Obtener el ID del nuevo domicilio
        if response_new_domicilio.data:
            new_domicilio_id = response_new_domicilio.data[0]['id_domicilio']

            # Actualizar el campo id_domicilio en la tabla Usuario
            response_update_usuario = supabase.table('Usuario').update({
                'id_domicilio': new_domicilio_id
            }).eq('id_usuario', user_id).execute()

            if not response_update_usuario.data:
                error_message = response_update_usuario.error or 'Error al actualizar el id_domicilio en Usuario'
                print("Error:", error_message)
                return jsonify({'success': False, 'message': error_message}), 500

            return jsonify({'success': True, 'id_domicilio': new_domicilio_id, 'message': 'Domicilio creado y asociado al usuario'})

        else:
            error_message = response_new_domicilio.error or 'Error al crear el nuevo domicilio'
            print("Error al crear domicilio:", error_message)
            return jsonify({'success': False, 'message': error_message}), 500

    # Si existe un id_domicilio, actualizar la dirección y numeración
    domicilio_id = response_domicilio_id.data[0]['id_domicilio']

    response_update_domicilio = supabase.table('Domicilio').update({
        'direccion': direccion,
        'numeracion': numeracion
    }).eq('id_domicilio', domicilio_id).execute()

    print("Respuesta de Supabase para actualizar domicilio:", response_update_domicilio)

    if not response_update_domicilio.data:
        error_message = response_update_domicilio.error or 'Error desconocido al actualizar la dirección'
        print("Error al actualizar la dirección:", error_message)
        return jsonify({'success': False, 'message': error_message}), 500

    return jsonify({'success': True, 'id_domicilio': domicilio_id, 'message': 'Domicilio actualizado exitosamente'})

# Ruta para eliminar perfil de usuario
@app.route('/eliminar-cuenta', methods=['POST'])
@login_required
def delete_account():
    user_id = session.get('id_usuario')
    print(f'ID del usuario: {user_id}')  # Depuración

    if not user_id:
        return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

    try:
        # Eliminar el usuario de Supabase
        response = supabase.table('Usuario').delete().eq('id_usuario', user_id).execute()

        # Imprimir respuesta para depuración
        print('Response:', response)

        # Verificar si hay algún error en la respuesta
        if not response.data:
            return jsonify({'success': False, 'message': 'No se pudo eliminar la cuenta o la cuenta no existe'}), 500

        # Limpiar la sesión
        session.clear()  # Asegúrate de que la sesión se limpie antes de redirigir
        flash('Has cerrado sesión.', 'info')  # Mensaje de cierre de sesión
        
        # Redirigir a home.html después de eliminar la cuenta
        return redirect(url_for('home'))  # Cambiar a 'home' si tienes una función para manejar esa ruta

    except AttributeError as e:
        print(f'Error de atributo: {e}')
        return jsonify({'success': False, 'message': 'Error al procesar la solicitud'}), 500

    except Exception as e:
        print(f'Error desconocido: {e}')
        return jsonify({'success': False, 'message': 'Error al procesar la solicitud'}), 500

##Comentario

@app.route('/api/guardarComentario', methods=['POST'])
def guardar_comentario():
    try:
        # Verifica si el usuario está conectado (usa la sesión para almacenar el ID del usuario)
        if 'id_usuario' not in session:
            return jsonify({'error': 'Usuario no autenticado'}), 401
        
        # Obtener los datos del comentario desde la solicitud
        data = request.get_json()
        titulo = data.get('titulo')
        calificacion = data.get('calificacion')
        texto = data.get('texto')
        
        # Obtener el id_usuario desde la sesión
        usuario_id = session['id_usuario']
        
        # Generar la fecha actual (formato YYYY-MM-DD)
        fecha_actual = datetime.now().strftime('%Y-%m-%d')
        
        # Insertar los datos en la tabla 'Comentario'
        response = supabase.table('Comentario').insert({
            'titulo': titulo,
            'calificacion': calificacion,
            'texto': texto,
            'usuario_id': usuario_id,  # ID del usuario conectado
            'fecha': fecha_actual       # Fecha actual
        }).execute()

        if response.status_code == 201:
            return jsonify({'message': 'Comentario guardado exitosamente'}), 201
        else:
            return jsonify({'error': 'Error al guardar el comentario'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/add_pet', methods=['POST', 'GET'])
def add_pet():
    print("Petición recibida")

    try:
        if request.method == 'GET':
            return jsonify({'message': 'Esta es la ruta para agregar mascotas. Usa el método POST para agregar una.'}), 200

        nombre = request.form.get('nombre')
        especie = request.form.get('especie')
        raza = request.form.get('raza')
        fecha_nacimiento = request.form.get('fecha_nacimiento')
        edad = request.form.get('edad')
        
        id_usuario = session.get('id_usuario')
        print("ID de usuario:", id_usuario)

        if not id_usuario:
            return jsonify({'error': 'Usuario no autenticado'}), 401

        if not all([nombre, especie, raza, fecha_nacimiento, edad]):
            return jsonify({'error': 'Faltan datos en la solicitud'}), 400
        
        if 'foto' not in request.files:
            return jsonify({'error': 'Se requiere una foto'}), 400
        
        foto = request.files['foto']
        
        # Subir la foto a Cloudinary
        response_upload = cloudinary.uploader.upload(foto, public_id=f"{nombre}_{id_usuario}")
        
        # Obtener la URL de la foto subida
        foto_url = response_upload['secure_url']

        # Verificar que el usuario existe en la tabla Usuario
        usuario_existente = supabase.table('Usuario').select('id_usuario').eq('id_usuario', id_usuario).execute()
        if not usuario_existente.data or len(usuario_existente.data) == 0:
            return jsonify({'error': 'Usuario no encontrado'}), 404
    

        response = supabase.table('Mascota').insert([{
            'nombre': nombre,
            'especie': especie,
            'raza': raza,
            'fecha_nacimiento': fecha_nacimiento,
            'edad': edad,
            'id_usuario': id_usuario,
            'foto_url': foto_url
        }]).execute()

        if response.error:
            print("Error de Supabase:", response.error)
            return jsonify({'error': response.error}), 400



        print("Respuesta de Supabase:", response)
        if response.status_code != 201:
            return jsonify({'error': response.error}), 400

        return jsonify({'message': 'Mascota añadida con éxito', 'data': response.data}), 201

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500


##Editar mascota
@app.route('/edit_pet/<pet_id>', methods=['PUT'])
def edit_pet(pet_id):
    try:
        # Obtener datos del formulario
        nombre = request.form.get('nombre')
        especie = request.form.get('especie')
        raza = request.form.get('raza')
        fecha_nacimiento = request.form.get('fecha_nacimiento')
        edad = request.form.get('edad')

        # Validar que los datos no estén vacíos
        if not all([nombre, especie, raza, fecha_nacimiento, edad]):
            return jsonify({'error': 'Faltan datos en la solicitud'}), 400

        # Actualizar la mascota en Supabase
        response = supabase.table('Mascota').update({
            'nombre': nombre,
            'especie': especie,
            'raza': raza,
            'fecha_nacimiento': fecha_nacimiento,
            'edad': edad
        }).eq('id_mascota', pet_id).execute()

        print('Respuesta de Supabase:', response)  # Imprimir la respuesta completa

        # Verificar la respuesta
        if response.data is None or 'error' in response:  # Verifica si hay un error
            return jsonify({'error': 'Error al actualizar la mascota', 'details': response.error}), 400

        return jsonify({'message': 'Mascota actualizada con éxito', 'data': response.data}), 200

    except Exception as e:
        print(f'Error en edit_pet: {str(e)}')  # Imprimir el error en la consola del servidor
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

##Eliminar mascota

@app.route('/pets/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    # Elimina la mascota usando el ID
    response = supabase.table('Mascota').delete().eq('id_mascota', pet_id).execute()

    if response.data:
        return jsonify({"message": "Mascota eliminada con éxito."}), 200
    else:
        # Manejo de errores
        return jsonify({"message": "Error al eliminar la mascota.", "details": response}), 400


@app.route('/comentarios', methods=['GET'])
def obtener_comentarios():
    # Consulta para obtener comentarios y nombres de usuario
    comentarios = supabase.table('Comentario').select('id_comentario, texto, fecha, titulo, calificacion, Usuario(nombre, appaterno)').execute()

    # Verifica si la consulta fue exitosa
    if comentarios.data is None:  # Si no hay datos, probablemente hubo un error
        print("Error en la consulta:", comentarios)  # Imprime el objeto de respuesta completo
        return jsonify({"error": "Error al obtener comentarios."}), 500

    return jsonify(comentarios.data)  # Devuelve los datos de comentarios en formato JSON


# Ruta para el perfil de veterinario
@app.route('/profile_vet')
@login_required
@role_required('vet')
def profile_vet():
    # Asumiendo que el usuario ha iniciado sesión y su id_usuario está almacenado en la sesión
    user_id = session.get('id_usuario')  # Cambia 'correo' por 'id_usuario'

    # Obtener los datos del veterinario de Supabase
    vet_data = supabase.table('Usuario').select('*').eq('id_usuario', user_id).execute()
    
    # Asumiendo que solo hay un veterinario o que deseas el primero
    vet = vet_data.data[0] if vet_data.data else {}

    if not vet:
        return "No se encontraron datos para este veterinario."

    return render_template('profile_vet.html', vet=vet)

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

    # Obtener la fecha actual en el formato "YYYY-MM-DD"
    fecha_creacion = datetime.now().strftime("%Y-%m-%d")  # Cambia aquí el formato de fecha
    print("Fecha de creación:", fecha_creacion)  # Agregar un log para verificar la fecha

    # Inserta los datos en Supabase
    response = supabase.table('Usuario').insert({
        'id_usuario': rut,
        'nombre': nombre,
        'appaterno': appaterno,
        'apmaterno': apmaterno,
        'correo': correo,
        'contraseña': contraseña,
        'celular': celular,
        'tipousuarioid': 1, 
        'fecha_creacion': fecha_creacion  # Agregar la fecha de creación
    }).execute()

    # Log para ver la respuesta de Supabase
    print("Respuesta de Supabase:", response)

    if response.status_code == 201:  # Si la inserción fue exitosa
        return jsonify({"message": "Usuario creado exitosamente", "data": response.data}), 201
    else:
        return jsonify({"error": "Error al crear el usuario", "details": response.json()}), 400

##Editar Usuarios
@app.route('/api/update_user/<rut>', methods=['PUT'])
def update_user(rut):
    try:
        # Obtener los datos actualizados del request
        updated_data = request.json

        # Verifica que appaterno y apmaterno existan en los datos
        if 'appaterno' in updated_data and 'apmaterno' in updated_data:
            # Crear un diccionario para los datos que se van a actualizar
            data_to_update = {
                'appaterno': updated_data['appaterno'],
                'apmaterno': updated_data['apmaterno'],
                'nombre': updated_data.get('nombre'),
                'especialidad': updated_data.get('especialidad'),
                'celular': updated_data.get('telefono'),
                'correo': updated_data.get('correo'),
                # Agrega más campos según sea necesario
            }

            # Realizar la actualización en la tabla "Usuario" en Supabase
            response = supabase.table('Usuario').update(data_to_update).eq('id_usuario', rut).execute()

            # Imprimir la respuesta para verificar su estructura
            print("Respuesta de Supabase:", response)

            # Verifica si la respuesta tiene un error
            if hasattr(response, 'error') and response.error:
                return jsonify({"error": response.error.message}), 400
            
            return jsonify({"message": "Usuario actualizado correctamente"}), 200
        else:
            return jsonify({"error": "appaterno y apmaterno son requeridos"}), 400

    except Exception as e:
        print(f"Ocurrió un error al actualizar el usuario: {e}")
        return jsonify({"error": "Error al actualizar el usuario", "details": str(e)}), 500

##Eliminar Usuarios
@app.route('/api/delete_user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # Realiza la eliminación en la tabla "Usuario" en Supabase
        response = supabase.table('Usuario').delete().eq('id_usuario', user_id).execute()

        # Verifica si la respuesta contiene un error
        if hasattr(response, 'error') and response.error:
            return jsonify({"error": response.error.message}), 400
        
        # Si no hay error, retorna un mensaje de éxito
        return jsonify({"message": "Usuario eliminado correctamente"}), 200

    except Exception as e:
        print(f"Ocurrió un error al eliminar el usuario: {e}")
        return jsonify({"error": "Error al eliminar el usuario", "details": str(e)}), 500

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

##Obtener usuarios
@app.route('/api/get_users', methods=['GET'])
def get_users():
    try:
        response = supabase.table('Usuario').select('*').execute()
        users = response.data  # Esto obtiene los datos directamente

        if users:
            return jsonify(users), 200
        else:
            return jsonify({"message": "No se encontraron usuarios"}), 404

    except Exception as e:
        print(f"Ocurrió un error al obtener usuarios: {e}")
        return jsonify({"error": "Error al obtener usuarios", "details": str(e)}), 500

@app.route('/api/get_supabase_key')
def get_supabase_key():
    return jsonify({'supabase_key': SUPABASE_KEY})

@app.route('/get_pets', methods=['GET'])
def get_pets():
    try:
        # Obtener las mascotas de la tabla Mascota, incluyendo la URL de la foto
        response = supabase.table('Mascota').select('id_mascota, nombre, edad, especie, raza, fecha_nacimiento, foto_url').execute()
        
        # Verificar si la respuesta contiene un error
        if response.data is None:
            print("Error en la respuesta de Supabase:", response)
            return jsonify({'error': 'Error al obtener mascotas.'}), 500
        
        # Comprobar si hay datos
        if not response.data:
            print("No se encontraron mascotas.")
            return jsonify({'error': 'No se encontraron mascotas.'}), 404

        print("Mascotas obtenidas:", response.data)
        return jsonify(response.data), 200

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

##Razas

@app.route('/razas/<especie>', methods=['GET'])
def obtener_razas(especie):
    if especie == 'perro':
        return jsonify(razas_perros)
    elif especie == 'gato':
        return jsonify(razas_gatos)
    else:
        return jsonify({"mensaje": "Especie no válida"}), 400


if __name__ == '__main__':
    app.run(debug=True)  # Ejecuta la aplicación en modo depuración
