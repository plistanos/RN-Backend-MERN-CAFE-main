const {Schema, model} = require('mongoose');


// Estructura de una Solicitud
const SolicitudSchema = Schema({
    
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
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true
    },
    participantesInscritos: {
        type: Number
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
    img: { 
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
        
        
    },
    fechaRealizacion:{
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

SolicitudSchema.method('toJSON', function () {
    const{__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Solicitud', SolicitudSchema);