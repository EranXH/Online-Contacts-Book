// Import the dev-dependencies
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Import the internal-dependencies
import { Contact } from '../contact';
import { ContactResponse } from './contact.services.response';

@Injectable()
export class ContactService {
  constructor(private http: HttpClient) { }

  // Server base url
  contactsUrl = "http://localhost:8081/api/contacts"

  // Handels errors - log the and return a fitted response
  private handleError(error: HttpErrorResponse): Observable<ContactResponse> {
    switch (error.status) {
      case 0: {
        console.error(`Network Or Client-Side Error: ${error.message}`)
        return of(new ContactResponse(`Network Or Client-Side Error: ${error.message}`, []));
      }
      case 404: {
        console.error(`Not Found: ${error.message}`)
        return of(new ContactResponse(`Not Found: ${error.message}`, []));
      }
      case 403: {
        console.error(`Access Denied: ${error.message}`)
        return of(new ContactResponse(`Access Denied: ${error.message}`, []));
      }
      case 500: {
        console.error(`Internal Server Error: ${error.message}`)
        return of(new ContactResponse(`Internal Server Error: ${error.message}`, []));
      }
      default: {
        console.error(`Unknown Server Error: ${error.message}`)
        return of(new ContactResponse(`Unknown Server Error: ${error.message}`, []));
      }
    }
  }

  // POST: add a new contact to the database
  async addContact(contact: Contact): Promise<Contact> {
    console.log(`Sending a POST request with this values: ${JSON.stringify(contact)}`)

    // request
    var response = await lastValueFrom(this.http.post<ContactResponse>
      (`${this.contactsUrl}/post`, contact)
      .pipe(
        catchError(this.handleError)
      ))

    // return
    if (response.Contacts.length == 1) {
      console.log(`On successful POST request returning the contact with a new _id: ${JSON.stringify(contact)}`)
      return response.Contacts[0]
    } else {
      console.log(`On failer POST request or find returning the give contact without any _id: ${JSON.stringify(contact)}`)
      return contact
    }
  }

  // GET: get all the maching contacts from the database
  async getContacts(contact: Contact): Promise<Array<Contact>> {
    console.log(`Sending a GET request based on this values: ${JSON.stringify(contact)}`)

    // Add params to query
    var params = new HttpParams()

    if (contact.FirstName != null && contact.FirstName != "") {
      params = params.set('FirstName', contact.FirstName);
    }
    if (contact.LastName != null && contact.LastName != "") {
      params = params.set('LastName', contact.LastName)
    }
    if (contact.Age != null) {
      params = params.set('Age', contact.Age!);
    }

    let GotContacts: Array<Contact> = [];

    // request
    var response = await lastValueFrom(this.http.get<ContactResponse>
      (`${this.contactsUrl}/get`, { params: params })
      .pipe(
        catchError(this.handleError)
      ))

    // return
    if (response.Contacts.length != 0) {
      console.log(`On successful GET request and find returning the response: ${JSON.stringify(contact)}`)
      return response.Contacts
    } else {
      console.error(`On failer GET request or find returning an empty response`)
      return GotContacts
    }
  }

  // PUT: edit a contact in the database
  async editContact(contact: Contact): Promise<String> {
    console.log(`Sending a PUT request for this values: ${JSON.stringify(contact)}`)

    // request
    // Due to the nature of HTML5 (sending only POST/GET requests) and the increased complexity
    // there is no logic in adding the PUT/DELETE methods
    var response = await lastValueFrom(this.http.post<ContactResponse>
      (`${this.contactsUrl}/put`, contact)
      .pipe(
        catchError(this.handleError)
      ))

    // return
    console.log(`the POST request response text: ${response.Status}`)
    return response.Status
  }

  // DELETED: remove a contact from the database
  async deleteContact(contact: Contact): Promise<String> {
    console.log(`Sending a DELETE request for on this contact: ${JSON.stringify(contact)}`)

    // Add _id to query params
    var params = new HttpParams().set('_id', contact._id!)

    // request
    // Due to the nature of HTML5 (sending only POST/GET requests) and the increased complexity
    // there is no logic in adding the PUT/DELETE methods
    var response = await lastValueFrom(this.http.get<ContactResponse>
      (`${this.contactsUrl}/delete`, { params: params })
      .pipe(
        catchError(this.handleError)
      ))

    // return
    console.log(`the DELET request response text: ${response.Status}`)
    return response.Status;
  }
}
