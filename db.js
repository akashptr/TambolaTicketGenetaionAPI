const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const client = new MongoClient(process.env.CONNECTIONSTRING);

(async function () {
    await client.connect();
    module.exports = client.db();
    const app = require("./app");
    app.listen(process.env.PORT);
    console.log(`listening at port ${process.env.PORT}`);
})();
