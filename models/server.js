const express = require('express');
const cors = require('cors');
class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares
        this.middlewares();

        //rutas de mi aplicacion
        this.routes();
    }

    middlewares(){

        //cors

        this.app.use(cors());

        //Lectura ypaseo del body para POST
        this.app.use(express.json() );

        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosPath,require('../routes/user'));
    }

    listen(){
        this.app.listen(this.port)
    }


}

module.exports = Server;