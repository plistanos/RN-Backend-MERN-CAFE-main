const { response } = require("express");
const Solicitud = require('../models/Solicitud')

//Obtener Solicitudes
const getSolicitudes = async(req, res = response) => {

    const query = { estado: true };

    const [ total, solicitudes ] = await Promise.all([
        Solicitud.countDocuments(query),
        Solicitud.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            
    ]);

    res.json({

        ok: true,
        total,
        solicitudes
    })

}
//Crar nueva Solicitud
const crearSolicitud = async(req, res = response) => {
    
    const { estado, usuario, ...body } = req.body;

    const solicitudDB = await Solicitud.findOne({ nombre: body.nombre.toUpperCase() });

    
    if ( solicitudDB ) {
        return res.status(400).json({
            msg: `La solicitud ${ solicitudDB.nombre }, ya existe`
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

    const solicitud = new Solicitud( data );

    // Guardar DB
    const nuevoSolicitud = await solicitud.save();
    await nuevoSolicitud
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .execPopulate();
    
    res.status(201).json( nuevoSolicitud );
}
//Actualizar una solicitud
const actualizarSolicitud = async (req, res = response) => {

    const solicitudId = req.params.id;

    try {

        const solicitud = await Solicitud.findById(solicitudId);
        if( !solicitud){
            res.status(404).json({
                ok: false,
                msg: 'Solicitud no existe por ese Id'
            })
        }


        const nuevaSolicitud = {
            ...req.body,
        }

        const solicitudActualizada = await Solicitud.findByIdAndUpdate(solicitudId, nuevaSolicitud, {new:true});
        res.json({
            ok: true,
            solicitud: solicitudActualizada
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar la Solicitud'
        });
    }



}

//Eliminar una solicitud
const eliminarSolicitud = async(req, res = response) => {

    const solicitudId = req.params.id;

    try {

        const solicitud = await Solicitud.findById(solicitudId);
        if( !solicitud){
            res.status(404).json({
                ok: false,
                msg: 'Solicitud no existe por ese Id'
            })
        }

        const solicitudEliminada = await Solicitud.findByIdAndDelete(solicitudId);
        res.json({
            ok: true,
            msg: 'Solicitud Eliminada Correctamente',
            solicitud: solicitudEliminada
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar una solicitud'
        });
    }

   

}

module.exports = {
    getSolicitudes,
    crearSolicitud,
    actualizarSolicitud,
    eliminarSolicitud
}


