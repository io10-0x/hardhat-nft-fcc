const { networkConfig } = require("../helper-hardhat-config");
const { network, ethers } = require("hardhat");
require("dotenv").config();
const { verify } = require("../utils/verify");
const fs = require("fs");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  log(`deploying to network with ${chainId}`);
  let pricefeedaddress;
  if (chainId == 1337 || chainId == 31337) {
    console.log("Deploying mocks");
    const pricefeedaddressmock = await deployments.get("MockV3Aggregator");

    pricefeedaddress = pricefeedaddressmock.address;
  } else {
    pricefeedaddress = networkConfig[chainId]["pricefeedaddress"];
  }
  const frownsvg = await fs.readFileSync("./img/dynamicnft/frown.svg", {
    encoding: "utf8",
  });
  const happysvg = await fs.readFileSync("./img/dynamicnft/happy.svg", {
    encoding: "utf8",
  });

  const dynamicsvgnft = await deploy("DynamicSvgNft", {
    from: deployer,
    args: [pricefeedaddress, frownsvg, happysvg],
    log: true,
  });
  log("-----------------------------------------");

  if (!(chainId == 1337) && process.env.ETHERSCAN_TOKEN) {
    await verify(dynamicsvgnft.address, [pricefeedaddress, frownsvg, happysvg]);
  }
  log(`Verified contract at ${dynamicsvgnft.address}`);
};

module.exports.tags = ["all", "dynamicsvgnft"];
