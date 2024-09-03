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

# Ruta para la página de registro
@app.route('/profile')
def profile():
    return render_template('profile.html')

# Ruta para la página de producto
@app.route('/products')
def products():
    return render_template('products.html')

# Ruta para la página de item
@app.route('/item')
def item():
    return render_template('item.html')

if __name__ == '__main__':
    app.run(debug=True)