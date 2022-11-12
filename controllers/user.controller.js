const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res= response) => {

    const {limit, desde} = req.query;
    const query = {state: true}
    const resp = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).limit(Number(limit)).skip(Number(desde))
    ]);
    res.json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            resp
        }]
    })
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const {_id, password, google, email, state, ...resto} = req.body;

    // TODO validar contra base de datos

    if(password){
         //Encriptar la contra
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'Usuario actualizado correctamente',
            usuario
        }]
    })
}

const usuariosPost = async (req, res = response) => {

    const {name, email, password, role} = req.body;
    const usuario = new Usuario({name, email, password, role});

    //Encriptar la contra
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en BD
    await usuario.save();

    res.json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'El usuario fue creado correctamente',
            usuario
        }]
    }); 
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params

    try {
        const usuario = await Usuario.findByIdAndUpdate(id, {state: false});
        //const usuarioAutenticado = req.usuario;
        res.status(200).json({
            header: [{
                error:'NO ERROR',
                code: 200,
            }],
            body:[{
                msg:'El usuario fue borrado satisfactoriamente',
                usuario
            }]
        })
    } catch (error) {
        res.status(500).json({
            header: [{
                error: 'Error no se pudo eliminar el usuario',
                code: 500
            }],
            body:[{}]
            
        })
    } 
  
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}