import { Router,Request,Response } from "express";
import { Usuario } from '../modelos/usuario.model';
import bcrypt from 'bcrypt'
import Token from "../clases/token";
import { verificarToken } from '../middlewares/autenticacion';
import  FileSystem  from '../clases/file-system';
import bodyParser from "body-parser";
import { fileUpload } from "../interfaces/file-upload";


const userRoutes= Router();
const fileSystem=new FileSystem();

//inicar sesion
userRoutes.post('/login',(req:Request,res:Response)=>{
    const body=req.body;
    //buscamos el email en la base de datos
    Usuario.findOne({email: body.email},(err: any,userDB: any)=>{
        if(err) throw err;
        //si no existe mandamos esto y salinmos
        if(!userDB){
            return res.json({
                ok:false,
                mensaje:"usuario/contraseña no son correctas"

            });
        }

        // en caso de que exista ,comprobamos la contraseña que esta encriptada
        //si es correcto  comrpobaremos el token, y cogeremos los datos del usuario
        //añadir aqui los nuevos campos
        if(userDB.compruebaPass(body.password)){
            const tokenUser=Token.getToken({
                _id:userDB._id,
                nombre:userDB.nombre,
                email:userDB.email,
                desc:userDB.desc,
                imagen:userDB.imagen
            });
            res.json({
                ok:true,
                token:tokenUser

            });
        }else{
            return res.json({
                ok:false,
                mensaje:"usuario/contraseña no son correctas "

            });
        }

    })


});


//obtener los atributos del  usuario
userRoutes.get('/getusu/:userid',async(req:any,res:Response)=>{
   
    const prueba:any[]=[];
    const userId=req.params.userid;
    const user = await Usuario.find()  
    .exec(); 

    user.forEach((ele:any)=>{
        if(ele._id==userId){
            console.log("entra"); 
            prueba.push(ele)          
        }
    })
    prueba[0].password='';

    res.json({
        ok:true,
        userId:userId,
        user:prueba,
        
    });
});





//crear un usuario

userRoutes.post('/create',(req:Request,res:Response)=>{

   //creamos una constante con la informacion del usuario para luego pasarselo al modelo usuario
   //req es la informacion que le pedimos al usuario, que esta dentro de body y luego ya tiene los atributos
    const user={
        nombre: req.body.nombre ,
        email:req.body.email  ,
        imagen:req.body.imagen,
        

        //el 10 es para que use 10 veces la encri`tacion
        password:bcrypt.hashSync(req.body.password,10 )
        
      
    }



    
    Usuario.create(user).then(userDB=>{
        //comprobamos que el token es valido y no está expirado
        const tokenUser=Token.getToken({
            _id:userDB._id,
            nombre:userDB.nombre,
            email:userDB.email,
            desc:userDB.desc,
            imagen:userDB.imagen
        });
        res.json({
            ok:true, 
            token:tokenUser
           // mensaje:'todo funcionan correctamente'
        });


        //const imagenes=fileSystem.imagenesTempToPost(userDB._id);
       // console.log(imagenes);
        

    }).catch(err=>{
        res.json({
            ok:false,
            err
        });

    });
    
    

    

});

//actualizar datos usuarios

// [verificarToken],verificarToken
userRoutes.post('/update',verificarToken,async (req:any,res:Response)=>{
    console.log('usuario',req.body.imagen);
    console.log(req.usuario.imagen);
   const ruta = fileSystem.obtenerImagenesPerfil(req.body._id)
   console.log('ruta',ruta);
   
    
    
    
    const user={
        //en caso de que no venga algun dato volvemos a dejar la informacion que ya existía
        nombre: req.body.nombre || req.usuario.nombre,
        email:req.body.email    || req.usuario.email,
        imagen:ruta[0] || req.usuario.imagen,
        desc:req.body.desc  || req.usuario.desc,
        
      
    }
    //comprobamos que existe el usuario
    Usuario.findByIdAndUpdate(req.usuario._id,user,{new:true},(err,userDB)=>{


        if(err)throw err;

        if(!userDB){
            return res.json({
                ok:false,
                mensaje:"no existe el usuario con ese id"
               

            });

        }

        //generamos l nuevo token con los datos del usuario
        const tokenUser=Token.getToken({
            _id:userDB._id,
            nombre:userDB.nombre,
            email:userDB.email,
            desc:userDB.desc,
            imagen:userDB.imagen
            
        });
        res.json({
            ok:true, 
            token:tokenUser
           // mensaje:'todo funcionan correctamente'
        });



    });
       
         
      


});


//devolver la informacion del token 
userRoutes.get('/',[verificarToken],(req:any,res:Response)=>{
   
    const usuario=req.usuario;

    res.json({
        ok:true,
        usuario
    })
    

});

//devolver userid del token 
userRoutes.get('/get',[verificarToken],(req:any,res:Response)=>{
   
    const usuario=req.usuario._id;

    res.json({
        ok:true,
        usuario
    })
    

});

//devolver icono de usuario 
userRoutes.get('/geticon/:userid',async (req:any,res:Response)=>{
    var imagen:string='';
    const userId=req.params.userid;
    const user = await Usuario.find()
    .exec();
    
    
    user.forEach((ele:any)=>{
        if(ele._id==userId){
            console.log("encuentra id");
            imagen=ele.imagen
            console.log('imagen',imagen);
            
            
        }
    })
    //localhost:3000/user/geticon/61fd18477bece05749331f3f
    
     

    res.json({
        ok:true,
        userId:userId,
        imagen:imagen,
        
    });
    

});

//devolver icono y nombre de usuario
userRoutes.get('/geticonname/:userid',async (req:any,res:Response)=>{

    var imagen:string='';
    var nombre:string='';
    const userId=req.params.userid;
    const user = await Usuario.find()
    .exec();
    
    
    user.forEach((ele:any)=>{
        if(ele._id==userId){
            console.log("entra");
            console.log('el user',ele);
            
            imagen=ele.imagen
            nombre=ele.nombre
            
        }
    })
    //localhost:3000/user/geticon/61fd18477bece05749331f3f
    
     

    res.json({
        ok:true,
        userId:userId,
        imagen:imagen,
        nombre:nombre,
        
    });
    

})



//crear post
userRoutes.post('/aftercreate',[verificarToken],(req:any,res:Response)=>{

    const body =req.body;
    body.usuario=req.usuario._id;
    const imagenes=fileSystem.imagenesTempToPost(req.usuario._id);
     body.img=imagenes;

    Usuario.create(body).then(async postDB=>{
        //nos muestre los datos del usuario
        await postDB.populate('usuario','-password');

        res.json({
            ok:true,
            post:postDB
    
        });

    }).catch(err=>{
        res.json(err);
    })

   
});

//servicio para subir archivos imagenes y videos
userRoutes.post('/upload',[verificarToken],async (req:any,res:Response)=>{
console.log('body',req.body);
const id=req.body.id

    //si no existen archivos
    if(!req.files){
        return res.status(400).json({
            ok:false,
            mensaje:'No se subió ningun archivo'
        });
    }
    //console.log('upload',req.files.image);
    const file:fileUpload=req.files.image;
   fileSystem.guardarImagenPerfil(file,id);
    console.log('imagen devuelta');
   console.log('hola');
   
    if(!file){
        return res.status(400).json({
            ok:false,
            mensaje:'No se subió ningun archivo'
        });
    }

    //comprobar que no es una imagen //hay que hacerque se puedan subir videos
    //mimetype es el para identificar el tipo de archivo
    if(!file.mimetype.includes('image') && !file.mimetype.includes('video')){
        return res.status(400).json({
            ok:false,
            mensaje:'no es una tipo de archivo valido'
        });
    }
    //manda el archivo y el id

   

    res.json({
        ok:true,
        file:file.mimetype


    });

    console.log('sale');
    

});



//coger las imagenes y videos
userRoutes.get('/imagen/:userid/:img',(req:any,res:Response)=>{
    const userId=req.params.userid;
    const img=req.params.img;
    const pathFoto=fileSystem.getFotoUrlPerfil(userId,img);
    res.sendFile(pathFoto);
    
    });

export default userRoutes;