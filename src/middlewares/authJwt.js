import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/auth.config.js';
import db, {ROLE_ADMIN, ROLE_MODERATOR} from '../model/index.js';
const User = db.user;
const Role = db.role;

// check token is provided, legal or not
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  // token not provided
  if (!token) {
    return res.status(403).send({ message: 'No token provided' });
  }

  // token privided
  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    // error while decoding
    if (error) {
      return res.status(401).send({ message: 'Unauthenticated!' });
    }

    // decoded successfully => set userId for request => to pass next check
    req.userId = decoded.id;

    // continue wrapped task
    next();
  });
};

const getRoles = async (req, res) => {
  // retrive user 
  let user;
  try {
    user = await User.findById(req.userId).exec();
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }

  // retrieve user's roles
  let roles;
  try {
    roles = await Role.find({ _id: { $in: user.roles } }).exec();
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }

  return roles;
}

// check whether user has admin role
const isAdmin = async (req, res, next) => {
  
  const roles = await getRoles(req, res);
  if (!roles) return;

  // check whether is admin
  const foundAdminRole = roles.find((role) => 
      role.name === db.ROLES[ROLE_ADMIN]
  )

  if (!foundAdminRole) {
      res.status(403).send({ message: 'Required admin role'});
      return;
  }

  next();
};

// check whether user has moderator role
const isModerator = async (req, res, next) => {
  
  const roles = await getRoles(req, res);
  if (!roles) return;

  // check whether is moderator
  const foundModeratorRole = roles.find((role) => 
      role.name === db.ROLES[ROLE_MODERATOR]
  )

  if (!foundModeratorRole) {
      res.status(403).send({ message: 'Required moderator role'});
      return;
  }

  next();
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
}

export default authJwt;


