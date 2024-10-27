import mongoose from "mongoose";

let isConnected=false

export const connectToDB=async()=>{
    mongoose.set('strictQuery', true)
    console.log(process.env.DB_USER);
    console.log(process.env.DB_PASS);

    if(isConnected){
        console.log("Mongo is already connected")
        return
    }

    try{
        await mongoose.connect(
          //   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jtwnv2k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
          `mongodb+srv://next-project:6iZm6LdGeYl9zasw@cluster0.jtwnv2k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
        );

        isConnected=true
        console.log("connected to mongodb")
    }
    catch(e){
        console.log(e)
    }

}