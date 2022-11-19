const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.path = {
            usuarios: '/api/usuarios',
            auth    : '/api/auth',
            category: '/api/categories',
            products: '/api/products',
            finds   : '/api/finds',
            uploads : '/api/uploads'
        }

        // conectar a base de datos
        this.conectarDB();


        //Middlewares
        this.middlewares();

        //rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //cors

        this.app.use(cors());

        //Lectura y parseo del body para POST
        this.app.use(express.json() );

        //Directorio publico
        this.app.use(express.static('public'));

        //FileupLoad - carga de archivos 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.path.auth,require('../routes/auth'));
        this.app.use(this.path.usuarios,require('../routes/user'));
        this.app.use(this.path.category,require('../routes/category'));
        this.app.use(this.path.products,require('../routes/product'));
        this.app.use(this.path.finds,require('../routes/find'));
        this.app.use(this.path.uploads,require('../routes/uploads'));
    }

    listen(){
        this.app.listen(this.port)
    }


}

module.exports = Server;