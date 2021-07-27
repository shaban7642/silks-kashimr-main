const asyncHandler = require('express-async-handler');
const generateToken = require('../../utils/generateToken.js');
const User = require('../../models/User');

//@desc     Auth user & get token
//@route    POST /api/users/login
//@access   Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
});

//@desc     Register a new user
//@route    POST /api/users
//@access   Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('User is already exists');
	}

	const user = await User.create({ name, email, password });

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

//@desc     Get user by ID
//@route    GET /api/users/:id
//@access   Private/Admin
const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');

	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

//@desc     Get all users
//@route    GET /api/users
//@access   Private/Admin
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});

	res.json(users);
});

//@desc     Get user profile
//@route    POST /api/users/profile
//@access   Private
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

//@desc     Update user profile
//@route    Put /api/users/profile
//@access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id),
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

//@desc     Update user
//@route    Put /api/users/:id
//@access   Private/Admin
const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = req.body.isAdmin;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

//@desc     Delete user
//@route    DELETE /api/users/:id
//@access   Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		await user.remove();
		res.json({ message: 'User removed' });
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

const addToWishList = asyncHandler(async (req, res) => {
	const { product } = req.body;
	let user = await User.findOne({ _id: req.user.id });
	if (user == null) {
		res.status(401).json('you should login to review');
	}
	let { wishlist } = user;
	const existWish = wishlist.find((slug) => slug === product);
	if (existWish) {
		user.wishlist = user.wishlist.filter((slug) => slug !== existWish);
		await user.save();
		res.send('removed');
	}
	wishlist = wishlist.push(product);
	await user.save();
	res.send('added');
});

const getWishes = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);
	res.json(user.wishlist);
});

const createOrLoginUser = async (req, res) => {
	const { email } = req.user;

	const user = await User.findOneAndUpdate(
		{ email },
		{ name: email.split('@')[0] },
		{ new: true }
	);
	if (user) {
		res.json(user);
	} else {
		const newUser = await new User({
			email,
			name: email.split('@')[0],
		}).save();
		res.json(newUser);
		console.log('user created', newUser);
	}
};

const currentUser = async (req, res) => {
	await User.findOne({ email: req.user.email }).exec((err, user) => {
		if (err) throw new Error(err);
		res.json(user);
	});
};

module.exports = {
	loginUser,
	registerUser,
	getUserById,
	getUsers,
	getUserProfile,
	updateUserProfile,
	updateUser,
	deleteUser,
	addToWishList,
	getWishes,
	currentUser,
	createOrLoginUser,
};
