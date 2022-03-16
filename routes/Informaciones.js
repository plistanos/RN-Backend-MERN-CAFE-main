const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { getInformaciones,
crearInformacion,
actualizarInformacion,
eliminarInformacion } = require('../controllers/Informaciones');

const { existeCategoriaPorId, existeInformacionPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/',getInformaciones);

// Crear Informacion
router.post(
    '/',
    [
        validarJWT,
        check('titulo', 'El titulo es obligatorio').not().isEmpty(),
        check('categoria', 'La categoria es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es obligatorio').not().isEmpty(),
        check('fechaCreacion', 'Fecha de creacion de la actividad es obligatoria').not().isEmpty(),
        check('categoria','No es un id de Mongo').isMongoId(),
        check('categoria').custom( existeCategoriaPorId ),
        validarCampos
    ],
    crearInformacion);

// Actulizar Informacion
router.put('/:id',actualizarInformacion);

// Eliminar Informacion
router.delete('/:id', eliminarInformacion);


module.exports = router;