const express = require("express");
const path = require("path");

const movements = require('./routes/movement')

const userRoute = require('./routes/userRoute')

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));


















const port = process.env.PORT || 5000;
app.listen(port);





app.use(movements)


console.log(`Password generator listening on ${port}`);