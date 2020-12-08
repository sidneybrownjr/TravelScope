const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Sidney B',
    email: 'test@test.com',
    password: 'testpw',
  },
  {
    id: 'u2',
    name: 'EJ',
    email: 'new@test.com',
    password: 'testpw',
  },
];

// GET requests //
const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

//POST requests //
const signupUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs, please check your data', 422);
  }

  const { name, email, password } = req.body;

  const userExists = DUMMY_USERS.find((u) => u.email === email);

  if (userExists) {
    throw new HttpError('Could not create user, email already exists', 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  const identitfiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identitfiedUser || identitfiedUser.password != password) {
    throw new HttpError(
      'Could not identify user, credentials seem incorrect',
      401
    );
  }

  res.json({ message: 'Logged in' });
};

exports.getUsers = getUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
