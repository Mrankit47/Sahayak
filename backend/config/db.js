import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export const connectDb = async () => {
	mongoose.set('strictQuery', true);
	const configuredUri = process.env.MONGO_URI;
	if (configuredUri) {
		try {
			await mongoose.connect(configuredUri, { appName: 'sahayak-backend' });
			console.log('Connected to MongoDB (configured URI)');
			return;
		} catch (err) {
			console.warn('Failed to connect to configured MONGO_URI. Falling back to in-memory MongoDB. Error:', err.message);
		}
	}
	memoryServer = await MongoMemoryServer.create();
	const uri = memoryServer.getUri();
	await mongoose.connect(uri, { appName: 'sahayak-backend' });
	console.log('Connected to in-memory MongoDB');
};

export const disconnectDb = async () => {
	await mongoose.disconnect();
	if (memoryServer) {
		await memoryServer.stop();
		memoryServer = null;
	}
}; 