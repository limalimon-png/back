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


});

//coger las imagenes y videos
postRoutes.get('/imagen/:userid/:img',(req:any,res:Response)=>{
const userId=req.params.userid;
const img=req.params.img;
const pathFoto=fileSystem.getFotoUrl(userId,img);
res.sendFile(pathFoto);

});
export default postRoutes;