from django.db import models

class Domicilio(models.Model):
    id_domicilio = models.AutoField(primary_key=True)
    numero = models.CharField(max_length=50)
    calle = models.CharField(max_length=100)
    comuna = models.ForeignKey('Comuna', on_delete=models.CASCADE)

class Comuna(models.Model):
    id_comuna = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=50)
    cuidad = models.ForeignKey('Cuidad', on_delete=models.CASCADE)

class Cuidad(models.Model):
    id_cuidad = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=50)
    region = models.ForeignKey('Region', on_delete=models.CASCADE)

class Region(models.Model):
    id_region = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=50)

class Usuario(models.Model):
    id_usuario = models.CharField(max_length=9, primary_key=True)
    nombre = models.CharField(max_length=50)
    appaterno = models.CharField(max_length=50)
    apmaterno = models.CharField(max_length=50)
    correo = models.CharField(max_length=50)
    contraseña = models.CharField(max_length=50)
    celular = models.IntegerField()
    domicilio = models.ForeignKey(Domicilio, on_delete=models.CASCADE)

class Administrador(models.Model):
    id_administrador = models.CharField(max_length=9, primary_key=True)
    nombre = models.CharField(max_length=50)
    appaterno = models.CharField(max_length=50)
    apmaterno = models.CharField(max_length=50)
    correo = models.CharField(max_length=50)
    contraseña = models.CharField(max_length=50)
    celular = models.IntegerField()
    domicilio = models.ForeignKey(Domicilio, on_delete=models.CASCADE)

class MedicoVeterinario(models.Model):
    id_veterinario = models.CharField(max_length=9, primary_key=True)
    nombre = models.CharField(max_length=50)
    appaterno = models.CharField(max_length=50)
    apmaterno = models.CharField(max_length=50)
    correo = models.CharField(max_length=50)
    contraseña = models.CharField(max_length=50)
    celular = models.IntegerField()
    domicilio = models.ForeignKey(Domicilio, on_delete=models.CASCADE)

class Mascota(models.Model):
    id_mascota = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    raza = models.CharField(max_length=50)
    fecha_nacimiento = models.DateField()
    foto = models.BinaryField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

class Cita(models.Model):
    id_cita = models.AutoField(primary_key=True)
    fecha = models.DateField()
    descripcion = models.CharField(max_length=100)
    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE)
    medico_veterinario = models.ForeignKey(MedicoVeterinario, on_delete=models.CASCADE)

class Agenda(models.Model):
    id_agenda = models.AutoField(primary_key=True)
    fecha = models.DateField()
    hora = models.TimeField()
    medico_veterinario = models.ForeignKey(MedicoVeterinario, on_delete=models.CASCADE)

class AtencionServicio(models.Model):
    id_atencion = models.AutoField(primary_key=True)
    fecha = models.DateField()
    descripcion = models.CharField(max_length=100)
    cita = models.ForeignKey(Cita, on_delete=models.CASCADE)

class CarnetDigital(models.Model):
    id_carnet_digital = models.AutoField(primary_key=True)
    fechaemision = models.DateField()
    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE, unique=True)

class CasoDonacion(models.Model):
    id_donacion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    foto = models.BinaryField()
    descripcion = models.CharField(max_length=200)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

class Certificado(models.Model):
    id_certificado = models.AutoField(primary_key=True)
    fecha_emision = models.DateField()
    descripcion = models.CharField(max_length=200)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

class Comentario(models.Model):
    id_comentario = models.AutoField(primary_key=True)
    texto = models.CharField(max_length=200)
    fecha = models.DateField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

class Documento(models.Model):
    id_documento = models.AutoField(primary_key=True)
    total_compra = models.IntegerField()
    nombre_producto = models.CharField(max_length=50, blank=True, null=True)
    fecha = models.DateField()
    cantidad_producto = models.IntegerField()
    venta = models.ForeignKey('Venta', on_delete=models.CASCADE)
    forma_pago = models.ForeignKey('FormaPago', on_delete=models.CASCADE)

class FormaPago(models.Model):
    id_forma_pago = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=50)
    caso_donacion = models.ForeignKey(CasoDonacion, on_delete=models.CASCADE)

class HistorialMedico(models.Model):
    id_historial = models.AutoField(primary_key=True)
    fecha = models.DateField()
    descripcion = models.CharField(max_length=200)
    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE)

class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre_producto = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=100)
    valor = models.IntegerField()
    marca = models.CharField(max_length=50, blank=True, null=True)
    stock = models.IntegerField()
    tipo_producto = models.ForeignKey('TipoProducto', on_delete=models.CASCADE)

class Recordatorio(models.Model):
    id_recordatorio = models.AutoField(primary_key=True)
    fecha = models.DateField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

class TipoAtencion(models.Model):
    id_tipo_atencion = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=50)
    atencion_servicio = models.ForeignKey(AtencionServicio, on_delete=models.CASCADE)

class TipoCita(models.Model):
    id_tipo_cita = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=100)
    cita = models.ForeignKey(Cita, on_delete=models.CASCADE)

class TipoEspecialidad(models.Model):
    id_especialidad = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=50)
    medico_veterinario = models.ForeignKey(MedicoVeterinario, on_delete=models.CASCADE)

class TipoMascota(models.Model):
    id_tipo_mascota = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=50, blank=True, null=True)
    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE, unique=True)

class TipoProducto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=50)

class TipoRecordatorio(models.Model):
    id_tipo_recordatorio = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=100)
    recordatorio = models.ForeignKey(Recordatorio, on_delete=models.CASCADE)

class Venta(models.Model):
    id_venta = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=100)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
