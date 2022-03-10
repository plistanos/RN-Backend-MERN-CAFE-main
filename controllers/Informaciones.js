const { response, request } = require('express');
const { Informacion } = require('../models');


const getInformaciones = async(req, res = response) => {

    const informaciones = await Informacion.find().populate();

    res.json({

        ok: true,
        informaciones
    })

}

const crearInformacion = async(req, res = response) => {
    
    const informacion = new Informacion( req.body );
    try{
        informacion.usuarioEncargado = req.uid;
        const informacionGuardada = await informacion.save()

        res.json({
            ok: true,
            informacion: informacionGuardada
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear Informacion'
        });
    }
}

const actualizarInformacion = async (req, res = response) => {

    const informacionId = req.params.id;

    try {

        const informacion = await Informacion.findById(informacionId);
        if( !informacion){
            res.status(404).json({
                ok: false,
                msg: 'Informacion no existe por ese Id'
            })
        }


        const nuevaInformacion = {
            ...req.body,
        }

        const informacionActualizada = await Informacion.findByIdAndUpdate(informacionId, nuevaInformacion, {new:true});
        res.json({
            ok: true,
            informacion: informacionActualizada
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar Informacion'
        });
    }



}

const eliminarInformacion = async(req, res = response) => {

    const informacionId = req.params.id;

    try {

        const informacion = await Informacion.findById(informacionId);
        if( !informacion){
            res.status(404).json({
                ok: false,
                msg: 'Informacion no existe por ese Id'
            })
        }

        const informacionEliminada = await Informacion.findByIdAndDelete(informacionId);
        res.json({
            ok: true,
            msg: 'Informacion Eliminada Correctamente',
            informacion: informacionEliminada
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar informacion'
        });
    }

   

}

module.exports = {
    getInformaciones,
    crearInformacion,
    actualizarInformacion,
    eliminarInformacion
}

