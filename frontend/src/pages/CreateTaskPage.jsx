import { Box, Button, Heading, Input, Textarea, VStack, HStack, Select, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../services/api.js';

export default function CreateTaskPage() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [address, setAddress] = useState('');
	const [taskDateTime, setTaskDateTime] = useState('');
	const [volunteersNeeded, setVolunteersNeeded] = useState(1);
	const [lat, setLat] = useState('');
	const [lng, setLng] = useState('');
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const navigate = useNavigate();

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const payload = { title, description, category, address, volunteersNeeded: Number(volunteersNeeded) };
			if (taskDateTime) payload.taskDateTime = new Date(taskDateTime).toISOString();
			if (lat && lng) payload.location = { lat: Number(lat), lng: Number(lng) };
			await createTask(payload);
			toast({ title: 'Task created', status: 'success' });
			navigate('/dashboard');
		} catch (err) {
			toast({ title: 'Failed to create task', status: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box maxW="lg" mx="auto">
			<Heading size="md" mb={4}>Create Task</Heading>
			<form onSubmit={onSubmit}>
				<VStack align="stretch" spacing={3}>
					<Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
					<Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
					<Select placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
						<option value="Cleanup">Cleanup</option>
						<option value="Donation">Donation</option>
						<option value="Teaching">Teaching</option>
					</Select>
					<Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
					<Input type="datetime-local" value={taskDateTime} onChange={(e) => setTaskDateTime(e.target.value)} />
					<HStack>
						<Input type="number" min={1} placeholder="Volunteers needed" value={volunteersNeeded} onChange={(e) => setVolunteersNeeded(e.target.value)} />
						<Input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
						<Input placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
					</HStack>
					<Button type="submit" colorScheme="teal" isLoading={loading}>Create</Button>
				</VStack>
			</form>
		</Box>
	);
} 