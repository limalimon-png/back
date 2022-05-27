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
        //ordenamos de forma descendente
        sort({ _id: -1 })
        .skip(skip)
        //limita a 10 resultados
        .limit(10)
        //de la informacion de usuario, quitamos es password
        .populate('usuario', '-password')
        //ejecuta la query
        .exec();
    res.json({
        ok: true,
        pagina: pagina,
        posts
    });
}));
//obtener todos los post de un usuario
postRoutes.get('/perfil/:userid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prueba = [];
    const userId = req.params.userid;
    const posts = yield post_model_1.Post.find()
        .populate('usuario', '-password')
        .exec();
    posts.forEach((ele) => {
        if (ele.usuario.id == userId) {
            console.log("entra");
            prueba.push(ele);
        }
    });
    res.json({
        ok: true,
        userId: userId,
        //pagina:pagina,
        posts: prueba,
    });
}));
//obtener post por id
postRoutes.get('/perfil2/:postid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prueba = [];
    const postId = req.params.postid;
    const posts = yield post_model_1.Post.find()
        .populate('usuario', '-password')
        .exec();
    posts.forEach((ele) => {
        if (ele._id == postId) {
            console.log("entra");
            prueba.push(ele);
        }
    });
    res.json({
        posts: prueba,
    });
}));
//crear post
postRoutes.post('/a', [autenticacion_1.verificarToken], (req, res) => {
    const pos = {
        mensaje: req.body.mensaje,
        usuario: req.body.usuario,
        img: req.body.img
    };
    // const body =req.body;
    //body.usuario=req.usuario._id;
    // pos.img.forEach(async (element: any) => {
    //     const file:fileUpload=element;
    //  await fileSystem.guardarImagenTemporal(file,req.usuario._id);
    // });
    //  const imagenes=fileSystem.imagenesTempToPost(req.body.usuario._id);
    // pos.img=imagenes;
    post_model_1.Post.create(pos).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
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
//servicio para subir archivos imagenes y videos
postRoutes.post('/upload', [autenticacion_1.verificarToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('usuario', req.usuario._id);
    //si no existen archivos
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }
    console.log('upload', req.files.image);
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }
    //comprobar que no es una imagen //hay que hacerque se puedan subir videos
    //mimetype es el para identificar el tipo de archivo
    if (!file.mimetype.includes('image') && !file.mimetype.includes('video')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no es una tipo de archivo valido'
        });
    }
    //manda el archivo y el id
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
    console.log('sale');
}));
//actualizar datos post
// [verificarToken],verificarToken
postRoutes.post('/update', (req, res) => {
    console.log('body', req.body);
    console.log('iamgenes', req.body.img);
    const body = req.body;
    //comprobamos que existe el usuario
    post_model_1.Post.findByIdAndUpdate(body._id, body, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "no existe ese post"
            });
        }
        res.json({
            ok: true
        });
    });
});
//coger las imagenes y videos
postRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
//get post a traves del id
postRoutes.get('/getlikepost/:postid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prueba = [];
    const postId = req.params.postid;
    const posts = yield post_model_1.Post.find()
        .populate('usuario', '-password')
        .exec();
    posts.forEach((ele) => {
        if (ele._id == postId) {
            console.log("entra");
            prueba.push(ele);
        }
    });
    res.json({
        ok: true,
        //pagina:pagina,
        posts: prueba,
        //numeroLikes: prueba.length
    });
}));
exports.default = postRoutes;
