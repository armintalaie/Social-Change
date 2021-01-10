const fs = require("fs");
const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Movement = require("./models/movement.js");
const Donation = require("./models/donation.js");
const Community = require("./models/community.js");
const Photo = require("./models/photo.js");
var multer = require('multer')
var path = require('path')
const dbName = "nwHacks";


const movement_vote_pts = 1
const num_top_amsdrs = 5
const num_top_mvments = 5
const mvmnt_donation_pts = 4
const cmnty_donation_pts = 10
const cmnty_votes_threshold = 100



storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../uploads/photos')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({ storage: storage })

async function getUser(client, id) {
    let db = client.db(dbName);
    let user_col = db.collection("users");
    let don_col = db.collection("donations");
    let move_col = db.collection("movement");

    let user = await user_col.findOne({ "_id": id });
    if (user) {
        return user;
    }

    let don = await don_col.findOne({ "_id": id });
    if (don) {
        return await user_col.find({ _id: don.user });
    }

    let move = await move_col.findOne({ "_id": id });
    if (move) {
        return await user_col.find({ _id: move.created_by });
    }

    return null;
}

async function getPhoto(client, id) {
    let db = client.db(dbName);
    let user_col = db.collection("users");
    let comm_col = db.collection("communities");
    let move_col = db.collection("movements");
    let phot_col = db.collection("photos");

    let user = await user_col.findOne({ "_id": id });
    if (user) {
        return await phot_col.findOne({ "_id": user.photo });
    }

    let comm = await comm_col.findOne({ "_id": id });
    if (comm) {
        return await phot_col.findOne({ "_id": comm.photo });
    }

    let move = await move_col.findOne({ "_id": id });
    if (move) {
        return await phot_col.findOne({ "_id": move.photo });
    }

    return null;
}

async function getTrustedBy(client, user_id) {
    let db = client.db(dbName);
    let user_col = db.collection("users");

    let user = await user_col.findOne({ "_id": user_id });
    if (user) {
        return await user_col.find({ _id: { $in: user.trusted_by } }).toArray();
    }

    return [];
}

async function getMovement(client, id) {
    let db = client.db(dbName);
    let col = db.collection("movements");
    return await col.findOne({ "_id": id });
}

async function getMovements(client, id) {
    let db = client.db(dbName);
    let comm_col = db.collection("communities");
    let move_col = db.collection("movements");
    let user_col = db.collection("users");

    let comm = await comm_col.findOne({ "_id": id });
    if (comm) {
        return await move_col.find({ _id: { $in: comm.movements } }).toArray();
    }

    let user = await user_col.findOne({ "_id": id });

    if (user) {
        return await move_col.find({ _id: { $in: user.movements } }).toArray();
    }

    return null;
}

async function getAllMovements(client) {
    let db = client.db(dbName);
    let col = db.collection("movements");
    return await col.find().toArray();
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

async function getAllCommunities(client) {
    let db = client.db(dbName);
    let col = db.collection("communities");
    return await col.find().toArray();
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

async function voteFunk(client, movement_id, user_id) {
    let db = client.db(dbName);

    let user_col = db.collection('users')
    let move_col = db.collection('movements')
    let comm_col = db.collection("communities");

    let user = await user_col.findOne({ "_id": user_id })

    let user_movements = await getMovements(client,user._id);
    let movement_ids = []
    for (user_movement of user_movements) {
        movement_ids.push(user_movement._id);
    }

    let movement = await move_col.findOne({ "_id": movement_id, "_id": { "$nin": movement_ids } });

    let comm = await comm_col.findOne({ "_id": movement.community });
    //user can't vote twice
    if (movement) {
        addPoint(user, movement_vote_pts);
        user.votes.push(movement._id);
        movement.votes.push(user._id);
        movement.count = await calculateVotes(client,movement._id);

        await user_col.updateOne({ _id: user._id }, {
            $set: { "votes": user.votes },
        });

        await move_col.updateOne({ _id: movement._id }, {
            $set: { "votes": movement.votes, "count": movement.count },
        });

        if (comm){
            comm.votes += 1;
            comm.lifetime_votes += 1;
            if (comm.votes >= cmnty_votes_threshold) {
                await passMovements(client, comm);
            }

            await comm_col.updateOne({ _id: comm._id }, {
                $set: { "votes": comm.votes, "lifetime_votes": comm.lifetime_votes },
            });
        }
    }
    return null;
}

async function passMovements(client, community_id) {
    let db = client.db(dbName);
    let user_col = db.collection("users");
    let move_col = db.collection("movements");
    let comm_col = db.collection("communities");

    let comm = await comm_col.findOne({ "_id": community_id });
    let top = new Array(num_top_mvments)
    move_col.find({ _id: { $in: comm.movements }, "passed": false }).sort({ votes: -1 })
        .limit(num_top_mvments),
        function(err, results) {
            top = results
        }.toArray();

    let num_votes = 0;

    for (move of move_col) {
        num_votes += calculateVotes(client, move._id);
    }

    for (move of move_col) {
        let slice = floor(comm.balance / top.length * move.count / num_votes * comm.balance);
        //can't get more than their slice of the pie
        if (move.goal < slice) {
            slice = move.goal
        }
        comm.balance -= slice;
        comm_col.updateOne({ _id: comm._id }, {
            $set: { "balance": comm.balance },
        });

        let user = await user_col.findOne({ "_id": move.created_by });
        user.balance += slice;
        user_col.updateOne({ _id: user._id }, {
            $set: { "balance": user.balance },
        });
        move_col.updateOne({ _id: move._id }, {
            $set: { "passed": true },
        });
    }

    comm_col.updateOne({ _id: comm._id }, {
        $set: { "votes": 0 },
    });
}

async function trust(client, truster_id, trustee_id) {
    let db = client.db(dbName)
    var user_col = db.collection('users')
    var truster = await user_col.findOne({ "_id": truster_id })
    var trustee = await user_col.findOne({ "_id": trustee_id })

    if (trustee && truster) {
        truster.trusts = trustee._id;
        trustee.trusted_by.push(truster._id);

        await user_col.updateOne({ _id: truster._id }, {
            $set: { "trusts": truster.trusts },
        });

        await user_col.updateOne({ _id: trustee._id }, {
            $set: { "trusted_by": trustee.trusted_by },
        });
    }
    return null;
}

async function createMovement(client, user_id, comm_id, movement) {
    let db = client.db(dbName)
    var user_col = db.collection('users')
    var move_col = db.collection('movements')
    var comm_col = db.collection('communities')

    var user = await user_col.findOne({ "_id": user_id })
    var comm = await comm_col.findOne({ "_id": comm_id })
    console.log('swjnlkjnwfjmjnjnjnjnjnjnjnjnjnjnjnjnjnkljnlk')
    if (user && comm) {
        console.log('swjnlkjnwfkljnlk')
        movement.created_by = user._id;
        movement.votes.push(user._id);
        movement.count = 1;
        movement.community = comm_id;
        user.movements.push(movement._id);
        user_col.updateOne({ _id: user._id }, {
            $set: { "movements": user.movements },
        });
        comm.movements.push(movement._id);
        comm_col.updateOne({ _id: comm._id }, {
            $set: { "movements": comm.movements },
        });
        return move_col.insertOne(movement);
    }
    return null;
}

async function createPhoto(client, photo) {
    let db = client.db(dbName)
    var photo_col = db.collection('photos')
    photo_col.insertOne(photo)

}

async function createDonation(client, user_id, community_id, donation) {
    let db = client.db(dbName)
    var user_col = db.collection('users')
    var comm_col = db.collection('communities')
    var don_col = db.collection('donations')

    var user = await user_col.findOne({ "_id": user_id })
    var comm = await comm_col.findOne({ "_id": community_id })

    if (user && comm) {
        community.balance += donation.amount;
        comm_col.updateOne({ _id: comm._id }, {
            $set: { "balance": comm.balance },
        });
        user.balance -= donation.amount;
        user.points += cmnty_donation_pts;
        user_col.updateOne({ _id: user._id }, {
            $set: { "balance": user.balance, "points": user.points },
        });
        donation.user = user._id;
        donation.community = comm._id;
        return don_col.insertOne(donation);
    }
    return null;
}

async function createUser(client, user) {
    let db = client.db(dbName)
    var user_col = db.collection('users')
    return user_col.insertOne(user);
}

async function createCommunity(client, community) {
    let db = client.db(dbName)
    var comm_col = db.collection('communities')
    community.balance = 0;
    return comm_col.insertOne(community);
}

async function createPhoto(client, photo) {
    let db = client.db(dbName);
    let phot_col = db.collection("photos");
    return await phot_col.insertOne(photo);
}

// top people
async function topAmbassadors(client) {

    let db = client.db(dbName)
    var user_col = db.collection('users')
    var top = new Array(num_top_amsdrs)
    top = await user_col.find().sort({ points: -1 })
        .limit(num_top_amsdrs).toArray()

    return top

}


// top people
function topMovements(client) {

    let db = client.db(dbName)
    var movement_col = db.collection('movements')
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

    movements_col.updateOne({ _id: movement._id }, {
        $set: { "count": num_votes },
    });
    return num_votes;
}

module.exports.getUser = async function(id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getUser(client, id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getPhoto = async function(id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getPhoto(client, id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getMovement = async function(id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getMovement(client, id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getMovements = async function(id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getMovements(client, id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getAllMovements = async function() {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getAllMovements(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getCommunity = async function(id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getCommunity(client, id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getAllCommunities = async function() {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getAllCommunities(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getDonation = async function(id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getDonation(client, id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getDonations = async function(id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getDonations(client, id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.voteFunk = async function(movement_id, user_id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await voteFunk(client, movement_id, user_id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.topAmbassadors = async function() {
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

module.exports.topMovements = async function() {
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

module.exports.searchCommunities = async function(query) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await searchCommunities(client, query);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.searchMovements = async function(query) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await searchMovements(client, query);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.calculateVotes = async function(id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await calculateVotes(client, id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.createMovement = async function(user_id, comm_id, movement) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await createMovement(client, user_id, comm_id, movement)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};


module.exports.createPhoto = async function(photo) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await createPhoto(client, photot)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.trust = async function(truster_id, trustee_id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await trust(client, truster_id, trustee_id)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.createDonation = async function(user_id, community_id, donation) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await createDonation(client, user_id, community_id, donation)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.createUser = async function(user) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await createUser(client, user)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.createPhoto = async function(photo) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await createPhoto(client, photo)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.passMovements = async function(community_id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await passMovements(client, community_id)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

module.exports.getTrustedBy = async function(user_id) {
    const uri = fs.readFileSync('uri.txt', 'utf8');
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        return await getTrustedBy(client, user_id)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};