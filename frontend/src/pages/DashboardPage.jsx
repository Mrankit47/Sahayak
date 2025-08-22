import { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Heading, HStack, Input, Select, Button } from '@chakra-ui/react';
import { getTasks } from '../services/api.js';
import TaskCard from '../components/TaskCard.jsx';
import MapView from '../components/MapView.jsx';

export default function DashboardPage() {
	const [tasks, setTasks] = useState([]);
	const [category, setCategory] = useState('');
	const [lat, setLat] = useState('');
	const [lng, setLng] = useState('');
	const [radiusKm, setRadiusKm] = useState('5');

	const fetchTasks = async () => {
		const params = {};
		if (category) params.category = category;
		if (lat && lng) {
			params.lat = Number(lat);
			params.lng = Number(lng);
			params.radiusKm = Number(radiusKm || 5);
		}
		const { data } = await getTasks(params);
		setTasks(data);
	};

	useEffect(() => { fetchTasks(); }, []);

	return (
		<Box>
			<Heading size="md" mb={3}>Nearby Tasks</Heading>
			<HStack mb={4} spacing={3}>
				<Select placeholder="All categories" value={category} onChange={(e) => setCategory(e.target.value)}>
					<option value="Cleanup">Cleanup</option>
					<option value="Donation">Donation</option>
					<option value="Teaching">Teaching</option>
				</Select>
				<Input placeholder="Lat" value={lat} onChange={(e) => setLat(e.target.value)} width="120px" />
				<Input placeholder="Lng" value={lng} onChange={(e) => setLng(e.target.value)} width="120px" />
				<Input placeholder="Radius km" value={radiusKm} onChange={(e) => setRadiusKm(e.target.value)} width="120px" />
				<Button onClick={fetchTasks} colorScheme="teal">Filter</Button>
			</HStack>
			<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
				<GridItem>
					{tasks.map((t) => <TaskCard key={t._id} task={t} />)}
				</GridItem>
				<GridItem>
					<MapView tasks={tasks} />
				</GridItem>
			</Grid>
		</Box>
	);
} 