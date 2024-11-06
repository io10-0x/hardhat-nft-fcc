const { PinataSDK } = require("pinata-web3");
require("dotenv").config();

async function uploadtoPinata(name, description, imageuri, cutenessval) {
  const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: "plum-comparative-basilisk-241.mypinata.cloud",
  });

  const upload = await pinata.upload.json({
    name: name,
    description: description,
    image: imageuri,
    attributes: [
      {
        cuteness: cutenessval,
      },
    ],
  });

  return upload.IpfsHash;
}
module.exports = { uploadtoPinata };
