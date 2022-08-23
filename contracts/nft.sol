//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
contract SolidityNFTSHKA is ERC721("SOLNFT","SOLNFT") {
    
    bytes32 immutable public roothash;
    mapping(address => bool) public isClaimed;
    string baseURL;
    constructor(bytes32 _roothash, string memory __baseURI) {
        roothash = _roothash;
        baseURL = __baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURL;
    }

    bytes32 public nodeStorage;
    function getAirdrop(
        uint _tokenId,
        bytes32[] calldata merkleProof
        ) external  {
            require(!isClaimed[msg.sender], "no more");
            bytes32 node = keccak256(
            abi.encodePacked(msg.sender, _tokenId)
            );
            require(MerkleProof.verifyCalldata(merkleProof, roothash, node),"wrong data");

        isClaimed[msg.sender] = true;
        _safeMint(msg.sender, _tokenId);
    }
}