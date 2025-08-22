import { useEffect, useState } from 'react';
import { getTasks } from '../services/api.js';

export function useTasks(initialParams = {}) {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [params, setParams] = useState(initialParams);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const { data } = await getTasks(params);
				setTasks(data);
			} finally {
				setLoading(false);
			}
		})();
	}, [JSON.stringify(params)]);

	return { tasks, loading, setParams };
} 