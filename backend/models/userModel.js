import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const profileSchema = new mongoose.Schema({
	bio: { type: String, default: '' },
	skills: { type: [String], default: [] },
	avatarUrl: { type: String, default: '' },
}, { _id: false });

const geoPointSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['Point'],
		default: 'Point',
	},
	coordinates: {
		type: [Number], // [lng, lat]
		validate: {
			validator: (v) => Array.isArray(v) && v.length === 2,
			message: 'Coordinates must be [lng, lat]'
		},
	},
}, { _id: false });

const userSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	password: { type: String, required: true, minlength: 6, select: false },
	role: { type: String, enum: ['volunteer', 'organization'], default: 'volunteer' },
	location: { type: geoPointSchema },
	profile: { type: profileSchema, default: () => ({}) },
}, { timestamps: true });

userSchema.pre('save', async function preSave(next) {
	if (!this.isModified('password')) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
	return bcrypt.compare(candidate, this.password);
};

// Geo index for users
// eslint-disable-next-line
// @ts-ignore
if (!userSchema.indexes().some(([fields]) => Object.keys(fields).includes('location'))) {
	userSchema.index({ location: '2dsphere' });
}

export const User = mongoose.model('User', userSchema); 