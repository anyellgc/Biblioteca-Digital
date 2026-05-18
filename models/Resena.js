const mongoose = require("mongoose");

const resenaSchema = new mongoose.Schema({

    libroId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Libro",
        required: true
    },

    usuario: {
        type: String,
        required: true
    },

    comentario: {
        type: String,
        required: true
    },

    calificacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    fecha: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Resena", resenaSchema);