import db from "../model/index.js";
const ROLES = db.ROLES;
const User = db.user;

// Check duplication for username and email
export const checkUserDuplicate = async (req, res, next) => {
    
    // Check username
    try {
        const user = await User
        .findOne({ username: req.body.username})
        .exec()
        // if find an user => already in use
        if (user) {
            res.status(400).send({message: "username already in use"})
            return;
        }
    }
    catch (error) {
        res.status(500).send({message: error})
        return;
    }
    
    // Check email
    try {
        const user = await User
        .findOne({ email: req.body.email})
        .exec()
        // if find an user => already in use
        if (user) {
            res.status(400).send({message: "email already in use"})
            return;
        }
    }
    catch (error) {
        res.status(500).send({message: error})
        return;
    }

    // continue wrapped task 
    next();
}

// check whether roles in request is legal or not
export const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (const role of req.body.roles) {
            if (!ROLES.includes(role)) {
                res.status(400).send({message: `Role ${role} does not exist!`})
                return;
            }
        }
    }

    next();
}