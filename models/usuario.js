
const { Schema, model } = require('mongoose');
const { stringify } = require('uuid');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    direccion: {
        type: String,
        require: [true, "La dirección es obligatoria"],
    },
    establecimiento: {
        type: String,
        require: [true, "El establecimiento es obligatorio"]
    },
    rut: {
        type: String,
        require: [true, "El rut es obligatorio"]
    },
    actividades:[{
        type: Schema.Types.ObjectId,
        ref: 'Activity',
        default: []
    }]

});



UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema );
