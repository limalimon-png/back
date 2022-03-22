"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    guardarImagenTemporal(file, userId) {
        //para poder usar el async y el await se hace en promesas
        //todas las promesas devuelven resolve>lo que ejecuta su va bien y reject si fall
        return new Promise((resolve, reject) => {
            //crear carpetas
            const path = this.crearCarpetaUsuario(userId);
            //archivo
            const nombreArchivo = this.generarNombreArchivo(file.name);
            //mover a la carpeta temporal
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombreArchivo(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const nombreUnico = (0, uniqid_1.default)();
        return nombreUnico + '.' + extension;
    }
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagenesTempToPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        const pathPosts = path_1.default.resolve(__dirname, '../uploads', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPosts)) {
            fs_1.default.mkdirSync(pathPosts);
        }
        const imagenesTemp = this.obtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(img => {
            fs_1.default.renameSync(`${pathTemp}/${img}`, `${pathPosts}/${img}`);
        });
        return imagenesTemp;
    }
    obtenerImagenesEnTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId, img) {
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/noimage.png');
        }
        return pathFoto;
    }
}
exports.default = FileSystem;
