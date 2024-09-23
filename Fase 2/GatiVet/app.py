from flask import Flask, render_template, request, redirect, url_for, flash, session


app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Clave para las sesiones

# Datos simulados para usuarios
users = {
    "user@example.com": {"password": "userpass", "role": "user"},
    "vet@example.com": {"password": "vetpass", "role": "vet"},
    "admin@example.com": {"password": "adminpass", "role": "admin"}
}


# Ruta para la página de home
@app.route('/')
def home():
    return render_template('home.html')

# Ruta para la página de login, permite GET y POST
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
            session['is_logged_in'] = True  # Agrega esto
            
            if user['role'] == 'user':
                return redirect(url_for('profile'))
            elif user['role'] == 'vet':
                return redirect(url_for('profile_vet'))
            elif user['role'] == 'admin':
                return redirect(url_for('admin_dashboard'))  # Ruta ejemplo para admin
        else:
            flash('Usuario o contraseña incorrectos', 'error')
    
    return render_template('login.html')

# Ruta para la página de registro
@app.route('/registration', methods=['GET', 'POST'])
def registration():
    if request.method == 'POST':
        # Aquí agregarías lógica para registrar un nuevo usuario
        pass
    return render_template('registration.html')

# Ruta para el perfil del usuario
@app.route('/profile')
def profile():
    if 'email' not in session or session.get('role') != 'user':
        flash('Debes iniciar sesión como usuario para acceder a esta página.', 'error')
        return redirect(url_for('login'))
    return render_template('profile.html')

# Ruta para el perfil del veterinario
@app.route('/profile_vet')
def profile_vet():
    if 'email' not in session or session.get('role') != 'vet':
        flash('Debes iniciar sesión como veterinario para acceder a esta página.', 'error')
        return redirect(url_for('login'))
    return render_template('profile_vet.html')

# Ruta para cerrar sesión
@app.route('/logout')
def logout():
    session.pop('email', None)
    session.pop('role', None)
    session.pop('is_logged_in', None)
    flash('Has cerrado sesión.', 'info')
    return redirect(url_for('login'))

# Ruta ejemplo para admin (opcional)
@app.route('/admin_dashboard')
def admin_dashboard():
    if 'email' not in session or session.get('role') != 'admin':
        flash('Debes iniciar sesión como administrador para acceder a esta página.', 'error')
        return redirect(url_for('login'))
    return render_template('admin_dashboard.html')


# Ruta para la página de producto
@app.route('/products')
def products():
    return render_template('products.html')

# Ruta para la página de item
@app.route('/item')
def item():
    return render_template('item.html')

# Ruta para la página de help
@app.route('/help')
def help():
    return render_template('help.html')

# Ruta para la página de contacto
@app.route('/contact')
def contact():
    return render_template('contact.html')

# Ruta para la página de agendar hora
@app.route('/schedule')
def schedule():
    return render_template('schedule.html')

# Ruta para la página de perfil
#@app.route('/profile')
#def profile():
#    return render_template('profile.html')

# Ruta para la página de perfil veterinario
#@app.route('/profile_vet')
#def profile_vet():
#    return render_template('profile_vet.html')

# Ruta para la página de carrito
@app.route('/cart')
def cart():
    return render_template('cart.html')


if __name__ == '__main__':
    app.run(debug=True)