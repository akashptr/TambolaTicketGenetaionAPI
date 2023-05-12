const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = function (req, res) {
    let user = new User(req.body.username, req.body.password);
    user.signUp()
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            res.json(error.message);
        });
};

exports.login = function (req, res) {
    let user = new User(req.body.username, req.body.password);
    user.logIn()
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.json(err.message);
        });
};

exports.userMustLogIn = function (req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({
            error: "Unauthorized! log in first"
        });
    } else {
        const secretKey = process.env.SECRETKEY;
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    error: "Unauthorized! log in first"
                });
            } else {
                req.loggedInUserId = decoded._id;
                next();
            }
        });
    }
};
