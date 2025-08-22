import { Box, Button, Heading, Input, VStack, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const navigate = useNavigate();

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await login(email, password);
			toast({ title: 'Logged in', status: 'success' });
			navigate('/dashboard');
		} catch (err) {
			toast({ title: 'Login failed', status: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box maxW="md" mx="auto">
			<Heading size="md" mb={4}>Login</Heading>
			<form onSubmit={onSubmit}>
				<VStack align="stretch" spacing={3}>
					<Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					<Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					<Button type="submit" colorScheme="teal" isLoading={loading}>Login</Button>
				</VStack>
			</form>
			<Button as={Link} to="/register" variant="link" mt={3}>Create an account</Button>
		</Box>
	);
} 