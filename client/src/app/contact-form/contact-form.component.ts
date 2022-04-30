// Import the dev-dependencies
import { Component } from '@angular/core';

// Import the internal-dependencies
import { Contact } from '../contact';
import { ContactService } from '../contact-services/contact.services'

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})

export class ContactFormComponent {
  // Set initial values
  constructor(private contactService: ContactService) { }

  // Set Israeli mobile phone number pattern for validation
  // Phone Number should start with either +9725 or 05 and continue with the left 8 digit of the phone number
  mobilePhoneNumberPattern = "^(\\+9725([0-9]{8})|05([0-9]{8}))$";

  page = 0;

  hasContacts = false;
  isEditable = false;

  requestType = "POST"
  requestTypeBeforeEdit = "POST"

  model = new Contact('', '');

  index = 0;

  GotContacts: Array<Contact> = [];
  shownContact = new Contact('', '');

  
  // Submit function for GET/POST/PUT requests
  async onSubmit() {
    console.log("Submit button was clicked after form validation")

    // GET request
    if (this.requestType == "GET") {
      console.log("Submitin as a GET request")
      this.GotContacts = await this.contactService.getContacts(this.model)

      // Check for success response
      if (this.GotContacts.length > 0) {
        console.log("Submitin as a GET request success")
        this.index = 0;
        this.shownContact = this.GotContacts[this.index]
        this.hasContacts = true
        this.isEditable = true
      } else {
        console.error("Submitin as a GET request failer / no value match")
        this.shownContact = this.model
        this.hasContacts = false
        this.isEditable = false
      }

      // Move to presentation page
      this.page = 2;
    }

    // POST request
    if (this.requestType == "POST") {
      console.log("Submitin as a POST request")
      this.shownContact = await this.contactService.addContact(this.model)

      // Check for success response
      if (this.shownContact._id != null) {
        console.log("Submitin as a POST request success")
        this.isEditable = true

      } else {
        console.error("Submitin as a POST request failer")
        this.isEditable = false
      }

      // Move to presentation page
      this.page = 2;
    }

    // PUT request
    if (this.requestType == "PUT") {
      console.log("Submitin as a PUT request")
      var response = await this.contactService.editContact(this.model)

      // Check for success response
      if (response == 'Edited_A_Contact_Successfully') {
        console.log("Submitin as a PUT request success")

        if (this.requestTypeBeforeEdit == 'POST') {
          this.shownContact = this.model
        }
        if (this.requestTypeBeforeEdit == 'GET') {
          this.GotContacts.splice(this.index, 1, this.model)
        }

        // Move to presentation page
        this.page = 2;
        this.requestType = this.requestTypeBeforeEdit

      } else {
        console.error("Submitin as a PUT request failer")
      }
    }
  }

  // delete function the DELETE request
  async delete() {
    if (this.shownContact._id != null) {
      console.log(`Trying to send a DELETE request for this _id: ${this.shownContact._id}`)
      var response = await this.contactService.deleteContact(this.shownContact)

      // Check for success response
      if (response == "Deleted_A_Contact_Successfully") {
        console.log("DELETE request success")
        // If the corrent represented 'requestType' is POST change the title above the contact info
        if (this.requestType == 'POST') {
          this.requestType = 'DELETE'
        }
        // If the corrent represented 'requestType' is GET then delete the relevant contact info
        if (this.requestType == 'GET') {
          this.GotContacts.splice(this.index, 1)

          if (this.GotContacts.length > 0) {
            if (this.index > 0) {
              this.index = this.index - 1
            }
            this.shownContact = this.GotContacts[this.index]
          } else {
            this.isEditable = false
          }
        }
      } else {
        console.error("DELETE request failer")
      }
    } else {
      console.error(`Can't send a DELETE request for an _id with a null value`)
    }
  }

  // The 'Edit' button function - return to the Form page for editing the contact info
  edit() {
    console.log("Returning to Form Page for contact editing")
    this.model = this.shownContact
    this.requestTypeBeforeEdit = this.requestType
    this.requestType = 'PUT'
    this.page = 1;
  }

  // The 'Previous' button function - move to the previous contact in the got contact list
  previous() {
    if (0 < this.index) {
      this.index = this.index - 1
      this.shownContact = this.GotContacts[this.index]
      console.log(`Moving to previous contact in the got contact list to this contact : ${JSON.stringify(this.shownContact)}`)
    } else {
      console.error("Reached the lower limit of the got contact list")
    }
  }

  // The 'Next' button function - move to the next contact in the got contact list
  next() {
    if (this.index < this.GotContacts.length - 1) {
      this.index = this.index + 1
      this.shownContact = this.GotContacts[this.index]
      console.log(`Moving to next contact in the got contact list to this contact : ${JSON.stringify(this.shownContact)}`)
    } else {
      console.error("Reached the upper limit of the got contact list")
    }
  }

  // The 'New Contact' button function
  newContact() {
    this.model = new Contact("", "");
    console.log("New contact model have been created")
  }

  // The 'Back' button function (in presentation page) - reset the values and go back to Home page
  backToHomePage() {
    this.page = 0

    this.index = 0;

    this.hasContacts = false;
    this.isEditable = false;

    this.model = new Contact("", "");

    this.GotContacts = [];
    this.shownContact = new Contact('', '');

    console.log("Reset the values and return to Home page")
  }
}