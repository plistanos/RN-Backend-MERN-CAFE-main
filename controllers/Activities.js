const { response, request } = require('express');
const { Activity } = require('../models');


const activityGet = async(req, res = response ) => {

    const query = { estado: true };

    const [ total, activities ] = await Promise.all([
        Activity.countDocuments(query),
        Activity.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            
    ]);

    res.json({
        total,
        activities
    });
}

const activityPost = async(req, res = response ) => {

    const { id } = req.params;
    const activity = await Activity.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( activity );

}

const activityPut = async(req, res = response ) => {

    const { estado, usuario, ...body } = req.body;

    const activityDB = await Activity.findOne({ nombre: body.nombre.toUpperCase() });

    
    if ( activityDB ) {
        return res.status(400).json({
            msg: `La actividad ${ activityDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase()
    }
    data.ticketsDisponibles = data.tickets;
    data.usuario = req.usuario._id;
    data.participantes=[];

    const activity = new Activity( data );

    // Guardar DB
    const nuevoActivity = await activity.save();
    await nuevoActivity
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();
    
    res.status(201).json( nuevoActivity );

}

const activityPatch = async( req = request, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;


    data.usuario = req.usuario._id;
    const activityData = await Activity.findById(id);
    const ticketsDisponibles = activityData.ticketsDisponibles;
    activityData.participantes.push(data.usuario);
    data.ticketsDisponibles = ticketsDisponibles - 1;
    data.participantes = activityData.participantes;

    const activity = await Activity.findByIdAndUpdate(id, data, { new: true });

    await activity
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        
        
    res.json( activity );

}

const activityDelete = async(req, res = response ) => {

    const { id } = req.params;
    // const activityDel = await Activity.findByIdAndUpdate( id, { estado: false }, {new: true });
    const activityDel = await Activity.findByIdAndDelete( id);
    res.json( activityDel );
}




module.exports = {
    activityDelete,
    activityGet,
    activityPatch,
    activityPut,
    activityPost
}