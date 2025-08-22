import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@chakra-ui/react';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TaskDetailPage from './pages/TaskDetailPage.jsx';
import CreateTaskPage from './pages/CreateTaskPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children, roles }) {
	const { user } = useAuth();
	if (!user) return <Navigate to="/login" replace />;
	if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
	return children;
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Navbar />
				<Container maxW="6xl" py={6}>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route path="/tasks/:id" element={<TaskDetailPage />} />
						<Route
							path="/create-task"
							element={
								<ProtectedRoute roles={["organization"]}>
									<CreateTaskPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/profile"
							element={
								<ProtectedRoute>
									<ProfilePage />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</Container>
			</BrowserRouter>
		</AuthProvider>
	);
} 