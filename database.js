const MongoClient = require('mongodb').MongoClient;
var mongoose = require("mongoose");
const User = require("./models/user.js");
const Movement = require("./models/movement.js");
const dbName = "nwHacks";



async function main(){
    const uri = "mongodb+srv://user:password@cluster0.rbltt.mongodb.net/nwHacks?retryWrites=true&w=majority";//authentication here
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db(dbName);
        const users_col = db.collection("users");
        const movements_col = db.collection("movements");


        const test_doc = await movements_col.findOne();
         // Print to the console




    } catch (e) {
        console.error(e);
    } finally {
        //await client.close();
    }
}
main().catch(console.error);