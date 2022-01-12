const { response, request } = require('express');
const { Informacion } = require('../models');


const informacionGet = async(req, res = response ) => {

    const query = { estado: true };

    const [ total, informaciones ] = await Promise.all([
        Informacion.countDocuments(query),
        Informacion.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            
    ]);

    res.json({
        total,
        informaciones
    });
}

const informacionPost = async(req, res = response ) => {

    const { id } = req.params;
    const informacion = await Informacion.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( informacion );

}

const informacionPut = async(req, res = response ) => {

    const { estado, usuario, ...body } = req.body;

    const informacionDB = await Informacion.findOne({ nombre: body.nombre.toUpperCase() });

    
    if ( informacionDB ) {
        return res.status(400).json({
            msg: `La información ${ informacionDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase()
    }

    data.usuario = req.usuario._id;

    const informacion = new Informacion( data );

    // Guardar DB
    const nuevoInformacion = await informacion.save();
    await nuevoInformacion
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();
    
    res.status(201).json( nuevoInformacion );

}

const informacionPatch = async( req = request, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;


    data.usuario = req.usuario._id;
    const informacionData = await Informacion.findById(id);

    const informacion = await Informacion.findByIdAndUpdate(id, data, { new: true });

    await informacion
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        
        
    res.json( informacion );

}

const informacionDelete = async(req, res = response ) => {

    const { id } = req.params;
    // const activityDel = await Activity.findByIdAndUpdate( id, { estado: false }, {new: true });
    const informacionDel = await Informacion.findByIdAndDelete( id);
    res.json( informacionDel );
}




module.exports = {
    informacionDelete,
    informacionGet,
    informacionPatch,
    informacionPut,
    informacionPost
}