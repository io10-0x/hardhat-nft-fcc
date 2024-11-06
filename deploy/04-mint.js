const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  //BasicNft Mint
  const BasicNft = await ethers.getContract("BasicNft", deployer);
  const basicnftmint = await BasicNft.mintNft();
  await basicnftmint.wait(1);
  console.log(`BasicNft index 0 minted at ${await BasicNft.tokenURI(0)}`);

  //RandomIPFSNft Mint
  const RandomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
  const nftprice = await RandomIpfsNft.getnftprice();
  console.log(nftprice);
  let tokenuri; // Variable to store the tokenuri
  await new Promise(async (resolve, reject) => {
    setTimeout(resolve, 300000);
    RandomIpfsNft.once("NftMinted", async function (tokenId, tokenURI) {
      console.log(`RandomIPFSNft index 0 minted at ${tokenURI}`);
      resolve();
    });

    const chainId = network.config.chainId;
    let requesttxreceipt;
    if (chainId == 1337 || chainId == 31337) {
      const linkamount = ethers.parseEther("8000");
      linktoken = await ethers.getContract("LinkToken", deployer);
      const tx1 = await linktoken.transfer(
        await RandomIpfsNft.getAddress(),
        linkamount
      );
      await tx1.wait(1);
    }
    const requesttx = await RandomIpfsNft.requestNft({
      value: nftprice,
    });
    requesttxreceipt = await requesttx.wait(1);

    if (chainId == 1337 || chainId == 31337) {
      vrfcoordinatorv2mock = await ethers.getContract(
        "VRFCoordinatorV2Mock",
        deployer
      );
      vrfv2wrapper = await ethers.getContract("VRFV2Wrapper", deployer);
      const getrandomnft = await vrfcoordinatorv2mock.fulfillRandomWords(
        1,
        await vrfv2wrapper.getAddress()
      );
    }
  });

  //Dynamic Svg Mint
  const DynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer);
  const value = BigInt(195200000000);
  const minttx1 = await DynamicSvgNft.mintNft(value);
  console.log(
    `DynamicSvgNft index 0 minted at ${await DynamicSvgNft.tokenURI(0)}`
  );
  let pricefeedaddress;
  const chainId = network.config.chainId;
  if (chainId == 1337 || chainId == 31337) {
    console.log("Deploying mocks");
    const pricefeedaddressmock = await deployments.get("MockV3Aggregator");

    pricefeedaddress = pricefeedaddressmock.address;
  } else {
    pricefeedaddress = networkConfig[chainId]["pricefeedaddress"];
  }
  console.log(pricefeedaddress);
  console.log(await DynamicSvgNft.getPrice(pricefeedaddress));
};

module.exports.tags = ["mint"];
