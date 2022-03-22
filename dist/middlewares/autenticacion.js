"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = void 0;
const token_1 = __importDefault(require("../clases/token"));
const verificarToken = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.comprobarToken(userToken).then((decoded) => {
        console.log("decoded: ", decoded);
        req.usuario = decoded.usuario;
        next();
    })
        .catch(err => {
        res.json({
            ok: false,
            mensaje: 'token no es correcto'
        });
    });
};
exports.verificarToken = verificarToken;
