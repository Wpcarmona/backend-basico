const { response } = require("express");
const {Category} = require('../models');
const { ObjectId } = require('mongoose').Types;


// obtenerCategoirias - Paginado - total - populate

const obtenerCategories = async(req, res= response) => {

    const {limit, desde} = req.query;
    const query = {state: true}
    const [total, Categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
        .populate('user','name')
        .limit(Number(limit))
        .skip(Number(desde))
    ]);
    res.status(200).json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            total,
            Categories
        }]
    })    

}


const obtenerUnaCateriesByID = async(req, res= response) => {

    const {id} = req.params; 
    const category = await Category.findById(id).populate('user', 'name')
    if(!category){
        res.status(200).json({
            header: [{
                error:`no se encontro categoria con ese id`,
                code: 400,
            }],
            body:[{}]
        }) 
    }                     
    res.status(200).json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            category
        }]
    }) 

}

const obtenerTodasCategoriesByID= async(req, res= response) => {

    const {id} = req.params
    const query = {state: true}
    const findCategoriesByID = await Category.find({
        user: ObjectId(id)

    }).populate('user','name')
    const countCategories = await Category.countDocuments(query)

    if(findCategoriesByID =='' || findCategoriesByID == null || findCategoriesByID == undefined ){
        return res.status(200).json({
            header: [{
                error:'No tienes categorias registradas',
                code: 200,
            }],
            body:[{}]
        }) 
    }

    return res.status(200).json({
        header: [{
            error:'NO ERROR',
            code: 200,
        }],
        body:[{
            total: countCategories,
            findCategoriesByID
        }]
    })
    
}

const crearCategory = async(req, res= response) => {

    const {name} = req.body

    if(name == '' || name == null || name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre de la categoria`,
                code: 400,
            }],
            body:[{}]
        })
    }

    const categoryDB = await Category.findOne({name:name.toUpperCase});

    if(categoryDB) {
        return res.status(200).json({
            header: [{
                error:`la caterogia ${name}, ya existe`,
                code: 400,
            }],
            body:[{}]
        })
    }

    //Generar la data a guardar

    const data = {
        name:name.toUpperCase(),
        user: req.usuario._id
    }


    console.log(data)

    const category = new Category(data);

    //Guardar DB

    await category.save(); 

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'La categoria se creo correctamente',
            category
        }]
    })

}

const actualizarCategory = async(req, res = response) => {

    const {id} = req.params;
    const {state, user,...data} = req.body;

    const findId = await Category.findById(id)

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe esa categoria`,
                code: 400,
            }],
            body:[{}]
        })
    }

    if(data.name == '' || data.name == null || data.name == undefined){
        return res.status(200).json({
            header: [{
                error:`Por favor ingrese el nombre de la categoria`,
                code: 400,
            }],
            body:[{}]
        })
    }

    data.name = data.name.toUpperCase();
    data.user = req.user;

    const category = await Category.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'La categoria se actualizo correctamente',
            category
        }]
    })
}

const borrarCategory =  async(req, res=response) => {

    const {id} = req.params;

    const findId = await Category.findById(id)

    if(!findId){
        return res.status(200).json({
            header: [{
                error:`No existe esa categoria`,
                code: 400,
            }],
            body:[{}]
        })
    }

    
    const categoryDelete = await Category.findByIdAndUpdate(id , {state:false}, {new:true});

    res.status(200).json({
        header: [{
            error: 'NO ERROR',
            code: 200,
        }],
        body:[{
            msg: 'La categoria se borro correctamente',
            categoryDelete
        }]
    })

}


module.exports = {
    crearCategory,
    obtenerCategories,
    obtenerTodasCategoriesByID,
    actualizarCategory,
    borrarCategory,
    obtenerUnaCateriesByID
}