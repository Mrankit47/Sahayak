import { useEffect, useState } from 'react';
import { Box, Button, Heading, Input, Textarea, VStack, HStack, useToast } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext.jsx';
import { getMe, updateMe } from '../services/api.js';

export default function ProfilePage() {
	const { user, setUser } = useAuth();
	const [name, setName] = useState(user?.name || '');
	const [bio, setBio] = useState(user?.profile?.bio || '');
	const [skills, setSkills] = useState((user?.profile?.skills || []).join(', '));
	const [avatarUrl, setAvatarUrl] = useState(user?.profile?.avatarUrl || '');
	const [lat, setLat] = useState(user?.location?.coordinates ? String(user.location.coordinates[1]) : '');
	const [lng, setLng] = useState(user?.location?.coordinates ? String(user.location.coordinates[0]) : '');
	const [loading, setLoading] = useState(false);
	const toast = useToast();

	useEffect(() => {
		(async () => {
			const { data } = await getMe();
			setName(data.name || '');
			setBio(data.profile?.bio || '');
			setSkills((data.profile?.skills || []).join(', '));
			setAvatarUrl(data.profile?.avatarUrl || '');
			if (data.location?.coordinates) {
				setLat(String(data.location.coordinates[1]));
				setLng(String(data.location.coordinates[0]));
			}
		})();
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const payload = {
				name,
				profile: {
					bio,
					skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
					avatarUrl,
				},
			};
			if (lat && lng) payload.location = { lat: Number(lat), lng: Number(lng) };
			const { data } = await updateMe(payload);
			setUser(data.user);
			toast({ title: 'Profile updated', status: 'success' });
		} catch (err) {
			toast({ title: 'Update failed', status: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box maxW="lg" mx="auto">
			<Heading size="md" mb={4}>Profile</Heading>
			<form onSubmit={onSubmit}>
				<VStack align="stretch" spacing={3}>
					<Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
					<Textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
					<Input placeholder="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
					<Input placeholder="Avatar URL" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
					<HStack>
						<Input placeholder="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
						<Input placeholder="Longitude" value={lng} onChange={(e) => setLng(e.target.value)} />
					</HStack>
					<Button type="submit" colorScheme="teal" isLoading={loading}>Save</Button>
				</VStack>
			</form>
		</Box>
	);
} 