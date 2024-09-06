def generar_carnet(nombre, especie, raza, edad):
    # Aquí podrías generar el carnet como un archivo PDF o HTML dinámico
    # pero para simplificar, retornamos una string con los datos
    return f"""
        <div class='p-4 border rounded bg-blue-100'>
            <h3 class='font-bold'>Carnet Digital</h3>
            <p><strong>Nombre:</strong> {nombre}</p>
            <p><strong>Especie:</strong> {especie}</p>
            <p><strong>Raza:</strong> {raza}</p>
            <p><strong>Edad:</strong> {edad} años</p>
        </div>
    """
