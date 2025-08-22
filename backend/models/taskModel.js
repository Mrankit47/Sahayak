import mongoose from 'mongoose';

const geoPointSchema = new mongoose.Schema({
	type: { type: String, enum: ['Point'], default: 'Point' },
	coordinates: {
		type: [Number], // [lng, lat]
		validate: {
			validator: (v) => Array.isArray(v) && v.length === 2,
			message: 'Coordinates must be [lng, lat]'
		},
	}
}, { _id: false });

const taskSchema = new mongoose.Schema({
	title: { type: String, required: true, trim: true },
	description: { type: String, default: '' },
	postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	status: { type: String, enum: ['open', 'in_progress', 'completed'], default: 'open' },
	category: { type: String, default: '' },
	location: { type: geoPointSchema },
	address: { type: String, default: '' },
	taskDateTime: { type: Date },
	volunteersNeeded: { type: Number, default: 1, min: 1 },
}, { timestamps: true });

// Geo index
// Ensure index exists even if schema-level index is missed by some tools
// Will be created automatically by Mongoose in development
// For production, ensure index build is handled in deployment
// eslint-disable-next-line
// @ts-ignore
if (!taskSchema.indexes().some(([fields]) => Object.keys(fields).includes('location'))) {
	taskSchema.index({ location: '2dsphere' });
}

export const Task = mongoose.model('Task', taskSchema); 