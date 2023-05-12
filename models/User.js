const userCollection = require("../db").collection("Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let User = function (username, password) {
    this.username = username;
    this.password = password;
};

User.prototype.cleanUp = function () {
    if (typeof this.username !== "string") {
        this.username = "";
    }
    if (typeof this.password !== "string") {
        this.password = "";
    }
    this.username = this.username.trim().toLowerCase();
};

User.prototype.validate = function () {
    return new Promise(async (resolve, reject) => {
        try {
            if (this.username === "") {
                throw new Error("Empty username");
            }
            if (this.password === "") {
                throw new Error("Empty password");
            }
            if (this.username.length < 3 || this.username.length > 20) {
                throw new Error("Username must consist of 3 to 20 characters");
            }
            if (this.password.length < 8 || this.password.length > 30) {
                throw new Error("Password must consist of 8 to 30 characters");
            }
            if (!/^[a-zA-Z0-9]+$/.test(this.username)) {
                throw new Error(
                    "Only alphanumeric characters are allowed as username"
                );
            }
            resolve("Valid");
        } catch (err) {
            reject(err);
        }
    });
};

User.prototype.signUp = function () {
    return new Promise(async (resolve, reject) => {
        try {
            this.cleanUp();
            await this.validate();
            let existingUser = await userCollection.findOne({
                username: this.username
            });
            if (existingUser) {
                throw new Error("User already exists");
            }
            let salt = bcrypt.genSaltSync(10);
            this.password = bcrypt.hashSync(this.password, salt);
            await userCollection.insertOne(this);
            resolve("Success");
        } catch (error) {
            reject(error);
        }
    });
};

User.prototype.logIn = function () {
    return new Promise(async (resolve, reject) => {
        try {
            this.cleanUp();
            const userData = await userCollection.findOne({
                username: this.username
            });
            if (
                userData &&
                bcrypt.compareSync(this.password, userData.password)
            ) {
                let token = jwt.sign(userData, process.env.SECRETKEY, {
                    expiresIn: "1h"
                });
                resolve({ token });
            } else {
                reject(new Error("Failed! login criteria mismatch"));
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = User;
