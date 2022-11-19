
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2
const { response } = require("express");
const { Usuario, Product} = require('../models');
const { uploadFile } = require("../helpers");

cloudinary.config(process.env.CLOUDINARY_URL);



const cargarFile = async(req, res = response) => {

    const pathComplete = await uploadFile(req.files,'user');

    res.json({
      path: pathComplete
    })
   
}

///ya nose usa 

const actualizarUserImg = async(req, res = response) => {

  const {id, colection} = req.params

  let model;
  switch (colection) {
    case 'usuarios':
      model = await Usuario.findById(id);
      if(!model){
        return res.status(200).json({
          header: [{
              error:`el usuario no esta registrado en base de datos`,
              code: 400,
          }],
          body:[{}]
      })
      }

      
    break;
    case 'products':
      model = await Product.findById(id);
      if(!model){
        return res.status(200).json({
          header: [{
              error:`no existe el producto registrado en la base de datos`,
              code: 400,
          }],
          body:[{}]
      })
      }
      
      
    break;
  
    default:
      return res.status(500).json({
        header: [{
            error:`INTERNAL SERVER ERROR`,
            code: 500,
        }],
        body:[{}]
    })
  }

  //Limpiar imagenes previas
  if(model.img){
    //hay que borrar la imagen del servidor
    const pathImg = path.join(__dirname, '../uploads',colection, model.img);
    if(fs.existsSync(pathImg)){
      fs.unlinkSync(pathImg);
    }
  }

  const pathComplete = await uploadFile(req.files,colection);
  model.img = pathComplete.body[0].path;

  await model.save();

  res.json({
    header: [{
      error:`NO ERROR`,
      code: 200,
    }],
    body:[{
      msg: 'se actualizo la imagen correctamente',
      model
    }]
  })

}

//subir las imagenes a un servidor
const actualizarUserImgCloudinary = async(req, res = response) => {

  const {id, colection} = req.params

  let model;
  switch (colection) {
    case 'usuarios':
      model = await Usuario.findById(id);
      if(!model){
        return res.status(200).json({
          header: [{
              error:`el usuario no esta registrado en base de datos`,
              code: 400,
          }],
          body:[{}]
      })
      }

      
    break;
    case 'products':
      model = await Product.findById(id);
      if(!model){
        return res.status(200).json({
          header: [{
              error:`no existe el producto registrado en la base de datos`,
              code: 400,
          }],
          body:[{}]
      })
      }
      
      
    break;
  
    default:
      return res.status(500).json({
        header: [{
            error:`INTERNAL SERVER ERROR`,
            code: 500,
        }],
        body:[{}]
    })
  }

  //Limpiar imagenes previas
  if(model.img){
    const  nameArr = model.img.split('/');
    const name = nameArr[nameArr.length -1];
    const [public_id] = name.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const {tempFilePath} = req.files.file;

  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url;

  await model.save();

  res.json({
    header: [{
      error:`NO ERROR`,
      code: 200,
    }],
    body:[{
      msg: 'se actualizo la imagen correctamente',
      model
    }]
  })

}

const ShowImg = async(req, res = response) => {

  const {id, colection} = req.params

  let model;
  switch (colection) {
    case 'usuarios':
      model = await Usuario.findById(id);
      if(!model){
        return res.status(200).json({
          header: [{
              error:`el usuario no esta registrado en base de datos`,
              code: 400,
          }],
          body:[{}]
      })
      }

      
    break;
    case 'products':
      model = await Product.findById(id);
      if(!model){
        return res.status(200).json({
          header: [{
              error:`no existe el producto registrado en la base de datos`,
              code: 400,
          }],
          body:[{}]
      })
      }
      
      
    break;
  
    default:
      return res.status(500).json({
        header: [{
            error:`INTERNAL SERVER ERROR`,
            code: 500,
        }],
        body:[{}]
    })
  }

  //Limpiar imagenes previas
  if(model.img){
    //hay que borrar la imagen del servidor
    const pathImg = path.join(__dirname, '../uploads',colection, model.img);
    if(fs.existsSync(pathImg)){
      return res.sendFile(pathImg)
    }
  }

  const pathImg = path.join(__dirname, '../assets/not-image.png');
  res.sendFile(pathImg)

}


module.exports = {
    cargarFile,
    actualizarUserImg,
    ShowImg,
    actualizarUserImgCloudinary
}