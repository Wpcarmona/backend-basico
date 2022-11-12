const validateCampos = require('../middlewares/validar-campos');
const validateJWT  = require('../middlewares/validar-jwt');
const validateRoles = require('../middlewares/validar-roles');


module.exports = {
    ...validateCampos,
    ...validateJWT,
    ...validateRoles,
}