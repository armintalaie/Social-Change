import "dotenv/config";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const db = require("./app/models");

var corsOptions = {};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

require("./app/routes/product.routes")(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Aru." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Uncomment if we want databse to reset
// db.sequelize.sync().then(() => {
//   console.log("Drop and re-sync db.");
// });

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
