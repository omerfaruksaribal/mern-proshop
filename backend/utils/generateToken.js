import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.REACT_APP_JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set JWT as HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.REACT_APP_NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Days
  });
};

export default generateToken;
