// Require the dev-dependencies
var express = require('express');
var bodyParser = require('body-parser');
const winston = require('winston');

// Require the internal-dependencies
var ContactModel = require("./contact_schema.js").ContactModel;

// Initialize logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

// Create the server app
var app = express();
logger.info('Start server app')

// Set header acception
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Set body to json
app.use(bodyParser.json());
logger.info('Fix app header and information format')


// Get a contact
app.get('/api/contacts/get', async function (req, res) {
    logger.info(`GET request ${JSON.stringify(req.query)}`)

    var contacts = await ContactModel.find(req.query).catch(
        function (error) {
            logger.error(`Failed in GET request while trying to find`)
            return res.send({ 'Status': 'Failed_Getting_Contacts', "Contacts": [] })
        }
    )
    logger.info(`Found these matches : ${contacts}`)
    return res.send({ 'Status': 'Got_Contacts_Successfully', "Contacts": contacts })
})

// Add a contact
app.post('/api/contacts/post', async function (req, res) {
    logger.info(`POST request ${JSON.stringify(req.body)}`)

    ContactModel.create(req.body, function (error, contact_instance) {
        if (error) {
            logger.error(`Failed in POST request while trying to add`)
            return res.send({ 'Status': 'Failed_Adding_A_Contact', "Contacts": [] })
        };
        logger.info(`Added this contact : ${contact_instance}`)
        return res.send({ 'Status': 'Added_A_Contact_Successfully', "Contacts": [contact_instance] })
    })
})

// Put a contact
// Due to the nature of HTML5 (sending only POST/GET requests) and the increased complexity
// there is no logic in adding the PUT/DELETE methods
app.post('/api/contacts/put', async function (req, res) {
    logger.info(`PUT request ${JSON.stringify(req.body)}`)

    ContactModel.updateOne({ _id: req.body._id }, { $set: req.body }, { upsert: true },
        function (error) {
            if (error) {
                logger.error(`Failed in PUT request while trying to update`)
                return res.send({ 'Status': 'Failed_Editing_A_Contact', "Contacts": [] })
            };
            logger.info(`Update contact to this: ${JSON.stringify(req.body)}`)
            return res.send({ 'Status': 'Edited_A_Contact_Successfully', "Contacts": [] })
        });
})

// Delete a contact
// Due to the nature of HTML5 (sending only POST/GET requests) and the increased complexity
// there is no logic in adding the PUT/DELETE methods
app.get('/api/contacts/delete', async function (req, res) {
    logger.info(`DELETE request ${JSON.stringify(req.query)}`)

    ContactModel.deleteOne({ _id: req.query._id },
        function (error) {
            if (error) {
                logger.error(`Failed in DELETE request while trying to delete`)
                return res.send({ 'Status': 'Failed_Deleting_A_Contact', "Contacts": [] })
            };
            logger.info(`Delete a contact with this _id : ${req.query._id}`)
            return res.send({ 'Status': 'Deleted_A_Contact_Successfully', "Contacts": [] })
        });
})

// Sets the server port depending on run mode ( test / development )
if (process.env.NODE_ENV == 'test') {
    var port = 8082
} else {
    var port = 8081
}

// start server listening
app.listen(port)
    .on("error", function (error) { logger.error(`Server failed listening on port ${port}`) })
    .on("close", function (error) { logger.info(`Server close listening for port ${port}`) })
    .on("listening", function (error) { logger.info(`Server start listening for port ${port}`) })
    .on("connection", function (error) { logger.info(`Server start connection for port ${port}`) })
    .on("connect", function (error) { logger.info(`Server start connect to port ${port}`) })
    .on("clientError", function (error) { logger.error(`Server on port ${port} clientError`) })
    .on("request", function (error) { logger.info(`Server got request on port ${port}`) })

module.exports = app;
