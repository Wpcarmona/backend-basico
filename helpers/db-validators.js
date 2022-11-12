const Role = require('../models/role');
const Usuario = require('../models/usuario')

const esRolevalido = async(role = '') => {
    const existeRole = await Role.findOne({ role });
    if ( !existeRole){
        throw new Error(`el rol ${role} no esta registrado en la BD`)
    }
}


const emailExiste = async(email = '') => {
         //verificar si el correo existe

    const existeEmail = await Usuario.findOne({ email});
    if (existeEmail){
        throw new Error(`el correo: ${email}, ya se encuentra registrado.`);
    } 
}

const existeUsuarioPorId = async(id) => {
    //verificar si el correo existe

const existeId = await Usuario.findById(id);
if (!existeId){
   throw new Error(`el ID: ${id}, no existe.`);
} 
}

module.exports = {
    esRolevalido,
    emailExiste,
    existeUsuarioPorId
}





