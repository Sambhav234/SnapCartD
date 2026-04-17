import axios from "axios";

async function emitEventHandler(event:string,data:any,socketId?:string){
        try{
            console.log("making request to notify")
            await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`,{socketId,event,data})
            console.log("request to notify sent")
        }catch(error){
            console.log(error)
        }
}

export default emitEventHandler