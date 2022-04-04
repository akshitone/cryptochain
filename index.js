const express = require("express");
const bodyParser = require("body-parser");

const Blockchain = require("./blockchain");
const PubSub = require("./pubSub");

const app = express();
const blockchain = new Blockchain();
const pubSub = new PubSub({ blockchain });

setTimeout(() => {
  pubSub.broadcastChain();
}, 1000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api", (req, res) => {
  res.send({ message: "Welcome to the blockchain API" });
});

app.get("/api/blocks", (req, res) => {
  res.send(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;

  const block = blockchain.addBlock({ data });

  res.send({
    message: "Block added",
    block,
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
