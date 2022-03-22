import Server from "./clases/server";
import userRoutes from "./rutas/usuario";
import mongoose from 'mongoose';
import cors from 'cors';


import express from "express";
import fileUpload from 'express-fileupload'
import postRoutes from './rutas/post';


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

//conectar con base de datos mongoDB

mongoose.connect('mongodb://localhost:27017/app',

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