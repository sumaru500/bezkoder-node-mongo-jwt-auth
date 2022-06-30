import {checkUserDuplicate, checkRolesExisted} from '../middlewares/verifySignup.js';
import {signup, signin} from '../controllers/auth.controller.js';
export default function route(app) {
    
    // build header for response
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"            
        );
        next();
    })

    // API POST /api/auth/signup
    app.post(
        '/api/auth/signup',
        [checkUserDuplicate, checkRolesExisted],
        signup
    )

    // API POST /api/auth/signin
    app.post(
        '/api/auth/signin',
        signin
    )
}