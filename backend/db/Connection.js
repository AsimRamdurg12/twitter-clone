import mongoose from "mongoose"


const Connection = async (URL) => {
    try{
  const connect = await mongoose.connect(URL);
  console.log(`MongoDB connected: ${connect.connection.host}`);
    }catch(error){
        console.error(`error: ${error.message}`);
        process.exit(1);
        

    }
}

export default Connection