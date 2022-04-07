const Blockchain = require("../blockchain");

const blockchain = new Blockchain();

blockchain.addBlock({ data: "initial block" });

let previousTimestamp, nextTimestamp, nextBlock, timeDifference, averageTime;

const times = [];

for (let i = 0; i < 1000; i++) {
  previousTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

  blockchain.addBlock({ data: `block ${i}` });
  nextBlock = blockchain.chain[blockchain.chain.length - 1];

  nextTimestamp = nextBlock.timestamp;
  timeDifference = nextTimestamp - previousTimestamp;
  times.push(timeDifference);

  averageTime = times.reduce((total, next) => total + next) / times.length;

  console.log(
    `Time to mine block: ${timeDifference}ms \tDifficulty: ${nextBlock.difficulty} \t\tAverage time: ${averageTime}ms`
  );
}
