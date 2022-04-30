// Seting NODE_ENV
process.env.NODE_ENV = 'test'

// Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

// Require the internal-dependencies
var ContactModel = require("./contact_schema.js").ContactModel;
let server = require('./server');

// Use Http model in chai
chai.use(chaiHttp);

// Initialize tests
describe('Contacts API', () => {
    //Before each test we empty the database
    beforeEach(async () => { await ContactModel.deleteMany(); });

    //Test GET
    describe(' ===================== GET ===================== ', () => {
        it('Get all contacts (GET)', async () => {
            // Ask for all thw contacts - the database is empty therefore check if length is zero
            var response = await chai.request(server)
                .get('/api/contacts/get')
            response.should.have.status(200);
            response.body.Status.should.be.eql("Got_Contacts_Successfully");
            response.body.Contacts.length.should.be.eql(0);
        });
    });

    //Test POST
    describe(' ===================== POST ===================== ', () => {
        it('Add a contact (POST)', async () => {
            // Create a contact map
            let contact = {
                FirstName: "first_name 1",
                LastName: "last_name 1",
                Age: 21,
                PhoneNumber: "0521234567"
            }
            // Add the contact to the database and check for id and equality to the one which was sent
            var response = await chai.request(server)
                .post('/api/contacts/post')
                .send(contact)
            response.should.have.status(200);
            response.body.Status.should.be.eql("Added_A_Contact_Successfully");
            response.body.Contacts.should.be.a('array');
            response.body.Contacts.length.should.be.eql(1);
            response.body.Contacts[0].should.have.property('_id');
            response.body.Contacts[0].should.have.property('FirstName').eql("first_name 1");
        });

    });

    //Test PUT
    describe(' ===================== PUT ===================== ', () => {
        it('Update the contact Age without changing the contact id (PUT)', async () => {
            // Add the contact to the database
            let contact = new ContactModel({
                FirstName: "first_name 2",
                LastName: "last_name 2",
                Age: 21,
                PhoneNumber: "0521234567"
            })
            await contact.save()

            // Create an edited contact map
            contactMap = {
                FirstName: contact.FirstName,
                LastName: contact.LastName,
                Age: 30,
                PhoneNumber: contact.PhoneNumber,
                _id: contact._id
            }

            // Update the contact in the database
            var response = await chai.request(server)
                .post('/api/contacts/put')
                .send(contactMap)
            response.should.have.status(200);
            response.body.Status.should.be.eql("Edited_A_Contact_Successfully");
            response.body.Contacts.length.should.be.eql(0);

            // Check if the contact is updated and is the same one
            var response = await chai.request(server)
                .get('/api/contacts/get')
            response.should.have.status(200);
            response.body.Status.should.be.eql("Got_Contacts_Successfully");
            response.body.Contacts.length.should.be.eql(1);
            response.body.Contacts[0].should.have.property('Age').eql(contactMap.Age);
            response.body.Contacts[0].should.have.property('_id').eql(String(contact._id));
        });
    });

    //Test DELETE
    describe(' ===================== DELETE ===================== ', () => {
        it('Delete the added contact (DELETE) ', async () => {

            // Add the contact to the database
            let contact = new ContactModel({
                FirstName: "first_name 3",
                LastName: "last_name 3",
                Age: 21,
                PhoneNumber: "0521234567"
            })
            await contact.save()

            // Check database for the added contact
            var response = await chai.request(server)
                .get('/api/contacts/get')
            response.should.have.status(200)
            response.body.Status.should.be.eql("Got_Contacts_Successfully");
            response.body.Contacts.length.should.be.eql(1);
            response.body.Contacts[0].should.have.property('FirstName').eql("first_name 3");

            // Delete the contact from the database
            var response = await chai.request(server)
                .get('/api/contacts/delete').query({ _id: String(contact._id) })
            response.should.have.status(200)
            response.body.Status.should.be.eql("Deleted_A_Contact_Successfully")

            // Check database for the deleted contact
            var response = await chai.request(server)
                .get('/api/contacts/get')
            response.should.have.status(200)
            response.body.Status.should.be.eql("Got_Contacts_Successfully");
            response.body.Contacts.length.should.be.eql(0);
        });
    });
});

