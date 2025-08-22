import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const signToken = (user) => {
	const secret = process.env.JWT_SECRET;
	return jwt.sign({ id: user._id.toString(), role: user.role }, secret, { expiresIn: '7d' });
};

export const registerUser = async (req, res) => {
	try {
		const { name, email, password, role, location, profile } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ message: 'name, email, and password are required' });
		}
		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(400).json({ message: 'Email already registered' });
		}

		const user = new User({ name, email, password, role, profile });

		if (location) {
			// Accept either { coordinates: [lng, lat] } or { lat, lng }
			if (Array.isArray(location.coordinates)) {
				user.location = { type: 'Point', coordinates: location.coordinates };
			} else if (typeof location.lat === 'number' && typeof location.lng === 'number') {
				user.location = { type: 'Point', coordinates: [location.lng, location.lat] };
			}
		}

		await user.save();
		const token = signToken(user);
		return res.status(201).json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				location: user.location,
				profile: user.profile,
			},
		});
	} catch (error) {
		console.error('registerUser error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'email and password are required' });
		}
		const user = await User.findOne({ email }).select('+password');
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const token = signToken(user);
		return res.json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				location: user.location,
				profile: user.profile,
			},
		});
	} catch (error) {
		console.error('loginUser error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		return res.json({
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			location: user.location,
			profile: user.profile,
		});
	} catch (error) {
		console.error('getMe error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const updateMe = async (req, res) => {
	try {
		const { name, profile, location } = req.body;
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		if (typeof name === 'string') user.name = name;
		if (profile && typeof profile === 'object') {
			user.profile = { ...user.profile.toObject?.() ?? user.profile, ...profile };
		}
		if (location) {
			if (Array.isArray(location.coordinates)) {
				user.location = { type: 'Point', coordinates: location.coordinates };
			} else if (typeof location.lat === 'number' && typeof location.lng === 'number') {
				user.location = { type: 'Point', coordinates: [location.lng, location.lat] };
			}
		}
		await user.save();
		return res.json({ message: 'Profile updated',
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				location: user.location,
				profile: user.profile,
			}
		});
	} catch (error) {
		console.error('updateMe error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
}; 