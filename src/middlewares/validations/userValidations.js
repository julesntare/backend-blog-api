const userAddValidations = (req, res, next) => {
	if (
		req.body.firstname == undefined ||
		req.body.lastname == undefined ||
		req.body.email == undefined ||
		req.body.password == undefined ||
		req.body.cpassword == undefined
	) {
		return res.status(409).json({ msg: 'Please provide firstname, lastname, email, password and cpassword' });
	}
	if (!/^[a-zA-Z]+$/.test(req.body.firstname) || req.body.firstname.length < 3 || req.body.firstname == '') {
		return res
			.status(403)
			.json({ msg: 'firstname must not be empty, contain letters only and have above 3 letters' });
	}
	if (!/^[a-zA-Z]+$/.test(req.body.lastname) || req.body.lastname.length < 3 || req.body.lastname == '') {
		return res
			.status(403)
			.json({ msg: 'lastname must not be empty, contain letters only and have above 3 letters' });
	}
	if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(req.body.email)) {
		return res.status(403).json({ msg: 'email is invalid' });
	}
	if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/.test(req.body.password)) {
		return res.status(403).json({
			msg:
				'password must contain at least 1 lowercase letter, 1 uppercase letter, 1 numeric character, 1 special character and contains 6 or more characters',
		});
	}
	if (req.body.password != req.body.cpassword) {
		return res.status(403).json({ msg: 'Password must match' });
	}
	next();
};

const userEditValidations = async (req, res, next) => {
	if (req.body.firstname) {
		if (!/^[a-zA-Z]+$/.test(req.body.firstname) || req.body.firstname.length < 3 || req.body.firstname == '') {
			return res.status(403).json({
				msg: 'firstname must not be empty, must be one name, contain letters only and have above 3 letters',
			});
		}
	}
	if (req.body.lastname) {
		if (!/^[a-zA-Z]+$/.test(req.body.lastname) || req.body.lastname.length < 3 || req.body.lastname == '') {
			return res.status(403).json({
				msg: 'lastname must not be empty, must be one name, contain letters only and have above 3 letters',
			});
		}
	}
	if (req.body.email) {
		if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(req.body.email)) {
			return res.status(403).json({ msg: 'email is invalid' });
		}
	}

	next();
};

export default { userAddValidations, userEditValidations };
