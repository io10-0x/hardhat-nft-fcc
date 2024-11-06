const { networkConfig } = require("../helper-hardhat-config");
const { network, ethers } = require("hardhat");
require("dotenv").config();
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  log(`deploying to network with ${chainId}`);
  const basicnft = await deploy("BasicNft", {
    from: deployer,
    args: [],
    log: true,
  });
  log("-----------------------------------------");

  if (!(chainId == 1337) && process.env.ETHERSCAN_TOKEN) {
    await verify(basicnft.address, []);
  }
  log(`Verified contract at ${basicnft.address}`);
};

module.exports.tags = ["all", "basicnft"];
