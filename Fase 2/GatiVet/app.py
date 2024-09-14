from flask import Flask, render_template


app = Flask(__name__)



# Ruta para la página de home
@app.route('/')
def home():
    return render_template('home.html')

# Ruta para la página de login
@app.route('/login')
def login():
    return render_template('login.html')

# Ruta para la página de registro
@app.route('/registration')
def registration():
    return render_template('registration.html')

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
@app.route('/profile')
def profile():
    return render_template('profile.html')

# Ruta para la página de carrito
@app.route('/cart')
def cart():
    return render_template('cart.html')


if __name__ == '__main__':
    app.run(debug=True)