import { Contact } from "../contact";

export class ContactResponse {
    constructor(
        public Status: String, 
        public Contacts: Array<Contact>,
    ) { }

}