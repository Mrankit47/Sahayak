import mongoose from 'mongoose';
import { Task } from '../models/taskModel.js';

export const createTask = async (req, res) => {
	try {
		const { title, description, category, address, taskDateTime, volunteersNeeded, location } = req.body;
		if (!title) {
			return res.status(400).json({ message: 'title is required' });
		}
		const task = new Task({
			title,
			description,
			category,
			address,
			taskDateTime: taskDateTime ? new Date(taskDateTime) : undefined,
			volunteersNeeded,
			postedBy: req.user.id,
		});
		if (location) {
			if (Array.isArray(location.coordinates)) {
				task.location = { type: 'Point', coordinates: location.coordinates };
			} else if (typeof location.lat === 'number' && typeof location.lng === 'number') {
				task.location = { type: 'Point', coordinates: [location.lng, location.lat] };
			}
		}
		await task.save();
		return res.status(201).json(task);
	} catch (error) {
		console.error('createTask error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const getTasks = async (req, res) => {
	try {
		const { category, lat, lng, radiusKm } = req.query;
		const filter = {};
		if (category) filter.category = category;

		if (lat && lng) {
			const radiusMeters = Number(radiusKm || 5) * 1000;
			filter.location = {
				$near: {
					$geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
					$maxDistance: radiusMeters,
				},
			};
		}

		const tasks = await Task.find(filter).sort({ createdAt: -1 }).populate('postedBy', 'name role');
		return res.json(tasks);
	} catch (error) {
		console.error('getTasks error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const getTaskById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.isValidObjectId(id)) {
			return res.status(400).json({ message: 'Invalid task id' });
		}
		const task = await Task.findById(id).populate('postedBy', 'name role');
		if (!task) return res.status(404).json({ message: 'Task not found' });
		return res.json(task);
	} catch (error) {
		console.error('getTaskById error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const updateTask = async (req, res) => {
	try {
		const { id } = req.params;
		const task = await Task.findById(id);
		if (!task) return res.status(404).json({ message: 'Task not found' });
		if (task.postedBy.toString() !== req.user.id) {
			return res.status(403).json({ message: 'Forbidden: Not your task' });
		}
		const { title, description, category, address, taskDateTime, volunteersNeeded, status, location } = req.body;
		if (typeof title === 'string') task.title = title;
		if (typeof description === 'string') task.description = description;
		if (typeof category === 'string') task.category = category;
		if (typeof address === 'string') task.address = address;
		if (typeof volunteersNeeded === 'number') task.volunteersNeeded = volunteersNeeded;
		if (typeof status === 'string') task.status = status;
		if (taskDateTime) task.taskDateTime = new Date(taskDateTime);
		if (location) {
			if (Array.isArray(location.coordinates)) {
				task.location = { type: 'Point', coordinates: location.coordinates };
			} else if (typeof location.lat === 'number' && typeof location.lng === 'number') {
				task.location = { type: 'Point', coordinates: [location.lng, location.lat] };
			}
		}
		await task.save();
		return res.json(task);
	} catch (error) {
		console.error('updateTask error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const deleteTask = async (req, res) => {
	try {
		const { id } = req.params;
		const task = await Task.findById(id);
		if (!task) return res.status(404).json({ message: 'Task not found' });
		if (task.postedBy.toString() !== req.user.id) {
			return res.status(403).json({ message: 'Forbidden: Not your task' });
		}
		await task.deleteOne();
		return res.json({ message: 'Task deleted' });
	} catch (error) {
		console.error('deleteTask error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
}; 