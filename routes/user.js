const { Router } = require('express');
const { check } = require('express-validator');
const { 
    usuariosGet, 
    usuariosPut, 
    usuariosPost, 
    usuariosDelete, 
    usuariosPatch 
} = require('../controllers/user.controller');
const { esRolevalido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const {validateCampos} = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id',).custom(existeUsuarioPorId), //si solo se tiene una variable, se entiende por defecto que esa se enviara
    check('role').custom(esRolevalido),
    validateCampos
],usuariosPut);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 letras').isLength({min: 6}),
    check('email').custom(emailExiste),
    check('role').custom(esRolevalido),
    //check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validateCampos
] ,usuariosPost); //si se tienen mas de 3, significa que el del medio es un middlewares

router.delete('/:id', [
    validateJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id',).custom(existeUsuarioPorId), //si solo se tiene una variable, se entiende por defecto que esa se enviara
    validateCampos
],usuariosDelete);

router.patch('/', usuariosPatch);


module.exports = router;