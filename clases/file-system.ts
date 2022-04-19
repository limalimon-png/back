import { fileUpload } from '../interfaces/file-upload';
import path from 'path'
import fs from 'fs'
import uniqid from 'uniqid';
export default class FileSystem {
    constructor() { }

    guardarImagenTemporal(file: fileUpload, userId: string) {
        //para poder usar el async y el await se hace en promesas
        //todas las promesas devuelven resolve>lo que ejecuta su va bien y reject si fall

        return new Promise<void>((resolve, reject) => {

            //crear nombre carpetas
            const path = this.crearCarpetaUsuario(userId);
            //crear nombre archivo
            const nombreArchivo = this.generarNombreArchivo(file.name);

            //mover a la carpeta temporal
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                if (err) {
                    reject(err);

                } else {
                    resolve();
                }

            })


        })






    }
    //genera un nombre unico
    private generarNombreArchivo(nombreOriginal: string) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const nombreUnico = uniqid();

        return nombreUnico + '.' + extension

    }

    //creamos una carpeta para cada usuario con su id para identificarlo
    private crearCarpetaUsuario(userId: string) {
        //dirname nos da la ruta desde la raiz del dispositivo
        const pathUser = path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';
       // console.log(pathUser);

        const existe = fs.existsSync(pathUser);
        if (!existe) {
            fs.mkdirSync(pathUser)
            fs.mkdirSync(pathUserTemp)

        }
        return pathUserTemp;

    }


    //mover los archivos multimedia del temp a post
    imagenesTempToPost(userId:string){
        const pathTemp = path.resolve(__dirname, '../uploads', userId,'temp');
        const pathPosts = path.resolve(__dirname, '../uploads', userId,'posts');
        if(!fs.existsSync(pathTemp)){
            return [];
        }
        if(!fs.existsSync(pathPosts)){
            fs.mkdirSync(pathPosts);
        }

        const imagenesTemp =this.obtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(img=>{
            fs.renameSync(`${pathTemp}/${img}`,`${pathPosts}/${img}`)
        });
        return imagenesTemp;

    }

    obtenerImagenesEnTemp(userId:string){

        const pathTemp = path.resolve(__dirname, '../uploads', userId,'temp');
        return fs.readdirSync(pathTemp) || [];

    }
    getFotoUrl(userId:string,img:string){

        const pathFoto=path.resolve(__dirname, '../uploads', userId,'posts',img);

        const existe =fs.existsSync(pathFoto);
        //en caso de que no tenga imagenes coge la no imagen
        if(!existe){
            return path.resolve(__dirname,'../assets/noimage.png');

        }

        return pathFoto;

    }
}