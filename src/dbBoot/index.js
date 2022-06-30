import db from '../model/index.js';
import { HOST, PORT, DB } from '../config/db.config.js';

function connectDB() {
    // DB connection
    db.mongoose
      .connect(`mongodb://${HOST}:${PORT}/${DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Successfully connected.');
        // Re-entrant, create 3 roles in Role collection
        initializeDB();
      })
      .catch((error) => {
        console.error('Error connecting', error);
        process.exit();
      });

    return db;
    
}
    // DB initial, re-entrant  
function initializeDB() {
    const Role = db.role;
    Role.estimatedDocumentCount((error, count) => {
        if (!error && count === 0) {
            // create 3 roles then insert into Role collection
            for (const roleName in db.ROLES) {
                new Role({
                    name: db.ROLES[roleName]
                })
                .save((error) => {                   
                    if (error) {
                        console.log('Error inserting role', error);
                    }
                    else {
                        console.log(`Role ${roleName} is added successfully`)
                    }
                })

            } 
        }
    })
}

export default connectDB;
