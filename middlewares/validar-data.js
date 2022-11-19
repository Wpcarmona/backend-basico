const { response } = require("express");
const { Usuario, Category } = require("../models");



const validatePhone = async(req, res = response, next) => {

    const {phone} = req.params;

    const phoneExiste = await Usuario.findOne({ phone});

    if(phoneExiste){
        return  res.status(200).json({
            header: [{
                error:'el numero de telefono ya esta registrado',
                code: 401,
            }],
            body:[{}]
        })
    }
    

    next();
}

const esRolevalido = async(req, res = response, next) => {

    const {role} = req.params;

    const existeRole = await Role.findOne({ role });
    if ( !existeRole){
        return  res.status(200).json({
            header: [{
                error:`el rol ${role} no esta registrado en la BD`,
                code: 401,
            }],
            body:[{}]
        })
    }
    next();
}


const emailExiste = async(req, res = response, next) => {

    const {email} = req.params;
         //verificar si el correo existe

    const existeEmail = await Usuario.findOne({ email});
    if (existeEmail){
        return  res.status(200).json({
            header: [{
                error:`el ${email} ya existe en la base de datos`,
                code: 401,
            }],
            body:[{}]
        })
    } 

    next();
    
}

const existeUsuarioPorId = async(req, res = response, next) => {

    const {id} = req.params;
    //verificar si el correo existe

    const existeId = await Usuario.findById(id);
    if (!existeId){
        return  res.status(200).json({
            header: [{
                error:`el ID: ${id}, no existe.`,
                code: 401,
            }],
            body:[{}]
        })
    } 
    next();
}


const existeProductById = async(req, res = response, next) => {


    const {id} = req.params;
    //verificar si el correo existe

    const existeId = await Product.findById(id)
    if (!existeId){
        return  res.status(200).json({
            header: [{
                error:`el ID: ${id}, no existe.`,
                code: 401,
            }],
            body:[{}]
        })
    } 
    next();
}

const existeCategoryById = async(req, res = response, next) => {
    //verificar si el correo existe

    const {id} = req.params;
    //verificar si el correo existe

    const existeId = await Category.findById(id)
    if (!existeId){
        return  res.status(200).json({
            header: [{
                error:`el ID: ${id}, no existe.`,
                code: 401,
            }],
            body:[{}]
        })
    } 
    next();
}


module.exports = {
    validatePhone,
    esRolevalido,
    emailExiste,
    existeUsuarioPorId,
    existeProductById,
    existeCategoryById
}