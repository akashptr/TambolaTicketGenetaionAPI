const ticketCollection = require("../db").collection("Tickets");
const ticketGenerator = require("./TambolaTicketGenerator");

let Ticket = function (userId, data) {
    this.userId = userId;
    this.data = data;
};

Ticket.prototype.save = function () {
    return new Promise(async (resolve, reject) => {
        try {
            if (!this.userId || !this.data) {
                throw new Error("Invalid ticket");
            }
            let info = await ticketCollection.insertOne(this);
            resolve(info.insertedId);
        } catch (err) {
            reject(err);
        }
    });
};

Ticket.fetch = function (uId, page, limit) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!uId) {
                throw new Error("Invalid ticket");
            }
            const skip = (page - 1) * limit;
            const totalTicketsCount = await ticketCollection.countDocuments({
                userId: uId
            });
            const fullPage = {
                page,
                limit,
                totalTicketsCount,
                totalPages: Math.ceil(totalTicketsCount / limit)
            };
            fullPage.tickets = await ticketCollection
                .find({
                    userId: uId
                })
                .skip(skip)
                .limit(limit)
                .toArray();
            resolve(fullPage);
        } catch (err) {
            reject(err);
        }
    });
};

Ticket.generateTambolaTicket = function (numberOfTickets = 6) {
    return new Promise(async (resolve, reject) => {
        try {
            let numberOfSets = Math.floor(numberOfTickets / 6);
            let remainingTickets = numberOfTickets % 6;
            let tickets = [];
            for (let i = 0; i < numberOfSets; i++) {
                tickets = tickets.concat(ticketGenerator());
            }
            tickets = tickets.concat(
                ticketGenerator().splice(0, remainingTickets)
            );
            resolve(tickets);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = Ticket;
