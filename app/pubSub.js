const amqp = require("amqplib");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;

    this.publisher = this.connect();
    this.subscriber = this.connect();

    this.publisher
      .then((channel) => {
        channel.assertQueue(CHANNELS.TEST);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async connect() {
    try {
      const connection = await amqp.connect("amqp://localhost");
      return await connection.createChannel();
    } catch (err) {
      console.log(err);
    }
  }

  publish({ message, queue }) {
    this.publisher
      .then((channel) => {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        this.handleMessage({ message, queue });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleMessage({ message, queue }) {
    console.log(`Message sent to ${queue} queue with message: ${message}`);
    const parsedMessage = JSON.parse(message);
    if (queue === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage);
    }
  }

  subscribe({ queue }) {
    this.subscriber
      .then((channel) => {
        channel.consume(queue, (message) => {
          const data = JSON.parse(message.content.toString());
          console.log(data);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  broadcastChain() {
    this.publish({
      message: JSON.stringify(this.blockchain.chain),
      queue: CHANNELS.BLOCKCHAIN,
    });
  }
}

module.exports = PubSub;
