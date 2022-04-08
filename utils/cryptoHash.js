const crypto = require("crypto");

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash("sha256"); // Create a hash object with the SHA256 algorithm
  hash.update(inputs.join(" ")); // Update the hash object with the inputs

  return hash.digest("hex"); // Return the hash as a hexadecimal string
};

module.exports = cryptoHash;
