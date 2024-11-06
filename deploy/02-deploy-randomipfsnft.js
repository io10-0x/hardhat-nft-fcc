const { networkConfig } = require("../helper-hardhat-config");
const { network, ethers } = require("hardhat");
require("dotenv").config();
const { verify } = require("../utils/verify");
const { uploadtoPinata } = require("../utils/uploadtopinata");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let tokenuris = [];
  if (tokenuris.length == 0) {
    let tokencids = [
      await uploadtoPinata(
        "PUG",
        "An Adorable Pug",
        "https://ipfs.io/ipfs/QmZ4uHLzh35ufjFHHNbc7vAjuWmL7MWTKeARVzKsZoaJjY",
        90
      ),
      await uploadtoPinata(
        "SHIBA INU",
        "An Adorable Shiba Inu",
        "https://ipfs.io/ipfs/QmdotT4u4Yq9UcgiWLZqoLPPnyn774Hsc2fqJtn6gWqHrw",
        80
      ),
      await uploadtoPinata(
        "ST BERNARD",
        "An Adorable St Bernard",
        "https://ipfs.io/ipfs/QmeaE4MTmQaomEXffrKKE2PaVZFuaT34DxVYyVn6xL7BsW",
        50
      ),
    ];

    for (i = 0; i < tokencids.length; i++) {
      tokenuris.push(`https://ipfs.io/ipfs/${tokencids[i]}`);
    }
  }

  log(`deploying to network with ${chainId}`);
  let linkaddress;
  let wrapperaddress;
  if (chainId == 1337 || chainId == 31337) {
    console.log("Deploying mocks");
    const linkaddressmock = await deployments.get("LinkToken");
    const wrappperaddressmock = await deployments.get("VRFV2Wrapper");
    linkaddress = linkaddressmock.address;
    wrapperaddress = wrappperaddressmock.address;
  } else {
    linkaddress = networkConfig[chainId]["linkaddress"];
    wrapperaddress = networkConfig[chainId]["wrapperaddress"];
  }
  const entrancefee = ethers.parseEther("0.02");
  const randomipfsnft = await deploy("RandomIpfsNft", {
    from: deployer,
    args: [entrancefee, linkaddress, wrapperaddress, tokenuris],
    log: true,
  });
  log("-----------------------------------------");

  if (!(chainId == 1337) && process.env.ETHERSCAN_TOKEN) {
    await verify(randomipfsnft.address, [
      entrancefee,
      linkaddress,
      wrapperaddress,
      tokenuris,
    ]);
  }
  log(`Verified contract at ${randomipfsnft.address}`);
  console.log(tokenuris);
};

module.exports.tags = ["all", "randomipfsnft"];
