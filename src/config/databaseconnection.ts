import mongoose from 'mongoose';
import { exit } from 'process';
import dotenv from 'dotenv'
dotenv.config();

export async function ConnectToDatabase() {
    try {
        let databaseConnection = process.env.DATABASE_CONNECTION_STRING;
        if (!databaseConnection) {
            console.log("No database connection string found");
            exit(1);
        }
        const connection = await mongoose.connect(databaseConnection);
        if (connection){
            console.log(`MongoDB Connected: ${connection.connection.host}`);
        }else throw("Failed to connect to DB");
    } catch (error) {
        console.log(error);
    }
}