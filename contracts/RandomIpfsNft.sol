//SPDX-License-Identifier: MIT
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {VRFV2WrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/VRFV2WrapperConsumerBase.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

pragma solidity ^0.8.7;

contract RandomIpfsNft is
    VRFV2WrapperConsumerBase,
    ConfirmedOwner,
    ERC721URIStorage
{
    //when we mint an nft, we will trigger a chainlink VRF call to get a random number
    //using that number we will get a random nft
    //Pug, Shiba Inu or St. Bernard
    //Pug super rare
    //Shiba kinda rare
    //St. bernard common

    //users have to pay to mint an nft
    //the owner of the contract can withdraw the eth
    uint256 private immutable i_nftprice;
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );
    event NftMinted(uint256 tokenId, string tokenURI);
    struct RequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */

    mapping(uint256 => address)
        public s_addresstomint; /* mapping addresses to who minted nft */

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;
    uint256 public lastrandomnumbergenerated;
    enum Breed {
        PUG,
        SHIBAINU,
        STBERNARD
    }

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 private constant CALLBACKGASLIMIT = 500000;

    // The default is 3, but you can set this higher.
    uint16 private constant REQUESTCONFIRMATIONS = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFV2Wrapper.getConfig().maxNumWords.
    uint32 private constant NUMWORDS = 1;

    uint256 private s_tokenCounter;
    string[3] public s_tokenURIlist;

    error RandomIpfsNft__NotEnoughETH();
    error RandomIpfsNft__OutOfRange();
    error RandomIpfsNft__TransferFailed();

    constructor(
        uint256 buyprice,
        address linktokenaddress,
        address v2WrapperAddress,
        string[3] memory dogTokenUris
    )
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linktokenaddress, v2WrapperAddress)
        ERC721("RandomIpfsNft", "RIN")
    {
        i_nftprice = buyprice;
        s_tokenURIlist = dogTokenUris;
        s_tokenCounter = 0;
    }

    function requestNft() public payable {
        if (msg.value < i_nftprice) {
            revert RandomIpfsNft__NotEnoughETH();
        }
        uint256 requestId = requestRandomness(
            CALLBACKGASLIMIT,
            REQUESTCONFIRMATIONS,
            NUMWORDS
        );
        s_requests[requestId] = RequestStatus({
            paid: VRF_V2_WRAPPER.calculateRequestPrice(CALLBACKGASLIMIT),
            randomWords: new uint256[](0),
            fulfilled: false
        });

        s_addresstomint[requestId] = msg.sender;
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, NUMWORDS);
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );
        lastrandomnumbergenerated = _randomWords[0];
        uint256 randomnumber = lastrandomnumbergenerated % 100;
        Breed breed = getBreed(randomnumber);
        uint256 newItemId = s_tokenCounter;
        s_tokenCounter = s_tokenCounter + 1;
        _safeMint(s_addresstomint[_requestId], newItemId);
        _setTokenURI(newItemId, s_tokenURIlist[uint256(breed)]);
        emit NftMinted(newItemId, s_tokenURIlist[uint256(breed)]);
    }

    function withdrawEth() public payable onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert RandomIpfsNft__TransferFailed();
        }
    }

    function getBreed(uint256 randomnumber) public pure returns (Breed) {
        uint8[3] memory chancearray = [10, 30, 100];
        uint256 cummulativesum = 0;
        for (uint256 i = 0; i < chancearray.length; i++) {
            if (
                randomnumber >= cummulativesum && randomnumber <= chancearray[i]
            ) {
                return Breed(i);
            }
            cummulativesum += chancearray[i];
        }
        revert RandomIpfsNft__OutOfRange();
    }

    function getnftprice() public view returns (uint256) {
        return i_nftprice;
    }

    function getTokenCount() public view returns (uint256) {
        return s_tokenCounter;
    }
}
