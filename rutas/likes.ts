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


//getLikes de post

likesRoutes.get('/getlikes/:postid',async(req:any,res:Response)=>{
   
    const prueba:any[]=[];
    const postId=req.params.postid;
    const postLike = await Likes.find()
    .exec();
    
    
    postLike.forEach((ele:any)=>{
        if(ele.idPost==postId){
            console.log("entra");
            prueba.push(ele.idUsuario)
            
        }
    })
    
    
    
     

    res.json({
        ok:true,
        //pagina:pagina,
        usuarios:prueba,
       numeroLikes: prueba.length
        
    });
});


//getLikes por usuario

likesRoutes.get('/getpostlike/:userid',async(req:any,res:Response)=>{
   
    const prueba:any[]=[];
    const userid=req.params.userid;
    const postLike = await Likes.find()
    .exec();
    
    
    postLike.forEach((ele:any)=>{
        if(ele.idUsuario==userid){
            console.log("entra");
            prueba.push(ele.idPost)
            
        }
    })
    
    
    
     

    res.json({
        ok:true,
        //pagina:pagina,
        posts:prueba,
       //numeroLikes: prueba.length
        
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