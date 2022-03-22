"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../modelos/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../clases/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = (0, express_1.Router)();
//crear login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "usuario/contraseña no son correctas"
            });
        }
        if (userDB.compruebaPass(body.password)) {
            const tokenUser = token_1.default.getToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email
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
//crear un usuario
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        imagen: req.body.imagen,
        password: bcrypt_1.default.hashSync(req.body.password, 10)
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        const tokenUser = token_1.default.getToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email
        });
        res.json({
            ok: true,
            token: tokenUser
            // mensaje:'todo funcionan correctamente'
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
//actualizar
// [verificarToken],verificarToken
userRoutes.post('/update', autenticacion_1.verificarToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        imagen: req.body.imagen || req.usuario.imagen,
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "no existe el usuario con ese id"
            });
        }
        const tokenUser = token_1.default.getToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email
        });
        res.json({
            ok: true,
            token: tokenUser
            // mensaje:'todo funcionan correctamente'
        });
    });
});
//devolver la informacion del token
userRoutes.get('/', [autenticacion_1.verificarToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
exports.default = userRoutes;
