const ticketCollection = require("../db").collection("Tickets");
const { default: Tambola } = require("tambola-generator");
const tambola = require("tambola-generator");

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

Ticket.generateTambolaTicket = function (numberOfTickets = 1) {
    return new Promise(async (resolve, reject) => {
        try {
            let tickets = Tambola.generateTickets(numberOfTickets);
            //  = tambola.getTickets(numberOfTickets);
            resolve(tickets);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = Ticket;
