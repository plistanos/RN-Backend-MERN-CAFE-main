const { response, request } = require('express');
const { Activity } = require('../models');
const fs = require('fs');
var tj = require('@mapbox/togeojson')
const DOMParser = require('xmldom').DOMParser;


const activityGet = async(req, res = response ) => {

    const query = { estado: true };

    const [ total, activities ] = await Promise.all([
        Activity.countDocuments(query),
        Activity.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            
    ]);

    res.json({
        ok:true,
        total,
        actividades:activities
    });
}

const activityPost = async(req, res = response ) => {

    const { id } = req.params;
    
    const activity = await Activity.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( {
        ok:true,
        actividad:activity
    } );

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
    
    res.status(201).json( {
        ok:true,
        actividad: nuevoActivity
    } );

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
const actualizarActividad = async( req = request, res = response ) => {

    const actividadId = req.params.id;

    try {

        const actividad = await Activity.findById(actividadId);
        if( !actividad){
            res.status(404).json({
                ok: false,
                msg: 'Actividad no existe por ese Id'
            })
        }


        const nuevaActividad = {
            ...req.body,
        }

        const actividadActualizada = await Activity.findByIdAndUpdate(actividadId, nuevaActividad, {new:true});
        res.json({
            ok: true,
            actividad: actividadActualizada
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }



}

const deleteActivitiesByDate = async( req = request, res = response ) => {

    const query = { estado: true };

    const activities = await Activity.find(query)
       
    var actividades = []

    activities.forEach((activity)=>{
        const arrayDate = activity.date.split(' ')
        
        const DDMMYY = arrayDate[0].split('/')
        const HHMM = arrayDate[1].split(':')
        const fecha = new Date(
            parseInt(DDMMYY[2]),
            parseInt(DDMMYY[1]) - 1,
            parseInt(DDMMYY[0]),
            parseInt(HHMM[0]),
            parseInt(HHMM[1])
        )
        const fechaActual = new Date(Date.now())
        const id = activity._id
        if(fecha < fechaActual){
            activity.estado = false
            
            const actividad = Activity.findOneAndUpdate(id,activity,{new:true})
            

            
        }else{
            activity.estado = true
            actividades.push(activity)
            const actividad = Activity.findByIdAndUpdate(id,activity,{new:true})
        }
        
    })
        
        
    res.json( actividades );

}
const activityDelete = async(req, res = response ) => {

    const { id } = req.params;
    // const activityDel = await Activity.findByIdAndUpdate( id, { estado: false }, {new: true });
    const activityDel = await Activity.findByIdAndDelete( id);
    res.json( {
        ok: true,
        msg: 'Actividad Eliminada Correctamente',
        actividad: activityDel
    } );
}

const convertKMLtoJSON = (req, res = response) => {
    
    var kml = new DOMParser().parseFromString(fs.readFileSync('./uploads/doc.kml','utf8'));

    var converted = tj.kml(kml);

    var convertedWithStyles = tj.kml(kml, {styles:true});

    res.json(converted);
}

module.exports = {
    activityDelete,
    activityGet,
    activityPatch,
    activityPut,
    activityPost,
    convertKMLtoJSON,
    deleteActivitiesByDate,
    actualizarActividad
}