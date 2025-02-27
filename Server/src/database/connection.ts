import mongoose from "mongoose";

export default async function connect() {
	try {
		await mongoose.connect(process.env.DB_URL as string);
		console.log("Connected to database");
	} catch (error) {
		throw new Error("Error while connecting to database");
	}
}
