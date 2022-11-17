const {Router} = require('express');
const { find } = require('../controllers/find');
const { validateCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validar-jwt');



const router = Router();


router.get('/:colection/:term',[
    validateJWT
],find)



module.exports = router