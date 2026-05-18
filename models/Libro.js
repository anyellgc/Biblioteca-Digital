const mongoose = require("mongoose");

const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    categoria: { type: String, default: "General" },
    portada: { type: String, required: true },
    pdf: { type: String, required: true },
    idioma: { type: String, default: "Español" },
    descripcion: { type: String, default: "Sin reseña disponible." },
    fechaSubida: { type: Date, default: Date.now },
    comentarios: [
        {
            texto: { type: String, required: true },
            fecha: { type: Date, default: Date.now }
        }
    ],
    calificaciones: [{ type: Number }]
});

module.exports = mongoose.models.Libro || mongoose.model("Libro", libroSchema);