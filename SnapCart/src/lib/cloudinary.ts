import { rejects } from 'assert';
import { v2 as cloudinary, UploadStream } from 'cloudinary'


cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

// this response has been used in api/admin/add-grocery..for image upload
const uploadOnCloudinary=async (file:Blob):Promise<string | null>=>{
  if(!file){
    return null
  }
  try{
    const arrayBuffer=await file.arrayBuffer()
    const buffer=Buffer.from(arrayBuffer)
    return new Promise((resolve,reject)=>{
      const uploadStream=cloudinary.uploader.upload_stream(
        {resource_type:"auto"},
        (error,result)=>{
            if(error){
              reject(error)
            }else{
              resolve(result?.secure_url??null)
            }
        }
      )
      uploadStream.end(buffer)
    })
  }catch(err){
    console.log(err)
    return null
  }
}

export default uploadOnCloudinary


// Jab tu likhta hai:
// const url = await uploadOnCloudinary(file)
// Actually hota kya hai?

// uploadOnCloudinary start hota hai

// Promise create hota hai

// Upload start hota hai

// JS bolta hai:

// “Main wait karta hoon…”

// Jab callback me:

// resolve(url)

// Promise FULFILL

// await ko value milti hai

// 🧠 Await ka buffer se koi lena-dena nahi




// Buffer gaya → file upload hui → URL bana →
// Promise resolve hui → await ko URL mila →
// DB / API / UI me use hua










// ┌──────────────────────────────────────────┐
// │ uploadOnCloudinary(file: Blob)            │
// │ Reason: Entry point of upload logic       │
// └───────────────┬──────────────────────────┘
//                 │
//                 ▼
// ┌──────────────────────────────────────────┐
// │ Check: Is file present?                  │
// │ Reason: Upload without file is useless  │
// │ Prevents runtime errors                 │
// └───────────────┬──────────────────────────┘
//         NO ─────►│ return null              │
//                 │ Reason: Graceful exit     │
//                 ▼
//                YES
//                 │
//                 ▼
// ┌──────────────────────────────────────────┐
// │ Enter try block                          │
// │ Reason: File conversion & upload can    │
// │ throw errors                            │
// └───────────────┬──────────────────────────┘
//                 │
//                 ▼
// ┌──────────────────────────────────────────┐
// │ Blob → ArrayBuffer                      │
// │ file.arrayBuffer()                     │
// │ Reason: Node.js cannot directly handle  │
// │ browser Blob objects                   │
// └───────────────┬──────────────────────────┘
//                 │
//                 ▼
// ┌──────────────────────────────────────────┐
// │ ArrayBuffer → Buffer                    │
// │ Buffer.from(arrayBuffer)               │
// │ Reason: Cloudinary upload_stream       │
// │ accepts Node.js Buffer only            │
// └───────────────┬──────────────────────────┘
//                 │
//                 ▼
// ┌──────────────────────────────────────────┐
// │ Create new Promise                      │
// │ Reason: upload_stream is callback-based│
// │ Promise needed for async/await support  │
// └───────────────┬──────────────────────────┘
//                 │
//                 ▼
// ┌──────────────────────────────────────────┐
// │ cloudinary.uploader.upload_stream       │
// │ resource_type: "auto"                   │
// │ Reason: Cloudinary auto-detects file    │
// │ type (image/video/pdf/etc)              │
// └───────────────┬──────────────────────────┘
//                 │
//                 ▼
// ┌──────────────────────────────────────────┐
// │ uploadStream.end(buffer)                │
// │ Reason: Sends actual binary data to     │
// │ Cloudinary & triggers upload            │
// └───────────────┬──────────────────────────┘
//                 │
//                 ▼
// ┌──────────────────────────────────────────┐
// │ Callback invoked (error, result)        │
// │ Reason: Cloudinary responds asynchronously│
// └───────────────┬───────────────┬──────────┘
//                 │               │
//           ERROR │               │ SUCCESS
//                 │               │
//                 ▼               ▼
// ┌────────────────────────┐ ┌──────────────────────────┐
// │ reject(error)          │ │ resolve(result.secure_url)│
// │ Reason: Propagate      │ │ Reason: secure HTTPS URL  │
// │ failure to caller      │ │ safe to store in DB       │
// └────────────────────────┘ └──────────────────────────┘
//                 │
//                 ▼
// ┌──────────────────────────────────────────┐
// │ Promise settles                         │
// │ Reason: upload completed or failed      │
// └──────────────────────────────────────────┘
//                 │
//                 ▼
// ┌──────────────────────────────────────────┐
// │ catch(error)?                           │
// │ Reason: Handle unexpected crashes       │
// └───────────────┬──────────────────────────┘
//         YES ─────►│ log error + return null │
//                 │ Reason: App stability     │
//                 ▼
//                END