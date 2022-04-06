"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const usuario_1 = __importDefault(require("./rutas/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const post_1 = __importDefault(require("./rutas/post"));
const server = new server_1.default();
//recibe la informacion del post
server.app.use(express_1.default.urlencoded({ extended: true }));
server.app.use(express_1.default.json());
//subir archivo
server.app.use((0, express_fileupload_1.default)());
//configurar cors para poder usar varios servidores en local
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
//rutas app
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
//conectar con base de datos mongoDB
const conection = 'mongodb+srv://guillermo:3Qrzg6g0xFvLGpUS@cluster0.kbzko.mongodb.net/app?retryWrites=true&w=majority';
const conexion = 'mongodb://localhost:27017/app';
mongoose_1.default.connect(conexion, (err) => {
    if (err)
        throw err;
    console.log('Base de datos ONLINE');
});
//LEVANTAR SERVIDOR EXPRESS
server.start(() => {
    console.log("servidor corriendo por el puerto " + server.port + "");
});
