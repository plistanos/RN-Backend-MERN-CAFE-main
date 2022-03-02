const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Activity } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'activities',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    });

}

const buscarActivities = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 
    const actividades = []
    if ( esMongoID ) {
        const activity = await Activity.findById(termino)
                            .populate('categoria','nombre');
        

        
        const DDMMYY = activity.fechaRealizacion.split('/')
        const HHMM = activity.hora.split(':')
        const fecha = new Date(
            parseInt(DDMMYY[2]),
            parseInt(DDMMYY[1]) - 1,
            parseInt(DDMMYY[0]),
            parseInt(HHMM[0]),
            parseInt(HHMM[1])
        )
        const fechaActual = new Date(Date.now())
        const id = activity._id
        const actividad = null
        if(fecha > fechaActual){
            actividad = activity
        }

        return res.json({
            results: ( actividad ) ? [ actividad ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const activities = await Activity.find({ nombre: regex, estado: true })
                            .populate('categoria','nombre')

    
    activities.forEach((activity)=>{
        const DDMMYY = activity.fechaRealizacion.split('/')
        const HHMM = activity.hora.split(':')
        const fecha = new Date(
            parseInt(DDMMYY[2]),
            parseInt(DDMMYY[1]) - 1,
            parseInt(DDMMYY[0]),
            parseInt(HHMM[0]),
            parseInt(HHMM[1])
        )
        const fechaActual = new Date(Date.now())
        const id = activity._id
        if(fecha > fechaActual){     
            actividades.push(activity)
        }
        
    })
    res.json({
        results: actividades
    });

}



const buscar = ( req, res = response ) => {
    
    const { coleccion, termino  } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'activities':
            buscarActivities(termino, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsquda'
            })
    }

}



module.exports = {
    buscar
}