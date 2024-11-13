# Importaciones estándar de Python
from datetime import datetime, timezone
import os
import uuid
import smtplib
from email.mime.text import MIMEText

# Importaciones de terceros
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_cors import CORS, cross_origin
from functools import wraps
import requests
from requests.auth import HTTPBasicAuth
import cloudinary
import cloudinary.uploader
from flask_mail import Mail, Message
import pytz
import jwt
import httpx
import string
import random
from cloudinary.api import resources

# Importaciones específicas del proyecto
from supabase import create_client

app = Flask(__name__, template_folder='templates', static_folder='static')

CORS(app)
app.secret_key = 'supersecretkey'  # Clave para las sesiones

# Configuración de cliente HTTP con tiempo de espera
timeout = httpx.Timeout(30.0, read=100.0)
client_httpx = httpx.Client(timeout=timeout)


# Reemplaza con tus credenciales de Cloudinary
CLOUD_NAME = 'dqeideoyd'
API_KEY = '916694628586842'
API_SECRET = '4v36fweAMrokX64C8ciboL7o_SA'

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'gativet30@gmail.com'  # Cambia esto por tu correo
app.config['MAIL_PASSWORD'] = 'qpby svvg fkoj qcsm'  # Cambia esto por tu contraseña
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']
app.config['SECRET_KEY'] = '5d6a9c2c3f18af5d9e23c26be9d4c5a3'
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'valor_por_defecto_si_no_existe')

mail = Mail(app)

# Configurar las credenciales de Cloudinary
cloudinary.config(
    cloud_name=CLOUD_NAME,  # Tu nombre de nube
    api_key=API_KEY,        # Tu API Key
    api_secret=API_SECRET   # Tu API Secret
)

# Inicializa Supabase aquí
SUPABASE_URL = 'https://wlnahmbigsbckwbdwezo.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbmFobWJpZ3NiY2t3YmR3ZXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MDg5MzUsImV4cCI6MjA0NDA4NDkzNX0.CP-BaGcCf-fQD-lYrbH0_B-sKVOwUb9Xgy9-nzKjtLM'
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)  # Inicializar el cliente de Supabase

##RAZAS
# Lista de razas de gatos segun la Fifé
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
    {"id": 21, "nombre": "Exótico"},
    {"id": 22, "nombre": "Birmano"},
    {"id": 23, "nombre": "Ruso Azul"},
    {"id": 24, "nombre": "Bosque de Siberia"},
    {"id": 25, "nombre": "Somalí"},
    {"id": 26, "nombre": "Ocicat"},
    {"id": 27, "nombre": "Manx"},
    {"id": 28, "nombre": "Selkirk Rex"},
    {"id": 29, "nombre": "Bombay"},
    {"id": 30, "nombre": "Tonkinés"},
    {"id": 31, "nombre": "Van Turco"},
    {"id": 32, "nombre": "LaPerm"},
    {"id": 33, "nombre": "Singapura"},
    {"id": 34, "nombre": "Burmilá"},
    {"id": 35, "nombre": "Balinés"},
    {"id": 36, "nombre": "Oriental de pelo largo"},
    {"id": 37, "nombre": "Korat"},
    {"id": 38, "nombre": "Peterbald"},
    {"id": 39, "nombre": "Angora Turco"},
    {"id": 40, "nombre": "Cymric"},
    {"id": 41, "nombre": "Snowshoe"},
    {"id": 42, "nombre": "Mau Egipcio"},
    {"id": 43, "nombre": "Tonkinés"},
    {"id": 44, "nombre": "Javanés"},
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

@app.route('/')
def home():
    print("Estado de sesión:", session)
    return render_template('home.html', is_logged_in=session.get('is_logged_in'), role=session.get('role'))


# Ruta para la página de login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        try:
            # Corregimos la consulta para asegurarnos de que está bien estructurada
            user_data = supabase.table('Usuario').select('id_usuario, correo, contraseña, tipousuarioid, confirmacion').filter('correo', 'eq', email).execute()
            
            if user_data.data:
                user = user_data.data[0]  # Obtener el primer usuario encontrado

                # Verificar si el correo ha sido confirmado
                if not user.get('confirmacion'):
                    flash('Debe confirmar su correo electrónico para iniciar sesión', 'error')
                    return redirect(url_for('login'))
                
                # Verificar la contraseña (ajusta esto si usas un método de hash)
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
                    return redirect(url_for('home'))
                else:
                    flash('Usuario o contraseña incorrectos', 'error')
            else:
                flash('Usuario o contraseña incorrectos', 'error')
        
        except Exception as e:
            flash(f'Error al intentar iniciar sesión: {str(e)}', 'error')

    return render_template('login.html')


# Ruta para la registrar veterinario
@app.route('/register_vet', methods=['POST'])
def register_vet():
    data = request.get_json()

    # Log para ver los datos recibidos
    print("Datos recibidos:", data)

    try:
        # Extraer los datos del JSON
        rut = data.get('id_usuario')
        nombre = data.get('nombre')
        appaterno = data.get('appaterno')
        apmaterno = data.get('apmaterno')
        correo = data.get('correo')
        contraseña = data.get('contraseña')
        celular = data.get('celular')
        especialidad = data.get('especialidad')
        tipo_usuario = data.get('tipousuarioid')

        # Validaciones adicionales (si es necesario)
        if not (rut and nombre and correo and contraseña and celular and especialidad):
            return jsonify({"error": "Faltan campos requeridos."}), 400

        # Obtener la fecha actual en el formato "YYYY-MM-DD"
        fecha_creacion = datetime.now().strftime("%Y-%m-%d")

        # Inserta los datos en Supabase
        response = supabase.table('Usuario').insert({
            'id_usuario': rut,
            'nombre': nombre,
            'appaterno': appaterno,
            'apmaterno': apmaterno,
            'correo': correo,
            'contraseña': contraseña,
            'celular': celular,
            'especialidad': especialidad,
            'tipousuarioid': tipo_usuario,
            'fecha_creacion': fecha_creacion
        }).execute()

        # Log para ver la respuesta completa de Supabase
        print("Respuesta completa de Supabase:", response)

        # Verificar si la respuesta de Supabase contiene datos
        if response.data:
            return jsonify({"message": "Veterinario creado exitosamente", "data": response.data}), 201
        else:
            print(f"Error al obtener respuesta válida de Supabase: {response}")
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
    user_id = session.get('id_usuario') 
    
    # Registro para depuración
    print(f"User ID from session: {user_id}")  # Verifica el valor de user_id

    # Comprobar si user_id es None
    if user_id is None:
        return "No se encontró el ID de usuario en la sesión."

    # Obtener los datos del usuario de Supabase, incluyendo la dirección y numeración
    user_data = supabase.table('Usuario').select('*, Domicilio(direccion, numeracion)').filter('id_usuario', 'eq', user_id).execute()
    
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
    }).filter('id_usuario', 'eq', user_id).execute()

    print("Respuesta de Supabase para usuario:", response_usuario)

    # Comprobar si la respuesta fue exitosa
    if not response_usuario.data:
        error_message = response_usuario.error or 'Error desconocido al actualizar el usuario'
        print("Error al actualizar los datos del usuario:", error_message)
        return jsonify({'success': False, 'message': error_message}), 500

    # Obtener el id_domicilio del usuario
    response_domicilio_id = supabase.table('Usuario').select('id_domicilio').filter('id_usuario', 'eq', user_id).execute()

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
            }).filter('id_usuario', 'eq', user_id).execute()

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
    }).filter('id_domicilio', 'eq', domicilio_id).execute()

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
        response = supabase.table('Usuario').delete().filter('id_usuario', 'eq', user_id).execute()

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

# Ruta para crear mascotas usuario
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
        
        # Imprimir información del archivo de imagen
        print(f"Nombre del archivo: {foto.filename}, Tipo de archivo: {foto.content_type}")

        # Verificar que el usuario existe en la tabla Usuario
        usuario_existente = supabase.table('Usuario').select('id_usuario').filter('id_usuario', 'eq', id_usuario).execute()
        if not usuario_existente.data or len(usuario_existente.data) == 0:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        # Insertar la mascota primero para obtener su ID
        response = supabase.table('Mascota').insert([{
            'nombre': nombre,
            'especie': especie,
            'raza': raza,
            'fecha_nacimiento': fecha_nacimiento,
            'edad': edad,
            'id_usuario': id_usuario,
            'Fallecimiento': True
        }]).execute()

        # Verificar si hubo un error en la respuesta de Supabase
        if not response.data:  # Si no hay datos, hubo un error
            print("Error de Supabase:", response)  # Mostrar datos de la respuesta
            return jsonify({'error': 'Error al agregar la mascota', 'details': response}), 400

        # Obtener el ID de la mascota recién creada
        id_mascota = response.data[0]['id_mascota']  # Asegúrate de que esto coincide con el nombre de la columna del ID

        # Subir la foto a Cloudinary usando el id_mascota
        folder_name = 'Foto mascotas'  # Nombre de la carpeta
        try:
            response_upload = cloudinary.uploader.upload(foto, public_id=f'mascota_{id_mascota}', folder=folder_name)
            # Obtener la URL de la foto subida
            foto_url = response_upload['secure_url']
        except Exception as e:
            print("Error al subir la imagen a Cloudinary:", str(e))
            return jsonify({'error': 'Error al subir la imagen a Cloudinary', 'details': str(e)}), 500

        # Actualizar la URL de la foto en Supabase
        update_response = supabase.table('Mascota').update({'foto_url': foto_url}).filter('id_mascota', 'eq', id_mascota).execute()

        # Verificar si hubo un error en la respuesta de actualización
        if not update_response.data:  # Si no hay datos, hubo un error
            print("Error al actualizar la URL de la foto:", update_response)  # Mostrar datos de la respuesta
            return jsonify({'error': 'Error al actualizar la URL de la foto', 'details': update_response}), 400

        return jsonify({'message': 'Mascota añadida con éxito', 'data': response.data}), 201

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Ruta para obtener mascotas
@app.route('/get_pets', methods=['GET'])
@login_required
def get_pets():
    try:
        # Obtener el id_usuario de la sesión
        user_id = session.get('id_usuario')
        
        # Comprobar si user_id es None
        if user_id is None:
            return jsonify({'error': 'No se encontró el ID de usuario en la sesión.'}), 403

        # Obtener las mascotas de la tabla Mascota para el usuario específico
        response = supabase.table('Mascota') \
            .select('id_mascota, nombre, edad, especie, raza, fecha_nacimiento, foto_url, Fallecimiento, causa_fallecimiento') \
            .filter('id_usuario', 'eq', user_id) \
            .execute()
        
        # Verificar si la respuesta contiene un error
        if response.data is None:
            print("Error en la respuesta de Supabase:", response)
            return jsonify({'error': 'Error al obtener mascotas.'}), 500
        
        # Comprobar si hay datos
        if not response.data:
            print("No se encontraron mascotas para el usuario.")
            return jsonify({'error': 'No se encontraron mascotas.'}), 404

        print("Mascotas obtenidas:", response.data)
        return jsonify(response.data), 200

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Obtener vacunas
@app.route('/get_pet_vaccines/<int:id_mascota>', methods=['GET'])
@login_required
def get_pet_vaccines(id_mascota):
    try:
        # Selecciona solo los campos específicos de la base de datos
        response = supabase.table('Vacuna') \
            .select('fecha, nombre_vacuna, prox_fecha, nombre_veterinario') \
            .filter('id_mascota', 'eq', id_mascota) \
            .execute()
        
        print("Respuesta de Supabase:", response)

        if response.data is None:
            return jsonify({'error': 'Error al obtener vacunas.'}), 500

        # Enviar solo los datos específicos al cliente
        return jsonify(response.data), 200

    except Exception as e:
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

## Obtener desparacitaciones
@app.route('/get_pet_deworming/<int:id_mascota>', methods=['GET'])
@login_required
def get_pet_deworming(id_mascota):
    try:
        response = supabase.table('Desparacitacion') \
            .select('fecha, nombre_desparacitador, dosis, nombre_veterinario, prox_fecha') \
            .filter('id_mascota', 'eq', id_mascota) \
            .execute()
        
        print("Respuesta de Supabase:", response)

        if response.data is None:
            return jsonify({'error': 'Error al obtener desparasitaciones.'}), 500

        return jsonify(response.data), 200

    except Exception as e:
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Obtener citas
@app.route('/get_pet_checkups/<int:id_mascota>', methods=['GET'])
@login_required
def get_pet_checkups(id_mascota):
    try:
        # Consulta con join para traer la columna descripcion de TipoCita
        response = supabase.table('Cita') \
            .select('id_cita, descripcion, prox_fecha, fecha, id_medico(nombre), TipoCita(descripcion)') \
            .filter('id_mascota', 'eq', id_mascota) \
            .execute()

        print("Respuesta de Supabase:", response)
        
        if response.data is None:
            return jsonify({'error': 'Error al obtener controles.'}), 500

        return jsonify(response.data), 200

    except Exception as e:
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Ruta para obtener mascotas por ID de usuario
@app.route('/get_pets_by_id', methods=['GET'])
def get_pets_by_id():
    id_usuario = request.args.get('id_usuario')

    try:
        if not id_usuario:
            return jsonify({'error': 'ID de usuario no proporcionado.'}), 400

        # Obtener las mascotas asociadas al id_usuario
        pets_response = supabase.table('Mascota').select(
            'id_mascota, nombre, edad, especie, raza, fecha_nacimiento, foto_url, Fallecimiento, causa_fallecimiento, sexo, num_microchip, tamaño, color_pelaje'
        ).filter('id_usuario', 'eq', id_usuario).execute()

        # Realizar la consulta para obtener datos del usuario
        user_response = supabase.table('Usuario').select(
            'nombre, appaterno, apmaterno, id_usuario, id_domicilio, celular, correo'
        ).filter('id_usuario', 'eq', id_usuario).execute()

        # Verificar si hay datos del usuario
        if user_response.data:
            user_data = user_response.data[0]
            id_domicilio = user_data.get('id_domicilio')  # Usamos get() para evitar un error si no existe el campo
            
            # Asignar el rut
            user_data['rut'] = id_usuario  # Asignamos id_usuario como rut
            
            # Realizar la consulta para obtener la dirección del domicilio si existe un id_domicilio válido
            if id_domicilio:
                domicilio_response = supabase.table('Domicilio').select('direccion').filter('id_domicilio', 'eq', id_domicilio).execute()
                user_data['direccion'] = domicilio_response.data[0]['direccion'] if domicilio_response.data else "N/A"
            else:
                user_data['direccion'] = "N/A"
        else:
            user_data = {
                'rut': id_usuario, 'direccion': "N/A", 'nombre': "N/A", 
                'celular': "N/A", 'correo': "N/A", 'id_usuario': "N/A"
            }  # Datos por defecto si no se encuentra el usuario

        # Verificar si hay mascotas asociadas
        if pets_response.data is None:
            return jsonify({'error': 'Error al obtener mascotas.'}), 500

        # Retornar los datos de usuario y mascotas
        return jsonify({'pets': pets_response.data, 'user': user_data}), 200

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

#Ruta para obtener Razas mascota
@app.route('/razas/<especie>', methods=['GET'])
def obtener_razas(especie):
    if especie == 'perro':
        return jsonify(razas_perros)
    elif especie == 'gato':
        return jsonify(razas_gatos)
    else:
        return jsonify({"mensaje": "Especie no válida"}), 400

# Editar imagen mascota
@app.route('/upload-image', methods=['POST'])
def upload_image():
    # Verifica si se envió un archivo
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'No se envió ninguna imagen'}), 400

    file = request.files['image']
    
    # Verifica si se envió el id_mascota
    id_mascota = request.form.get('id_mascota')  # Asegúrate de enviar el id_mascota desde el frontend
    if not id_mascota:
        return jsonify({'success': False, 'message': 'ID de mascota no proporcionado'}), 400

    try:
        # Define un public_id basado en el id_mascota
        public_id = f'mascota_{id_mascota}'

        # Especifica la carpeta en la que deseas guardar la imagen
        folder_name = 'Foto mascotas'  # Cambia esto por el nombre de tu carpeta

        # Subir imagen a Cloudinary con el mismo public_id y en la carpeta especificada
        upload_result = cloudinary.uploader.upload(file, public_id=public_id, folder=folder_name)
        image_url = upload_result.get('secure_url')

        if not image_url:
            return jsonify({'success': False, 'message': 'Error al subir la imagen a Cloudinary'}), 500

        # Actualizar la URL de la imagen en Supabase para la mascota correspondiente
        response = supabase.table('Mascota').update({'foto_url': image_url}).filter('id_mascota', 'eq', int(id_mascota)).execute()

        # Verificar si la actualización fue exitosa
        if response.status_code == 200:  # Este método puede variar
            return jsonify({'success': True, 'message': 'Imagen subida y campo foto_url actualizado'}), 200
        else:
            # Acceder al mensaje de error de la respuesta
            error_message = response.error or 'Error desconocido'  # Utilizamos 'or' para proporcionar un mensaje predeterminado
            return jsonify({'success': False, 'message': f'Error al actualizar la URL de la imagen en la base de datos: {error_message}'}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Solicitud para editar mascota
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
        }).filter('id_mascota', 'eq', pet_id).execute()

        print('Respuesta de Supabase:', response)  # Imprimir la respuesta completa

        # Verificar la respuesta
        if response.data is None or 'error' in response:  # Verifica si hay un error
            return jsonify({'error': 'Error al actualizar la mascota', 'details': response.error}), 400

        return jsonify({'message': 'Mascota actualizada con éxito', 'data': response.data}), 200

    except Exception as e:
        print(f'Error en edit_pet: {str(e)}')  # Imprimir el error en la consola del servidor
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Eliminar mascota
@app.route('/pets/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    try:
        # Elimina la mascota usando el ID
        response = supabase.table('Mascota').delete().filter('id_mascota', 'eq', pet_id).execute()

        if response.data:
            return jsonify({"message": "Mascota eliminada con éxito."}), 200
        else:
            # Manejo de errores
            return jsonify({"message": "Error al eliminar la mascota.", "details": response}), 400
    except Exception as e:
        return jsonify({"message": "Error al procesar la solicitud", "details": str(e)}), 500


#Ruta para comentarios
@app.route('/comentarios', methods=['GET'])
def obtener_comentarios():
    # Consulta para obtener comentarios y nombres de usuario
    comentarios = supabase.table('Comentario').select('id_comentario, texto, fecha, titulo, calificacion, Usuario(nombre, appaterno)').execute()

    # Verifica si la consulta fue exitosa
    if comentarios.data is None:  # Si no hay datos, probablemente hubo un error
        print("Error en la consulta:", comentarios)  # Imprime el objeto de respuesta completo
        return jsonify({"error": "Error al obtener comentarios."}), 500

    return jsonify(comentarios.data)  # Devuelve los datos de comentarios en formato JSON

#Ruta para guardar comentarios
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

# Ruta para el perfil de veterinario
@app.route('/profile_vet', methods=['GET'])
@login_required
@role_required('vet')  # Asegurarse de que este decorador existe para verificar el rol del usuario
def profile_vet():
    # Asumiendo que el veterinario ha iniciado sesión y su id_usuario está almacenado en la sesión
    user_id = str(session.get('id_usuario'))
    print(f"user_id: {user_id}")  # Asegúrate de que el valor sea lo que esperas

    # Comprobar si user_id es None
    if user_id is None:
        return "No se encontró el ID de usuario en la sesión."

    vet_data = supabase.table('Usuario').select('*').filter('id_usuario', 'eq', user_id).execute()

    # Verificar si se encontraron datos del veterinario
    if not vet_data.data:
        return "No se encontraron datos para este veterinario."

    vet = vet_data.data[0]

    # Obtener el id_domicilio desde la tabla Usuario
    id_domicilio = vet.get('id_domicilio')

    # Verificar si existe id_domicilio
    if id_domicilio:
        # Obtener los datos de domicilio usando id_domicilio desde la tabla Domicilio
        domicilio_data = supabase.table('Domicilio').select('*').filter('id_domicilio', 'eq', id_domicilio).execute()

        # Verificar si se encontraron datos de domicilio
        if domicilio_data.data:
            domicilio = domicilio_data.data[0]
            vet['domicilio'] = domicilio.get('direccion', 'Sin dirección')
            vet['numeracion'] = domicilio.get('numeracion', 'Sin numeración')
        else:
            vet['domicilio'] = 'Sin dirección'
            vet['numeracion'] = 'Sin numeración'
    else:
        vet['domicilio'] = 'Sin dirección'
        vet['numeracion'] = 'Sin numeración'

    # Renderizar la plantilla con los datos del veterinario y su domicilio
    return render_template('profile_vet.html', vet=vet)


# Ruta guardar datos veterinarios
@app.route('/save_vet_data', methods=['POST']) 
@login_required
@role_required('vet')  # Verifica el rol del usuario
def save_vet_data():
    try:
        data = request.get_json()  # Obtener los datos enviados desde el frontend

        # Extraer los datos
        user_id = data.get('rut')
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        especialidad = data.get('especialidad')
        telefono = data.get('telefono')
        correo = data.get('correo')
        direccion = data.get('domicilio')  # Captura de la dirección
        numeracion = data.get('numeracion')  # Captura de la numeración

        # Verificar si el usuario ya existe
        usuario_response = supabase.table('Usuario').select('id_domicilio').filter('id_usuario', 'eq', user_id).execute()

        if not usuario_response.data:
            return jsonify({'success': False, 'message': 'El usuario no existe'}), 404

        # Obtener el id_domicilio del usuario
        response_domicilio_id = usuario_response

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
                }).filter('id_usuario', 'eq', user_id).execute()

                if not response_update_usuario.data:
                    error_message = response_update_usuario.error or 'Error al actualizar el id_domicilio en Usuario'
                    print("Error:", error_message)
                    return jsonify({'success': False, 'message': error_message}), 500

                return jsonify({'success': True, 'id_domicilio': new_domicilio_id, 'message': 'Domicilio creado y asociado al usuario'}), 200

            else:
                error_message = response_new_domicilio.error or 'Error al crear el nuevo domicilio'
                print("Error al crear domicilio:", error_message)
                return jsonify({'success': False, 'message': error_message}), 500

        # Si existe un id_domicilio, actualizar la dirección y numeración
        domicilio_id = response_domicilio_id.data[0]['id_domicilio']

        response_update_domicilio = supabase.table('Domicilio').update({
            'direccion': direccion,
            'numeracion': numeracion
        }).filter('id_domicilio', 'eq', domicilio_id).execute()

        if not response_update_domicilio.data:
            error_message = response_update_domicilio.error or 'Error desconocido al actualizar la dirección'
            print("Error al actualizar la dirección:", error_message)
            return jsonify({'success': False, 'message': error_message}), 500

        return jsonify({'success': True, 'id_domicilio': domicilio_id, 'message': 'Domicilio actualizado exitosamente'}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({'success': False, 'message': str(e)}), 500

#Ruta para el panel de administrador
@app.route('/admin_dashboard')
@login_required
@role_required('admin')
def admin_dashboard():
    return render_template('admin_dashboard.html')

#Otras rutas de la aplicación
@app.route('/products')
def products():
    return render_template('products.html', show_search=True)

@app.route('/help')
def help():
    return render_template('help.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        nombre = request.form['nombre']
        correo = request.form['correo']
        mensaje = request.form['mensaje']

        # Establece el remitente como tu correo y el reply-to como el correo del usuario
        msg = Message('Nuevo mensaje de contacto',
                    sender='gativet30@gmail.com',  # Tu correo
                    reply_to=correo,  # Usar el correo del usuario para respuestas
                    recipients=['gativet30@gmail.com'])  # Tu correo
        msg.body = f'Nombre: {nombre}\nCorreo: {correo}\nMensaje: {mensaje}'

        try:
            mail.send(msg)
            flash('Mensaje enviado con éxito!', 'success')  # Mensaje de éxito
        except Exception as e:
            print(f'Error al enviar el correo: {e}')  # Imprimir el error en la consola
            flash('Error al enviar el mensaje. Por favor, inténtelo más tarde.', 'error')

        return redirect(url_for('contact'))  # Redirigir después de enviar

    return render_template('contact.html')

@app.route('/schedule')
def schedule():
    return render_template('schedule.html')

# Ruta para la página de carrito
@app.route('/cart')
@login_required
def cart():
    # Obtener el ID del usuario de la sesión
    user_id = session.get('id_usuario')

    # Consultar los datos del usuario desde la base de datos Supabase
    usuario = supabase.table('Usuario').select('nombre', 'appaterno', 'correo', 'celular').filter('id_usuario', 'eq', user_id).execute()

    # Asegúrate de que el usuario existe en la base de datos
    if usuario.data:
        usuario_data = usuario.data[0]  # Obtén el primer resultado de la consulta
    else:
        usuario_data = None

    # Pasar los datos a la plantilla
    return render_template('cart.html', usuario_data=usuario_data)

# Ruta de compra
@app.route('/save_sale', methods=['POST'])
def save_sale():
    if not session.get('is_logged_in'):
        return jsonify({"success": False, "message": "Usuario no autenticado."}), 401

    user_id = session['id_usuario']
    cart = request.json.get('cart', [])
    
    # Calcular el total y obtener la fecha actual en zona horaria de Santiago
    total = sum(item['cantidad'] * item['precio'] for item in cart)
    local_tz = pytz.timezone('America/Santiago')
    fecha_actual = datetime.now(local_tz)
    fecha_formateada = fecha_actual.strftime("%d-%m-%Y")
    hora_formateada = fecha_actual.strftime("%H:%M")

    transaction_data = {
        "fecha": fecha_actual.isoformat(),
        "total": str(total),
        "id_usuario": user_id
    }

    # Insertar en la tabla Transaccion
    response = supabase.table("Transaccion").insert(transaction_data).execute()
    
    if not response.data or 'id_venta' not in response.data[0]:
        return jsonify({"success": False, "message": "Error al crear la transacción."}), 500
    
    id_venta = response.data[0]['id_venta']

    # Insertar cada producto del carrito en DetalleVenta
    for item in cart:
        detalle_data = {
            "nombre_producto": item['nombre_producto'],
            "cantidad": item['cantidad'],
            "precio": item['precio'],
            "id_producto": item['id_producto'],
            "id_venta": id_venta,
            "id_usuario": user_id
        }
        
        detalle_response = supabase.table("DetalleVenta").insert(detalle_data).execute()
        
        if not detalle_response.data:
            return jsonify({"success": False, "message": "Error al guardar el detalle de la venta."}), 500

    # Recuperar el correo del usuario desde la base de datos
    usuario_response = supabase.table("Usuario").select("correo").filter("id_usuario", "eq", user_id).single().execute()
    if not usuario_response.data:
        return jsonify({"success": False, "message": "No se pudo recuperar el correo del usuario."}), 500
    
    correo_usuario = usuario_response.data['correo']

    # Función para formato de precio en CLP
    def formato_clp(valor):
        return f"${valor:,.0f}".replace(",", ".")

    # Crear el contenido HTML del correo con el resumen de la compra
    productos_detalle_html = "".join([ 
        f"""
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">{item['nombre_producto']}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">{item['cantidad']}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{formato_clp(item['precio'])}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">{formato_clp(item['cantidad'] * item['precio'])}</td>
        </tr>
        """
        for item in cart
    ])
    
    mensaje_correo_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <img src="https://res.cloudinary.com/dqeideoyd/image/upload/v1728506204/shrotm1w6az7voy7fgfg.png" alt="Gativet Logo" style="width: 150px; height: auto;">
            <div style="text-align: left;">
                <h2 style="margin: 0; color: #4CAF50;">Gracias por comprar en Gativet!</h2>
                <p style="margin: 0;">Aquí tienes tu resumen de compra:</p>
            </div>
        </div>

        <p><strong>Número de transacción:</strong> {id_venta}</p>
        <p><strong>Fecha:</strong> {fecha_formateada}<br><strong>Hora:</strong> {hora_formateada}</p>

        <h3 style="color: #333;">Productos</h3>
        <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Producto</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Precio Unidad</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {productos_detalle_html}
            </tbody>
        </table>

        <p style="font-size: 1.2em; margin-top: 20px;">
            <strong>Total:</strong> {formato_clp(total)}
        </p>

        <p>Esperamos verte pronto de nuevo en Gativet!</p>
    </body>
    </html>
    """

    # Enviar el correo con el resumen de compra
    try:
        msg = Message("Resumen de tu compra en Gativet",
                    sender=app.config['MAIL_USERNAME'],
                    recipients=[correo_usuario])
        msg.html = mensaje_correo_html  # Configurar el contenido HTML
        mail.send(msg)
        print("Correo de resumen de compra enviado exitosamente.")
    except Exception as e:
        print(f"Error al enviar el correo de resumen de compra: {e}")
        return jsonify({"success": True, "message": "Venta guardada, pero no se pudo enviar el correo de resumen."}), 500

    return jsonify({"success": True, "message": "Venta guardada exitosamente y correo enviado."}), 200

#Ruta registration
@app.route('/registration')
def registration():
    return render_template('registration.html')

# Ruta Registro
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    rut = data.get('id_usuario')
    nombre = data.get('nombre')
    appaterno = data.get('appaterno')
    apmaterno = data.get('apmaterno')
    correo = data.get('correo')
    contraseña = data.get('contraseña')
    celular = data.get('celular')
    fecha_creacion = datetime.now().strftime("%Y-%m-%d")

    # Verificación de datos recibidos
    print(f"Datos recibidos: {data}")

    # Verificar si el RUT o el correo ya existen
    existing_user = supabase.table('Usuario').select('id_usuario', 'correo').filter('id_usuario', 'eq', rut).filter('correo', 'eq', correo).execute()

    if existing_user.data:
        return jsonify({"error": "Ya existe un usuario con este RUT o correo."}), 400

    # Insertar el usuario en la base de datos
    response = supabase.table('Usuario').insert({
        'id_usuario': rut,
        'nombre': nombre,
        'appaterno': appaterno,
        'apmaterno': apmaterno,
        'correo': correo,
        'contraseña': contraseña,
        'celular': celular,
        'tipousuarioid': 1,
        'fecha_creacion': fecha_creacion,
        'confirmacion': False
    }).execute()

    # Verificar si la inserción fue exitosa
    if response.data:
        # Enviar correo de prueba
        try:
            confirmation_link = f"http://localhost:5000/confirm/{rut}"
            msg = Message("Confirma tu correo",
                        sender=app.config['MAIL_USERNAME'],
                        recipients=[correo])
            msg.html = f"""
                <p>Hola {nombre} {appaterno} {apmaterno}, de RUT {rut}:</p>
                <p>Este es un correo para verificar la configuración de Flask-Mail al registrarse.</p>
                <p>Por favor, confirma tu correo haciendo clic en el siguiente enlace: 
                <a href="{confirmation_link}">Confirma tu correo aquí</a>
                </p>
            """
            mail.send(msg)
            print("Correo de prueba enviado exitosamente.")
            
            return jsonify({"message": "Usuario creado exitosamente y correo de prueba enviado"}), 201
        except Exception as e:
            print(f"Error al enviar el correo de prueba: {e}")
            return jsonify({"error": "Usuario creado, pero no se pudo enviar el correo de prueba", "details": str(e)}), 500
    else:
        return jsonify({"error": "Error al crear el usuario", "details": response.error}), 400


@app.route('/confirm/<string:rut>', methods=['GET'])
def confirm_user(rut):
    # Actualizar el estado de confirmación en la base de datos
    response = supabase.table('Usuario').update({'confirmacion': True}).filter('id_usuario', 'eq', rut).execute()

    if response.data:
        # Agregar mensaje flash para la confirmación exitosa
        flash("Usuario confirmado con éxito, ya puedes iniciar sesión.", "success")
    else:
        flash("Error al confirmar el correo.", "error")

    # Redirigir a la página de inicio de sesión
    return redirect(url_for('login'))

#Editar Usuarios
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
            response = supabase.table('Usuario').update(data_to_update).filter('id_usuario', 'eq', rut).execute()

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

#Eliminar Usuarios
@app.route('/api/delete_user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # Realiza la eliminación en la tabla "Usuario" en Supabase
        response = supabase.table('Usuario').delete().filter('id_usuario', 'eq', user_id).execute()

        # Verifica si la respuesta contiene un error
        if hasattr(response, 'error') and response.error:
            return jsonify({"error": response.error.message}), 400
        
        # Si no hay error, retorna un mensaje de éxito
        return jsonify({"message": "Usuario eliminado correctamente"}), 200

    except Exception as e:
        print(f"Ocurrió un error al eliminar el usuario: {e}")
        return jsonify({"error": "Error al eliminar el usuario", "details": str(e)}), 500

# Ruta para la página de donaciones
@app.route('/donation')
def donation():
    # Consultar los casos y fundaciones desde la base de datos Supabase
    casos = supabase.table('CasoDonacion').select('id_caso, nombre_caso').execute()
    fundaciones = supabase.table('FundacionDonacion').select('id_fundacion, nombre_fundacion').execute()

    # Asegurarse de que accedes a los datos correctamente
    casos_data = casos.data  # Accede a los datos con el atributo .data
    fundaciones_data = fundaciones.data  # Accede a los datos con el atributo .data

    # Suponiendo que tienes el ID del usuario en la sesión
    user_id = session.get('id_usuario')  # O reemplaza esto con el método adecuado para obtener el ID del usuario

    if user_id:
        # Consultar los datos del usuario desde la base de datos Supabase con .filter
        user = supabase.table('Usuario').select('nombre', 'appaterno', 'correo', 'celular').filter('id_usuario', 'eq', user_id).execute()

        # Asegúrate de que el usuario existe en la base de datos
        if user.data:
            user_data = user.data[0]  # Obtén el primer resultado de la consulta
        else:
            user_data = None
    else:
        user_data = None

    # Pasar los datos a la plantilla
    return render_template('donation.html', casos=casos_data, fundaciones=fundaciones_data, user_data=user_data)


# Ruta para la guardar donaciones
@app.route('/save_donation', methods=['POST'])
def save_donation():
    # Obtener los datos del formulario
    nombre_donacion_id = request.form.get('nameOption')  # Aquí se obtiene el ID seleccionado
    total = request.form.get('donationOption')

    # Obtener el id_usuario desde la sesión
    id_usuario = session.get('id_usuario')  # Obtener el id_usuario desde la sesión

    # Verifica si los datos del formulario y el id_usuario están vacíos
    if not nombre_donacion_id or not total or not id_usuario:
        return "Faltan datos necesarios", 400

    # Asegúrate de que 'total' sea un número
    try:
        total = int(total)
    except ValueError:
        return "El total debe ser un número válido", 400

    # Calcular la fecha actual en la zona horaria de Santiago
    local_tz = pytz.timezone('America/Santiago')
    fecha_actual = datetime.now(local_tz)
    
    # Convertir la fecha a formato ISO para timestamptz
    fecha_iso = fecha_actual.isoformat()  # Esta es la representación ISO 8601

    # Verificar si el ID corresponde a un caso o a una fundación
    caso = supabase.table('CasoDonacion').select('nombre_caso').filter('id_caso', 'eq', nombre_donacion_id).execute()
    if caso.data:
        nombre_donacion = caso.data[0]['nombre_caso']
    else:
        # Si no es un caso, entonces debe ser una fundación
        fundacion = supabase.table('FundacionDonacion').select('nombre_fundacion').filter('id_fundacion', 'eq', nombre_donacion_id).execute()
        if fundacion.data:
            nombre_donacion = fundacion.data[0]['nombre_fundacion']
        else:
            return "Caso o fundación no encontrados", 400

    # Insertar los datos en Supabase
    response = supabase.table('Donacion').insert({
        'fecha': fecha_iso,
        'total': total,
        'id_usuario': id_usuario,
        'nombre_donacion': nombre_donacion
    }).execute()

    # Verificación si la inserción fue exitosa
    if response.data is None:
        return f"Error al guardar la donación: {response.error}", 500

    # Recuperar el correo del usuario
    usuario_response = supabase.table("Usuario").select("correo").filter("id_usuario", "eq", id_usuario).single().execute()
    if not usuario_response.data:
        return jsonify({"success": False, "message": "No se pudo recuperar el correo del usuario."}), 500

    correo_usuario = usuario_response.data['correo']

    # Función para formato de precio en CLP
    def formato_clp(valor):
        return f"${valor:,.0f}".replace(",", ".")

    # Crear el contenido del correo
    mensaje_correo_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <img src="https://res.cloudinary.com/dqeideoyd/image/upload/v1728506204/shrotm1w6az7voy7fgfg.png" alt="Logo" style="width: 150px; height: auto;">
            <div style="text-align: left;">
                <h2 style="margin: 0; color: #4CAF50;">¡Gracias por tu donación!</h2>
                <p style="margin: 0;">Agradecemos tu apoyo a {nombre_donacion}.</p>
            </div>
        </div>

        <p><strong>Donación realizada:</strong> {formato_clp(total)}</p>
        <p><strong>Fecha:</strong> {fecha_actual.strftime('%d/%m/%Y')}</p>

        <p>¡Gracias por hacer la diferencia!</p>
    </body>
    </html>
    """

    # Enviar el correo
    try:
        msg = Message("Gracias por tu donación",
                    sender=app.config['MAIL_USERNAME'],
                    recipients=[correo_usuario])
        msg.html = mensaje_correo_html  # Configurar el contenido HTML
        mail.send(msg)
        print("Correo de agradecimiento enviado exitosamente.")
    except Exception as e:
        print(f"Error al enviar el correo: {e}")
        return jsonify({"success": True, "message": "Donación registrada, pero no se pudo enviar el correo."}), 500

    # Devolver un JSON de éxito
    return jsonify({"status": "success", "message": "Donación registrada correctamente"})

#/// FIN DONACIONES //

#/// PRODUCTOS //
# Crear productos
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

    # Imprimir los datos recibidos para depuración
    print('Datos recibidos:', data)

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
        'imagen_url': data['image_url'],
        'is_active': True
    }).execute()

    # Imprimir la respuesta de Supabase para depuración
    print('Respuesta de Supabase:', response)

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
    print(response.data)  # Verificar el formato de los datos
    
    # Verifica si el usuario está logeado
    is_logged_in = session.get('is_logged_in', False)
    
    return jsonify({
        'products': response.data if isinstance(response.data, list) else [],
        'is_logged_in': is_logged_in
    }), 200

# selecciona producto
@app.route('/item/<int:id_producto>', methods=['GET'])
@login_required
def get_product(id_producto):
    response = supabase.table('Producto').select('*').filter('id_producto', 'eq', id_producto).execute()

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

# Ruta para actualizar producto
@app.route('/update_product/<int:product_id>', methods=['PUT'])
@login_required
@role_required('admin')
def update_product(product_id):
    data = request.get_json()
    print("Datos recibidos:", data)

    # Comprobar si se recibieron datos
    if not data:
        return jsonify({'error': 'No se recibió ningún dato.'}), 400

    # Verificar claves necesarias
    required_keys = ['name', 'description', 'price', 'quantity']
    for key in required_keys:
        if key not in data:
            return jsonify({'error': f'Falta el campo: {key}'}), 400

    # Actualizar el producto en Supabase sin cambiar marca, tipo y URL de la imagen
    response = supabase.table('Producto').update({
        'nombre_producto': data['name'],
        'descripcion': data['description'],
        'valor': data['price'],
        'stock': data['quantity'],
    }).filter('id_producto', 'eq', product_id).execute()

    # Verificar si la actualización fue exitosa
    if response.data:
        return jsonify({'message': 'Producto actualizado exitosamente.', 'data': response.data}), 200
    else:
        print('Error de Supabase:', response.error)
        return jsonify({'error': 'Error al actualizar el producto.', 'details': response.error}), 400

# Ruta para eliminar un producto (marcar como inactivo)
@app.route('/delete_product/<int:id_producto>', methods=['DELETE'])
@login_required
@role_required('admin')
def delete_product(id_producto):
    try:
        # Actualizar el estado del producto a inactivo
        response = supabase.table('Producto').update({'is_active': False}).filter('id_producto', 'eq', id_producto).execute()

        if response.data:
            return jsonify({'message': 'Producto marcado como inactivo exitosamente.'}), 200
        else:
            print('Error de Supabase:', response.error)
            return jsonify({'error': 'Error al marcar el producto como inactivo.', 'details': response.error}), 400
    except Exception as e:
        print(f'Excepción al marcar el producto como inactivo: {str(e)}')  # Log de la excepción
        return jsonify({'error': 'Error interno del servidor.'}), 500

# Ruta para activar producto
@app.route('/activate_product/<int:id_producto>', methods=['PUT'])
@login_required
@role_required('admin')
def activate_product(id_producto):
    try:
        # Obtener el producto de la base de datos
        response = supabase.table('Producto').select('*').filter('id_producto', 'eq', id_producto).execute()  # Usando .filter()

        if not response.data:
            return jsonify({'error': 'Producto no encontrado.'}), 404

        # Activar el producto
        producto = response.data[0]
        producto['is_active'] = True
        producto['stock'] = 0  # O el valor deseado

        # Guardar los cambios en Supabase
        update_response = supabase.table('Producto').update({
            'is_active': producto['is_active'],
            'stock': producto['stock']
        }).filter('id_producto', 'eq', id_producto).execute()  # Usando .filter()

        if not update_response.data:
            return jsonify({'error': 'Error al activar el producto.'}), 500

        # Devolver el producto actualizado para reflejarlo en la UI
        return jsonify({
            'message': 'Producto activado correctamente.',
            'product': {
                'id_producto': id_producto,
                'is_active': producto['is_active'],
                'stock': producto['stock']
            }
        }), 200
    except Exception as e:
        print(f'Error al activar el producto: {str(e)}')
        return jsonify({'error': 'Error interno del servidor.'}), 500

#Ruta para obtener la cantidad de productos en el carrito
@app.route('/cart_count', methods=['GET'])
def cart_count():
    cart_items = session.get('cart', [])
    return jsonify({'count': len(cart_items)}), 200

#Ruta para añadir al carrito
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
        response = supabase.table('Producto').select('*').filter('id_producto', 'eq', product_id).execute()  # Usando .filter()

        if not response.data:
            return jsonify({"success": False, "message": "Producto no encontrado"}), 404

        # Obtener el producto y actualizar su stock
        producto = response.data[0]
        nuevo_stock = producto['stock'] - quantity

        if nuevo_stock < 0:
            return jsonify({"success": False, "message": "Stock insuficiente"}), 400

        # Actualizar el stock en la base de datos
        update_response = supabase.table('Producto').update({'stock': nuevo_stock}).filter('id_producto', 'eq', product_id).execute()  # Usando .filter()

        if update_response.data:
            return jsonify({"success": True, "message": f"Stock actualizado correctamente para el producto {product_id}"}), 200
        else:
            return jsonify({"success": False, "message": "Error al actualizar el stock"}), 500

    except Exception as e:
        return jsonify({"success": False, "message": f"Error interno: {str(e)}"}), 500
#/// fIN PRODUCTOS //

#Obtener usuarios
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

## Subir foto vet
@app.route('/upload_photo_vet', methods=['POST'])
@login_required  # Asegúrate de que solo usuarios autenticados puedan subir fotos
@role_required('vet')  # Asegúrate de que solo los veterinarios puedan cambiar su foto
def upload_photo_vet():
    user_id = session.get('id_usuario')  # Obtener el id del usuario de la sesión
    if not user_id:
        return "No se encontró el ID de usuario en la sesión.", 400

    # Verificar si se ha enviado un archivo
    if 'photo' not in request.files:
        return "No se encontró ningún archivo.", 400

    photo = request.files['photo']
    if photo.filename == '':
        return "No se seleccionó ningún archivo.", 400

    # Subir la imagen a Cloudinary
    try:
        # Usar el user_id como nombre de la imagen para evitar duplicados
        upload_result = cloudinary.uploader.upload(photo, folder="Foto Veterinarios", public_id=f"vet_{user_id}", overwrite=True)
        image_url = upload_result['secure_url']

        # Actualizar la URL de la imagen en la base de datos de Supabase
        response = supabase.table('Usuario').update({'imagen': image_url}).filter('id_usuario', 'eq', user_id).execute()  # Usando .filter()

        if response.status_code == 200:
            flash("Imagen subida y actualizada con éxito.", "success")
        else:
            flash("Hubo un error al actualizar la imagen en la base de datos.", "danger")
        
    except Exception as e:
        print(f"Error al subir la imagen a Cloudinary: {str(e)}")
        flash("Hubo un error al subir la imagen.", "danger")
        return redirect(url_for('profile_vet'))

    return redirect(url_for('profile_vet'))  # Redirigir al perfil del veterinario

## actualizar estado
@app.route('/update-pet-status', methods=['POST'])
def update_pet_status():
    data = request.json
    
    # Obtener el ID de la mascota desde los datos recibidos
    pet_id = data.get('id_mascota')  # Cambia 'pet_id' por 'id_mascota'
    
    if not pet_id:
        return jsonify({"success": False, "error": "ID de mascota no proporcionado"}), 400
    
    # Preparar los datos para actualizar en Supabase
    updates = {
        "reproductor": data.get('reproducer', False),
        "tratamiento": data.get('treatment', False),
        "esterilizado": data.get('sterilized', False),
        "Fallecimiento": not data.get('deceased', True),  # Se invierte el valor para que `False` signifique fallecido
        "causa_fallecimiento": data.get('causeOfDeath') if data.get('deceased', False) else None
    }

    # Actualizar la base de datos en la tabla 'Mascota' en Supabase
    try:
        response = supabase.table('Mascota').update(updates).filter('id_mascota', 'eq', pet_id).execute()  # Usando .filter()

        if response.data:  # Verificamos si hay datos en la respuesta
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "error": "Error al actualizar la base de datos"}), 500

    except Exception as e:
        print(f"Error al actualizar la mascota: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

## Obtener estado
@app.route('/get-pet-status', methods=['GET'])
def get_pet_status():
    pet_id = request.args.get('pet_id') or request.args.get('id_mascota')  # Acepta ambos
    if not pet_id:
        return jsonify({"error": "ID de mascota no proporcionado."}), 400
    try:
        # Consultar la tabla "Mascota" en Supabase
        response = supabase.table('Mascota').select('reproductor, esterilizado, tratamiento, Fallecimiento, causa_fallecimiento').filter('id_mascota', 'eq', pet_id).execute()  # Usando .filter()

        # Verificar si hay errores en la respuesta
        if not response.data:
            return jsonify({'error': 'Mascota no encontrada o error en la consulta.'}), 404

        # Obtener los datos de la respuesta
        pet_data = response.data[0]  # Supongamos que solo hay un resultado

        return jsonify({
            'reproducer': pet_data.get('reproductor', False),
            'sterilized': pet_data.get('esterilizado', False),
            'treatment': pet_data.get('tratamiento', False),
            'deceased': not pet_data.get('Fallecimiento', False),  # Invertimos el booleano
            'causeOfDeath': pet_data.get('causa_fallecimiento', '') or ''
        })
        
    except Exception as e:
        print(f"Error al obtener el estado de la mascota: {str(e)}")  # Imprimir el error
        return jsonify({"error": "Error al procesar la solicitud: " + str(e)}), 500

## Editar mascota
@app.route('/update_pet/<pet_id>', methods=['POST'])
def update_pet(pet_id):
    data = request.json
    nombre = data.get('nombre') 
    edad = data.get('edad')
    fecha_nacimiento = data.get('fecha_nacimiento')
    especie = data.get('especie')
    raza = data.get('raza')
    sexo = data.get('sexo')
    num_microchip = data.get('num_microchip')
    tamaño = data.get('tamaño')
    color_pelaje = data.get('color_pelaje')

    # Actualiza la mascota en tu base de datos usando Supabase
    response = supabase.table('Mascota').update({
        'nombre': nombre,
        'edad': edad,
        'fecha_nacimiento': fecha_nacimiento,
        'especie': especie,
        'raza': raza,
        'sexo': sexo,
        'num_microchip': num_microchip,
        'tamaño': tamaño,
        'color_pelaje': color_pelaje
    }).filter('id_mascota', 'eq', pet_id).execute()  # Usando .filter()

    return jsonify({"message": "Mascota actualizada exitosamente."}), 200

# Ruta para obtener vacunas por ID de mascota
@app.route('/get_vaccines_by_pet_id', methods=['GET'])
def get_vaccines_by_pet_id():
    id_mascota = request.args.get('id_mascota')

    try:
        # Validar que se ha proporcionado el ID de la mascota
        if not id_mascota:
            return jsonify({'error': 'ID de mascota no proporcionado.'}), 400

        # Obtener las vacunas asociadas al id_mascota
        vaccines_response = supabase.table('Vacuna').select('*').filter('id_mascota', 'eq', id_mascota).execute()  # Usando .filter()

        # Verificar si hay un error en la respuesta
        if hasattr(vaccines_response, 'error') and vaccines_response.error:
            return jsonify({'error': 'Error al obtener vacunas.', 'details': vaccines_response.error.message}), 500

        # Verificar si se obtuvieron datos
        if not vaccines_response.data:
            return jsonify({'vaccines': []}), 200

        # Retornar las vacunas obtenidas
        return jsonify({'vaccines': vaccines_response.data}), 200

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Ruta para agregar una nueva vacuna
@app.route('/add_vaccine', methods=['POST'])
def add_vaccine():
    data = request.json
    try:
        fecha = data.get('fecha')
        prox_fecha = data.get('prox_fecha')  # Nueva fecha de la próxima vacuna
        nombre_vacuna = data.get('nombre_vacuna')
        dosis = data.get('dosis')
        nombre_veterinario = data.get('nombre_veterinario')
        id_mascota = data.get('id_mascota')

        if not all([fecha, prox_fecha, nombre_vacuna, dosis, nombre_veterinario, id_mascota]):
            return jsonify({'error': 'Todos los campos son requeridos.'}), 400

        response = supabase.table('Vacuna').insert({
            'fecha': fecha,
            'prox_fecha': prox_fecha,  # Almacenar en la base de datos
            'nombre_vacuna': nombre_vacuna,
            'dosis': dosis,
            'nombre_veterinario': nombre_veterinario,
            'id_mascota': id_mascota
        }).execute()

        if isinstance(response, Exception):
            return jsonify({'error': 'Error al agregar vacuna.', 'details': str(response)}), 500
        
        return jsonify({'message': 'Vacuna añadida exitosamente.', 'data': response.data}), 201

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Ruta para obtener desparasitaciones por ID de mascota
@app.route('/get_dewormer_by_pet_id', methods=['GET'])
def get_dewormer_by_pet_id():
    id_mascota = request.args.get('id_mascota')

    try:
        # Validar que se ha proporcionado el ID de la mascota
        if not id_mascota:
            return jsonify({'error': 'ID de mascota no proporcionado.'}), 400

        # Obtener las desparacitaciones asociadas al id_mascota
        dewormer_response = supabase.table('Desparacitacion').select('*').filter('id_mascota', 'eq', id_mascota).execute()  # Usando .filter()

        # Verificar si hay un error en la respuesta
        if hasattr(dewormer_response, 'error') and dewormer_response.error:
            return jsonify({'error': 'Error al obtener desparacitaciones.', 'details': dewormer_response.error.message}), 500

        # Verificar si se obtuvieron datos
        if not dewormer_response.data:
            return jsonify({'dewormer': []}), 200

        # Retornar las desparacitaciones obtenidas
        return jsonify({'dewormer': dewormer_response.data}), 200

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Ruta para agregar desparasitacion
@app.route('/add_dewormer', methods=['POST'])
def add_dewormer():
    data = request.json
    try:
        # Extraer los datos del cuerpo de la solicitud
        fecha = data.get('fecha')
        prox_fecha = data.get('prox_fecha')  # Nueva fecha de la próxima vacuna
        nombre_desparacitador = data.get('nombre_desparacitador')
        dosis = data.get('dosis')
        nombre_veterinario = data.get('nombre_veterinario')
        id_mascota = data.get('id_mascota')  # Debes enviar este campo desde el frontend

        # Validar que los campos no estén vacíos
        if not all([fecha, prox_fecha , nombre_desparacitador, dosis, nombre_veterinario, id_mascota]):
            return jsonify({'error': 'Todos los campos son requeridos.'}), 400

        # Insertar la nueva desparacitación en la tabla Desparacitacion
        response = supabase.table('Desparacitacion').insert({
            'fecha': fecha,
            'prox_fecha': prox_fecha,  # Almacenar en la base de datos
            'nombre_desparacitador': nombre_desparacitador,
            'dosis': dosis,
            'nombre_veterinario': nombre_veterinario,
            'id_mascota': id_mascota  # Establecer la FK
        }).execute()

        # Verificar si hubo un error en la respuesta
        if isinstance(response, Exception):
            return jsonify({'error': 'Error al agregar desparacitacion.', 'details': str(response)}), 500
        
        if response.data is None:
            return jsonify({'error': 'No se recibió respuesta de Supabase.', 'details': str(response)}), 500

        # Retornar la nueva desparacitacion creada (opcional)
        return jsonify({'message': 'Desparacitación añadida exitosamente.', 'data': response.data}), 201

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Ruta guardar ficha
@app.route('/api/insertar_historial', methods=['POST'])
def insert_medical_history():
    data = request.json
    id_usuario = data.get("id_usuario")

    # Validaciones
    if not id_usuario:
        return jsonify({'error': 'ID de usuario no proporcionado.'}), 400

    # Obtener el id_mascota directamente del JSON enviado
    id_mascota = data.get("id_mascota")

    # Validar que id_mascota no sea None
    if not id_mascota:
        return jsonify({'error': 'ID de mascota no proporcionado.'}), 400

    id_historial = str(uuid.uuid4())

    medical_history = {
        "id_historial": id_historial,
        "fecha": data.get("fecha"),
        "hora_inicio": data.get("hora_inicio"),
        "temperatura": data.get("temperatura"),
        "frecuencia_cardiaca": data.get("frecuencia_cardiaca"),
        "frecuencia_respiratoria": data.get("frecuencia_respiratoria"),
        "peso": data.get("peso"),
        "motivo_consulta": data.get("motivo_consulta"),
        "examen_fisico": data.get("examen_fisico"),
        "diagnostico": data.get("diagnostico"),
        "indicaciones_tratamientos": data.get("indicaciones_tratamientos"),
        "id_mascota": id_mascota,
        "id_usuario": id_usuario
    }

    insert_response = supabase.table('HistorialMedico').insert(medical_history).execute()


    return jsonify({'message': 'Historial médico insertado con éxito!', 'id_historial': id_historial}), 201

##Ruta historial medico
@app.route('/get_medical_history', methods=['GET'])
def get_medical_history():
    pet_id = request.args.get('id_mascota')  # Obtiene el id_mascota de la consulta
    data = supabase.table('HistorialMedico').select('*').filter('id_mascota', 'eq', pet_id).execute()

    return jsonify(data.data), 200  # Devuelve los datos obtenidos

@app.route('/get_medical_record', methods=['GET'])
def get_medical_record():
    record_id = request.args.get('id_historial')
    
    try:
        # Validar que se ha proporcionado el ID del historial
        if not record_id:
            return jsonify({'error': 'ID de historial no proporcionado.'}), 400

        # Obtener el registro médico asociado al id_historial
        medical_record_response = supabase.table('HistorialMedico').select('*').filter('id_historial', 'eq', record_id).execute()  # Usando .filter()

        # Verificar si hay un error en la respuesta
        if hasattr(medical_record_response, 'error') and medical_record_response.error:
            return jsonify({'error': 'Error al obtener el historial médico.', 'details': medical_record_response.error.message}), 500

        # Verificar si se obtuvieron datos
        if not medical_record_response.data:
            return jsonify({'error': 'Historial médico no encontrado.'}), 404

        # Retornar el primer registro médico obtenido
        return jsonify(medical_record_response.data[0]), 200  # Devuelve el primer resultado

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

@app.route('/api/get_user_by_id', methods=['GET'])
def get_user_by_id():
    # Obtener el RUT del parámetro de la solicitud
    id_usuario = request.args.get('id_usuario')

    # Imprimir el valor recibido de id_usuario para depuración
    print(f"Recibiendo id_usuario: {id_usuario}")

    # Validar que el id_usuario no sea None o vacío
    if not id_usuario:
        return jsonify({"error": "El parámetro 'id_usuario' es obligatorio."}), 400  # Si el valor es None o vacío

    try:
        # Asegurarse de que id_usuario se trata como texto al hacer la consulta
        id_usuario_str = str(id_usuario)  # Forzar que id_usuario sea un string

        # Imprimir la consulta que se va a ejecutar para depuración
        print(f"Ejecutando consulta con id_usuario: {id_usuario_str}")
        
        # Realizar la consulta en Supabase asegurándose de que se pase como texto
        response = supabase.table('Usuario').select('nombre, appaterno, apmaterno, celular, id_domicilio') \
                                           .filter('id_usuario', 'eq', id_usuario_str) \
                                           .execute()

        # Depuración adicional para ver la respuesta de la consulta
        print(f"Respuesta de la consulta de Usuario: {response.data}")

        if response.data:
            user_data = response.data[0]

            # Concatenar nombre completo
            full_name = f"{user_data['nombre']} {user_data['appaterno']} {user_data['apmaterno']}"
            celular = user_data['celular']

            # Obtener la dirección desde la tabla Domicilio usando id_domicilio como clave externa
            domicilio_response = supabase.table('Domicilio').select('direccion').filter('id_domicilio', 'eq', user_data['id_domicilio']).execute()

            # Depuración adicional para la consulta de domicilio
            print(f"Respuesta de la consulta de Domicilio: {domicilio_response.data}")

            direccion = domicilio_response.data[0]['direccion'] if domicilio_response.data else 'Dirección no encontrada'

            # Responder con los datos del usuario
            return jsonify({
                'name': full_name,
                'address': direccion,
                'phone': celular
            }), 200
        else:
            return jsonify({'error': 'Usuario no encontrado'}), 404

    except Exception as e:
        # Imprimir detalles completos del error
        print(f"Ocurrió un error al obtener el usuario: {e}")
        return jsonify({"error": "Error al obtener usuario", "details": str(e)}), 500


##Obtener doctores
@app.route('/api/get_doctors', methods=['GET'])
def get_doctors():
    try:
        # Obtener los usuarios que son doctores usando .filter()
        response = supabase.table('Usuario').select('nombre, appaterno, apmaterno, id_usuario, imagen').filter('tipousuarioid', 'eq', 2).execute()
        
        # Verifica si hay datos
        if not response.data:
            return jsonify([]), 200  # Retorna una lista vacía si no hay doctores

        # Construir la lista de doctores
        doctors = []
        for user in response.data:
            full_name = f"Dr. {user['nombre']} {user['appaterno']} {user['apmaterno']}"
            doctors.append({
                'name': full_name,
                'value': user['id_usuario'],  # Asegúrate de que este campo existe
                'image': user['imagen'] or "static/img/default-doctor.jpg"  # Usar imagen de Cloudinary o imagen por defecto
            })

        return jsonify(doctors), 200
    except Exception as e:
        print(f"Ocurrió un error al obtener los doctores: {e}")
        return jsonify({"error": "Error al obtener doctores", "details": str(e)}), 500

##Obtener mascotas de agenda
@app.route('/api/get_pets_by_user_id', methods=['GET'])
def get_pets_by_user_id():
    id_usuario = request.args.get('id_usuario')

    try:
        # Obtener las mascotas asociadas al id_usuario usando .filter()
        response = supabase.table('Mascota').select('id_mascota, nombre, edad, raza, foto_url').filter('id_usuario', 'eq', id_usuario).execute()

        if response.data:
            return jsonify(response.data), 200
        else:
            return jsonify({'error': 'No se encontraron mascotas'}), 404

    except Exception as e:
        print(f"Ocurrió un error al obtener las mascotas: {e}")
        return jsonify({"error": "Error al obtener mascotas", "details": str(e)}), 500

#Ruta confirmar agenda
@app.route('/api/confirm_appointment', methods=['POST'])
def confirm_appointment():
    data = request.get_json()

    # Extraer datos de la solicitud
    rut = data.get('rut')
    doctor_id = data.get('doctorId')
    service = data.get('service')
    date = data.get('date')
    time = data.get('time')
    pet_id = data.get('petId')
    details = data.get('details')

    # Insertar los datos en Supabase sin id_agenda
    response = supabase.table('Agenda').insert({
        'id_usuario': rut,
        'medico_veterinario_id': doctor_id,
        'servicio': service,
        'fecha': date,
        'hora': time,
        'id_mascota': pet_id,
        'motivo': details
    }).execute()

    # Obtener la información del doctor desde la tabla Usuario (tipousuarioid = 2) usando .filter()
    doctor_response = supabase.table('Usuario').select('nombre, appaterno').filter('id_usuario', 'eq', doctor_id).filter('tipousuarioid', 'eq', 2).execute()

    if doctor_response.data:
        # Concatenar los nombres
        doctor_name = f"{doctor_response.data[0]['nombre']} {doctor_response.data[0]['appaterno']}"
    else:
        doctor_name = 'Desconocido'


    # Obtener la información de la mascota usando .filter()
    pet_response = supabase.table('Mascota').select('nombre').filter('id_mascota', 'eq', pet_id).execute()
    pet_name = pet_response.data[0]['nombre'] if pet_response.data else 'Desconocida'

    # Obtener el id_domicilio del usuario usando .filter()
    user_response = supabase.table('Usuario').select('id_domicilio').filter('id_usuario', 'eq', rut).execute()
    user_address_id = user_response.data[0]['id_domicilio'] if user_response.data else None

    # Si el id_domicilio existe, obtener la dirección y la numeración desde la tabla Domicilio
    user_address = 'Dirección no disponible'
    if user_address_id:
        address_response = supabase.table('Domicilio').select('direccion', 'numeracion').filter('id_domicilio', 'eq', user_address_id).execute()
        if address_response.data:
            # Concatenar la dirección y la numeración
            user_address = f"{address_response.data[0]['direccion']} {address_response.data[0]['numeracion']}"
        else:
            user_address = 'Dirección no disponible'

    # Devolver la respuesta con los datos necesarios
    return jsonify({
        'message': 'Cita confirmada exitosamente!',
        'doctorName': doctor_name,
        'petName': pet_name,
        'userAddress': user_address
    }), 201

#///CASOS ADMINISTRADOR ///
#ruta guardar casos administrador
@app.route('/api/casos', methods=['POST'])
def create_case():
    data = request.json

    # Obtener los datos del formulario
    nombre_caso = data.get('nombre_caso')
    descripcion = data.get('descripcion')
    foto_url = data.get('foto_url')

    # Obtener la fecha y hora actual en la zona horaria local
    local_tz = pytz.timezone('America/Santiago')
    fecha_ingreso = datetime.now(local_tz).isoformat()  # O usa strftime para formato específico

    # Para depuración
    print("Fecha y hora que se va a guardar:", fecha_ingreso)

    # Guardar en Supabase
    supabase.table('CasoDonacion').insert({
        'nombre_caso': nombre_caso,
        'descripcion': descripcion,
        'foto_url': foto_url,
        'fecha_ingreso': fecha_ingreso,
    }).execute()

    return jsonify({"message": "Caso creado exitosamente!"}), 201

#Ruta visualizar datos casos administrados
@app.route('/api/casos', methods=['GET'])
def get_cases():
    # Obtiene todos los casos de la tabla CasoDonacion
    cases = supabase.table('CasoDonacion').select('*').execute()
    
    # Si quieres procesar los datos, puedes hacerlo aquí
    cases_data = cases.data  # Asegúrate de que 'cases.data' contenga tus datos

    return jsonify(cases_data), 200

# Ruta para actualizar casos
@app.route('/api/casos/<int:case_id>', methods=['PUT'])
def update_case(case_id):
    data = request.json

    # Obtener los datos del formulario
    nombre_caso = data.get('nombre_caso')
    descripcion = data.get('descripcion')

    # Actualizar el caso en la base de datos usando .filter()
    response = supabase.table('CasoDonacion').update({
        'nombre_caso': nombre_caso,
        'descripcion': descripcion,
    }).filter('id_caso', 'eq', case_id).execute()

    return jsonify({"message": "Caso actualizado exitosamente!"}), 200

# Ruta para obtener un caso por ID
@app.route('/api/casos/<int:case_id>', methods=['GET'])
def get_case(case_id):
    case = supabase.table('CasoDonacion').select('*').filter('id_caso', 'eq', case_id).execute()
    if case.data:
        return jsonify(case.data[0]), 200  # Devuelve solo el primer caso encontrado
    return jsonify({"message": "Caso no encontrado"}), 404

#Ruta para eliminar casos administrador
@app.route('/api/casos/<int:case_id>', methods=['DELETE'])
def delete_case(case_id):
    # Eliminar el caso de la tabla CasoDonacion
    response = supabase.table('CasoDonacion').delete().filter('id_caso', 'eq', case_id).execute()
    return jsonify({"message": "Caso eliminado exitosamente!"}), 200

#/// FIN CASOS ADMINISTRADOR ///   

#///CASOS FUNDACIONES ///

# Ruta para guardar fundaciones
@app.route('/api/fundaciones', methods=['POST'])
def create_foundation():
    data = request.json

    # Obtener los datos del formulario
    nombre_fundacion = data.get('nombre_fundacion')
    descripcion = data.get('descripcion')
    foto_url = data.get('foto_url')

    # Obtener la fecha y hora actual en la zona horaria local
    local_tz = pytz.timezone('America/Santiago')
    fecha_ingreso = datetime.now(local_tz).isoformat()  # O usa strftime para formato específico

    # Para depuración
    print("Fecha y hora que se va a guardar:", fecha_ingreso)

    # Guardar en Supabase
    supabase.table('FundacionDonacion').insert({
        'nombre_fundacion': nombre_fundacion,
        'descripcion': descripcion,
        'foto_url': foto_url,
        'fecha_ingreso': fecha_ingreso,
    }).execute()

    return jsonify({"message": "Fundación creada exitosamente!"}), 201

# Ruta para visualizar datos de fundaciones
@app.route('/api/fundaciones', methods=['GET'])
def get_foundations():
    # Obtiene todas las fundaciones de la tabla Fundacion
    foundations = supabase.table('FundacionDonacion').select('*').execute()
    
    # Si quieres procesar los datos, puedes hacerlo aquí
    foundations_data = foundations.data  # Asegúrate de que 'foundations.data' contenga tus datos

    return jsonify(foundations_data), 200

# Ruta para actualizar fundaciones
@app.route('/api/fundaciones/<int:foundation_id>', methods=['PUT'])
def update_foundation(foundation_id):
    data = request.json

    # Obtener los datos del formulario
    nombre_fundacion = data.get('nombre_fundacion')
    descripcion = data.get('descripcion')

    # Actualizar la fundación en la base de datos
    response = supabase.table('FundacionDonacion').update({
        'nombre_fundacion': nombre_fundacion,
        'descripcion': descripcion,
    }).filter('id_fundacion', 'eq', foundation_id).execute()

    return jsonify({"message": "Fundación actualizada exitosamente!"}), 200

# Ruta para obtener una fundación por ID (editar)
@app.route('/api/fundaciones/<int:foundation_id>', methods=['GET'])
def get_foundation(foundation_id):
    foundation = supabase.table('FundacionDonacion').select('*').filter('id_fundacion', 'eq', foundation_id).execute()
    if foundation.data:
        return jsonify(foundation.data[0]), 200  # Devuelve solo la primera fundación encontrada
    return jsonify({"message": "Fundación no encontrada"}), 404

# Ruta para eliminar fundaciones
@app.route('/api/fundaciones/<int:foundation_id>', methods=['DELETE'])
def delete_foundation(foundation_id):
    # Eliminar la fundación de la tabla FundacionDonacion
    response = supabase.table('FundacionDonacion').delete().filter('id_fundacion', 'eq', foundation_id).execute()
    return jsonify({"message": "Fundación eliminada exitosamente!"}), 200

#/// FIN CASOS FUNDACIONES ///

#Ruta Agenda
@app.route('/api/agenda', methods=['GET'])
@cross_origin()
def get_agenda():
    print("API de agenda solicitada")
    
    # Obtener datos de la tabla Agenda, asegurándote de incluir 'area' y 'motivo'
    agenda_response = supabase.table('Agenda').select('*').execute()
    agenda_data = agenda_response.data
    
    # Obtener datos de la tabla Usuario
    usuario_response = supabase.table('Usuario').select('*').execute()
    usuario_data = {user['id_usuario']: user for user in usuario_response.data}
    
    # Obtener datos de la tabla Mascota
    mascota_response = supabase.table('Mascota').select('*').execute()
    mascota_data = {pet['id_mascota']: pet for pet in mascota_response.data}
    
    # Preparar la respuesta combinada
    combined_data = []
    for cita in agenda_data:
        usuario_info = usuario_data.get(cita['id_usuario'])  # Asumiendo 'usuario_id' como FK en Agenda
        mascota_info = mascota_data.get(cita['id_mascota'])  # Asumiendo 'mascota_id' como FK en Agenda
        
        # Combinar datos
        combined_record = {
            'fecha': cita['fecha'],           # Fecha de la cita
            'hora': cita['hora'],             # Hora de la cita
            'id_mascota': cita['id_mascota'], # ID de la mascota
            'servicio': cita['servicio'],     # Servicio asignado
            'motivo': cita['motivo'],         # Nuevo campo 'motivo'
            'usuario': usuario_info,          # Información del usuario
            'mascota': mascota_info           # Información de la mascota
        }
        combined_data.append(combined_record)
    
    return jsonify(combined_data), 200

#Obtener servicios desde Supabase
@app.route('/obtener_servicios', methods=['GET'])
def obtener_servicios():
    # Obtener los servicios desde la tabla TipoCita
    response = supabase.table('TipoCita').select('descripcion').execute()

    # Verificar si se obtuvieron los datos correctamente
    if response.data:  # Si hay datos en la respuesta
        servicios = response.data
        return jsonify(servicios)
    else:
        return jsonify({"error": "Error al obtener los servicios"}), 500
    
# Verificar disponibilidad agenda
@app.route('/api/check_availability', methods=['POST'])
def check_availability():
    data = request.json
    selected_date = data['date']  # Se espera que la fecha esté en formato 'YYYY-MM-DD'

    # Consultar las horas ocupadas para la fecha seleccionada utilizando el cliente de Supabase inicializado
    query = supabase.table('Agenda') \
        .select('hora') \
        .filter('fecha', 'eq', selected_date)  # Suponiendo que 'fecha' es un campo de tipo date
    
    occupied_hours = query.execute()

    # Devolver las horas ocupadas
    occupied_hours_list = [entry['hora'] for entry in occupied_hours.data]
    return jsonify({'occupied_hours': occupied_hours_list})

### MEDICAMENTOS ADMIN

# Ruta para obtener las imágenes de medicamentos desde Cloudinary
@app.route('/api/cloudinary/medications', methods=['GET'])
def get_medication_images():
    url = f'https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/image/upload'
    response = requests.get(url, auth=HTTPBasicAuth(API_KEY, API_SECRET))

    if response.status_code == 200:
        # Obtenemos solo las URLs seguras de las imágenes
        images = [resource['secure_url'] for resource in response.json().get('resources', [])]
        return jsonify(images)
    else:
        return jsonify({'error': 'Error fetching images from Cloudinary'}), response.status_code

# Ruta para agregar medicamento
@app.route('/api/medicamentos', methods=['POST'])
@login_required
@role_required('admin')
def add_medicine():
    # Obtener datos del formulario
    data = request.get_json()

    # Comprobar si se recibieron datos
    if not data:
        return jsonify({'error': 'No se recibió ningún dato.'}), 400

    # Verificar claves necesarias
    required_keys = ['nombre', 'descripcion', 'marca', 'tipo_medicamento', 'stock', 'imagen_url']
    for key in required_keys:
        if key not in data:
            return jsonify({'error': f'Falta el campo: {key}'}), 400

    # Imprimir los datos recibidos para depuración
    print('Datos recibidos:', data)

    # Obtener la fecha de ingreso
    fecha_ingreso = datetime.now().isoformat()

    # Crear el medicamento en Supabase
    response = supabase.table('Medicamentos').insert({
        'nombre': data['nombre'],
        'descripcion': data['descripcion'],
        'marca': data['marca'],
        'tipo_medicamento': data['tipo_medicamento'],
        'stock': data['stock'],
        'imagen_url': data['imagen_url'],
        'fecha_ingreso': fecha_ingreso
    }).execute()

    # Imprimir la respuesta de Supabase para depuración
    print('Respuesta de Supabase:', response)

    # Verificar si la inserción fue exitosa
    if response.data:
        return jsonify({'success': True, 'message': 'Medicamento agregado exitosamente.', 'data': response.data}), 201
    else:
        print('Error de Supabase:', response.error)
        return jsonify({'success': False, 'error': 'Error al agregar medicamento.', 'details': response.error}), 400

# Ruta para obtener medicamentos
@app.route('/api/obtener_medicamentos', methods=['GET'])
def obtener_lista_medicamentos():
    try:
        # Obtiene los filtros de la URL
        tipo_medicamento = request.args.get('tipo_medicamento')

        # Construye la consulta dinámica basada en los filtros
        query = supabase.table('Medicamentos').select('*')

        # Aplica el filtro por tipo de medicamento si existe
        if tipo_medicamento:
            query = query.eq('tipo_medicamento', tipo_medicamento)

        # Ejecuta la consulta
        response = query.execute()

        # Imprime la respuesta completa para depuración
        print("Contenido completo de la respuesta:", response)

        # Comprobamos si la respuesta tiene datos
        if not response.data:
            print("No se encontraron medicamentos en la respuesta.")
            return jsonify({'error': 'No se encontraron medicamentos'}), 404
        
        # Retornar los datos obtenidos
        return jsonify(response.data), 200

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Ruta para actualizar un medicamento
@app.route('/api/medicamentos/<int:medicine_id>', methods=['PUT'])
@login_required
@role_required('admin')
def update_medicine(medicine_id):
    # Obtener datos del formulario
    data = request.get_json()

    # Verificar si se recibieron datos
    if not data:
        return jsonify({'error': 'No se recibió ningún dato.'}), 400

    # Aquí procesas la actualización del medicamento en la base de datos
    response = supabase.table('Medicamentos').update({
        'nombre': data['nombre'],
        'descripcion': data['descripcion'],
        'tipo_medicamento': data['tipo_medicamento'],
        'marca': data['marca'],
        'stock': data['stock']
    }).eq('id_medicamento', medicine_id).execute()

    if response.data:
        return jsonify({'success': True, 'message': 'Medicamento actualizado exitosamente.'}), 200
    else:
        return jsonify({'error': 'Error al actualizar medicamento.'}), 400

@app.route('/api/medicamentos/<int:medicine_id>', methods=['GET'])
@login_required
@role_required('admin')
def get_medicine(medicine_id):
    response = supabase.table('Medicamentos').select('*').eq('id_medicamento', medicine_id).execute()

    if response.data:
        return jsonify(response.data[0]), 200  # Retorna los datos del medicamento
    else:
        return jsonify({'error': 'Medicamento no encontrado'}), 404

#Eliminar medicamento
@app.route('/api/medicamentos/<int:medicine_id>', methods=['DELETE'])
@login_required
@role_required('admin')
def delete_medicine(medicine_id):
    # Verificar si el medicamento existe
    response = supabase.table('Medicamentos').select('*').eq('id_medicamento', medicine_id).execute()

    if not response.data:
        return jsonify({'error': 'Medicamento no encontrado.'}), 404

    # Eliminar el medicamento de la base de datos
    delete_response = supabase.table('Medicamentos').delete().eq('id_medicamento', medicine_id).execute()

    if delete_response.data:
        return jsonify({'success': True, 'message': 'Medicamento eliminado exitosamente.'}), 200
    else:
        return jsonify({'error': 'Error al eliminar el medicamento.'}), 400


#Ruta para recuperación de contraseña
@app.route('/recover_password', methods=['POST'])
def recover_password():
    # Obtener el correo electrónico enviado en formato JSON
    data = request.get_json()
    correo = data.get('email')

    if not correo:
        return jsonify({"success": False, "message": "El correo electrónico es requerido."}), 400

    # Verificar si el correo existe y está confirmado en la tabla "usuarios"
    response = supabase.table('Usuario').select('*').eq('correo', correo).eq('confirmacion', True).execute()

    # Verificar si la respuesta contiene datos
    if not response.data or len(response.data) == 0:
        return jsonify({"success": False, "message": "Correo no registrado o no confirmado."}), 400

    # El usuario se encuentra en response.data, que es una lista
    usuario = response.data[0]  # Tomamos el primer (y único) usuario de la lista

    try:
        msg = Message("Recuperación de Contraseña",
                    sender=app.config['MAIL_USERNAME'],
                    recipients=[correo])
        msg.html = f"""
        <html>
            <body>
                <h2>Recuperación de Contraseña</h2>
                <p>Hola {usuario['nombre']} {usuario['appaterno']},</p>
                <p>Tu contraseña es: {usuario['contraseña']}</p>
                <p>Si no solicitaste esta recuperación, por favor ignora este mensaje.</p>
            </body>
        </html>
        """
        mail.send(msg)

        return jsonify({"success": True, "message": "Correo de recuperación enviado exitosamente."}), 200

    except Exception as e:
        return jsonify({"success": False, "message": f"Error al enviar el correo: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)  # Ejecuta la aplicación en modo depuración

