import mongoose from 'mongoose';

//  Role Schema definition
const Role = mongoose.model(
    'Role',
    new mongoose.Schema({
        name: String
    })
);

export default Role;
