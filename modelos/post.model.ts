import {Schema,model,Document} from 'mongoose';

const postSchema=new Schema({


    created:{
        type:Date
    },

    mensaje:{
        type:String
    },
    // una coleccion de imagenes para que se puedan subir varias imafenes
    img:[{
        type:String
    }],
    coords:{
        type:String
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:[true,'debe existir una referencia con el susuario']
    }
});

//crear la fecha automatica cada vez que publicamos algo

postSchema.pre<IPost>('save',function(next){

    this.created=new Date();
    next();
});
interface IPost extends Document{
    created:Date;
    
    mensaje:String;
    
    img:string[];
    coords:string;
    
    usuario:string;
}
export const Post =model<IPost>('Post',postSchema);


