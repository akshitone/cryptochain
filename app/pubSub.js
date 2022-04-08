const amqp = require("amqplib");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain; // Set the blockchain

    this.publisher = this.connect(); // Connect to the publisher
    this.subscriber = this.connect(); // Connect to the subscriber

    this.publisher
      .then((channel) => {
        channel.assertQueue(CHANNELS.TEST); // Create the test queue
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async connect() {
    try {
      const connection = await amqp.connect("amqp://localhost"); // Connect to the broker on localhost
      return await connection.createChannel(); // Create a channel
    } catch (err) {
      console.log(err);
    }
  }

  publish({ message, queue }) {
    this.publisher
      .then((channel) => {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message))); // Send the message to the queue
        this.handleMessage({ message, queue }); // Handle the message
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleMessage({ message, queue }) {
    console.log(`Message sent to ${queue} queue with message: ${message}`);
    const parsedMessage = JSON.parse(message); // Parse the message
    if (queue === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage); // Replace the chain with the new one
    }
  }

  subscribe({ queue }) {
    this.subscriber
      .then((channel) => {
        channel.consume(queue, (message) => {
          const data = JSON.parse(message.content.toString()); // Parse the message
          console.log(data);
        }); // Consume the queue
      })
      .catch((err) => {
        console.log(err);
      });
  }

  broadcastChain() {
    this.publish({
      message: JSON.stringify(this.blockchain.chain),
      queue: CHANNELS.BLOCKCHAIN,
    }); // Broadcast the chain
  }
}

module.exports = PubSub;
