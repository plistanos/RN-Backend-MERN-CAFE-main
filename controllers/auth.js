const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'michaelvilches747@gmail.com',
        pass: 'vxhrjixhuofnthpd'
    }
});



const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no son correctos'
            });
        }

        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no son correctos'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no son correctos'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }   

}
const random = (min, max) => {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

const validarEmail = async(req,res = response) => {
    const { correo, name } = req.body;
    const state = 1
    
    // Generar código
    const aleatorio = random(1000,9999)

    // Crear mensaje

    const message = `Hola ${name}!, Su codigo de verificación es : ${aleatorio}` 

    // Enviar email
    const mailOptions = {
        from: 'michaelvilches747@gmail.com',
        to: correo,
        subject: 'Correo de verificacion',
        text: message
    }
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            state = 0
        }else{
            state = 1
            
        }
    });
    // retornar estado y codigo
    res.json({
        state,
        aleatorio
    })
}

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }



}

const validarTokenUsuario = async (req, res = response ) => {

    // Generar el JWT
    const token = await generarJWT( req.usuario._id );
    
    res.json({
        ok:true,
        usuario: req.usuario,
        token: token,
    })

}



module.exports = {
    login,
    googleSignin,
    validarTokenUsuario,
    validarEmail
}
