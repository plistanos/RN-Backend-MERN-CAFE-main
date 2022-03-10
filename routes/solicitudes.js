/*

    Solicitud Router
    /api/solicitudes

*/

const { Router } = require('express')
const { check } = require('express-validator')

const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt');
const {getSolicitudes,crearSolicitud,actualizarSolicitud,eliminarSolicitud} = require('../controllers/solicitudes');

const router = Router();


// Todas tienes que pasar por la validacion del JWT de esta linea para abajo quedan protegidas con el JWT
router.use(validarJWT);

// Obtener Solicitudes
router.get('/',getSolicitudes);

// Crear Solicitudes
router.post(
    '/',
    [
        check('nombre', 'El titulo es obligatorio').not().isEmpty(),
        check('categoria', 'La categoria es obligatorio').not().isEmpty(),
        
        check('descripcion', 'La descripcion es obligatorio').not().isEmpty(),
        check('valorActividad', 'El valor de la actividad es obligatorio').not().isEmpty(),
        check('fechaCreacion', 'Fecha de creacion de la actividad es obligatoria').not().isEmpty(),
        check('fechaRealizacion', 'Fecha a realizar la actividad es obligatoria').not().isEmpty(),
        check('hora', 'La hora de la actividad es obligatoria').not().isEmpty(),
        validarCampos
    ],
    crearSolicitud);

// Actulizar Solicitud
router.put('/:id',actualizarSolicitud);

// Eliminar Solicitud
router.delete('/:id', eliminarSolicitud);


module.exports = router;