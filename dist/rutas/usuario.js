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
const usuario_model_1 = require("../modelos/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../clases/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const file_system_1 = __importDefault(require("../clases/file-system"));
const userRoutes = (0, express_1.Router)();
const fileSystem = new file_system_1.default();
//inicar sesion
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    //buscamos el email en la base de datos
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        //si no existe mandamos esto y salinmos
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "usuario/contraseña no son correctas"
            });
        }
        // en caso de que exista ,comprobamos la contraseña que esta encriptada
        //si es correcto  comrpobaremos el token, y cogeremos los datos del usuario
        //añadir aqui los nuevos campos
        if (userDB.compruebaPass(body.password)) {
            const tokenUser = token_1.default.getToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                desc: userDB.desc,
                imagen: userDB.imagen
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: "usuario/contraseña no son correctas "
            });
        }
    });
});
//obtener los atributos del  usuario
userRoutes.get('/getusu/:userid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prueba = [];
    const userId = req.params.userid;
    const user = yield usuario_model_1.Usuario.find()
        .exec();
    user.forEach((ele) => {
        if (ele._id == userId) {
            console.log("entra");
            prueba.push(ele);
        }
    });
    prueba[0].password = '';
    res.json({
        ok: true,
        userId: userId,
        user: prueba,
    });
}));
//crear un usuario
userRoutes.post('/create', (req, res) => {
    //creamos una constante con la informacion del usuario para luego pasarselo al modelo usuario
    //req es la informacion que le pedimos al usuario, que esta dentro de body y luego ya tiene los atributos
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        imagen: req.body.imagen,
        //el 10 es para que use 10 veces la encri`tacion
        password: bcrypt_1.default.hashSync(req.body.password, 10)
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        //comprobamos que el token es valido y no está expirado
        const tokenUser = token_1.default.getToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            desc: userDB.desc,
            imagen: userDB.imagen
        });
        res.json({
            ok: true,
            token: tokenUser
            // mensaje:'todo funcionan correctamente'
        });
        //const imagenes=fileSystem.imagenesTempToPost(userDB._id);
        // console.log(imagenes);
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//actualizar datos usuarios
// [verificarToken],verificarToken
userRoutes.post('/update', autenticacion_1.verificarToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('usuario', req.body.imagen);
    console.log(req.usuario.imagen);
    const ruta = fileSystem.obtenerImagenesPerfil(req.body._id);
    console.log('ruta', ruta);
    const user = {
        //en caso de que no venga algun dato volvemos a dejar la informacion que ya existía
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        imagen: ruta[0] || req.usuario.imagen,
        desc: req.body.desc || req.usuario.desc,
    };
    //comprobamos que existe el usuario
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "no existe el usuario con ese id"
            });
        }
        //generamos l nuevo token con los datos del usuario
        const tokenUser = token_1.default.getToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            desc: userDB.desc,
            imagen: userDB.imagen
        });
        res.json({
            ok: true,
            token: tokenUser
            // mensaje:'todo funcionan correctamente'
        });
    });
}));
//devolver la informacion del token 
userRoutes.get('/', [autenticacion_1.verificarToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
//devolver userid del token 
userRoutes.get('/get', [autenticacion_1.verificarToken], (req, res) => {
    const usuario = req.usuario._id;
    res.json({
        ok: true,
        usuario
    });
});
//devolver icono de usuario 
userRoutes.get('/geticon/:userid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var imagen = '';
    const userId = req.params.userid;
    const user = yield usuario_model_1.Usuario.find()
        .exec();
    user.forEach((ele) => {
        if (ele._id == userId) {
            console.log("encuentra id");
            imagen = ele.imagen;
            console.log('imagen', imagen);
        }
    });
    //localhost:3000/user/geticon/61fd18477bece05749331f3f
    res.json({
        ok: true,
        userId: userId,
        imagen: imagen,
    });
}));
//devolver icono y nombre de usuario
userRoutes.get('/geticonname/:userid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var imagen = '';
    var nombre = '';
    const userId = req.params.userid;
    const user = yield usuario_model_1.Usuario.find()
        .exec();
    user.forEach((ele) => {
        if (ele._id == userId) {
            console.log("entra");
            console.log('el user', ele);
            imagen = ele.imagen;
            nombre = ele.nombre;
        }
    });
    //localhost:3000/user/geticon/61fd18477bece05749331f3f
    res.json({
        ok: true,
        userId: userId,
        imagen: imagen,
        nombre: nombre,
    });
}));
//crear post
userRoutes.post('/aftercreate', [autenticacion_1.verificarToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesTempToPost(req.usuario._id);
    body.img = imagenes;
    usuario_model_1.Usuario.create(body).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
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
userRoutes.post('/upload', [autenticacion_1.verificarToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('body', req.body);
    const id = req.body.id;
    //si no existen archivos
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }
    //console.log('upload',req.files.image);
    const file = req.files.image;
    fileSystem.guardarImagenPerfil(file, id);
    console.log('imagen devuelta');
    console.log('hola');
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
    res.json({
        ok: true,
        file: file.mimetype
    });
    console.log('sale');
}));
//coger las imagenes y videos
userRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrlPerfil(userId, img);
    res.sendFile(pathFoto);
});
exports.default = userRoutes;
