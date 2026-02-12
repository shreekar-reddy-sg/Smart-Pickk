import connectDB from "./config/database.js";
import dotenv from "dotenv";
import app from "./app.js"

dotenv.config({
    path: './.env'
});

const startServer = async () => {
    try {
        const port = process.env.PORT || 5000;
        await connectDB();
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }
    catch(error) {
        console.log('Some Error Occurred: ',error.message);
        process.exit(1);
    }
}

startServer();