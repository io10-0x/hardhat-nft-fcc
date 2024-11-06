const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { interfaces } = require("mocha");
require("@nomicfoundation/hardhat-chai-matchers");

describe("Basic Nft unit tests", function () {
  let deployer;
  beforeEach(async function () {
    await deployments.fixture(["all"]);
    //deployer = (await getNamedAccounts()).deployer;
    const signers = await ethers.getSigners();
    deployer = signers[0];

    BasicNft = await ethers.getContract("BasicNft", deployer);

    console.log("BasicNft deployed at:", await BasicNft.getAddress());
  });

  describe("Constructor Test", function () {
    it("Test that the nft is called Dogie and the symbol is DOG ", async function () {
      const nftname = await BasicNft.name();
      const nftsymbol = await BasicNft.symbol();
      const expectedname = "Dogie";
      const expectedsymbol = "DOG";
      assert.equal(nftname, expectedname);
      assert.equal(nftsymbol, expectedsymbol);
    });

    it("Test that tokencounter is initialised to 0", async function () {
      const tokencounterval = await BasicNft.getTokenCount();
      const expectedval = 0;
      assert.equal(tokencounterval, expectedval);
    });
  });

  describe("Mint Nft Test", function () {
    it("Test that when a user mints an nft, a single nft is sent to the account ", async function () {
      await BasicNft.mintNft();
      const numberofnftsminted = 1;
      const balanceofwallet = await BasicNft.balanceOf(deployer);
      assert.equal(numberofnftsminted, balanceofwallet);
    });

    it("Test that tokencounter increases by 1 once an nft is minted", async function () {
      const tokencounter = await BasicNft.getTokenCount();
      await BasicNft.mintNft();
      const tokencounternewval = await BasicNft.getTokenCount();
      assert.equal(tokencounternewval, tokencounter + BigInt(1));
    });
  });

  describe("Test that tokenuri is correctly retrieved", function () {
    it("Test that when a user mints an nft, a single nft is sent to the account ", async function () {
      const tokenURI = await BasicNft.tokenURI(1);
      const expectedtokenuri =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
      assert.equal(tokenURI, expectedtokenuri);
    });
  });
});
