import fileUpload from 'express-fileupload';
export interface fileUpload{
   
        name:         string;
        data:         any;
        encoding:     string;
        tempFilePath: string;
        truncated:    boolean;
        mimetype:     string;
        mv:Function;
       
    
    
   
    


}