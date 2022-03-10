const { Schema, model } = require('mongoose');
const usuario = require('./usuario');

const ActivitySchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuarioEncargado: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true
    },
    participantesInscritos: {
        type: Number,
        required: true
    },
    participantes: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }],
    valorActividad: {
        type: Number,
        default: 0
    },
    freePass: {
        type: Boolean,
        default: false
    },
    tickets: {
        type: Number,
        default: 0
    },
    ticketsDisponibles: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { 
        type: String,
        required: true,
        default: '' 
    },
    disponible: { 
        type: Boolean,
        default: true 
    },
    imagen: { 
        type: String 
    },
    latitude:{
        type: Number
    },
    longitude:{
        type: Number
    },
    fechaCreacion:{
        type: String,
        required: true,
        default: new Date(Date.now())
    },
    fechaRealizacion:{
        type: String,
        required: true
    },
    hora:{
        type: String,
        required: true
    },
    fono:{
        type: String,
        required: true
    },
    contactEmail:{
        type: String,
        required: true
    },
    direccion:{
        type: String,
        required: true
    }
});


ActivitySchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Activity', ActivitySchema );
