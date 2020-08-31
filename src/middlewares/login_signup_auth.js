import jwt from 'jsonwebtoken';

const key = process.env.SECRET_KEY;
const verifyLogin = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decode = jwt.verify(token, key);
		if (decode) {
			return res.status(401).json({ message: 'You are already logged in' });
		}
		next();
	} catch (error) {
		next();
	}
};

export default verifyLogin;
