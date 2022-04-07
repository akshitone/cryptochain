const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const Blockchain = require("./blockchain");
const PubSub = require("./app/pubSub");

const app = express();
const blockchain = new Blockchain();
const pubSub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.floor(Math.random() * 1000);
}

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

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
  pubSub.broadcastChain();

  res.send({
    message: "Block added",
    blockchain: blockchain.chain,
  });
});

const syncChains = () => {
  request(`${ROOT_NODE_ADDRESS}/api/blocks`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);
      console.log("Root chain", rootChain);
      console.log("My chain", blockchain.chain);

      if (Blockchain.isValidChain(rootChain)) {
        console.log(
          "Received blockchain is valid. Replacing current blockchain with received blockchain"
        );
        blockchain.replaceChain(rootChain);
      } else {
        console.log("Received blockchain invalid");
      }
    }
  });
};

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  syncChains();
});
