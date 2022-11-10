const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res= response) => {

    const {limit, desde} = req.query;
    const query = {state: true}
    if(isNaN(limit) | isNaN(desde) ){
        return res.status(400).json({
            error:'ERROR',
            code: 400,
            msg: 'uno o mas de valores ingresados no es un numero'
        })
    }
    const resp = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .limit(Number(limit))
            .skip(Number(desde))
    ]);
    res.json({
        error:'NO ERROR',
        code: 200,
        resp
    })
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const {_id, password, google, email, ...resto} = req.body;

    // TODO validar contra base de datos

    if(password){
         //Encriptar la contra
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        error:'NO ERROR',
        code: 200,
        usuario
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
        error:'NO ERROR',
        code: 200,
        usuario
    }); 
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params

    // Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    //probar 
  /*  try {
        const usuario = await Usuario.findByIdAndUpdate(id, {state: false});
        res.json({
            error: 'NO ERROR',
            code: 200,
            usuario
        })
    } catch (error) {
        res.json({
            error: 'Error no se pudo eliminar el usuario',
            code: 400
        })
    } */

    const usuario = await Usuario.findByIdAndUpdate(id, {state: false});
        res.json({
            error: 'NO ERROR',
            code: 200,
            usuario
        })
  
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