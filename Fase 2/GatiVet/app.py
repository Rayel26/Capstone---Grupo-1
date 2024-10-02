from flask import Flask, render_template, request, redirect, url_for, flash, session
from functools import wraps

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Clave para las sesiones

# Datos simulados para usuarios
users = {
    "user@example.com": {"password": "userpass", "role": "user"},
    "vet@example.com": {"password": "vetpass", "role": "vet"},
    "admin@example.com": {"password": "adminpass", "role": "admin"}
}

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

@app.route('/item')
def item():
    return render_template('item.html')

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

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, render_template, request
app = Flask(__name__)

