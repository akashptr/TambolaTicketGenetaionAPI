# Project Tambola Ticket Generator API

A backend API to create user and generate Tambola Tickets for users.
Created by: Akash Patra

## Installation

To install and run this project, follow these steps:

1. cd TambolaTicketGenerationAPI
2. npm install
3. npm run watch

### Create User

To create a new user, send a `POST` request to `/signup` with the following JSON body:

```json
{
    "username": "<user name>",
    "password": "<password>"
}
```

### Login

To log in, send a `POST` request to `/login` with the following JSON body:

```json
{
    "username": "<user name>",
    "password": "<password>"
}
```

It will return a JWT token as a response to the successful login.

### Create Tickets

To create tickets, send a `POST` request to `/createticket?numberOfTickets=<number of tickets>` with the following headers:

```json
{ "Authorization": "Bearer <token>" }
```

### Fetch Tickets

To fetch tickets, send a `POST` request to `/fetchticket?page=<page number>&limit=<number of items per page>` with the following headers:

```json
{ "Authorization": "Bearer <token>" }
```

Replace `<user name>`, `<password>`, `<number of tickets>`, `<page number>`, `<number of items per page>`, and `<token>` with the actual values in your requests.

**Importent:** Connection string, Port number and Secret hashing key is provided in .env file, modify them accordingly.
