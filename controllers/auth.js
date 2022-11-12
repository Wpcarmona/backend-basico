const { response } = require('express');
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


const login = async(req, res = response) => {

    const {email, password} = req.body

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({
                header: [{
                    code: 400,
                    error: 'El correo no se encuentra registrado'
                }],
                body:[{}]
            });
        }

        // Si el usuario esta activo
        if(!usuario.state){
            return res.status(400).json({
                header: [{
                    code: 400,
                    error: 'Cuenta Eliminada'
                }],
                body:[{}]
            });
        }

        //Verificar el password

        const validatePassword = bcryptjs.compareSync(password, usuario.password);
        if(!validatePassword){
            return res.status(400).json({
                header: [{
                    code: 400,
                    error: 'Password incorrecto'
                }],
                body:[{}]
            });
        }
        // Generar JWT

        const token = await generarJWT(usuario.id);


        res.json({
            header: [{
                ERROR: 'NO ERROR',
                code: 200,
                token,
            }],
            body: [{
                usuario
            }]
           
            
        })
    
    } catch (error) {
        return res.status(500).json({
            code: 500,
            msg: 'ERROR EN EL SERVIDOR'
        })
    }

    
}

module.exports = {
    login
}