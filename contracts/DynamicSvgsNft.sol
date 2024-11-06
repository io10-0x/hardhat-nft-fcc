//SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";

pragma solidity ^0.8.7;

contract DynamicSvgNft is ERC721 {
    //_mint
    //store svg information somewhere
    //Some logic to change from happy svg to frown svg
    uint256 private s_tokenCounter;
    string private i_frownimageuri;
    string private i_happyimageuri;
    string private constant base64EncodedSvgPrefix =
        "data:image/svg+xml;base64,";
    string private constant base64EncodedJsonPrefix =
        "data:application/json;base64,";
    AggregatorV3Interface private s_pricefeedaddress;
    mapping(uint256 => uint256) public s_tokenidtoval;
    uint256 private s_value;
    event NftMinted(uint256 tokencounter, uint256 value);
    error DynamicSvgNft__UnrecognizedTokenId();

    constructor(
        address pricefeedaddress,
        string memory frownimagesvg,
        string memory happyimagesvg
    ) ERC721("Dynamic SVG NFT", "DSN") {
        s_tokenCounter = 0;
        i_frownimageuri = svgtoimageURI(frownimagesvg);
        i_happyimageuri = svgtoimageURI(happyimagesvg);
        s_pricefeedaddress = AggregatorV3Interface(pricefeedaddress);
    }

    function svgtoimageURI(
        string memory svg
    ) public pure returns (string memory) {
        string memory Base64encodeddata = Base64.encode(
            bytes((abi.encodePacked(svg)))
        );
        return
            string(abi.encodePacked(base64EncodedSvgPrefix, Base64encodeddata));
    }

    function mintNft(uint256 value) public returns (uint256) {
        s_value = value;
        uint256 newItemId = s_tokenCounter;
        s_tokenCounter = s_tokenCounter + 1;
        s_tokenidtoval[newItemId] = s_value;
        _safeMint(msg.sender, newItemId);
        emit NftMinted(newItemId, s_value);
        return newItemId;
    }

    function getPrice(
        AggregatorV3Interface priceFeed
    ) public view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer);
    }

    function tokenURI(
        uint256 tokenid
    ) public view override returns (string memory) {
        _requireOwned(tokenid);
        string memory imageURI;
        if (getPrice(s_pricefeedaddress) > s_value) {
            imageURI = i_happyimageuri;
        } else {
            imageURI = i_frownimageuri;
        }
        return
            string(
                abi.encodePacked(
                    base64EncodedJsonPrefix,
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(),
                                '", "description": "An NFT that changes based on the Chainlink Feed",',
                                '"attributes": [{"trait_type": "coolness", "value": 100}], "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function getTokenCount() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getvaluefromtokenid(
        uint256 tokenid
    ) public view returns (uint256) {
        return s_tokenidtoval[tokenid];
    }
}
