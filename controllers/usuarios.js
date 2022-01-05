const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'michaelvilches747@gmail.com',
        pass: 'galaonli1'
    }
});
const message = "cuenta registrada"; 

const usuariosGet = async(req = request, res = response) => {

    const { limite = 10, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
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

    //comprobar correo
    const mailOptions = {
        from: 'michaelvilches747@gmail.com',
        to: correo,
        subject: 'correo de verificacion',
        text: message
    };
    transporter.sendMail(mailOptions,async(error,info)=>{
        if(error){
            res.json({
                error
            })
        }
    });
    // Guardar en BD
    await usuario.save();

    // Generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
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

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    
    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}