const {conexion} = require("./basededatos/conexion.js");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bd = require("mongoose");
const { default: mongoose } = require("mongoose");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Inicializar la APP
console.log("Mi API Rest arrancada");

//Inicializar la BD
conexion();

//Crear un servidor Node
const app = express();
const puerto = 3900;

//Configurar los CORS
app.use(cors());

//Convertir body a objeto js
app.use(express.json());

//Escuchar peticiones del servidor
app.listen(puerto,()=>{
    console.log("Servidor Node corriendo en el puerto: " +puerto);
})

//Crear rutas
const Articulo = require("./models/Articulo");
//Insertar
app.post("/insert", async(req,res) => {
    try{
      const nuevoArticulo = new Articulo(req.body);
      await nuevoArticulo.save();
      console.log("Artículo insertado");
      return res.status(201).send(`
      <div>
        <h1>Datos insertados</h1>
       </div>
    `);
    }catch(error){
      console.log("Error al insertar artículo");
      return res.status(400).send(`
      <div>
        <h1>Error al insertar datos</h1>
       </div>
    `);
    }
});

//eliminar
app.delete("/delete/:id", async (req,res)=>{
  try{
    const articulo = await Articulo.findByIdAndDelete(req.params.id);
    if(!articulo){
      console.log("Artículos no encontrado para eliminar");
      return res.status(404).send(`
        <div>
          h1>Error articulos no encontrados</h1>
        </div>
      `);
    }
    console.log("Articulo eliminado Correctamente");
    return res.status(200).send(`
      <div>
        <h1>Eliminar</h1>
       </div>
    `);
  }catch(error){
    console.log("Error al eliminar el artículo");
    return res.status(500).send(`
    <div>
      <h1>Error al eliminar datos</h1>
     </div>
  `);
  }
});

app.put("/update/:id", async (req,res)=>{
  try{
    const articulo = await Articulo.findByIdAndUpdate(req.params.id,req.body,{new: true, runValidators: true});
    if(!articulo){
      console.log("Artículos no encontrados para actualizar");
      return res.status(404).send(`
        <div>
          h1>Error articulos no encontrados</h1>
        </div>
      `);
    }
    console.log("Articulos actualizados Correctamente");
    return res.status(200).send(`
      <div>
        <h1>Actualizar</h1>
       </div>
    `);
  }catch(error){
    console.log("Error al actualizar el artículo");
    return res.status(400).send(`
    <div>
      <h1>Error al actualizar datos</h1>
     </div>
  `);
  }
});

//Leer articulos
app.get("/find", async (req,res)=>{
  try{
    const articulos = await Articulo.find();
    console.log("Artículos obtenidos correctamente");
    return res.status(200).send(`
    <div>
      <h1>Articulos encontrados</h1>
      <p>Se han encontrado ${articulos.length} artículos</p>
     </div>
  `);
  }catch(error){
    console.log("Error al obtener el artículo");
    return res.status(500).send(`
    <div>
      <h1>Error al obtener datos</h1>
     </div>
  `);
  }
});

//imagen
app.post("/upload-image/:id", upload.single("imagen"), async (req, res) => {
  try {
      const articulo = await Articulo.findById(req.params.id);

      if (!articulo) {
          return res.status(404).send("Artículo no encontrado");
      }

      articulo.imagen = {
          data: req.file.buffer,
          contentType: req.file.mimetype
      };

      await articulo.save();
      console.log("Imagen subida correctamente");
      return res.status(200).send("Imagen subida correctamente al artículo");
  } catch (error) {
      console.log("Error al subir la imagen");
      return res.status(500).send("Error al subir la imagen");
  }
});
//ver img
app.get("/get-image/:id", async (req, res) => {
  try {
      const articulo = await Articulo.findById(req.params.id);

      if (!articulo || !articulo.imagen || !articulo.imagen.data) {
          return res.status(404).send("Imagen no encontrada");
      }

      res.set("Content-Type", articulo.imagen.contentType);
      return res.send(articulo.imagen.data);
  } catch (error) {
      console.log("Error al obtener la imagen");
      return res.status(500).send("Error al obtener la imagen");
  }
});

console.log("App Arrancada");