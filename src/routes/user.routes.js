import authJwt from '../middlewares/authJwt.js';
import {allAccess, adminBoard, moderatorBoard, userBoard} from '../controllers/user.controller.js';
export default function route(app) {
    
    // build header for response
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"            
        );
        next();
    })

    // API GET /api/test/all
    app.get(
        '/api/test/all',
        allAccess
    )

    // API GET /api/test/user
    app.get(
        '/api/test/user',
        [authJwt.verifyToken],
        userBoard
    )

    // API GET /api/test/moderator
    app.get(
        '/api/test/moderator',
        [authJwt.verifyToken, authJwt.isModerator],
        moderatorBoard
    )

    // API GET /api/test/admin
    app.get(
        '/api/test/admin',
        [authJwt.verifyToken, authJwt.isAdmin],
        adminBoard
    )
}