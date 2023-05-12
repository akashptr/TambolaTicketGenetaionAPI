const router = require("express").Router();
const userController = require("./controllers/userController");
const ticketController = require("./controllers/ticketController");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post(
    "/createticket",
    userController.userMustLogIn,
    ticketController.createTickets
);
router.get(
    "/fetchticket",
    userController.userMustLogIn,
    ticketController.fetchTickets
);

module.exports = router;
