// Require the dev-dependencies
var mongoose = require('mongoose');
const winston = require('winston');

// Initialize logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

// Sets the databases url depending on run mode ( test / development )
if (process.env.NODE_ENV == 'test') {
    var mongoUrl = "mongodb://localhost:27017/contacts-test";
} else {
    var mongoUrl = "mongodb://localhost:27017/contacts";
}

// Set up default mongoose connection
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true },
    function (error) {
        if (error) {
            logger.error(`Failed connecting to mongoDB Error name: ${error.name} || Error message ${error.message}`)
        } else {
            logger.info(`Connected to mongoDB`)
        }
    }
);

// Define a schema
var Schema = mongoose.Schema;

// Define the contact schema
var ContactSchema = new Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Age: {
        type: Number,
        required: true,
    },
    PhoneNumber: {
        type: String,
        required: true,
    },
});

// Define the contact model
module.exports = {
    ContactModel: mongoose.model('ContactModel', ContactSchema)
}