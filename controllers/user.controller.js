const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers');


const usuariosGet = async(req = request, res= response) => {

    const {limit, desde} = req.query;
    const query = {state: true}
    const [total, users] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).limit(Number(limit)).skip(Number(desde))
    ]);
    res.status(200).json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            total,
            users
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

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.status(200).json({
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

    const {name, email, password, role, phone, directory} = req.body;
    
    if(name == undefined || name == ""){
        return res.status(200).json({
            header: [{
                code: 400,
                error: 'El nombre es obligatorio'
            }],
            body:[{}]
        });
    }

    if(email == undefined || email == ""){
        return res.status(200).json({
            header: [{
                code: 400,
                error: 'El correo es obligatorio'
            }],
            body:[{}]
        });
    }

    if(password == undefined || password == ""){
        return res.status(200).json({
            header: [{
                code: 400,
                error: 'La contraseña es obligatoria '
            }],
            body:[{}]
        });
    }

    if(password.length < 6){
        return res.status(200).json({
            header: [{
                code: 400,
                error: 'La contraseña debe contener minimo 6 caracteres'
            }],
            body:[{}]
        });
    }

    if(phone == undefined || phone == ""){
        return res.status(200).json({
            header: [{
                code: 400,
                error: 'El telefono es obligatorio'
            }],
            body:[{}]
        });
    }

    if(phone.length<10){
        return res.status(200).json({
            header: [{
                code: 400,
                error: 'el numero de telefono debe contener 10 caracteres'
            }],
            body:[{}]
        });
    }

    const existeEmail = await Usuario.findOne({ email:email.toUpperCase()});
    const existePhone = await Usuario.findOne({ phone:phone});

    if(existeEmail){
        return res.status(200).json({
            header: [{
                code: 400,
                error: 'El correo ya se encuentra registrado'
            }],
            body:[{}]
        });
    }
    
    if(existePhone){
        return res.status(200).json({
            header: [{
                code: 400,
                error: 'El numero de telefono ya se encuentra registrado'
            }],
            body:[{}]
        });
    }

    var firstName = name.split(' ')[0];
    const usuario = new Usuario({
        name, 
        email:email.toUpperCase(), 
        password, 
        role, 
        phone, 
        directory, 
        firstName});

    //Encriptar la contra
    const salt = bcryptjs.genSaltSync();
    const token = await generarJWT(usuario.id);
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
            token: token,
            usuario
        }]
    }); 
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params

    try {
        const usuario = await Usuario.findByIdAndUpdate(id, {state: false}, {new: true});
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