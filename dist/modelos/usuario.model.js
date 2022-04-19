"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
//estructura usuario
const usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, "campo nombre obligatorio"]
    },
    imagen: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, "campo email obligatorio"]
    },
    password: {
        type: String,
        required: [true, "campo contraseña obligatorio"]
    }
});
usuarioSchema.method('compruebaPass', function (password = '') {
    return !!(bcrypt_1.default.compareSync(password, this.password));
});
exports.Usuario = (0, mongoose_1.model)('Usuario', usuarioSchema);
