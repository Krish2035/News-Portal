import { ID, ImageGravity } from "appwrite";
import {appWriteConfig, storage} from "./config"

export async function uploadFile(file) {
    try{
        const uploadedFile = await storage.createFile(
            appWriteConfig.storageId,
            ID.unique(),
            file
        )

    return uploadedFile
    }catch(error){
        console.log(error)
    }
}

//get file url

export async function getFilePreview(fileId){
    try{
        const fileUrl = storage.getFilePreview(
            appWriteConfig.storageId,
            fileId,
            2000,
            2000,
            ImageGravity.Top,
            100
        )

        if(!fileUrl) throw Error

        return fileUrl
    }catch(error){
        console.log(error);
    }
}