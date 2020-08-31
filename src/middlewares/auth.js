import jwt from 'jsonwebtoken';

const key = process.env.SECRET_KEY;
const verifyAuth = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, key);
		next();
	} catch (error) {
		res.status(401).json({ message: 'Authentication failed!' });
	}
};

export default verifyAuth;
