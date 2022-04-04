// amqp is a library that allows us to connect to RabbitMQ - Asynchronous Messaging Queue Protocol
const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err, connection) => {
  if (err) {
    console.log(err);
    return;
  }

  connection.createChannel((err, channel) => {
    if (err) {
      console.log(err);
      return;
    }
    const queueName = "blockchain";
    channel.assertQueue(queueName);

    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify({ message: "Hello World" }))
    );

    console.log("Message sent");

    channel.consume(queueName, (msg) => {
      console.log(msg.content.toString());
    });
  });
});

class PubSub {
  constructor() {
    this.publishers = {};
    this.subscribers = {};
  }
}
