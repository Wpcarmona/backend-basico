const { Router} = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validateCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'el password es obligatorio').not().isEmpty(),
    validateCampos
], login);



module.exports = router