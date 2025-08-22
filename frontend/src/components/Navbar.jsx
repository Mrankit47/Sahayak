import { Box, Button, Flex, HStack, Link as CLink, Spacer, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	return (
		<Box as="nav" borderBottom="1px" borderColor="gray.200" py={3} px={4}>
			<Flex align="center">
				<Text fontWeight="bold">Sahayak</Text>
				<Spacer />
				<HStack spacing={4}>
					<CLink as={Link} to="/">Home</CLink>
					<CLink as={Link} to="/dashboard">Dashboard</CLink>
					{user?.role === 'organization' && (
						<CLink as={Link} to="/create-task">Create Task</CLink>
					)}
					{user ? (
						<HStack>
							<CLink as={Link} to="/profile">{user.name}</CLink>
							<Button size="sm" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
						</HStack>
					) : (
						<HStack>
							<CLink as={Link} to="/login">Login</CLink>
							<Button size="sm" as={Link} to="/register">Register</Button>
						</HStack>
					)}
				</HStack>
			</Flex>
		</Box>
	);
} 