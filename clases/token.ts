import jwt from 'jsonwebtoken'

export default class Token{
    private static seed: string='superSeed';
    private static cadudidad: string ='30d';

    static getToken(payload:any):string{

        return jwt.sign({
            usuario:payload
        },this.seed,{expiresIn:this.cadudidad})

    }


    static comprobarToken(userToken:string){
        return new Promise((resolve,reject)=>{

            jwt.verify(userToken,this.seed,(err,decoded)=>{
                if(err){
                    //error
                    reject();
                }else{
                    //token valido
                    resolve(decoded);
                }
            });



        })

       
    }
}