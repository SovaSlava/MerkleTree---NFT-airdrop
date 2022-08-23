import { ethers } from "hardhat";
import { expect } from "chai";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "@ethersproject/keccak256";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SolidityNFTSHKA, SolidityNFTSHKA__factory} from "../typechain-types";

describe("Merkle tree",  () => {
    let owner:SignerWithAddress;
    let user1:SignerWithAddress;
    let user2:SignerWithAddress;
    let user3:SignerWithAddress;
    let user4:SignerWithAddress;
    let user5:SignerWithAddress;
    let user6:SignerWithAddress;
    let user7:SignerWithAddress;
    let user8:SignerWithAddress;
    let airdropData:{address:string,tokenId:number}[], leafNodes:any, merkleTree:any;

    let airdrop:SolidityNFTSHKA;
    before(async() => {
        [owner,  user1, user2, user3, user4, user5, user6, user7, user8] = await ethers.getSigners();
        airdropData = [
            { address: user1.address, tokenId: 100},
            { address: user2.address, tokenId: 101},
            { address: user3.address, tokenId: 102},
            { address: user4.address, tokenId: 103},
            { address: user5.address, tokenId: 104},
            { address: user6.address, tokenId: 105},
            { address: user7.address, tokenId: 106},
            { address: user8.address, tokenId: 107}
        ]
        leafNodes = airdropData.map((airdropData) =>
            ethers.utils.solidityKeccak256(
                ["address","uint"], 
                [airdropData.address, airdropData.tokenId]
            )
            
        );
        merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        airdrop = await new SolidityNFTSHKA__factory(owner).deploy(merkleTree.getHexRoot(), "https://sovaslava.com/nft/?id=") as SolidityNFTSHKA;

    })

    
    it("Get proof for user1 and try to get nft", async() => {
        let proof = merkleTree.getHexProof(leafNodes[0]);
        await airdrop.connect(user1).getAirdrop(airdropData[0].tokenId, proof);
        expect(await airdrop.ownerOf(100)).to.equal(user1.address);
    })

    it("Revert, if user try get free nft again", async() => {
        let proof = merkleTree.getHexProof(leafNodes[0]);
        await expect(airdrop.connect(user1).getAirdrop(airdropData[0].tokenId, proof))
            .revertedWith("no more");
    })
})
