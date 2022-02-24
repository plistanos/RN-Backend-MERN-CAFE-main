const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { activityGet,
        activityPost,
        activityDelete,
        activityPatch, 
        activityPut,
        convertKMLtoJSON,
        deleteActivitiesByDate } = require('../controllers/Activities');

const { existeCategoriaPorId, existeActivityPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', activityGet );

router.get('/geojson', convertKMLtoJSON );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeActivityPorId ),
    validarCampos,
], activityPost );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], activityPut );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom( existeActivityPorId ),
    validarCampos
], activityPatch );

router.post('/updateactivities',  deleteActivitiesByDate);


// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id').custom( existeActivityPorId ),
    validarCampos,
], activityDelete);


module.exports = router;