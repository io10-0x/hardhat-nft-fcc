const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { interfaces } = require("mocha");
require("@nomicfoundation/hardhat-chai-matchers");

describe("RandomIPFSNft unit tests", function () {
  let deployer;
  let RandomIpfsNft;
  let mockv3aggregator;
  let vrfcoordinatorv2mock;
  let vrfv2wrapper;
  let linktoken;
  beforeEach(async function () {
    await deployments.fixture(["mocks", "randomipfsnft"]);
    //deployer = (await getNamedAccounts()).deployer;
    const signers = await ethers.getSigners();
    deployer = signers[0];

    RandomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);

    console.log("RandomIpfsNft deployed at:", await RandomIpfsNft.getAddress());
    mockv3aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    vrfcoordinatorv2mock = await ethers.getContract(
      "VRFCoordinatorV2Mock",
      deployer
    );
    linktoken = await ethers.getContract("LinkToken", deployer);
    vrfv2wrapper = await ethers.getContract("VRFV2Wrapper", deployer);
    console.log(
      "MockV3Aggregator deployed at:",
      await mockv3aggregator.getAddress()
    );
    console.log(network.config.chainId);
    console.log("VRFV2Wrapper deployed at:", await vrfv2wrapper.getAddress());
    console.log(
      "LinkToken deployed at:",
      await vrfcoordinatorv2mock.getAddress()
    );
    const linkamount = ethers.parseEther("8000");

    const tx1 = await linktoken.transfer(
      await RandomIpfsNft.getAddress(),
      linkamount
    );
    await tx1.wait(1);
  });

  describe("Constructor Test", function () {
    it("Test that the nft mint price is set to 0.02 eth ", async function () {
      const mintprice = await RandomIpfsNft.getnftprice();
      const expectedprice = ethers.parseEther("0.02");
      assert.equal(mintprice, expectedprice);
    });

    it("Test that tokencounter is initialised to 0", async function () {
      const tokencounterval = await RandomIpfsNft.getTokenCount();
      const expectedval = 0;
      assert.equal(tokencounterval, expectedval);
    });

    it("Test that tokenuris for each nft is correct", async function () {
      const tokenuri0 = await RandomIpfsNft.s_tokenURIlist(0);
      const tokenuri1 = await RandomIpfsNft.s_tokenURIlist(1);
      const tokenuri2 = await RandomIpfsNft.s_tokenURIlist(2);
      const expectedtokenuris = [
        "https://ipfs.io/ipfs/bafkreifads6a3mo5ybnjgngsiuonufwudhqy4be23cygt6bo4vclnkn5hi",
        "https://ipfs.io/ipfs/bafkreify6mewyfmdchjvowznfvfpu3o7kh4swmrzqburf7eludgmo5bzzm",
        "https://ipfs.io/ipfs/bafkreifvjp6lvpsl55ht674yxg7kbypq5zt3ydlnv6hvmgmecgcb2vcbbq",
      ];
      assert.equal(tokenuri0, expectedtokenuris[0]);
      assert.equal(tokenuri1, expectedtokenuris[1]);
      assert.equal(tokenuri2, expectedtokenuris[2]);
    });
  });

  describe("requestNft Test", function () {
    it("Test that if a user tries to mint an nft for less than 0.02eth, error message appears ", async function () {
      await expect(
        RandomIpfsNft.requestNft({ value: ethers.parseEther("0.01") })
      ).to.be.revertedWithCustomError(
        RandomIpfsNft,
        "RandomIpfsNft__NotEnoughETH"
      );
    });

    it("Test that when a request is successfully made, the address => request id maps correctly", async function () {
      const tx1 = await RandomIpfsNft.requestNft({
        value: ethers.parseEther("0.02"),
      });
      const tx1receipt = await tx1.wait();
      const eventLogs = tx1receipt.logs;
      console.log(eventLogs);
      let requestId; // Variable to store the requestId

      // Iterate over the logs to find the 'RequestSent' event
      for (let log of eventLogs) {
        if (log.fragment && log.fragment.name === "RequestSent") {
          requestId = log.args[0]; // Store the requestId
          break; // Stop the loop once the requestId is found
        }
      }
      const mintingaddress = await RandomIpfsNft.s_addresstomint(requestId);
      assert.equal(mintingaddress, deployer.address);
    });
  });

  describe("fulfillrandomwords", function () {
    it("Test that when a request is fulfilled, a random number is returned correctly from chainlink", async function () {
      await RandomIpfsNft.requestNft({
        value: ethers.parseEther("0.02"),
      });
      const getrandomnft = await vrfcoordinatorv2mock.fulfillRandomWords(
        1,
        await vrfv2wrapper.getAddress()
      );
      const randomnumber = await RandomIpfsNft.lastrandomnumbergenerated();
      console.log(randomnumber);
      expect(randomnumber).to.exist;
    });
  });
});
