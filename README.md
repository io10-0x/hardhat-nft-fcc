<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<br />
<div align="center">
 
<h3 align="center">Nft Smart Contracts</h3>

  <p align="center">
    Nft Smart Contracts

<br />
<a href="https://github.com/io10-0x/hardhat-nft-fcc"><strong>Explore the docs »</strong></a>
<br />
<br />
<a href="https://github.com/io10-0x/hardhat-nft-fcc">View Demo</a>
·
<a href="https://github.com/io10-0x/hardhat-nft-fcc/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
·
<a href="https://github.com/io10-0x/hardhat-nft-fcc/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>

  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

# About the Nft Smart Contracts

## Introduction

The Hardhat NFT project is a comprehensive implementation of NFTs using the Hardhat development framework and JavaScript. It builds on the concepts covered in previous Solidity and blockchain notes, bringing NFT creation and deployment into the JavaScript realm. The project includes developing basic and advanced NFT contracts, incorporating Chainlink VRF for randomness, and enabling full on-chain SVG storage.

## Key Features

- **Basic NFT Contract**: A straightforward ERC-721 implementation with simple minting functionality and fixed metadata.
- **Random IPFS NFT Contract**: Integrates Chainlink VRF for generating random NFTs with varying rarities, complete with IPFS-hosted metadata.
- **Dynamic On-Chain SVG Contract**: Stores SVG images directly on-chain, enabling dynamic minting based on real-time conditions, such as ETH price changes.
- **Easy Deployment**: Using the Hardhat framework, the contract can be deployed easily across various Ethereum networks with a focus on both development and production environments. Comprehensive deployment and testing scripts using Hardhat, enabling seamless contract management.

## Contract Architecture

The FundMe smart contract is structured for modularity and efficiency:

- **BasicNft.sol**: Implements a basic ERC-721 token with simple minting functionality and a predefined token URI.
- **RandomIpfsNft.sol**: Utilizes Chainlink VRF to assign random NFTs with different levels of rarity.
- **DynamicSvgNft.sol**: Creates dynamic, condition-based SVG NFTs stored on-chain, encoding metadata and images in base64.

## Deployment & Testing

The contract is deployed and tested using Hardhat, a popular Ethereum development framework. Key aspects of deployment and testing include:

- **Automated Deployment**: Deployment scripts are configured to automate the process across different networks, ensuring consistency and reducing human error.
- **Local Development with Mocks**: During local development, the contract uses mock price feeds provided by `MockV3Aggregator`, allowing developers to test without relying on live Chainlink data.
- **Comprehensive Testing**: The project includes unit tests to verify the functionality of the contract, ensuring robustness and reliability before deployment to production.

## Chainlink Integration

The FundMe contract integrates with Chainlink's decentralized oracles to:

- **Chainklink VRF**: Provides reliable randomness for minting rare NFTs.
- **Chainlink Price Feeds**: Used in the DynamicSvgNft contract to set conditions for minting different NFTs.

## Conclusion

This Hardhat NFT project showcases essential NFT development skills, including creating on-chain and off-chain assets, integrating with oracles, and deploying secure and functional smart contracts. It is ideal for developers exploring advanced Web3 and smart contract development.

For further details, including setup and deployment instructions, refer to the project's documentation and source code.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



