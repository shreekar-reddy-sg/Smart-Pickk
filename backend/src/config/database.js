import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongo DB connected successfully!!!${connect.connection.host}`);
    }
    catch(error) {
        console.log('Error connecting to MongoDB...',error.message);
        process.exit(1);
    }
}

export default connectDB;

