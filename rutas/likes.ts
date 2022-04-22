import { Router,Request,Response } from "express";
import { Likes } from "../modelos/likes.model";

const likesRoutes =Router();


//like post
likesRoutes.post('/like',(req:any,res:Response)=>{
    const likesito={
        idUsuario: req.body.idUsuario ,
        idPost:req.body.idPost  ,  
    }

    Likes.create(likesito).then(userDB=>{
        
        res.json({
            ok:true, 
            like:userDB,
    
        });

    
    });


   
});


//unlike post
likesRoutes.post('/unlike',(req:any,res:Response)=>{
    const likesito={
        idUsuario: req.body.idUsuario ,
        idPost:req.body.idPost  ,  
    }

    Likes.deleteOne(likesito).then(userDB=>{
        
        res.json({
            ok:true, 
           // like:userDB,
    
        });

    
    });


   
});






export default likesRoutes;