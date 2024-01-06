import { v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
  cloud_name:process.env.CL0UDINARY_CLOUD_NAME, 
  api_key: process.env.CL0UDINARY_API_KEY, 
  api_secret:process.env.CL0UDINARY_API_SECRETS 
});

const uploadOnCloudinary = async (localPathfile) => {
    try {
        if(!localPathfile) return null;
        //if their is local path then upload
        const responseCloudinary = await cloudinary.uploader.upload(localPathfile
            ,{resource_type:"auto"}
            )
        fs.unlinkSync(localPathfile)
        return responseCloudinary;
    } catch (error) {
        console.log(error,'error')
        fs.unlinkSync(localPathfile)
        //remove the locally save uploaded file as operation was failed
        return null;
    }

}
export {uploadOnCloudinary};