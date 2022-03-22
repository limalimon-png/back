import { Router,Request,Response } from "express";
import { Usuario } from '../modelos/usuario.model';
import bcrypt from 'bcrypt'
import Token from "../clases/token";
import { verificarToken } from '../middlewares/autenticacion';



const userRoutes= Router();


//crear login
userRoutes.post('/login',(req:Request,res:Response)=>{
    const body=req.body;
    Usuario.findOne({email: body.email},(err: any,userDB: any)=>{
        if(err) throw err;

        if(!userDB){
            return res.json({
                ok:false,
                mensaje:"usuario/contraseña no son correctas"

            });
        }

        if(userDB.compruebaPass(body.password)){
            const tokenUser=Token.getToken({
                _id:userDB._id,
                nombre:userDB.nombre,
                email:userDB.email
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





//crear un usuario

userRoutes.post('/create',(req:Request,res:Response)=>{
   
    const user={
        nombre: req.body.nombre ,
        email:req.body.email  ,
        imagen:req.body.imagen,
        password:bcrypt.hashSync(req.body.password,10 )
        
      
    }
    
    Usuario.create(user).then(userDB=>{
        const tokenUser=Token.getToken({
            _id:userDB._id,
            nombre:userDB.nombre,
            email:userDB.email
        });
        res.json({
            ok:true, 
            token:tokenUser
           // mensaje:'todo funcionan correctamente'
        });

    }).catch(err=>{
        res.json({
            ok:false,
            err
        });

    });

    

});

//actualizar
// [verificarToken],verificarToken
userRoutes.post('/update',verificarToken,(req:any,res:Response)=>{
    
    const user={
        nombre: req.body.nombre || req.usuario.nombre,
        email:req.body.email    || req.usuario.email,
        imagen:req.body.imagen  || req.usuario.imagen,
        
      
    }
    Usuario.findByIdAndUpdate(req.usuario._id,user,{new:true},(err,userDB)=>{


        if(err)throw err;

        if(!userDB){
            return res.json({
                ok:false,
                mensaje:"no existe el usuario con ese id"
               

            });

        }

        const tokenUser=Token.getToken({
            _id:userDB._id,
            nombre:userDB.nombre,
            email:userDB.email
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
export default userRoutes;