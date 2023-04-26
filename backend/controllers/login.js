const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/User');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "can't find user" });
  }
  const passwordVerification = await bcrypt.compare(password, user.passwordHash);

  if (!passwordVerification) {
    return res.status(401).json({ message: 'wrong password' });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET_KEY);

  res
    .status(200)
    .json({
      token,
      username: user.username,
      id: user._id,
    });
});

module.exports = loginRouter;
