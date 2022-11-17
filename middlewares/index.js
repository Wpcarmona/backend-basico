const ValidateCampos = require('../middlewares/validar-campos');
const ValidateJWT  = require('../middlewares/validar-jwt');
const ValidateRoles = require('../middlewares/validar-roles');


module.exports = {
    ...ValidateCampos,
    ...ValidateJWT,
    ...ValidateRoles,
}