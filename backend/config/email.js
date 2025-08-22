import nodemailer from 'nodemailer';

export const getTransporter = () => {
	const host = process.env.SMTP_HOST;
	const port = Number(process.env.SMTP_PORT || 587);
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;

	if (!host || !user || !pass) {
		console.warn('SMTP not fully configured; email sending will be disabled.');
		return null;
	}

	return nodemailer.createTransport({
		host,
		port,
		secure: port === 465,
		auth: { user, pass },
	});
}; 