import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || '';
		const token = authHeader.startsWith('Bearer ')
			? authHeader.substring('Bearer '.length)
			: null;
		if (!token) {
			return res.status(401).json({ message: 'Unauthorized: Missing token' });
		}
		const secret = process.env.JWT_SECRET;
		const payload = jwt.verify(token, secret);
		req.user = { id: payload.id, role: payload.role };
		return next();
	} catch (error) {
		return res.status(401).json({ message: 'Unauthorized: Invalid token' });
	}
};

export const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Forbidden: Insufficient role' });
		}
		return next();
	};
}; 