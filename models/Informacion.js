const { Schema, model } = require('mongoose');
const usuario = require('./usuario');


const InformacionSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    usuarioEncargado: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    fechaCreacion:{
        type: String,
        required: true
    },
    linkNoticia: {
        type: String,
    }
   
});

InformacionSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Informacion', InformacionSchema );