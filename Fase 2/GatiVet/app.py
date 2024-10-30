from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_cors import CORS
from functools import wraps
import requests
from requests.auth import HTTPBasicAuth
from supabase import create_client
from datetime import datetime
import cloudinary
import cloudinary.uploader  # Asegúrate de importar esto
import uuid
from flask_mail import Mail, Message

app = Flask(__name__)
CORS(app)
app.secret_key = 'supersecretkey'  # Clave para las sesiones

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
    user_id = session.get('id_usuario') 
    
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
        usuario_existente = supabase.table('Usuario').select('id_usuario').eq('id_usuario', id_usuario).execute()
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
        update_response = supabase.table('Mascota').update({'foto_url': foto_url}).eq('id_mascota', id_mascota).execute()

        # Verificar si hubo un error en la respuesta de actualización
        if not update_response.data:  # Si no hay datos, hubo un error
            print("Error al actualizar la URL de la foto:", update_response)  # Mostrar datos de la respuesta
            return jsonify({'error': 'Error al actualizar la URL de la foto', 'details': update_response}), 400

        return jsonify({'message': 'Mascota añadida con éxito', 'data': response.data}), 201

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

#Ruta para obtener mascotas
@app.route('/get_pets', methods=['GET'])
def get_pets():
    try:
        # Obtener las mascotas de la tabla Mascota, incluyendo la URL de la foto
        response = supabase.table('Mascota').select('id_mascota, nombre, edad, especie, raza, fecha_nacimiento, foto_url, Fallecimiento, causa_fallecimiento').execute()
        
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

# Ruta para obtener mascotas por ID de usuario
@app.route('/get_pets_by_id', methods=['GET'])
def get_pets_by_id():
    id_usuario = request.args.get('id_usuario')

    try:
        if id_usuario is None or id_usuario == "":
            return jsonify({'error': 'ID de usuario no proporcionado.'}), 400

        # Obtener las mascotas asociadas al id_usuario
        pets_response = supabase.table('Mascota').select('id_mascota, nombre, edad, especie, raza, fecha_nacimiento, foto_url, Fallecimiento, causa_fallecimiento, sexo, num_microchip, tamaño, color_pelaje').eq('id_usuario', id_usuario).execute()

        # Realizar la consulta para obtener datos del usuario
        user_response = supabase.table('Usuario').select('nombre, appaterno, apmaterno, id_usuario, id_domicilio, celular, correo').eq('id_usuario', id_usuario).execute()

        # Verificar si hay datos del usuario
        if user_response.data:
            user_data = user_response.data[0]
            id_domicilio = user_data['id_domicilio']
            
            # Asignar el rut
            user_data['rut'] = id_usuario  # Asignamos id_usuario como rut
            
            # Realizar la consulta para obtener la dirección del domicilio
            domicilio_response = supabase.table('Domicilio').select('direccion').eq('id_domicilio', id_domicilio).execute()

            # Asignar la dirección al usuario
            user_data['direccion'] = domicilio_response.data[0]['direccion'] if domicilio_response.data else "N/A"
        else:
            user_data = {'rut': id_usuario, 'direccion': "N/A", 'nombre': "N/A", 'celular': "N/A", 'correo': "N/A", 'id_usuario': "N/A"}  # Datos por defecto si no se encuentra el usuario

        if pets_response.data is None:
            return jsonify({'error': 'Error al obtener mascotas.'}), 500

        if not pets_response.data and not user_response.data:
            return jsonify({'pets': [], 'user': user_data}), 200

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

#Editar imagen mascota
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
        response = supabase.table('Mascota').update({'foto_url': image_url}).eq('id_mascota', int(id_mascota)).execute()

        # Verificar si la actualización fue exitosa
        if response.status_code == 200:  # Este método puede variar
            return jsonify({'success': True, 'message': 'Imagen subida y campo foto_url actualizado'}), 200
        else:
            # Acceder al mensaje de error de la respuesta
            error_message = response.error or 'Error desconocido'  # Utilizamos 'or' para proporcionar un mensaje predeterminado
            return jsonify({'success': False, 'message': f'Error al actualizar la URL de la imagen en la base de datos: {error_message}'}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

#Solicitud para editar mascota
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

#Eliminar mascota
@app.route('/pets/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    # Elimina la mascota usando el ID
    response = supabase.table('Mascota').delete().eq('id_mascota', pet_id).execute()

    if response.data:
        return jsonify({"message": "Mascota eliminada con éxito."}), 200
    else:
        # Manejo de errores
        return jsonify({"message": "Error al eliminar la mascota.", "details": response}), 400

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
    user_id = session.get('id_usuario') 

    # Comprobar si user_id es None
    if user_id is None:
        return "No se encontró el ID de usuario en la sesión."

    # Obtener los datos del veterinario de la tabla Usuario usando id_usuario
    vet_data = supabase.table('Usuario').select('*').eq('id_usuario', user_id).execute()

    # Verificar si se encontraron datos del veterinario
    if not vet_data.data:
        return "No se encontraron datos para este veterinario."

    vet = vet_data.data[0]

    # Obtener el id_domicilio desde la tabla Usuario
    id_domicilio = vet.get('id_domicilio')

    # Verificar si existe id_domicilio
    if id_domicilio:
        # Obtener los datos de domicilio usando id_domicilio desde la tabla Domicilio
        domicilio_data = supabase.table('Domicilio').select('*').eq('id_domicilio', id_domicilio).execute()

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

#Ruta guardar datos veterinarios
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
        usuario_response = supabase.table('Usuario').select('id_domicilio').eq('id_usuario', user_id).execute()

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
                }).eq('id_usuario', user_id).execute()

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
        }).eq('id_domicilio', domicilio_id).execute()

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

@app.route('/cart')
def cart():
    # Verificar si el usuario está logueado
    if not session.get('is_logged_in'):
        session['cart'] = []  # Vaciar el carrito si no está logueado
    return render_template('cart.html')

#Ruta registration
@app.route('/registration')
def registration():
    return render_template('registration.html')

#Ruta para registrar 
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

#Eliminar Usuarios
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

#Ruta para donaciones
@app.route('/donation')
def donation():
    return render_template('donation.html')

#Crear productos
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

#Ruta para obtener los productos
@app.route('/get_products', methods=['GET'])
def get_products():
    response = supabase.table('Producto').select('*').execute()
    return jsonify(response.data), 200

#selecciona producto
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

##Subir foto vet
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
        response = supabase.table('Usuario').update({'imagen': image_url}).eq('id_usuario', user_id).execute()

        if response.status_code == 200:
            flash("Imagen subida y actualizada con éxito.", "success")
        else:
            flash("Hubo un error al actualizar la imagen en la base de datos.", "danger")
        
    except Exception as e:
        print(f"Error al subir la imagen a Cloudinary: {str(e)}")
        flash("Hubo un error al subir la imagen.", "danger")
        return redirect(url_for('profile_vet'))

    return redirect(url_for('profile_vet'))  # Redirigir al perfil del veterinario

##actualizar estado
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
        response = supabase.table('Mascota').update(updates).eq('id_mascota', pet_id).execute()

        if response.data:  # Verificamos si hay datos en la respuesta
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False, "error": "Error al actualizar la base de datos"}), 500

    except Exception as e:
        print(f"Error al actualizar la mascota: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

##Obtener estado
@app.route('/get-pet-status', methods=['GET'])
def get_pet_status():
    pet_id = request.args.get('pet_id') or request.args.get('id_mascota')  # Acepta ambos
    if not pet_id:
        return jsonify({"error": "ID de mascota no proporcionado."}), 400
    try:
        # Consultar la tabla "Mascota" en Supabase
        response = supabase.table('Mascota').select('reproductor, esterilizado, tratamiento, Fallecimiento, causa_fallecimiento').eq('id_mascota', pet_id).execute()

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

##Editar mascota
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
    }).eq('id_mascota', pet_id).execute()  # Asegúrate de que 'id_mascota' sea el nombre correcto de tu columna de identificador

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
        vaccines_response = supabase.table('Vacuna').select('id_vacuna, fecha, nombre_vacuna, dosis, nombre_veterinario').eq('id_mascota', id_mascota).execute()

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
        # Extraer los datos del cuerpo de la solicitud
        fecha = data.get('fecha')
        nombre_vacuna = data.get('nombre_vacuna')
        dosis = data.get('dosis')
        nombre_veterinario = data.get('nombre_veterinario')
        id_mascota = data.get('id_mascota')  # Debes enviar este campo desde el frontend

        # Validar que los campos no estén vacíos
        if not all([fecha, nombre_vacuna, dosis, nombre_veterinario, id_mascota]):
            return jsonify({'error': 'Todos los campos son requeridos.'}), 400

        # Insertar la nueva vacuna en la tabla Vacuna
        response = supabase.table('Vacuna').insert({
            'fecha': fecha,
            'nombre_vacuna': nombre_vacuna,
            'dosis': dosis,
            'nombre_veterinario': nombre_veterinario,
            'id_mascota': id_mascota  # Establecer la FK
        }).execute()

        # Verificar si hubo un error en la respuesta
        if isinstance(response, Exception):
            return jsonify({'error': 'Error al agregar vacuna.', 'details': str(response)}), 500
        
        if response.data is None:
            return jsonify({'error': 'No se recibió respuesta de Supabase.', 'details': str(response)}), 500

        # Retornar la nueva vacuna creada (opcional)
        return jsonify({'message': 'Vacuna añadida exitosamente.', 'data': response.data}), 201

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Ruta para obtener despracitaciones por ID de mascota
@app.route('/get_dewormer_by_pet_id', methods=['GET'])
def get_dewormer_by_pet_id():
    id_mascota = request.args.get('id_mascota')

    try:
        # Validar que se ha proporcionado el ID de la mascota
        if not id_mascota:
            return jsonify({'error': 'ID de mascota no proporcionado.'}), 400

        # Obtener las vacunas asociadas al id_mascota
        dewormer_response = supabase.table('Desparacitacion').select('id_desparacitacion, fecha, nombre_desparacitador, dosis, nombre_veterinario').eq('id_mascota', id_mascota).execute()

        # Verificar si hay un error en la respuesta
        if hasattr(dewormer_response, 'error') and dewormer_response.error:
            return jsonify({'error': 'Error al obtener desparacitaciones.', 'details': dewormer_response.error.message}), 500

        # Verificar si se obtuvieron datos
        if not dewormer_response.data:
            return jsonify({'dewormer': []}), 200

        # Retornar las vacunas obtenidas
        return jsonify({'dewormer': dewormer_response.data}), 200

    except Exception as e:
        print("Error al procesar la solicitud:", str(e))
        return jsonify({'error': 'Error procesando la solicitud', 'details': str(e)}), 500

# Ruta para agregar una nueva vacuna
@app.route('/add_dewormer', methods=['POST'])
def add_dewormer():
    data = request.json
    try:
        # Extraer los datos del cuerpo de la solicitud
        fecha = data.get('fecha')
        nombre_desparacitador = data.get('nombre_desparacitador')
        dosis = data.get('dosis')
        nombre_veterinario = data.get('nombre_veterinario')
        id_mascota = data.get('id_mascota')  # Debes enviar este campo desde el frontend

        # Validar que los campos no estén vacíos
        if not all([fecha, nombre_desparacitador, dosis, nombre_veterinario, id_mascota]):
            return jsonify({'error': 'Todos los campos son requeridos.'}), 400

        # Insertar la nueva desparacitación en la tabla Desparacitacion
        response = supabase.table('Desparacitacion').insert({
            'fecha': fecha,
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
    data = supabase.table('HistorialMedico').select('*').eq('id_mascota', pet_id).execute()


    return jsonify(data.data), 200  # Devuelve los datos obtenidos

@app.route('/get_medical_record', methods=['GET'])
def get_medical_record():
    record_id = request.args.get('id_historial')
    data = supabase.table('HistorialMedico').select('*').eq('id_historial', record_id).execute()

    return jsonify(data.data[0]), 200  # Devuelve el primer resultado

##Obtener usuarios por rut
@app.route('/api/get_user_by_id', methods=['GET'])
def get_user_by_id():
    # Obtener el RUT del parámetro de la solicitud
    id_usuario = request.args.get('id_usuario')
    
    # Normalizar el RUT quitando puntos y guiones
    id_usuario = id_usuario.replace('.', '').replace('-', '')

    try:
        # Consulta con el RUT normalizado
        response = supabase.table('Usuario').select('nombre, appaterno, apmaterno, celular, id_domicilio').eq('id_usuario', id_usuario).execute()
        
        if response.data:
            user_data = response.data[0]

            # Concatenar nombre completo
            full_name = f"{user_data['nombre']} {user_data['appaterno']} {user_data['apmaterno']}"
            celular = user_data['celular']

            # Obtener la dirección desde la tabla Domicilio usando id_domicilio como clave externa
            domicilio_response = supabase.table('Domicilio').select('direccion').eq('id_domicilio', user_data['id_domicilio']).execute()
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
        print(f"Ocurrió un error al obtener el usuario: {e}")
        return jsonify({"error": "Error al obtener usuario", "details": str(e)}), 500

##Obtener doctores
@app.route('/api/get_doctors', methods=['GET'])
def get_doctors():
    try:
        # Obtener los usuarios que son doctores
        response = supabase.table('Usuario').select('nombre, appaterno, apmaterno, id_usuario, imagen').eq('tipousuarioid', 2).execute()
        
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
        response = supabase.table('Mascota').select('id_mascota, nombre, edad, raza, foto_url').eq('id_usuario', id_usuario).execute()

        if response.data:
            return jsonify(response.data), 200
        else:
            return jsonify({'error': 'No se encontraron mascotas'}), 404

    except Exception as e:
        print(f"Ocurrió un error al obtener las mascotas: {e}")
        return jsonify({"error": "Error al obtener mascotas", "details": str(e)}), 500

@app.route('/api/confirm_appointment', methods=['POST'])
def confirm_appointment():
    data = request.get_json()

    # Extraer datos de la solicitud
    rut = data.get('rut')
    doctor_id = data.get('doctorId')
    area = data.get('area')
    service = data.get('service')
    date = data.get('date')
    time = data.get('time')
    pet_id = data.get('petId')
    details = data.get('details')

    # Insertar los datos en Supabase sin id_agenda
    response = supabase.table('Agenda').insert({
        'id_usuario': rut,
        'medico_veterinario_id': doctor_id,
        'area': area,
        'servicio': service,
        'fecha': date,
        'hora': time,
        'id_mascota': pet_id,
        'motivo': details
    }).execute()

    return jsonify({'message': 'Cita confirmada exitosamente!'}), 201

#Ruta Casos administrador
@app.route('/api/casos', methods=['POST'])
def create_case():
    data = request.json

    # Obtener los datos del formulario
    nombre_caso = data.get('nombre_caso')
    descripcion = data.get('descripcion')
    foto_url = data.get('foto_url')
    fecha_ingreso = datetime.now().isoformat()  # Convertir a cadena ISO 8601

    # Aquí iría el código para guardar en Supabase
    # Por ejemplo:
    supabase.table('CasoDonacion').insert({
        'nombre_caso': nombre_caso,
        'descripcion': descripcion,
        'foto_url': foto_url,
        'fecha_ingreso': fecha_ingreso,
    }).execute()

    return jsonify({"message": "Caso creado exitosamente!"}), 201

if __name__ == '__main__':
    app.run(debug=True)  # Ejecuta la aplicación en modo depuración
