import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function HomePage() {
	return (
		<Box>
			<Heading as="h1" size="lg" mb={3}>Welcome to Sahayak</Heading>
			<Text mb={4}>A hyperlocal micro-volunteering platform connecting volunteers with nearby tasks.</Text>
			<Button as={Link} to="/dashboard" colorScheme="teal">Explore Tasks</Button>
		</Box>
	);
} 