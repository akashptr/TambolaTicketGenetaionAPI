const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
const router = require("./router");
app.use("/", router);

module.exports = app;
