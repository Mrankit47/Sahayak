import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
	task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
	volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
	appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

applicationSchema.index({ task: 1, volunteer: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema); 