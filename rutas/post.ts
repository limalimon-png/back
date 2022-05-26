import { Router,Response } from 'express';
import { verificarToken } from '../middlewares/autenticacion';
import { Post } from '../modelos/post.model';
import { fileUpload } from '../interfaces/file-upload';
import  FileSystem  from '../clases/file-system';
const postRoutes =Router()
const fileSystem=new FileSystem();



//obtener post con paginacion
postRoutes.get('/',async(req:any,res:Response)=>{

    let pagina =Number(req.query.pagina) ||1;
    let skip=pagina -1;
    skip=skip*10;
    //recibimos los diferentes posts y luego los mostramos
    const posts = await Post.find().
    //ordenamos de forma descendente
    sort({_id:-1})
    .skip(skip)
    //limita a 10 resultados
    .limit(10)
    //de la informacion de usuario, quitamos es password
    .populate('usuario','-password')
    //ejecuta la query
    .exec();
     

    res.json({
        ok:true,
        pagina:pagina,
        posts
    });
});


//obtener todos los post de un usuario
postRoutes.get('/perfil/:userid',async(req:any,res:Response)=>{
   
    const prueba:any[]=[];
    const userId=req.params.userid;
    const posts = await Post.find()
    .populate('usuario','-password')
    .exec();
    
    
    posts.forEach((ele:any)=>{
        if(ele.usuario.id==userId){
            console.log("entra");
            prueba.push(ele)
            
        }
    })
    
    
    
     

    res.json({
        ok:true,
        userId:userId,
        //pagina:pagina,
        posts:prueba,
        
    });
});

//obtener post por id
postRoutes.get('/perfil2/:postid',async(req:any,res:Response)=>{
   
    const prueba:any[]=[];
    const postId=req.params.postid;
    const posts = await Post.find()
    .populate('usuario','-password')
    .exec();
    
    
    posts.forEach((ele:any)=>{
        if(ele._id==postId){
            console.log("entra");
            prueba.push(ele)
            
        }
    })
    
    
    
     

    res.json({
        
        posts:prueba,
        
    });
});




//crear post
postRoutes.post('/a',[verificarToken],(req:any,res:Response)=>{
    const pos={
        mensaje:req.body.mensaje,
        usuario:req.body.usuario,
        img:req.body.img
    }

   // const body =req.body;
    //body.usuario=req.usuario._id;
    // pos.img.forEach(async (element: any) => {
    //     const file:fileUpload=element;
       //  await fileSystem.guardarImagenTemporal(file,req.usuario._id);
    // });
   
  //  const imagenes=fileSystem.imagenesTempToPost(req.body.usuario._id);
   // pos.img=imagenes;

    Post.create(pos).then(async postDB=>{
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


//crear post
postRoutes.post('/',[verificarToken],(req:any,res:Response)=>{

    const body =req.body;
    body.usuario=req.usuario._id;
    const imagenes=fileSystem.imagenesTempToPost(req.usuario._id);
     body.img=imagenes;

    Post.create(body).then(async postDB=>{
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
postRoutes.post('/upload',[verificarToken],async (req:any,res:Response)=>{

    //si no existen archivos
    if(!req.files){
        return res.status(400).json({
            ok:false,
            mensaje:'No se subió ningun archivo'
        });
    }
    console.log('upload',req.files.image);
    
    const file:fileUpload=req.files.image;
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

    await fileSystem.guardarImagenTemporal(file,req.usuario._id);

    res.json({
        ok:true,
        file:file.mimetype


    });

    console.log('sale');
    

});


//actualizar datos post

// [verificarToken],verificarToken
postRoutes.post('/update',(req:any,res:Response)=>{
    console.log('body',req.body);
     console.log('iamgenes',req.body.img);
    const body =req.body;

  
    
    
   
    //comprobamos que existe el usuario
     Post.findByIdAndUpdate(body._id,body,{new:true},(err,userDB)=>{


         if(err)throw err;

         if(!userDB){
             return res.json({
                 ok:false,
                 mensaje:"no existe ese post"
               

             });

         }

         res.json({
             ok:true
         })



     });
       
   


});




//coger las imagenes y videos
postRoutes.get('/imagen/:userid/:img',(req:any,res:Response)=>{
const userId=req.params.userid;
const img=req.params.img;
const pathFoto=fileSystem.getFotoUrl(userId,img);
res.sendFile(pathFoto);

});

//get post a traves del id
postRoutes.get('/getlikepost/:postid',async(req:any,res:Response)=>{
   
    const prueba:any[]=[];
    const postId=req.params.postid;
    const posts = await Post.find()
    .populate('usuario','-password')
    .exec();
    
    
    posts.forEach((ele:any)=>{
        if(ele._id==postId){
            console.log("entra");
            prueba.push(ele)
            
        }
    })
    
    
     

    res.json({
        ok:true,
        //pagina:pagina,
        posts:prueba,
       //numeroLikes: prueba.length
        
    });
});

export default postRoutes;