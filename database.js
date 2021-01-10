const fs = require("fs");
const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Movement = require("./models/movement.js");
const Donation = require("./models/donation.js");
const Community = require("./models/community.js");
const dbName = "nwHacks";


const movement_vote_pts = 1
const num_top_amsdrs = 5
const num_top_mvments = 8
const mvmnt_donation_pts = 4
const cmnty_donation_pts = 10

async function getUser(client, id) {

    let db = client.db(dbName);
    let user_col = db.collection("users");
    let don_col = db.collection("donations");

    let user = await user_col.findOne({ "_id": id });
    if (user) {
        return user;
    }

    let don = await don_col.findOne({ "_id": id });
    if (don) {
        let user_id = don.user;
        return await user_col.findOne({ _id: user_id });
    }

    return null;
}

async function getMovement(client, id) {
    let db = client.db(dbName);
    let col = db.collection("movements");
    return await col.findOne({ "_id": id });
}

async function getCommunity(client, id) {
    let db = client.db(dbName);
    let move_col = db.collection("movements");
    let comm_col = db.collection("communities");
    let don_col = db.collection("donations");

    let comm = await comm_col.findOne({ "_id": id });
    if (comm) {
        return comm;
    }

    let move = await move_col.findOne({ "_id": id });
    if (move) {
        let community_id = user.community;
        return await comm_col.findOne({ _id: community_id });
    }

    let don = await don_col.findOne({ "_id": id });
    if (don) {
        let community_id = don.community;
        return await comm_col.findOne({ _id: community_id });
    }

    return null;
}

async function getDonation(client, id) {
    let db = client.db(dbName);
    let col = db.collection("donations");
    return await col.findOne({ "_id": id });
}

//Get Donations from either a community or user id
async function getDonations(client, id) {
    let db = client.db(dbName);
    let users_col = db.collection("users");
    let comm_col = db.collection("communities");
    let don_col = db.collection("donations");

    let user = await users_col.findOne({ "_id": id });
    if (user) {
        let donation_ids = user.donations;
        return await don_col.find({ _id: { $in: donation_ids } }).toArray();
    }

    let comm = await comm_col.findOne({ "_id": id });
    if (comm) {
        let donation_ids = comm.donations;
        return await don_col.find({ _id: { $in: donation_ids } }).toArray();
    }

    return null;
}

async function vote(client, movement_id, user_id) {
    let db = client.db(dbName)
    var user_col = db.col('users')
    var move_col = db.col('movements')

    var user = await user_col.findOne({ "_id": user_id })
    var movement = await move_col.findOne({ "_id": movement_id })

    addPoint(user, movement_vote_pts)
    user.movements.push(movement._id)
    movements.votes.push(user._id)

}

// top people
function topAmbassadors(client) {

    let db = client.db(dbName)
    var user_col = db.col('users')
    var top = new Array(num_top_amsdrs)
    user_col.find().sort({ votes: -1 })
        .limit(num_top_amsdrs),
        function(err, results) {
            top = results
        }.lean()

    return top

}


// top people
function topMovements(client) {

    let db = client.db(dbName)
    var movement_col = db.col('movements')
    var top = new Array(num_top_mvments)
    movement_col.find().sort({ votes: -1 })
        .limit(num_top_mvments),
        function(err, results) {
            top = results
        }.lean()

    return top

}

function addPoint(user, pts) {
    user.points += pts
}

//Search for communities using text index
async function searchCommunities(client, query) {
    let db = client.db(dbName);
    let col = db.collection("communities");
    col.createIndex({ "name": "text", "description": "text" });
    return await col.find({ $text: { $search: query } }).toArray();
}

//Search for movements using text index
async function searchMovements(client, query) {
    let db = client.db(dbName);
    let col = db.collection("movements");
    col.createIndex({ "name": "text", "description": "text" });
    return await col.find({ $text: { $search: query } }).toArray();
}

async function calculateVotes(client, movement_id) {

    let db = client.db(dbName);
    let movements_col = db.collection("movements");
    let users_col = db.collection("users");
    let movement = await movements_col.findOne({ "_id": movement_id });
    let votes = movement.votes;

    //Initially, we count all explicit votes
    let num_votes = votes.length;

    //Get explicit vote ids, which tells us which votes to filter out when traversing the tree
    let vote_ids = [];
    for (vote of votes) {
        vote_ids.push(vote.id);
    }

    //downstream will store all votes found through the trust feature
    let downstream = [];
    for (vote of movement.votes) {
        //first get each user who has casted a vote, then find the users that trust them
        let voting_user = await users_col.findOne({ _id: vote.id });

        //The nested loop is because the graphLookup restriction should only be applied on the children, not the parent user
        for (truster of voting_user.trusted_by) {
            let downstream_votes = await users_col.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(vote.id) } },
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
            for (ds_vote of downstream_votes) {
                downstream = downstream.concat(ds_vote.children);
            }
        }
    }

    //Add the downstream votes to get the total votes
    num_votes += downstream.length;
    return num_votes;
}

module.exports.getUser = async function (id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getUser(client,id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getMovement = async function (id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getMovement(client,id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getCommunity = async function (id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getCommunity(client,id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getDonation = async function (id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getDonation(client,id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getDonations = async function (id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getDonations(client,id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.vote = async function (movement_id,user_id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await vote(client,movement_id,user_id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.topAmbassadors = async function () {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await topAmbassadors(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.topMovements = async function () {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await topMovements(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.searchCommunities = async function (query) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await searchCommunities(client,query);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.searchMovements = async function (query) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await searchMovements(client,query);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.calculateVotes = async function (id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await calculateVotes(client,id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};