import { Box, Badge, Heading, Text, HStack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function TaskCard({ task }) {
	return (
		<Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
			<HStack justify="space-between" align="start">
				<Heading size="md">{task.title}</Heading>
				<Badge>{task.status}</Badge>
			</HStack>
			<Text mt={2}>{task.description?.slice(0, 120)}</Text>
			<HStack mt={3} spacing={4}>
				<Badge colorScheme="purple">{task.category || 'General'}</Badge>
				<Text fontSize="sm">Needs: {task.volunteersNeeded}</Text>
			</HStack>
			<Button as={Link} to={`/tasks/${task._id}`} mt={3} size="sm">View</Button>
		</Box>
	);
} 