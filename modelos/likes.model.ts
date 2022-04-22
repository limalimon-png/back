import {Schema,model,Document} from 'mongoose';
//structura likes

const postSchema=new Schema({


    idPost:{
        type:String

    },
    idUsuario:{
        type:String
    }

});


//creamos la interfaz
interface ILikes extends Document{
    idUsuario:String;
    
    idPost:String;
}
export const Likes =model<ILikes>('Likes',postSchema);