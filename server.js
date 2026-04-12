const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const User = require("./models/user");
const Libro = require("./models/Libro");

const app = express();

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// VERIFICACIÓN DE CARPETAS
const uploadDir = path.join(__dirname, "public/libros");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// --- CONEXIÓN A MONGODB ATLAS ---
const mongoURI = "mongodb://anyellgc:amgc6372839943@ac-cqmuaag-shard-00-00.c4oobiu.mongodb.net:27017,ac-cqmuaag-shard-00-01.c4oobiu.mongodb.net:27017,ac-cqmuaag-shard-00-02.c4oobiu.mongodb.net:27017/biblioteca?ssl=true&replicaSet=atlas-c43k79-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(mongoURI)
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => console.log(err));
// CONFIGURACIÓN DE MULTER
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/libros/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// RUTA PARA SUBIR LIBROS
app.post("/api/libros/subir", upload.single("pdf"), async (req, res) => {
    try {
        const { titulo, autor, descripcion, portadaUrl, categoria, idioma } = req.body;

        if (!req.file) {
            return res.status(400).json({ mensaje: "Falta el archivo PDF" });
        }

        const nuevoLibro = new Libro({
            titulo,
            autor,
            descripcion,
            categoria: categoria || "General",
            idioma: idioma || "Español",
            portada: portadaUrl,
            pdf: `/libros/${req.file.filename}`
        });

        await nuevoLibro.save();

        res.json({ mensaje: "Libro guardado correctamente" });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar" });
    }
});

// OBTENER TODOS LOS LIBROS
app.get("/api/libros/todos", async (req, res) => {
    try {
        const libros = await Libro.find().sort({ _id: -1 });
        res.json(libros);
    } catch (error) {
        res.status(500).json({ mensaje: "Error" });
    }
});

// REGISTRO
app.post("/registro", async (req, res) => {
    try {
        const { nombre, apellido, edad, correo, usuario, password, rol } = req.body;

        const nuevoUsuario = new User({
            nombre,
            apellido,
            edad,
            correo,
            usuario,
            password,
            rol
        });

        await nuevoUsuario.save();

        res.json({
            mensaje: "Registro exitoso",
            redireccion: "login.html"
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error" });
    }
});

// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { usuario, password } = req.body;

        const usuarioDB = await User.findOne({ usuario, password });

        if (!usuarioDB) {
            return res.status(401).json({ mensaje: "Error" });
        }

        res.json({
            mensaje: "Bienvenido",
            rol: usuarioDB.rol,
            nombre: usuarioDB.nombre
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error" });
    }
});

// PUERTO
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});