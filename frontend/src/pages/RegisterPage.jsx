import { Box, Button, Heading, Input, VStack, useToast, Select, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
	const { register } = useAuth();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('volunteer');
	const [lat, setLat] = useState('');
	const [lng, setLng] = useState('');
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const navigate = useNavigate();

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const payload = { name, email, password, role };
			if (lat && lng) payload.location = { lat: Number(lat), lng: Number(lng) };
			await register(payload);
			toast({ title: 'Registered', status: 'success' });
			navigate('/dashboard');
		} catch (err) {
			toast({ title: 'Registration failed', status: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box maxW="md" mx="auto">
			<Heading size="md" mb={4}>Register</Heading>
			<form onSubmit={onSubmit}>
				<VStack align="stretch" spacing={3}>
					<Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
					<Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					<Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					<Select value={role} onChange={(e) => setRole(e.target.value)}>
						<option value="volunteer">Volunteer</option>
						<option value="organization">Organization</option>
					</Select>
					<HStack>
						<Input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
						<Input placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
					</HStack>
					<Button type="submit" colorScheme="teal" isLoading={loading}>Create account</Button>
				</VStack>
			</form>
			<Button as={Link} to="/login" variant="link" mt={3}>Already have an account? Login</Button>
		</Box>
	);
} 