import mongoose from 'mongoose';
import user from './user.model.js';
import role from './role.model.js';
// ??? 
mongoose.Promise = global.Promise;
export const ROLE_USER = "user";
export const ROLE_ADMIN = "admin";
export const ROLE_MODERATOR = "moderator";
const db = {
    mongoose,
    user,
    role,
    ROLES: {
        [ROLE_USER] : ROLE_USER,
        [ROLE_ADMIN] : ROLE_ADMIN, 
        [ROLE_MODERATOR] : ROLE_MODERATOR,
    }
}
export default db;