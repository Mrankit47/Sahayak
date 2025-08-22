import mongoose from 'mongoose';
import { Application } from '../models/applicationModel.js';
import { Task } from '../models/taskModel.js';

export const applyForTask = async (req, res) => {
	try {
		const { taskId } = req.params;
		if (!mongoose.isValidObjectId(taskId)) {
			return res.status(400).json({ message: 'Invalid task id' });
		}
		const task = await Task.findById(taskId);
		if (!task) return res.status(404).json({ message: 'Task not found' });
		if (task.status !== 'open') {
			return res.status(400).json({ message: 'Task is not open for applications' });
		}
		const application = await Application.create({ task: taskId, volunteer: req.user.id });
		return res.status(201).json(application);
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({ message: 'You have already applied for this task' });
		}
		console.error('applyForTask error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const getApplicationsForTask = async (req, res) => {
	try {
		const { taskId } = req.params;
		if (!mongoose.isValidObjectId(taskId)) {
			return res.status(400).json({ message: 'Invalid task id' });
		}
		const task = await Task.findById(taskId);
		if (!task) return res.status(404).json({ message: 'Task not found' });
		if (task.postedBy.toString() !== req.user.id) {
			return res.status(403).json({ message: 'Forbidden: Not your task' });
		}
		const applications = await Application.find({ task: taskId })
			.populate('volunteer', 'name email profile');
		return res.json(applications);
	} catch (error) {
		console.error('getApplicationsForTask error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
};

export const updateApplicationStatus = async (req, res) => {
	try {
		const { applicationId } = req.params;
		const { status } = req.body; // 'accepted' or 'rejected'
		if (!['accepted', 'rejected', 'pending'].includes(status)) {
			return res.status(400).json({ message: 'Invalid status' });
		}
		const application = await Application.findById(applicationId).populate('task');
		if (!application) return res.status(404).json({ message: 'Application not found' });
		if (application.task.postedBy.toString() !== req.user.id) {
			return res.status(403).json({ message: 'Forbidden: Not your task' });
		}
		application.status = status;
		await application.save();
		return res.json(application);
	} catch (error) {
		console.error('updateApplicationStatus error:', error);
		return res.status(500).json({ message: 'Server error' });
	}
}; 