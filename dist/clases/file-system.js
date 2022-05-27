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
            //crear nombre carpetas
            const path = this.crearCarpetaUsuario(userId);
            //crear nombre archivo
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
    //genera un nombre unico
    generarNombreArchivo(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const nombreUnico = (0, uniqid_1.default)();
        return nombreUnico + '.' + extension;
    }
    //creamos una carpeta para cada usuario con su id para identificarlo
    crearCarpetaUsuario(userId) {
        //dirname nos da la ruta desde la raiz del dispositivo
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
    //mover los archivos multimedia del temp a post
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
    obtenerImagenesPerfil(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'perfil');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userId, img) {
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        const existe = fs_1.default.existsSync(pathFoto);
        //en caso de que no tenga imagenes coge la no imagen
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/noimage.png');
        }
        return pathFoto;
    }
    getFotoUrlPerfil(userId, img) {
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'perfil', img);
        const existe = fs_1.default.existsSync(pathFoto);
        //en caso de que no tenga imagenes coge la no imagen
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/noimage.png');
        }
        return pathFoto;
    }
    //crear en la carpeta del usuario la carpeta fotoPerfil
    guardarImagenPerfil(file, userId) {
        //para poder usar el async y el await se hace en promesas
        //todas las promesas devuelven resolve>lo que ejecuta su va bien y reject si fall
        console.log('userid', userId);
        console.log('fileUpload', file);
        return new Promise((resolve, reject) => {
            //crear nombre carpetas
            const path = this.crearCarpetaConPerfil(userId);
            //crear nombre archivo
            const nombreArchivo = this.generarNombreArchivo(file.name);
            //mover a la carpeta perfil
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
    crearCarpetaConPerfil(userId) {
        //dirname nos da la ruta desde la raiz del dispositivo
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/perfil';
        // console.log(pathUser);
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        const existe2 = fs_1.default.existsSync(pathUserTemp);
        if (!existe2) {
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
}
exports.default = FileSystem;
