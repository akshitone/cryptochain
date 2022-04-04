const amqp = require("amqplib");

async function connect() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "blockchain";
    channel.assertQueue(queueName);

    channel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify({ message: "Hello World" }))
    );

    console.log("Message sent");
  } catch (err) {
    console.log(err);
  }
}

connect();
