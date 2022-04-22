import Server from "./clases/server";
import userRoutes from "./rutas/usuario";
import mongoose from 'mongoose';
import cors from 'cors';


import express from "express";
import fileUpload from 'express-fileupload'
import postRoutes from './rutas/post';
import likesRoutes from "./rutas/likes";


const server =new Server();


//recibe la informacion del post
server.app.use(express.urlencoded({extended:true}));
server.app.use(express.json());

//subir archivo
server.app.use(fileUpload());


//configurar cors para poder usar varios servidores en local
server.app.use(cors({origin:true,credentials:true}));


//rutas app
server.app.use('/user',userRoutes);
server.app.use('/posts',postRoutes);
server.app.use('/likes',likesRoutes);

//conectar con base de datos mongoDB
//const conection='mongodb+srv://guillermo:3Qrzg6g0xFvLGpUS@cluster0.kbzko.mongodb.net/app?retryWrites=true&w=majority';
const conexion='mongodb://localhost:27017/app';
mongoose.connect(conexion,

    ( err ) => {
 
        if ( err ) throw err;
      
        console.log('Base de datos ONLINE');
    }
);


//LEVANTAR SERVIDOR EXPRESS
server.start(
    ()=>{
        console.log("servidor corriendo por el puerto "+server.port+"");
    }
);