const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Movement = require("./models/movement.js");
const dbName = "nwHacks";

async function calculateVotes(client, movement_id){

    let db = client.db(dbName);
    let movements_col = db.collection("movements");
    let users_col = db.collection("users");
    let movement = await movements_col.findOne({"_id": movement_id});
    let votes = movement.votes;

    //Initially, we count all explicit votes
    let num_votes = votes.length;

    //Get explicit vote ids, which tells us which votes to filter out when traversing the tree
    let vote_ids = [];
    for (vote of votes){
        vote_ids.push(vote.id);
    }

    //downstream will store all votes found through the trust feature
    let downstream = [];
    for (vote of movement.votes){
        //first get each user who has casted a vote, then find the users that trust them
        let voting_user = await users_col.findOne({_id: vote.id});

        //The nested loop is because the graphLookup restriction should only be applied on the children, not the parent user
        for (truster of voting_user.trusted_by){
            let downstream_votes = await users_col.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(vote.id)}},
                {
                    $graphLookup: {
                        from: "users",
                        startWith: truster.id,
                        connectFromField: "trusted_by.id",
                        connectToField: "_id",
                        as: "children",
                        restrictSearchWithMatch: { _id: { $nin: vote_ids } } //filters out users who have explicitly voted
                    }
                }
            ]).toArray();

            //concat to downstream array
            for (ds_vote of downstream_votes){
                downstream = downstream.concat(ds_vote.children);
            }
        }
    }
    
    //Add the downstream votes to get the total votes
    num_votes += downstream.length;
    return num_votes;
}

async function main(){
    const uri = "mongodb+srv://username:password@cluster0.rbltt.mongodb.net/nwHacks?retryWrites=true&w=majority";//authentication here
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const db = client.db(dbName);
        const users_col = db.collection("users");
        const movements_col = db.collection("movements");


        const test_doc = await movements_col.findOne();

        const movement_id = test_doc._id;
        
        let num_votes = await calculateVotes(client,movement_id);

        console.log(num_votes);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
main().catch(console.error);