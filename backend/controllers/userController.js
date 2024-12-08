import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

/**
 * @description Auth user & get token
 * @method POST
 * @link /api/users/auth
 * @access public
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

/**
 * @description Register user
 * @method POST
 * @link /api/users
 * @access public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Email already in use');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @description Logout user / Clear cookie
 * @method POST
 * @link /api/users/logout
 * @access private
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Successfully logged out!' });
});

/**
 * @description Get user profile
 * @method GET
 * @link /api/users/profile
 * @access private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  res.send('get user profile');
});

/**
 * @description Update user profile
 * @method PUT
 * @link /api/users/profile
 * @access private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  res.send('update user profile');
});

/**
 * @description Get all users (admin only)
 * @method GET
 * @link /api/users
 * @access private/admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  return res.json(users);
});

/**
 * @description Get user by ID
 * @method GET
 * @link /api/users/:id
 * @access private/admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    return res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found ');
  }
});

/**
 * @description Delete user
 * @method DELETE
 * @link /api/users/:id
 * @access private/admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  res.send('user deleted');
});

/**
 * @description Update user
 * @method PUT
 * @link /api/users/:id
 * @access private/admin
 */
const updateUser = asyncHandler(async (req, res) => {
  res.send('update user');
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
