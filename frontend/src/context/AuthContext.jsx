import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem('token'));
	const [user, setUser] = useState(() => {
		const raw = localStorage.getItem('user');
		return raw ? JSON.parse(raw) : null;
	});

	useEffect(() => {
		if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
	}, [token]);

	useEffect(() => {
		if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
	}, [user]);

	const login = async (email, password) => {
		const { data } = await api.post('/users/login', { email, password });
		setToken(data.token);
		setUser(data.user);
		return data.user;
	};

	const register = async (payload) => {
		const { data } = await api.post('/users/register', payload);
		setToken(data.token);
		setUser(data.user);
		return data.user;
	};

	const logout = () => {
		setToken(null);
		setUser(null);
	};

	const value = useMemo(() => ({ token, user, setUser, login, register, logout }), [token, user]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
} 