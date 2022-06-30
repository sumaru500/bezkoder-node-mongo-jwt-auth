import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { SECRET_KEY } from '../config/auth.config.js';
import db, { ROLE_USER } from '../model/index.js';

const User = db.user;
const Role = db.role;

// signup : create a new User in db
export const signup = async (req, res) => {
  const { username, password, email } = req.body;
  const newUser = new User({
    username,
    password: bcrypt.hashSync(password, 8),
    email,
  });

  // make reference to the right roles
  const { roles } = req.body;
  if (roles) {
    // roles provided
    // 1. lookup corresponding roles by name in database
    let foundRoles;
    try {
      foundRoles = await Role.find({ name: { $in: roles } }).exec();
    } catch (error) {
      res.status(500).send({ message: error });
      return;
    }

    // 2. set reference
    newUser.roles = foundRoles.map((role) => role._id);
  } else {
    // roles not provided
    // create with default role is 'user'
    let userRole;
    try {
      userRole = await Role.findOne({ name: ROLE_USER }).exec();
    } catch (error) {
      res.status(500).send({ message: error });
      return;
    }

    // set reference
    newUser.roles = [userRole];
  }

  // save into database
  try {
    await newUser.save();
    res.status(200).send({ message: 'User was registed successfully' });

  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }
};

// signin :
// 1. find User by username in db
// 2. compare password, in using bcrypt
// 3. generate token by jsonwebtoken
// 4. return user info and generated token

export const signin = async (req, res) => {
    const {username, password} = req.body;
    
    // 1. find User by username in db
    let user;
    try {
        user = await User
        .findOne({username})
        .populate("roles", "-__v")
        .exec()
    }
    catch(error) {
        res.status(500).send({ message: error });
        return;
    }
    if (!user) {
        res.status(400).send({ message: 'User not found' });
        return;
    }

    // 2. compare password, in using bcrypt
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
        res.status(401).send({
            accessToken: null,
            message: 'Invalid password' 
        });
        return;        
    }

    // 3. generate token by jsonwebtoken
    const token = jwt.sign({id: user._id}, SECRET_KEY, {expiresIn: 900 /* 15' */ });
    
    // 4. return user info and generated token
    const authorities = user.roles.map((role) => `ROLE_${role.name.toUpperCase()}`);

    res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
    })
};
