import mongoose from 'mongoose';

//  User Schema definition
const User = mongoose.model(
    'User',
    new mongoose.Schema({
        username: String,
        password: String,
        email: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            }
        ]
    })
);

export default User;
