"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const post_model_1 = require("../modelos/post.model");
const file_system_1 = __importDefault(require("../clases/file-system"));
const postRoutes = (0, express_1.Router)();
const fileSystem = new file_system_1.default();
//obtener post con paginacion
postRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    //recibimos los diferentes posts y luego los mostramos
    const posts = yield post_model_1.Post.find().
        sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina: pagina,
        posts
    });
}));
//crear post
postRoutes.post('/', [autenticacion_1.verificarToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesTempToPost(req.usuario._id);
    body.img = imagenes;
    post_model_1.Post.create(body).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        //nos muestre los datos del usuario
        yield postDB.populate('usuario', '-password');
        res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.json(err);
    });
});
//servicio para subir archivos en principio solo imagenes pero ya lo cambiaremos para videos tambien
postRoutes.post('/upload', [autenticacion_1.verificarToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo -image'
        });
    }
    //comprobar que no es una imagen //hay que hacerque se puedan subir videos
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no es una imagen'
        });
    }
    //manda el archivo y el id
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
//coger las imagenes
postRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = postRoutes;