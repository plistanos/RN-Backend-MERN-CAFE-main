const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT } = require('../middlewares');


const { login, googleSignin, validarTokenUsuario, validarEmail } = require('../controllers/auth');


const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.post('/validaremail',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],validarEmail );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );


router.get('/',[
    validarJWT
], validarTokenUsuario );



module.exports = router;