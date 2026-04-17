import mongoose from "mongoose";

const mongoUrl=process.env.MONGO_DB_URL

if(!mongoUrl){
    throw new Error("DB error!!")
}


let cache=global.mongoose
if(!cache){
    cache=global.mongoose={conn:null,promise:null}
}


const connectDB=async ()=>{
    if(cache.conn){
        return cache.conn
        // if connection exist in cache , then simply
        //return that connection
    }

    if(!cache.promise){
        //if both conn and promise are null
        //naya connection bnao or promise me daal do
        //then promise khud hi resolve hokr ,connection succes hojaega
        cache.promise=mongoose.connect(mongoUrl).then((conn)=>conn.connection)
    }

    try{
        //if conn is null but promise is there
        //which means connection is going on
        //then simply wait for the connection to 
        //resolve
        const conn=await cache.promise
        return conn
    }catch(err){
        console.log(err)
    }
}


export default connectDB