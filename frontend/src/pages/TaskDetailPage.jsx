import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Badge, Button, useToast } from '@chakra-ui/react';
import { getTask, applyForTask } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function TaskDetailPage() {
	const { id } = useParams();
	const [task, setTask] = useState(null);
	const { user } = useAuth();
	const navigate = useNavigate();
	const toast = useToast();

	useEffect(() => {
		(async () => {
			const { data } = await getTask(id);
			setTask(data);
		})();
	}, [id]);

	const onApply = async () => {
		try {
			if (!user) return navigate('/login');
			if (user.role !== 'volunteer') return toast({ title: 'Only volunteers can apply', status: 'warning' });
			await applyForTask(id);
			toast({ title: 'Applied successfully', status: 'success' });
		} catch (err) {
			toast({ title: 'Could not apply', status: 'error' });
		}
	};

	if (!task) return null;

	return (
		<Box>
			<Heading>{task.title}</Heading>
			<Badge mt={2}>{task.status}</Badge>
			<Text mt={3}>{task.description}</Text>
			<Text mt={2}>Category: {task.category || 'General'}</Text>
			<Text mt={2}>Volunteers needed: {task.volunteersNeeded}</Text>
			{task.address && <Text mt={2}>Address: {task.address}</Text>}
			<Button mt={4} colorScheme="teal" onClick={onApply}>I'm Interested</Button>
		</Box>
	);
} 