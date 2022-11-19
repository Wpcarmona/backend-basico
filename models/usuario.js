

const {Schema, model} = require('mongoose');


const usuarioSchema = Schema({

    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    phone: {
        type:Number,
        required: [true, 'El numero de telefono es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'la contra es obligatoria']
    },
    img: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
        //enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    state: {
        type: Boolean,
        default:true
    },
    google: {
        type: Boolean,
        default: false
    },
    directory: {
        type: Boolean,
        default: false
    },
    firstName: {
        type: String,
        default: ''
    }
});

usuarioSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user
}



module.exports =  model('Usuario', usuarioSchema);