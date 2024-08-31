const mongoose = require("mongoose");

const ArticuloSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        data: Buffer,
        contentType: String
    }
});

const Articulo = mongoose.model("Articulo", ArticuloSchema);
module.exports = Articulo;