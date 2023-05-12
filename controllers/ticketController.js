const Ticket = require("../models/Ticket");

exports.createTickets = async function (req, res) {
    let userId = req.loggedInUserId;
    let numberOfTickets = parseInt(req.query.numberOfTickets) || 1;
    let ticketsArray = await Ticket.generateTambolaTicket(numberOfTickets);
    let tickets = ticketsArray.map(
        (ticket) => new Ticket(userId, ticket._entries)
    );
    let ticketPromises = [];
    for (let ticket of tickets) {
        ticketPromises.push(ticket.save());
    }
    Promise.all(ticketPromises)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.json(err.message);
        });
};

exports.fetchTickets = async function (req, res) {
    let userId = req.loggedInUserId;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    Ticket.fetch(userId, page, limit)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.json(err);
        });
};
