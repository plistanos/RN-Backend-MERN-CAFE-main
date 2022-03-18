const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers');


const usuariosGet = async(req = request, res = response) => {

    // const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            // .skip( Number( desde ) )
            // .limit(Number( limite ))
    ]);

    res.json({
        ok:true,
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {
    
    const { nombre, correo, password, rol, establecimiento, rut, direccion } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol, establecimiento, rut, direccion });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    
    // Guardar en BD
    await usuario.save();

    // Generar el JWT
    const token = await generarJWT( usuario.id );
    res.json({
        ok: true,
        usuario,
        token
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usuariosPatch = async(req, res = response) => {

    const UsuarioID = req.params.id;
    try {

        const usuario = await Usuario.findById(UsuarioID);
        if( !usuario){
            res.status(404).json({
                ok: false,
                msg: 'Usuario no existe por ese Id'
            })
        }


        const nuevoUsuario = {
            ...req.body,
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(UsuarioID, nuevoUsuario, {new:true});
        res.json({
            ok: true,
            usuarioNormal: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar un Usuario Normal'
        });
    }
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndDelete( id, { estado: false } );

    
    res.json({
        ok :true,
        msg: 'Usuario Normal Eliminado Correctamente',
        usuario
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}